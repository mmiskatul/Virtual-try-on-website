"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit3, Eye, PlusCircle } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  getAdminDashboard,
  resolveAssetUrl,
  type AdminDashboardData,
} from "@/lib/api";

export default function AdminProductsPage() {
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
          setError(loadError instanceof Error ? loadError.message : "Could not load products.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Products</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Manage products</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Open a dedicated product page to edit details, images, status, and pricing.
          </p>
        </div>
        <Link
          href="/admin/add"
          className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        ) : !dashboard || dashboard.products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No products found.</p>
        ) : (
          dashboard.products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
            >
              <div className="relative bg-cream/30">
                <img
                  src={resolveAssetUrl(product.image)}
                  alt={product.name}
                  className="h-72 w-full object-cover"
                />
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-charcoal px-3 py-1 text-xs font-medium text-primary-foreground">
                    {product.tryOnCount} try-ons
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-foreground">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.gender} - {product.category}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-foreground">৳{product.price}</p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                    {product.id}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-medium ${
                      product.isActive === false
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {product.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-charcoal px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Link>
                  <Link
                    href={`/try-on?product=${product.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-border px-4 py-3 text-sm text-foreground transition hover:border-charcoal"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
