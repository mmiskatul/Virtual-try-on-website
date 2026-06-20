"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { getProducts } from "@/lib/api";
import { products as fallbackProducts, type Product } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export function FeaturedOutfits() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              The collection
            </p>
            <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
              Featured outfits
            </h2>
          </div>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-gold"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
