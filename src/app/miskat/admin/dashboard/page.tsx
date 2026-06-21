"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Edit3, Flame, Layers3, PackagePlus, Tags, Trash2 } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  deleteProduct,
  getAdminDashboard,
  resolveAssetUrl,
  type AdminDashboardData,
  type AdminDashboardProduct,
} from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
          setError(loadError instanceof Error ? loadError.message : "Could not load dashboard.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function handleDelete(product: AdminDashboardProduct) {
    if (!token) {
      setError("Please log in as admin first.");
      return;
    }

    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) return;

    setDeletingId(product.id);
    setError(null);

    try {
      await deleteProduct(product.id, token);
      setDashboard((current) => {
        if (!current) return current;
        const products = current.products.filter((item) => item.id !== product.id);
        const recentProducts = current.recentProducts.filter((item) => item.id !== product.id);
        const nextTotalProducts = Math.max(0, current.totalProducts - 1);
        const nextActiveProducts =
          product.isActive === false ? current.activeProducts : Math.max(0, current.activeProducts - 1);

        return {
          ...current,
          totalProducts: nextTotalProducts,
          activeProducts: nextActiveProducts,
          products,
          recentProducts,
        };
      });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-charcoal text-primary-foreground">
              <Layers3 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Collection total</p>
              <p className="text-2xl font-semibold text-charcoal">
                {loading ? "-" : dashboard?.totalProducts ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold/20 text-charcoal">
              <Tags className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Active products</p>
              <p className="text-2xl font-semibold text-charcoal">
                {loading ? "-" : dashboard?.activeProducts ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cream text-charcoal">
              <PackagePlus className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Try-on results</p>
              <p className="text-2xl font-semibold text-charcoal">
                {loading ? "-" : dashboard?.totalTryOns ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-700">
              <Flame className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Top product</p>
              <p className="text-sm font-semibold text-charcoal">
                {loading ? "-" : dashboard?.topProductName ?? "No try-ons yet"}
              </p>
              <p className="text-xs text-muted-foreground">
                {loading ? "" : `${dashboard?.topProductTryOnCount ?? 0} uses`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Quick links
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Separate admin routes</h2>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/miskat/admin/add"
              className="rounded-2xl border border-border bg-background p-4 transition hover:border-charcoal/30 hover:bg-cream/40"
            >
              <p className="text-sm font-medium text-foreground">Add product</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a new dress, shirt, or pant entry.
              </p>
            </Link>
            <Link
              href="/miskat/admin/products"
              className="rounded-2xl border border-border bg-background p-4 transition hover:border-charcoal/30 hover:bg-cream/40"
            >
              <p className="text-sm font-medium text-foreground">Open products</p>
              <p className="mt-1 text-sm text-muted-foreground">Edit individual products directly.</p>
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground">Inactive products</p>
              <p className="mt-1 text-2xl font-semibold text-charcoal">
                {loading ? "-" : dashboard?.inactiveProducts ?? 0}
              </p>
            </div>
            <Link
              href="/miskat/admin/history"
              className="rounded-2xl border border-border bg-background p-4 transition hover:border-charcoal/30 hover:bg-cream/40"
            >
              <p className="text-sm font-medium text-foreground">History details</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Review prompts, timestamps, and generated images.
              </p>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recent items</p>
          <div className="mt-4 grid gap-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading products...</p>
            ) : !dashboard || dashboard.recentProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products found.</p>
            ) : (
              dashboard.recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-border p-3"
                >
                  <img
                    src={resolveAssetUrl(product.image)}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.gender} - {product.category}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Dashboard collection
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Products overview</h2>
          </div>
          {!loading && dashboard && (
            <p className="text-sm text-muted-foreground">
              {dashboard.products.length} product cards
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading dashboard cards...</p>
          ) : !dashboard || dashboard.products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products found.</p>
          ) : (
            dashboard.products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-border bg-background"
              >
                <div className="relative bg-cream/30">
                  <img
                    src={resolveAssetUrl(product.image)}
                    alt={product.name}
                    className="h-72 w-full object-cover"
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/miskat/admin/products/${product.id}`)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-background/95 text-foreground shadow-soft transition hover:bg-background"
                      aria-label={`Edit ${product.name}`}
                      title="Edit product"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-700 shadow-soft transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Delete ${product.name}`}
                      title="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-charcoal px-3 py-1 text-xs font-medium text-primary-foreground">
                      {product.tryOnCount} try-ons
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {product.gender} - {product.category}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-foreground">
                      ${product.price}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                      ID: {product.id}
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

                  {product.description && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Recent activity
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Latest try-ons</h2>
          </div>
          {!loading && dashboard && (
            <Link
              href="/miskat/admin/history"
              className="text-sm font-medium text-foreground transition hover:text-gold"
            >
              Open history
            </Link>
          )}
        </div>

        <div className="mt-6 grid gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          ) : !dashboard || dashboard.recentTryOns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No try-on activity yet.</p>
          ) : (
            dashboard.recentTryOns.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-2xl border border-border bg-background p-4 md:grid-cols-[0.7fr_1.3fr]"
              >
                <div className="grid grid-cols-3 gap-3">
                  <img
                    src={resolveAssetUrl(item.userImageUrl)}
                    alt="User upload"
                    className="h-28 w-full rounded-xl object-cover"
                  />
                  <img
                    src={resolveAssetUrl(item.garmentImageUrl)}
                    alt={item.productName}
                    className="h-28 w-full rounded-xl object-cover"
                  />
                  <img
                    src={resolveAssetUrl(item.resultImageUrl)}
                    alt="Try-on result"
                    className="h-28 w-full rounded-xl object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">{item.productName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Product ID: {item.productId}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/miskat/admin/products/${item.productId}`}
                      className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm text-foreground transition hover:border-charcoal"
                    >
                      Open product
                    </Link>
                    <Link
                      href="/miskat/admin/history"
                      className="inline-flex items-center justify-center rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                      Open history
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
