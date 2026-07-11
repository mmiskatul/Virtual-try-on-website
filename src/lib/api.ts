import { type Product } from "@/lib/products";

export interface TryOnResult {
  id: string;
  user_image_url: string;
  product_id: string;
  product_name: string;
  garment_image_url: string;
  result_image_url: string;
  prompt: string;
  selected_size?: string | null;
  user_body_size?: string | null;
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
  tryOnsToday: number;
  tryOnsLast7Days: Array<{ date: string; count: number }>;
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

export interface AdminAnalyticsData {
  periodDays: number;
  periodStart: string;
  periodEnd: string;
  totalTryOns: number;
  periodTryOns: number;
  previousPeriodTryOns: number;
  periodChangePercent: number | null;
  totalProducts: number;
  activeProducts: number;
  uniqueProductsTried: number;
  resultStorageBytes: number;
  resultsWithMetadata: number;
  latestTryOnAt: string | null;
  dailyTryOns: Array<{ date: string; count: number }>;
  categoryPerformance: Array<{ category: string; tryOnCount: number; percentage: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    tryOnCount: number;
  }>;
}

export interface AdminStudioSettings {
  highFidelityRendering: boolean;
  realTimePhysics: boolean;
  precisionCalibration: boolean;
  themeAccent: "gold" | "black" | "red";
  typography: "Libre Caslon Text" | "Inter" | "Georgia";
  updatedAt: string | null;
  updatedBy: string | null;
  administrators: Array<{
    username: string;
    isActive: boolean;
    lastLoginAt: string | null;
  }>;
}

export type AdminStudioSettingsInput = Pick<
  AdminStudioSettings,
  | "highFidelityRendering"
  | "realTimePhysics"
  | "precisionCalibration"
  | "themeAccent"
  | "typography"
>;

interface BackendProduct {
  id: string;
  name: string;
  gender: Product["gender"];
  category: string;
  image_url: string;
  price: number;
  description: string;
  materials?: string;
  cloth_type?: string;
  coverage?: string;
  available_sizes?: string[];
  size_details?: string;
  fit_type?: string;
  color?: string;
  occasion?: string;
  care_instructions?: string;
  brand?: string;
  is_active: boolean;
}

interface BackendAdminDashboardData {
  total_products: number;
  active_products: number;
  inactive_products: number;
  total_tryons: number;
  tryons_today: number;
  tryons_last_7_days: Array<{ date: string; count: number }>;
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

interface BackendAdminAnalyticsData {
  period_days: number;
  period_start: string;
  period_end: string;
  total_tryons: number;
  period_tryons: number;
  previous_period_tryons: number;
  period_change_percent: number | null;
  total_products: number;
  active_products: number;
  unique_products_tried: number;
  result_storage_bytes: number;
  results_with_metadata: number;
  latest_tryon_at: string | null;
  daily_tryons: Array<{ date: string; count: number }>;
  category_performance: Array<{
    category: string;
    try_on_count: number;
    percentage: number;
  }>;
  top_products: Array<{
    id: string;
    name: string;
    category: string;
    image_url: string;
    try_on_count: number;
  }>;
}

interface BackendAdminStudioSettings {
  high_fidelity_rendering: boolean;
  real_time_physics: boolean;
  precision_calibration: boolean;
  theme_accent: AdminStudioSettings["themeAccent"];
  typography: AdminStudioSettings["typography"];
  updated_at: string | null;
  updated_by: string | null;
  administrators: Array<{
    username: string;
    is_active: boolean;
    last_login_at: string | null;
  }>;
}

export interface ProductCreateInput {
  id?: string;
  name: string;
  gender: Product["gender"];
  category: string;
  image_url: string;
  price: number;
  description: string;
  materials?: string;
  cloth_type?: string;
  coverage?: string;
  available_sizes?: string[];
  size_details?: string;
  fit_type?: string;
  color?: string;
  occasion?: string;
  care_instructions?: string;
  brand?: string;
  is_active: boolean;
}

export interface ProductUpdateInput {
  name?: string;
  gender?: Product["gender"];
  category?: string;
  image_url?: string;
  price?: number;
  description?: string;
  materials?: string;
  cloth_type?: string;
  coverage?: string;
  available_sizes?: string[];
  size_details?: string;
  fit_type?: string;
  color?: string;
  occasion?: string;
  care_instructions?: string;
  brand?: string;
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
    materials: product.materials,
    cloth_type: product.cloth_type,
    coverage: product.coverage as Product["coverage"],
    available_sizes: product.available_sizes ?? [],
    size_details: product.size_details,
    fit_type: product.fit_type,
    color: product.color,
    occasion: product.occasion,
    care_instructions: product.care_instructions,
    brand: product.brand,
    isActive: product.is_active,
  };
}

function normalizeAdminDashboardData(data: BackendAdminDashboardData): AdminDashboardData {
  return {
    totalProducts: data.total_products,
    activeProducts: data.active_products,
    inactiveProducts: data.inactive_products,
    totalTryOns: data.total_tryons,
    tryOnsToday: data.tryons_today,
    tryOnsLast7Days: data.tryons_last_7_days,
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

function normalizeAdminAnalyticsData(data: BackendAdminAnalyticsData): AdminAnalyticsData {
  return {
    periodDays: data.period_days,
    periodStart: data.period_start,
    periodEnd: data.period_end,
    totalTryOns: data.total_tryons,
    periodTryOns: data.period_tryons,
    previousPeriodTryOns: data.previous_period_tryons,
    periodChangePercent: data.period_change_percent,
    totalProducts: data.total_products,
    activeProducts: data.active_products,
    uniqueProductsTried: data.unique_products_tried,
    resultStorageBytes: data.result_storage_bytes,
    resultsWithMetadata: data.results_with_metadata,
    latestTryOnAt: data.latest_tryon_at,
    dailyTryOns: data.daily_tryons,
    categoryPerformance: data.category_performance.map((item) => ({
      category: item.category,
      tryOnCount: item.try_on_count,
      percentage: item.percentage,
    })),
    topProducts: data.top_products.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      imageUrl: item.image_url,
      tryOnCount: item.try_on_count,
    })),
  };
}

