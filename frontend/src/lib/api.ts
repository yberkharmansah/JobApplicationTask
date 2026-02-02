import type { Product } from "@/src/types/product";

const productBaseUrl =
  process.env.NEXT_PUBLIC_PRODUCT_API_URL ?? "http://localhost:5154/api";
const authBaseUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:5046/api";

export async function fetchProducts(params: {
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
  revalidate?: number;
}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.min) search.set("min", params.min);
  if (params.max) search.set("max", params.max);
  if (params.sort) search.set("sort", params.sort);

  const response = await fetch(
    `${productBaseUrl}/products?${search.toString()}`,
    { next: { revalidate: params.revalidate ?? 60 } }
  );

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return (await response.json()) as Product[];
}

export async function fetchProductsClient(params: {
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.min) search.set("min", params.min);
  if (params.max) search.set("max", params.max);
  if (params.sort) search.set("sort", params.sort);

  const response = await fetch(
    `${productBaseUrl}/products?${search.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return (await response.json()) as Product[];
}

export async function fetchProduct(id: string) {
  const response = await fetch(`${productBaseUrl}/products/${id}`, {
    next: { revalidate: 120 }
  });

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  return (await response.json()) as Product;
}

export async function login(payload: { email: string; password: string }) {
  const response = await fetch(`${authBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json() as Promise<{ token: string; email: string }>;
}

export async function register(payload: { email: string; password: string }) {
  const response = await fetch(`${authBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Register failed");
  }

  return response.json() as Promise<{ token: string; email: string }>;
}

export async function createProduct(
  payload: Omit<Product, "id">,
  token: string
) {
  const response = await fetch(`${productBaseUrl}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Create product failed");
  }

  return response.json() as Promise<Product>;
}

export async function updateProduct(
  id: string,
  payload: Omit<Product, "id">,
  token: string
) {
  const response = await fetch(`${productBaseUrl}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Update product failed");
  }

  return response.json() as Promise<Product>;
}

export async function deleteProduct(id: string, token: string) {
  const response = await fetch(`${productBaseUrl}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Delete product failed");
  }
}