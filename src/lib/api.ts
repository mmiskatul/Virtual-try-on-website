import { products as fallbackProducts, type Product } from "@/lib/products";

export interface TryOnResult {
  id: string;
  user_image_url: string;
  product_id: string;
  product_name: string;
  garment_image_url: string;
  result_image_url: string;
  prompt: string;
  image_details?: {
    provider: string;
    model: string;
    request_id?: string | null;
    source_result_url?: string | null;
    content_type?: string | null;
    file_name?: string | null;
    file_size?: number | null;
    width?: number | null;
    height?: number | null;
    seed?: number | null;
  } | null;
  created_at: string;
}

export interface AdminRecentTryOn {
  id: string;
  productId: string;
  productName: string;
  userImageUrl: string;
  garmentImageUrl: string;
  resultImageUrl: string;
  createdAt: string;
}

export interface AdminDashboardData {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalTryOns: number;
  topProductName: string | null;
  topProductTryOnCount: number;
  recentProducts: Product[];
  products: AdminDashboardProduct[];
  recentTryOns: AdminRecentTryOn[];
}

export interface AdminDashboardProduct extends Product {
  tryOnCount: number;
  lastTryOnAt: string | null;
}

interface BackendProduct {
  id: string;
  name: string;
  gender: Product["gender"];
  category: string;
  image_url: string;
  price: number;
  description: string;
  is_active: boolean;
}

interface BackendAdminDashboardData {
  total_products: number;
  active_products: number;
  inactive_products: number;
  total_tryons: number;
  top_product_name: string | null;
  top_product_try_on_count: number;
  recent_products: BackendProduct[];
  products: Array<BackendProduct & { try_on_count: number; last_try_on_at: string | null }>;
  recent_tryons: Array<{
    id: string;
    product_id: string;
    product_name: string;
    user_image_url: string;
    garment_image_url: string;
    result_image_url: string;
    created_at: string;
  }>;
}

export interface ProductCreateInput {
  id: string;
  name: string;
  gender: Product["gender"];
  category: string;
  image_url: string;
  price: number;
  description: string;
  is_active: boolean;
}

export interface ProductUpdateInput {
  name?: string;
  gender?: Product["gender"];
  category?: string;
  image_url?: string;
  price?: number;
  description?: string;
  is_active?: boolean;
}

export interface AdminLoginInput {
  username: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function resolveAssetUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${API_BASE_URL.replace(/\/$/, "")}${url}`;
  }

  return url;
}

export function getStoredAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("adminToken");
}

export function storeAdminToken(token: string): void {
  window.sessionStorage.setItem("adminToken", token);
}

export function clearAdminToken(): void {
  window.sessionStorage.removeItem("adminToken");
}

function normalizeProduct(product: BackendProduct): Product {
  return {
    id: product.id,
    name: product.name,
    gender: product.gender,
    category: product.category,
    price: product.price,
    image: product.image_url,
    description: product.description,
    isActive: product.is_active,
  };
}

function normalizeAdminDashboardData(data: BackendAdminDashboardData): AdminDashboardData {
  return {
    totalProducts: data.total_products,
    activeProducts: data.active_products,
    inactiveProducts: data.inactive_products,
    totalTryOns: data.total_tryons,
    topProductName: data.top_product_name,
    topProductTryOnCount: data.top_product_try_on_count,
    recentProducts: data.recent_products.map(normalizeProduct),
    products: data.products.map((product) => ({
      ...normalizeProduct(product),
      tryOnCount: product.try_on_count,
      lastTryOnAt: product.last_try_on_at,
    })),
    recentTryOns: data.recent_tryons.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      userImageUrl: item.user_image_url,
      garmentImageUrl: item.garment_image_url,
      resultImageUrl: item.result_image_url,
      createdAt: item.created_at,
    })),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let detail = "Request failed.";
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      // Keep clean fallback message.
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function adminRequest<T>(
  path: string,
  token: string | null,
  options?: RequestInit,
): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await request<BackendProduct[]>("/api/products");
    return data.map(normalizeProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const data = await request<BackendProduct>(`/api/products/${productId}`);
    return normalizeProduct(data);
  } catch {
    return fallbackProducts.find((product) => product.id === productId) ?? null;
  }
}

export async function uploadUserPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const data = await request<{ image_url: string }>("/api/uploads/user-photo", {
    method: "POST",
    body: formData,
  });
  return data.image_url;
}

export async function uploadProductImage(file: File, token: string | null): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const data = await adminRequest<{ image_url: string }>("/api/uploads/product-image", token, {
    method: "POST",
    body: formData,
  });
  return data.image_url;
}

export async function createProduct(
  payload: ProductCreateInput,
  token: string | null,
): Promise<Product> {
  const data = await adminRequest<BackendProduct>("/api/products", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeProduct(data);
}

export async function getAdminProducts(token: string | null): Promise<Product[]> {
  const data = await adminRequest<BackendProduct[]>("/api/admin/products", token);
  return data.map(normalizeProduct);
}

export async function getAdminProduct(
  productId: string,
  token: string | null,
): Promise<Product> {
  const data = await adminRequest<BackendProduct>(`/api/admin/products/${productId}`, token);
  return normalizeProduct(data);
}

export async function getAdminDashboard(token: string | null): Promise<AdminDashboardData> {
  const data = await adminRequest<BackendAdminDashboardData>("/api/admin/dashboard", token);
  return normalizeAdminDashboardData(data);
}

export async function updateProduct(
  productId: string,
  payload: ProductUpdateInput,
  token: string | null,
): Promise<Product> {
  const data = await adminRequest<BackendProduct>(`/api/products/${productId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalizeProduct(data);
}

export async function deleteProduct(productId: string, token: string | null): Promise<void> {
  await adminRequest<void>(`/api/products/${productId}`, token, {
    method: "DELETE",
  });
}

export async function loginAdmin(payload: AdminLoginInput): Promise<string> {
  const data = await request<{ token: string; token_type: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  storeAdminToken(data.token);
  return data.token;
}

export async function logoutAdmin(): Promise<void> {
  await request<{ detail: string }>("/api/auth/logout", { method: "POST" });
  clearAdminToken();
}

export async function getAdminSession(): Promise<{ username: string }> {
  return adminRequest<{ username: string }>("/api/auth/me", getStoredAdminToken());
}

export async function generateTryOn(payload: {
  user_image_url: string;
  product_id: string;
  prompt_optional?: string;
}): Promise<TryOnResult> {
  return request<TryOnResult>("/api/tryon/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getTryOnResult(id: string): Promise<TryOnResult> {
  return request<TryOnResult>(`/api/tryon/history/${id}`);
}

export async function getTryOnHistory(): Promise<TryOnResult[]> {
  return request<TryOnResult[]>("/api/tryon/history");
}

export async function deleteTryOnHistory(historyId: string, token: string | null): Promise<void> {
  await adminRequest<void>(`/api/tryon/history/${historyId}`, token, {
    method: "DELETE",
  });
}
