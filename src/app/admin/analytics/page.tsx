"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Activity, Download, HardDrive, Layers3, Shirt, TrendingUp, X } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  getAdminAnalytics,
  getAdminProduct,
  getAdminDashboard,
  resolveAssetUrl,
  type AdminAnalyticsData,
} from "@/lib/api";
import { type Product } from "@/lib/products";
import { Skeleton } from "@/components/ui/skeleton";

function downloadCsv(data: AdminAnalyticsData) {
  const rows = [
    ["date", "try_ons"],
    ...data.dailyTryOns.map((item) => [item.date, String(item.count)]),
    [],
    ["category", "try_ons", "share_percent"],
    ...data.categoryPerformance.map((item) => [
      item.category,
      String(item.tryOnCount),
      String(item.percentage),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell ?? ""}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai-fit-analytics-${data.periodDays}-days.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 ** 2).toFixed(1)} MB`;
}

function AdminAnalyticsPageContent() {
  const { token } = useAdminAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const focusedProductId = searchParams.get("product");

  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);
  const [focusedProductStats, setFocusedProductStats] = useState<{ tryOnCount: number; lastTryOnAt: string | null } | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    if (!token || !focusedProductId) {
      setFocusedProduct(null);
      setFocusedProductStats(null);
      return;
    }

    let active = true;
    setLoadingProduct(true);

    getAdminProduct(focusedProductId, token)
      .then((prod) => {
        if (active) setFocusedProduct(prod);
      })
      .catch((err) => {
        console.error("Could not load focused product details", err);
      });

    getAdminDashboard(token)
      .then((dash) => {
        if (active) {
          const match = dash.products.find((p) => p.id === focusedProductId);
          if (match) {
            setFocusedProductStats({
              tryOnCount: match.tryOnCount,
              lastTryOnAt: match.lastTryOnAt,
            });
          } else {
            setFocusedProductStats({
              tryOnCount: 0,
              lastTryOnAt: null,
            });
          }
        }
      })
      .catch((err) => {
        console.error("Could not load product stats from dashboard", err);
      })
      .finally(() => {
        if (active) setLoadingProduct(false);
      });

    return () => {
      active = false;
    };
  }, [focusedProductId, token]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    setError(null);
    getAdminAnalytics(token, days)
      .then((data) => active && setAnalytics(data))
      .catch((loadError) => {
        if (active)
          setError(loadError instanceof Error ? loadError.message : "Could not load analytics.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [days, token]);

  const maxDaily = Math.max(1, ...(analytics?.dailyTryOns.map((item) => item.count) ?? []));
  const change = analytics?.periodChangePercent;

  return (
    <div className="space-y-8 px-5 py-8 sm:px-8">
      {focusedProductId && (
        <div className="relative overflow-hidden rounded-3xl border border-gold bg-gold/5 p-6 shadow-soft">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {loadingProduct ? (
              <p className="text-sm text-muted-foreground">Loading product analytics focus...</p>
            ) : focusedProduct ? (
              <div className="flex items-center gap-5">
                <img
                  src={resolveAssetUrl(focusedProduct.image)}
                  alt={focusedProduct.name}
                  className="h-20 w-16 rounded-xl object-cover border border-neutral-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#806B4D]">
                      Product Focus
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">
                      ID: {focusedProduct.id}
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-charcoal">
                    {focusedProduct.name}
                  </h2>
                  <p className="text-xs text-muted-foreground capitalize">
                    {focusedProduct.category} · {focusedProduct.gender} · ৳{focusedProduct.price}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Product not found.</p>
            )}

            {!loadingProduct && focusedProduct && focusedProductStats && (
              <div className="flex flex-wrap gap-6 border-t border-neutral-200/50 pt-4 sm:border-t-0 sm:pt-0">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                    Product Try-Ons
                  </p>
                  <p className="mt-1 font-display text-3xl font-light text-charcoal">
                    {focusedProductStats.tryOnCount}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                    Last Tried On
                  </p>
                  <p className="mt-2 text-xs font-semibold text-charcoal">
                    {focusedProductStats.lastTryOnAt
                      ? new Date(focusedProductStats.lastTryOnAt).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => router.push("/admin/analytics")}
              className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-charcoal transition"
              title="Clear product focus"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="max-w-2xl space-y-1.5">
          <h1 className="font-display text-4xl font-medium text-charcoal">Analytics & Insights</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Measured try-on activity, inventory reach, and generated-result metadata.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-charcoal"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            type="button"
            disabled={!analytics}
            onClick={() => analytics && downloadCsv(analytics)}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-charcoal transition hover:border-charcoal/50 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: `Try-ons · ${days} days`, value: analytics?.periodTryOns, icon: Shirt },
          { label: "All-time try-ons", value: analytics?.totalTryOns, icon: TrendingUp },
          { label: "Active products", value: analytics?.activeProducts, icon: Layers3 },
          { label: "Products tried", value: analytics?.uniqueProductsTried, icon: Activity },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white p-5 shadow-soft"
          >
            <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
              {label}
            </span>
            <p className="mt-1 font-display text-3xl font-light text-charcoal">
              {loading ? <Skeleton className="h-9 w-24 bg-primary/5" /> : (value ?? 0).toLocaleString()}
            </p>
            <Icon className="absolute -bottom-3 -right-3 h-16 w-16 text-neutral-100" />
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-medium text-charcoal">Try-On Volume</h2>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Daily completed generations · UTC
            </p>
          </div>
          {!loading && (
            <span
              className={`rounded-full px-3 py-1 text-[9px] font-bold ${change == null ? "bg-neutral-100 text-neutral-500" : change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
            >
              {change == null
                ? "No previous-period baseline"
                : `${change >= 0 ? "+" : ""}${change}% vs previous period`}
            </span>
          )}
        </div>
        <div className="mt-8 flex h-56 items-end gap-1 border-b border-neutral-100">
          {loading ? (
            Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1 h-full flex items-end">
                <Skeleton 
                  className="w-full bg-[#806B4D]/10 rounded-t"
                  style={{ height: `${20 + (i % 6) * 12}%` }} 
                />
              </div>
            ))
          ) : (
            (analytics?.dailyTryOns ?? []).map((item) => (
              <div key={item.date} className="group relative flex h-full flex-1 items-end">
                <div
                  className="min-h-1 w-full rounded-t bg-[#806B4D] transition hover:bg-charcoal"
                  style={{ height: `${Math.max(2, (item.count / maxDaily) * 100)}%` }}
                />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-charcoal px-2 py-1 text-[8px] text-white group-hover:block">
                  {item.date}: {item.count}
                </span>
              </div>
            ))
          )}
          {!loading && analytics?.dailyTryOns.length === 0 && (
            <p className="m-auto text-sm text-muted-foreground">No activity in this period.</p>
          )}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        <section className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft lg:col-span-5">
          <h2 className="border-b border-neutral-200/40 pb-4 font-display text-xl font-medium text-charcoal">
            Category Performance
          </h2>
          <div className="mt-5 space-y-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))
            ) : (
              analytics?.categoryPerformance.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-charcoal">
                    <span className="capitalize">{item.category}</span>
                    <span>
                      {item.tryOnCount} · {item.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-[#806B4D]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
            {!loading && analytics?.categoryPerformance.length === 0 && (
              <p className="text-sm text-muted-foreground">No category activity yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft lg:col-span-7">
          <h2 className="border-b border-neutral-200/40 pb-4 font-display text-xl font-medium text-charcoal">
            Top Products
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3 bg-white">
                  <Skeleton className="h-14 w-12 rounded-lg animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              analytics?.topProducts.map((p) => {
                const isFocused = p.id === focusedProductId;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                      isFocused
                        ? "border-gold bg-gold/5 shadow-soft ring-1 ring-gold"
                        : "border-neutral-100 bg-white"
                    }`}
                  >
                    <img
                      src={resolveAssetUrl(p.imageUrl)}
                      alt={p.name}
                      className="h-14 w-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-charcoal flex items-center gap-1.5">
                        {p.name}
                        {isFocused && (
                          <span className="rounded bg-gold/25 px-1.5 py-0.5 text-[8px] font-bold text-[#806B4D] uppercase">
                            Selected
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {p.category} · {p.tryOnCount} try-ons
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            {!loading && analytics?.topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">No product performance data yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="grid gap-4 rounded-3xl bg-charcoal p-6 text-white sm:grid-cols-3">
        <div>
          <HardDrive className="h-5 w-5 text-[#B99A6C]" />
          <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            Recorded result storage
          </p>
          <p className="mt-1 font-display text-2xl text-[#B99A6C]">
            {formatBytes(analytics?.resultStorageBytes ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            Results with metadata
          </p>
          <p className="mt-1 font-display text-2xl text-[#B99A6C]">
            {analytics?.resultsWithMetadata ?? 0}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            Latest generation
          </p>
          <p className="mt-1 text-sm text-[#B99A6C]">
            {analytics?.latestTryOnAt
              ? new Date(analytics.latestTryOnAt).toLocaleString()
              : "No generations yet"}
          </p>
        </div>
      </section>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading analytics dashboard...</p>
      </div>
    }>
      <AdminAnalyticsPageContent />
    </Suspense>
  );
}
