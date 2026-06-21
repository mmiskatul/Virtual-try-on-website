"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Layers3, PackagePlus, Tags } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import { getAdminProducts, resolveAssetUrl } from "@/lib/api";
import type { Product } from "@/lib/products";

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let active = true;
    setLoading(true);
    getAdminProducts(token)
      .then((data) => {
        if (active) setProducts(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const activeCount = products.filter((product) => product.isActive !== false).length;

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
              <p className="text-2xl font-semibold text-charcoal">{products.length}</p>
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
              <p className="text-2xl font-semibold text-charcoal">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cream text-charcoal">
              <PackagePlus className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Manage routes</p>
              <p className="text-sm text-muted-foreground">
                Add, edit, and review products separately.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Quick links
              </p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">Separate admin routes</h2>
            </div>
            <Link
              href="/miskat/admin/collection"
              className="inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Open collection
              <ArrowRight className="h-4 w-4" />
            </Link>
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
              href="/miskat/admin/history"
              className="rounded-2xl border border-border bg-background p-4 transition hover:border-charcoal/30 hover:bg-cream/40"
            >
              <p className="text-sm font-medium text-foreground">Try-on history</p>
              <p className="mt-1 text-sm text-muted-foreground">Review generated try-on results.</p>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recent items</p>
          <div className="mt-4 grid gap-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products found.</p>
            ) : (
              products.slice(0, 4).map((product) => (
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
    </div>
  );
}
