"use client";

import { useState } from "react";

import { products, type Gender } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

type Filter = "all" | Gender;

export default function Collection() {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = filter === "all" ? products : products.filter((p) => p.gender === filter);

  return (
    <div className="bg-background">
      <section className="bg-gradient-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The collection
          </p>
          <h1 className="mt-3 font-display text-5xl text-charcoal sm:text-6xl">
            Curated for try-on
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            A carefully chosen edit of menswear and womenswear - every piece ready to preview on
            you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {(["all", "female", "male"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
                filter === g
                  ? "bg-charcoal text-primary-foreground shadow-soft"
                  : "border border-border bg-background text-foreground hover:border-charcoal"
              }`}
            >
              {g === "all" ? "All" : g}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
