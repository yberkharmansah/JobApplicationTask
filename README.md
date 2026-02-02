# JobApplicationTask

Full Stack Developer 2. aşama task için hazırlanmış Auth + Product backend servisleri ve çok dilli Next.js storefront uygulaması.

## İçerik
- [Genel Mimari](#genel-mimari)
- [Gereksinimler](#gereksinimler)
- [Kurulum](#kurulum)
  - [Docker](#docker)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Çevresel Değişkenler](#çevresel-değişkenler)
- [Paketler & Sürümler](#paketler--sürümler)
- [Notlar](#notlar)

## Genel Mimari
- **Auth Service**: kayıt, login ve JWT üretimi.
- **Product Service**: CQRS + Redis cache ile ürün listeleme ve CRUD.
- **Frontend**: Next.js App Router, next-intl çok dilli destek, RTK ile sepet yönetimi.

## Gereksinimler
- **.NET 7+**
- **Node.js 20+**
- **PostgreSQL 16**
- **Redis 7**

## Kurulum

### Docker
PostgreSQL ve Redis’i ayağa kaldırmak için:
```bash
cd docker
docker compose up -d
```

### Backend
Her servisi ayrı terminalde başlatın.

```bash
cd backend/src/AuthService
dotnet restore
dotnet run --project AuthService.API
```

```bash
cd backend/src/ProductService
dotnet restore
dotnet run --project ProductService.API
```

> Varsayılan swagger adresleri:
> - Auth: `http://localhost:5001/swagger`
> - Product: `http://localhost:5002/swagger`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

## Çevresel Değişkenler
`frontend/.env.local` örneği:
```bash
NEXT_PUBLIC_AUTH_API_URL=http://localhost:5001/api
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:5002/api
```

> Backend tarafında ise `appsettings.Development.json` içinde JWT ve connection string örnekleri bulunur.

## Paketler & Sürümler
Frontend’de kullanılan ana paketler:
```bash
npm install next@16.1.5 react@19.2.3 react-dom@19.2.3
npm install @reduxjs/toolkit@^2.5.1 react-redux@^9.1.2
npm install next-intl@^3.22.0
```

Tailwind + tooling zaten proje içerisinde yer alır:
```bash
npm install -D tailwindcss@^4 eslint@^9 typescript@^5
```

## Notlar
- Auth token frontend’de `localStorage` içinde saklanır (demo amaçlı).
- Next.js sayfaları ISR ile yeniden valide edilir (`revalidate: 60/120`).
- Ürün görselleri `next/image` ile lazy-load edilir.