"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Download, Share2, ShoppingBag, RotateCcw, Sparkles } from "lucide-react";

import {
  getProduct,
  getProducts,
  getTryOnResult,
  resolveAssetUrl,
  type TryOnResult,
} from "@/lib/api";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export default function Result() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center">
          <p className="text-sm text-muted-foreground">Loading your preview...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tryOnPath = pathname.startsWith("/admin") ? "/admin/try-on" : "/try-on";
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [showBefore, setShowBefore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const historyId = searchParams.get("id") ?? sessionStorage.getItem("tryon:lastResultId");
    if (!historyId) {
      router.push(tryOnPath);
      return;
    }
    const resultId = historyId;

    async function loadResult() {
      try {
        const loadedResult = await getTryOnResult(resultId);
        const loadedProduct = await getProduct(loadedResult.product_id);
        const loadedProducts = await getProducts();

        setResult(loadedResult);
        setProduct(loadedProduct);
        setSimilar(
          loadedProducts
            .filter(
              (candidate) =>
                candidate.id !== loadedResult.product_id &&
                (!loadedProduct || candidate.gender === loadedProduct.gender),
            )
            .slice(0, 4),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load try-on result.");
      }
    }

    loadResult();
  }, [router, searchParams, tryOnPath]);

  if (error) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="max-w-md px-5 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Link
            href={tryOnPath}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  }

  if (!result || !product) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <p className="text-sm text-muted-foreground">Loading your preview...</p>
      </div>
    );
  }

  const resultData = result;
  const productData = product;
  const visibleImageUrl = showBefore ? resultData.user_image_url : resultData.result_image_url;

  function downloadImage() {
    const a = document.createElement("a");
    a.href = resolveAssetUrl(resultData.result_image_url);
    a.download = `ai-fit-studio-${resultData.id}.png`;
    a.click();
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My AI Fit Studio try-on",
          text: `Check out how I look in the ${productData.name}!`,
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
              src={resolveAssetUrl(visibleImageUrl)}
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
                src={resolveAssetUrl(productData.image)}
                alt={productData.name}
                className="h-32 w-24 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl text-charcoal">{productData.name}</h2>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {productData.gender} - {productData.category}
                </p>
                <p className="mt-3 text-xl font-semibold text-foreground">৳{productData.price}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <Link
                href={
                  pathname.startsWith("/admin")
                    ? `/admin/products/${productData.id}`
                    : `/collection/${productData.id}`
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <ShoppingBag className="h-4 w-4" /> View Product
              </Link>
              <Link
                href={tryOnPath}
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

          {resultData.image_details && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Image details
              </p>
              <div className="mt-4 space-y-2 text-sm text-foreground">
                <p>
                  Provider: {resultData.image_details.provider} ({resultData.image_details.model})
                </p>
                {resultData.image_details.content_type && (
                  <p>Format: {resultData.image_details.content_type}</p>
                )}
                {(resultData.image_details.width || resultData.image_details.height) && (
                  <p>
                    Size: {resultData.image_details.width ?? "?"} x{" "}
                    {resultData.image_details.height ?? "?"}
                  </p>
                )}
                {typeof resultData.image_details.file_size === "number" && (
                  <p>File size: {(resultData.image_details.file_size / 1024).toFixed(1)} KB</p>
                )}
                {typeof resultData.image_details.seed === "number" && (
                  <p>Seed: {resultData.image_details.seed}</p>
                )}
                {resultData.image_details.request_id && (
                  <p className="break-all text-xs text-muted-foreground">
                    Request ID: {resultData.image_details.request_id}
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-3xl text-charcoal sm:text-4xl">You may also like</h2>
            <Link
              href={pathname.startsWith("/admin") ? "/admin/collection" : "/collection"}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View full collection
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} tryOnHrefBase={tryOnPath} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
