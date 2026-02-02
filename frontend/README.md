# JobApplicationTask

Full Stack Developer 2. aşama task’i için hazırlanmış; JWT tabanlı Auth servisi, CQRS + Redis cache ile optimize Product servisi ve çok dilli (TR/EN) Next.js storefront uygulaması.

## İçerik
- [Proje Özeti](#proje-özeti)
- [Mimari & Teknolojiler](#mimari--teknolojiler)
- [Ön Koşullar](#ön-koşullar)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
  - [Docker (PostgreSQL + Redis)](#docker-postgresql--redis)
  - [Backend Servisleri](#backend-servisleri)
  - [Frontend (Next.js)](#frontend-nextjs)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Admin Kullanıcı ile Test](#admin-kullanıcı-ile-test)
- [Sık Kullanılan API Uçları](#sık-kullanılan-api-uçları)
- [Notlar ve İpuçları](#notlar-ve-ipuçları)

## Proje Özeti
Bu proje; Auth ve Product servislerinin birlikte çalıştığı, JWT ile kimlik doğrulama ve rol bazlı yetkilendirme destekleyen, Redis cache ile hızlı ürün listeleme sağlayan bir e‑ticaret demo uygulamasıdır. Frontend tarafı Next.js App Router ile SSR/ISR destekler, multi‑language (TR/EN) ve RTK state yönetimi içerir.

## Mimari & Teknolojiler
**Backend**
- .NET 8 (AuthService + ProductService)
- Onion Architecture (Core / Application / Infrastructure / API)
- CQRS (MediatR)
- PostgreSQL
- Redis
- JWT Authentication + Role Authorization
- Serilog + Global Exception Middleware

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- next-intl (TR/EN)
- Redux Toolkit (RTK)

## Ön Koşullar
- **.NET 7+**
- **Node.js 20+**
- **PostgreSQL 16**
- **Redis 7**
- (Öneri) Docker Desktop veya Docker Engine

## Kurulum ve Çalıştırma

### Docker (PostgreSQL + Redis)
PostgreSQL ve Redis’i hızlıca ayağa kaldırmak için:
```bash
cd docker
docker compose up -d
```

### Backend Servisleri
Her servisi ayrı terminalde çalıştırın.

**Auth Service**
```bash
cd backend/src/AuthService
dotnet restore
dotnet run --project AuthService.API
```

**Product Service**
```bash
cd backend/src/ProductService
dotnet restore
dotnet run --project ProductService.API
```

Swagger adresleri:
- Auth: `http://localhost:5001/swagger`
- Product: `http://localhost:5002/swagger`

> Not: İlk kez çalıştırıyorsanız EF Core migration’ları uygulayın.  
> Örnek:
> ```bash
> cd backend/src/AuthService
> dotnet ef migrations add AddAuthRoleAndRefreshTokens \
>   --project AuthService.Infrastructure \
>   --startup-project AuthService.API
> dotnet ef database update \
>   --project AuthService.Infrastructure \
>   --startup-project AuthService.API
> ```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Uygulama `http://localhost:3000` adresinde çalışır.

## Ortam Değişkenleri
Frontend için `frontend/.env.local` dosyası örneği:
```bash
NEXT_PUBLIC_AUTH_API_URL=http://localhost:5001/api
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:5002/api
```

Backend tarafında JWT ve connection string örnekleri:
- `backend/src/AuthService/AuthService.API/appsettings.Development.json`
- `backend/src/ProductService/ProductService.API/appsettings.Development.json`

## Admin Kullanıcı ile Test
Ürün ekleme / güncelleme / silme işlemleri **Admin** rolü gerektirir.

### Hazır Admin Test Bilgisi
- **E‑posta:** `admin@demo.com`
- **Şifre:** `admin1998`

> Bu kullanıcı ile giriş yaptıktan sonra **Admin paneline** ulaşabilirsiniz:
> `http://localhost:3000/tr/admin/products`

> Eğer admin rolü görünmüyorsa:
> - `admin@demo.com` hesabı yeni sisteme geçmeden önce oluşturulmuş olabilir.
> - Veritabanında role güncellemesi yapabilirsiniz:
> ```sql
> UPDATE "Users"
> SET "Role" = 'Admin'
> WHERE "Email" = 'admin@demo.com';
> ```

## Sık Kullanılan API Uçları
**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

**Product**
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` (Admin only)
- `PUT /api/products/{id}` (Admin only)
- `DELETE /api/products/{id}` (Admin only)

## Notlar ve İpuçları
- Auth token frontend’de demo amaçlı `localStorage` içinde saklanır.
- Ürün listeleme SSR/ISR destekler (`revalidate` değerleri).
- Ürün görselleri `next/image` ile lazy‑load edilir.
- Redis cache ürün listeleme performansını artırır ve invalidation stratejisi içerir.