function normalizeAdminStudioSettings(data: BackendAdminStudioSettings): AdminStudioSettings {
  return {
    highFidelityRendering: data.high_fidelity_rendering,
    realTimePhysics: data.real_time_physics,
    precisionCalibration: data.precision_calibration,
    themeAccent: data.theme_accent,
    typography: data.typography,
    updatedAt: data.updated_at,
    updatedBy: data.updated_by,
    administrators: data.administrators.map((item) => ({
      username: item.username,
      isActive: item.is_active,
      lastLoginAt: item.last_login_at,
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
    return [];
  }
}

export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const data = await request<BackendProduct>(`/api/products/${productId}`);
    return normalizeProduct(data);
  } catch {
    return null;
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

export async function getAdminProduct(productId: string, token: string | null): Promise<Product> {
  const data = await adminRequest<BackendProduct>(`/api/admin/products/${productId}`, token);
  return normalizeProduct(data);
}

export async function getAdminDashboard(token: string | null): Promise<AdminDashboardData> {
  const data = await adminRequest<BackendAdminDashboardData>("/api/admin/dashboard", token);
  return normalizeAdminDashboardData(data);
}

export async function getAdminAnalytics(
  token: string | null,
  days = 30,
): Promise<AdminAnalyticsData> {
  const data = await adminRequest<BackendAdminAnalyticsData>(
    `/api/admin/analytics?days=${days}`,
    token,
  );
  return normalizeAdminAnalyticsData(data);
}

export async function getAdminSettings(token: string | null): Promise<AdminStudioSettings> {
  const data = await adminRequest<BackendAdminStudioSettings>("/api/admin/settings", token);
  return normalizeAdminStudioSettings(data);
}

export async function updateAdminSettings(
  payload: AdminStudioSettingsInput,
  token: string | null,
): Promise<AdminStudioSettings> {
  const data = await adminRequest<BackendAdminStudioSettings>("/api/admin/settings", token, {
    method: "PUT",
    body: JSON.stringify({
      high_fidelity_rendering: payload.highFidelityRendering,
      real_time_physics: payload.realTimePhysics,
      precision_calibration: payload.precisionCalibration,
      theme_accent: payload.themeAccent,
      typography: payload.typography,
    }),
  });
  return normalizeAdminStudioSettings(data);
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
  selected_size: string;
  user_body_size: string;
  user_size_details?: string;
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

export async function getTryOnHistory(token: string | null): Promise<TryOnResult[]> {
  return adminRequest<TryOnResult[]>("/api/tryon/history", token);
}

export async function deleteTryOnHistory(historyId: string, token: string | null): Promise<void> {
  await adminRequest<void>(`/api/tryon/history/${historyId}`, token, {
    method: "DELETE",
  });
}
