"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Layers3, Package, Pencil, Shirt, Sparkles } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import { getAdminDashboard, resolveAssetUrl, type AdminDashboardData } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;
    setLoading(true);
    setError(null);

    getAdminDashboard(token)
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load overview.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const highestDailyCount = Math.max(
    1,
    ...(dashboard?.tryOnsLast7Days.map((item) => item.count) ?? []),
  );

  return (
    <div className="space-y-12 px-5 py-8 sm:px-8">
      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
            Studio Core
          </span>
          <h1 className="font-display text-4xl leading-tight text-charcoal">
            <span className="relative inline-block pb-2.5">
              Performance Intelligence
              <span className="absolute bottom-0 left-0 h-[3px] w-24 bg-[#806B4D]" />
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-charcoal transition hover:border-charcoal/50"
          >
            <Package className="h-4 w-4" /> Manage Products
          </Link>
          <Link
            href="/admin/try-on"
            className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#806B4D]"
          >
            <Sparkles className="h-4 w-4" /> Virtual Try-On
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex min-h-[180px] flex-col justify-between rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <span className="rounded-xl border border-neutral-100 bg-[#FAF9F6] p-2.5 text-[#806B4D]">
              <Shirt className="h-5 w-5" />
            </span>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
              All time
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Try-Ons
            </p>
            <div className="font-display text-4xl font-light text-charcoal">
              {loading ? (
                <Skeleton className="h-10 w-24 bg-[#806B4D]/10" />
              ) : (
                (dashboard?.totalTryOns ?? 0).toLocaleString()
              )}
            </div>
          </div>
          <div className="mt-4 h-1 w-full rounded-full bg-[#806B4D]" />
        </div>

        <div className="flex min-h-[180px] flex-col justify-between rounded-3xl bg-[#1C1C1C] p-6 text-white shadow-soft">
          <div className="flex items-start justify-between">
            <span className="rounded-xl border border-neutral-700/20 bg-neutral-800/40 p-2.5 text-[#B99A6C]">
              <Activity className="h-5 w-5" />
            </span>
            <span className="rounded bg-[#806B4D]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#B99A6C]">
              Today UTC
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              Try-Ons Today
            </p>
            <div className="font-display text-4xl font-light text-white">
              {loading ? (
                <Skeleton className="h-10 w-24 bg-neutral-700" />
              ) : (
                (dashboard?.tryOnsToday ?? 0).toLocaleString()
              )}
            </div>
          </div>
          {loading ? (
            <div className="mt-4 flex h-7 items-end gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-full w-full bg-neutral-700" />
              ))}
            </div>
          ) : (
            <div
              className="mt-4 flex h-7 items-end gap-1"
              aria-label="Try-ons during the last seven days"
            >
              {(
                dashboard?.tryOnsLast7Days ??
                Array.from({ length: 7 }, (_, index) => ({ date: String(index), count: 0 }))
              ).map((item) => (
                <div
                  key={item.date}
                  className="min-h-1 w-full rounded-t-sm bg-[#B99A6C] transition-[height]"
                  style={{ height: `${Math.max(12, (item.count / highestDailyCount) * 100)}%` }}
                  title={`${item.date}: ${item.count} try-ons`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex min-h-[180px] flex-col justify-between rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <span className="rounded-xl border border-neutral-100 bg-[#FAF9F6] p-2.5 text-[#806B4D]">
              <Layers3 className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              {loading ? (
                <Skeleton className="h-3 w-16" />
              ) : (
                `${dashboard?.inactiveProducts ?? 0} inactive`
              )}
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Active Products
            </p>
            <div className="font-display text-4xl font-light text-charcoal">
              {loading ? (
                <Skeleton className="h-10 w-24 bg-[#806B4D]/10" />
              ) : (
                (dashboard?.activeProducts ?? 0).toLocaleString()
              )}
            </div>
          </div>
          <div className="mt-4 text-[9px] font-bold uppercase tracking-wider text-[#806B4D]">
            {loading ? (
              <Skeleton className="h-3 w-28" />
            ) : (
              `${dashboard?.totalProducts ?? 0} products total`
            )}
          </div>
        </div>
      </div>

      <div>
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-neutral-200/50 pb-4">
            <div>
              <h2 className="font-display text-2xl font-medium text-charcoal">
                Collection Overview
              </h2>
              {!loading && dashboard?.topProductName && (
                <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                  Most tried: {dashboard.topProductName} ({dashboard.topProductTryOnCount})
                </p>
              )}
            </div>
            <Link
              href="/admin/collection"
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#806B4D] hover:underline"
            >
              View All <span>→</span>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-4 rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-soft"
                >
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-10 rounded-xl" />
                    <Skeleton className="h-10 rounded-xl" />
                  </div>
                </div>
              ))
            ) : !dashboard || dashboard.recentProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products have been added yet.</p>
            ) : (
              dashboard.recentProducts.slice(0, 2).map((product) => (
                <article
                  key={product.id}
                  className="group space-y-4 rounded-3xl border border-neutral-200/40 bg-white p-4 shadow-soft"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-100">
                    <img
                      src={resolveAssetUrl(product.image)}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <span
                      className={`absolute right-4 top-4 flex items-center gap-1 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-white ${product.isActive === false ? "bg-neutral-500" : "bg-emerald-500"}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      {product.isActive === false ? "Inactive" : "Live"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                      {product.gender} · {product.category}
                    </p>
                    <h3 className="font-display text-lg font-medium text-charcoal">
                      {product.name}
                    </h3>
                    <p className="text-[9px] font-semibold uppercase text-muted-foreground">
                      ID: {product.id}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider text-charcoal hover:border-charcoal/50"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <Link
                      href={`/admin/try-on?product=${product.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-charcoal px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider text-white hover:bg-[#806B4D]"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Try On
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <footer className="border-t border-neutral-200/40 pt-12 text-center text-[9px] font-semibold uppercase tracking-widest text-neutral-400">
        AI Fit Studio © {new Date().getFullYear()} — Live studio data
      </footer>
    </div>
  );
}
