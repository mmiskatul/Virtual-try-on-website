"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { BarChart2, Download, Edit2, Plus, Search, Sparkles } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import { getAdminDashboard, resolveAssetUrl, type AdminDashboardData } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type StatusFilter = "all" | "live" | "inactive";

function exportProducts(data: AdminDashboardData) {
  const rows = [
    ["id", "name", "category", "gender", "status", "price", "try_ons", "last_try_on_at"],
    ...data.products.map((product) => [
      product.id,
      product.name,
      product.category,
      product.gender,
      product.isActive === false ? "inactive" : "live",
      String(product.price),
      String(product.tryOnCount),
      product.lastTryOnAt ?? "",
    ]),
  ];
  const csv = rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "ai-fit-products.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function AdminCollectionsPageContent() {
  const searchParams = useSearchParams();
  const { token } = useAdminAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    getAdminDashboard(token)
      .then((data) => active && setDashboard(data))
      .catch((loadError) => {
        if (active)
          setError(loadError instanceof Error ? loadError.message : "Could not load collections.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  const products = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (dashboard?.products ?? []).filter((product) => {
      const matchesStatus =
        filter === "all" ||
        (filter === "live" && product.isActive !== false) ||
        (filter === "inactive" && product.isActive === false);
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.id.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [dashboard, filter, query]);

  const topProduct = [...(dashboard?.products ?? [])].sort(
    (a, b) => b.tryOnCount - a.tryOnCount,
  )[0];

  return (
    <div className="space-y-8 px-5 py-8 sm:px-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="max-w-2xl space-y-1.5">
          <h1 className="font-display text-4xl font-medium text-charcoal">Collections</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Manage the products available to customers and review their try-on usage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!dashboard}
            onClick={() => dashboard && exportProducts(dashboard)}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-charcoal disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <Link
            href="/admin/add"
            className="inline-flex items-center gap-1.5 rounded-xl bg-charcoal px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#806B4D]"
          >
            <Plus className="h-3.5 w-3.5" /> New Product
          </Link>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 sm:flex-row sm:items-end">
        <div className="flex gap-6">
          {(["all", "live", "inactive"] as StatusFilter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`relative pb-3 text-[10px] font-bold uppercase tracking-wider ${filter === item ? "text-charcoal" : "text-neutral-400"}`}
            >
              {item}{" "}
              {item === "all"
                ? (dashboard?.totalProducts ?? 0)
                : item === "live"
                  ? (dashboard?.activeProducts ?? 0)
                  : (dashboard?.inactiveProducts ?? 0)}
              {filter === item && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-charcoal" />
              )}
            </button>
          ))}
        </div>
        <label className="mb-2 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
          <Search className="h-3.5 w-3.5 text-neutral-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="bg-transparent text-xs outline-none"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200/50 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="p-5 pl-8">Product</th>
                <th className="p-5">Category</th>
                <th className="p-5">Status</th>
                <th className="p-5">Try-ons</th>
                <th className="p-5">Last used</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs font-semibold text-charcoal">
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="transition hover:bg-neutral-50/40">
                      <td className="flex items-center gap-4 p-5 pl-8">
                        <Skeleton className="h-11 w-11 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </td>
                      <td className="p-5">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="p-5">
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </td>
                      <td className="p-5">
                        <Skeleton className="h-4 w-8" />
                      </td>
                      <td className="p-5">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-5 pr-8 text-right flex justify-end gap-2 items-center h-full mt-2.5">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </td>
                    </tr>
                  ))
                : products.map((product) => (
                    <tr key={product.id} className="transition hover:bg-neutral-50/40">
                      <td className="flex items-center gap-4 p-5 pl-8">
                        <img
                          src={resolveAssetUrl(product.image)}
                          alt={product.name}
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                        <div>
                          <p>{product.name}</p>
                          <p className="mt-0.5 text-[9px] uppercase text-muted-foreground">
                            ID: {product.id}
                          </p>
                        </div>
                      </td>
                      <td className="p-5 font-medium capitalize text-neutral-500">
                        {product.category}
                      </td>
                      <td className="p-5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase ${product.isActive === false ? "bg-neutral-100 text-neutral-500" : "bg-emerald-50 text-emerald-600"}`}
                        >
                          {product.isActive === false ? "Inactive" : "Live"}
                        </span>
                      </td>
                      <td className="p-5 text-neutral-500">{product.tryOnCount}</td>
                      <td className="p-5 text-neutral-500">
                        {product.lastTryOnAt
                          ? new Date(product.lastTryOnAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <Link
                          href={`/admin/products/${product.id}`}
                          aria-label={`Edit ${product.name}`}
                          className="inline-flex rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-charcoal"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/analytics?product=${product.id}`}
                          aria-label="View analytics"
                          className="inline-flex rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-charcoal"
                        >
                          <BarChart2 className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/try-on?product=${product.id}`}
                          aria-label={`Virtually try on ${product.name}`}
                          className="inline-flex rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-charcoal"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && products.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No products match this view.
          </p>
        )}
        {loading && null}
        <div className="border-t border-neutral-200 px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Showing {products.length} of {dashboard?.totalProducts ?? 0} products
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Top Performer
          </p>
          <p className="mt-4 text-sm font-bold text-charcoal">
            {topProduct?.name ?? "No activity yet"}
          </p>
          <p className="mt-1 font-display text-2xl text-[#806B4D]">
            {topProduct?.tryOnCount ?? 0} tries
          </p>
        </div>
        <div className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Active Inventory
          </p>
          <p className="mt-4 font-display text-3xl text-charcoal">
            {dashboard?.activeProducts ?? 0}
          </p>
        </div>
        <div className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Total Try-Ons
          </p>
          <p className="mt-4 font-display text-3xl text-charcoal">{dashboard?.totalTryOns ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminCollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading collections...</p>
        </div>
      }
    >
      <AdminCollectionsPageContent />
    </Suspense>
  );
}
