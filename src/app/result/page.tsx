"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Share2, ShoppingBag, RotateCcw, Sparkles } from "lucide-react";

import { products, type Product } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export default function Result() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [showBefore, setShowBefore] = useState(false);

  useEffect(() => {
    const p = sessionStorage.getItem("tryon:photo");
    const id = sessionStorage.getItem("tryon:product");
    const prod = id ? products.find((x) => x.id === id) : null;
    if (!p || !prod) {
      router.push("/try-on");
      return;
    }
    setPhoto(p);
    setProduct(prod);
  }, [router]);

  if (!photo || !product) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <p className="text-sm text-muted-foreground">Loading your preview...</p>
      </div>
    );
  }

  const similar = products
    .filter((p) => p.id !== product.id && p.gender === product.gender)
    .slice(0, 4);

  function downloadImage() {
    if (!photo) return;
    const a = document.createElement("a");
    a.href = photo;
    a.download = `ai-fit-studio-${product?.id}.png`;
    a.click();
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My AI Fit Studio try-on",
          text: `Check out how I look in the ${product?.name}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      }
    } catch {
      // User cancelled the share sheet.
    }
  }

  return (
    <div className="bg-background">
      <section className="bg-gradient-cream">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Your preview</p>
          <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">Here's your look</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Tap the comparison toggle to flip between your original photo and the AI try-on.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-cream shadow-luxe">
            <img
              src={photo}
              alt={showBefore ? "Original photo" : "AI generated try-on"}
              className="mx-auto max-h-[720px] w-full object-contain"
            />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-background/90 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-charcoal backdrop-blur">
              <Sparkles className="h-3 w-3 text-gold" />
              {showBefore ? "Before" : "AI Try-On"}
            </div>
            <button
              onClick={() => setShowBefore(!showBefore)}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-charcoal px-5 py-2.5 text-xs font-medium text-primary-foreground shadow-luxe transition hover:opacity-90"
            >
              {showBefore ? "Show After" : "Show Before"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadImage}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:border-charcoal sm:flex-none"
            >
              <Download className="h-4 w-4" /> Download
            </button>
            <button
              onClick={share}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground transition hover:border-charcoal sm:flex-none"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Outfit details
            </p>
            <div className="mt-4 flex gap-5">
              <img
                src={product.image}
                alt={product.name}
                className="h-32 w-24 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl text-charcoal">{product.name}</h2>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {product.gender} - {product.category}
                </p>
                <p className="mt-3 text-xl font-semibold text-foreground">${product.price}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
              <Link
                href="/try-on"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:border-charcoal"
              >
                <RotateCcw className="h-4 w-4" /> Try another outfit
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-cream p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">Tip</p>
            <p className="mt-2 text-sm text-foreground">
              For the most accurate fit, upload a photo wearing fitted clothing in good lighting.
            </p>
          </div>
        </aside>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-3xl text-charcoal sm:text-4xl">You may also like</h2>
            <Link
              href="/collection"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View full collection
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
