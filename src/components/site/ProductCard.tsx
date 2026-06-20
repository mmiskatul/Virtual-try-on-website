"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { Check } from "lucide-react";

interface Props {
  product: Product;
  selected?: boolean;
  onSelect?: (p: Product) => void;
  variant?: "browse" | "select";
}

export function ProductCard({ product, selected, onSelect, variant = "browse" }: Props) {
  const isSelect = variant === "select";

  return (
    <div
      onClick={() => isSelect && onSelect?.(product)}
      className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
        selected
          ? "border-charcoal shadow-luxe ring-2 ring-charcoal"
          : "border-border hover:shadow-luxe"
      } ${isSelect ? "cursor-pointer" : ""}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {selected && (
          <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-charcoal text-primary-foreground shadow-soft">
            <Check className="h-4 w-4" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur">
            {product.gender}
          </span>
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-foreground">${product.price}</p>
        </div>
        {!isSelect && (
          <Link
            href={`/try-on?product=${product.id}`}
            className="mt-2 flex w-full items-center justify-center rounded-full bg-charcoal px-4 py-2.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
          >
            Try On
          </Link>
        )}
      </div>
    </div>
  );
}
