"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import {
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  Tag,
  Shirt,
  Layers,
  Palette,
  Calendar,
  Info,
  WashingMachine,
} from "lucide-react";
import { getProduct, resolveAssetUrl } from "@/lib/api";

const COVERAGE_LABEL: Record<string, string> = {
  upper: "Upper Body",
  lower: "Lower Body",
  full: "Full Body",
  accessory: "Accessory",
};

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"details" | "materials" | "care" | "returns">(
    "details"
  );

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setSelectedSize("");

    getProduct(productId)
      .then((loadedProduct) => {
        if (loadedProduct) {
          setProduct(loadedProduct);
          // Auto-select first available size
          if (loadedProduct.available_sizes && loadedProduct.available_sizes.length > 0) {
            setSelectedSize(loadedProduct.available_sizes[0]);
          }
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load product details from API:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 text-[#806B4D] animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Loading product details…
        </p>
      </div>
    );
  }

  // Not found state
  if (notFound || !product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-6 px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#806B4D]">
          404 — Not Found
        </p>
        <h1 className="font-display text-3xl text-charcoal text-center">
          This product doesn&apos;t exist
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          The product with ID{" "}
          <span className="font-mono text-charcoal">{productId}</span> could not
          be found in the collection.
        </p>
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </Link>
      </div>
    );
  }

  const sizesToShow: string[] =
    product.available_sizes && product.available_sizes.length > 0
      ? product.available_sizes
      : ["XS", "S", "M", "L", "XL", "XXL"];

  const tryOnHref =
    selectedSize
      ? `/try-on?product=${product.id}&size=${encodeURIComponent(selectedSize)}`
      : `/try-on?product=${product.id}`;

  const badges = [
    product.color && { icon: Palette, label: "Color", value: product.color },
    product.cloth_type && { icon: Layers, label: "Fabric", value: product.cloth_type },
    product.coverage && {
      icon: Shirt,
      label: "Coverage",
      value: COVERAGE_LABEL[product.coverage] ?? product.coverage,
    },
    product.fit_type && { icon: Info, label: "Fit", value: product.fit_type },
    product.occasion && { icon: Calendar, label: "Occasion", value: product.occasion },
    product.brand && { icon: Tag, label: "Brand", value: product.brand },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Back navigation */}
      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-charcoal transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Collection</span>
        </Link>
      </section>

      {/* Main product area */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 grid gap-12 lg:grid-cols-12">
        {/* Left Column: Product Image */}
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-[#f9f8f6] aspect-[4/5] shadow-soft">
            {product.image ? (
              <img
                src={resolveAssetUrl(product.image)}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-neutral-100">
                <Sparkles className="h-8 w-8 text-[#806B4D]/40" />
              </div>
            )}
          </div>

          {/* Product ID badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Product ID
            </span>
            <span className="rounded-md bg-neutral-100 px-2.5 py-1 font-mono text-[10px] text-charcoal">
              {product.id}
            </span>
          </div>
        </div>

        {/* Right Column: Garment info */}
        <div className="lg:col-span-6 space-y-7 flex flex-col justify-start">
          {/* Category + Gender */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#806B4D]">
              {product.category}
              {product.gender ? ` · ${product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}` : ""}
            </span>
            <h1 className="mt-2 font-display text-4xl text-charcoal font-medium leading-tight">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-light text-charcoal/90">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* At-a-Glance badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5"
                >
                  <Icon className="h-3 w-3 text-[#806B4D]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    {label}:
                  </span>
                  <span className="text-[9px] font-semibold text-charcoal">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Size picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-charcoal uppercase tracking-widest">
                Select Size
              </p>
              {selectedSize && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#806B4D]">
                  Selected: {selectedSize}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {sizesToShow.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[44px] h-10 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition px-3 ${
                    selectedSize === size
                      ? "bg-charcoal border-transparent text-white shadow-soft"
                      : "border-neutral-200 text-charcoal hover:border-charcoal bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {product.available_sizes && product.available_sizes.length === 0 && (
              <p className="text-[10px] text-muted-foreground">
                Size information not available. Default sizes shown.
              </p>
            )}
          </div>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link
              href={tryOnHref}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#806B4D] hover:bg-[#6c5a40] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-soft transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Try On in Studio{selectedSize ? ` (Size ${selectedSize})` : ""}</span>
            </Link>
            <button className="flex-1 inline-flex items-center justify-center gap-2 border border-charcoal/30 hover:bg-charcoal/5 text-charcoal text-xs font-bold uppercase tracking-wider py-4 rounded-xl transition">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add to Bag</span>
            </button>
          </div>

          {/* Detailed Info Tabs */}
          <div className="border-t border-neutral-200/60 pt-5 space-y-4">
            {/* Tab buttons */}
            <div className="flex flex-wrap gap-4 border-b border-neutral-100 pb-px text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              {[
                { id: "details", label: "Garment Details" },
                { id: "materials", label: "Fabric & Materials" },
                { id: "care", label: "Care" },
                { id: "returns", label: "Shipping & Returns" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 relative transition whitespace-nowrap ${
                    activeTab === tab.id ? "text-charcoal" : "hover:text-charcoal"
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-charcoal" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="text-[11px] leading-relaxed text-muted-foreground min-h-[80px] space-y-2">
              {activeTab === "details" && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                  {[
                    ["Category", product.category],
                    ["Gender", product.gender && (product.gender.charAt(0).toUpperCase() + product.gender.slice(1))],
                    ["Color", product.color],
                    ["Cloth Type", product.cloth_type],
                    ["Coverage", product.coverage && COVERAGE_LABEL[product.coverage]],
                    ["Fit Type", product.fit_type],
                    ["Occasion", product.occasion],
                    ["Brand", product.brand],
                    ["Price", product.price && `$${product.price.toFixed(2)}`],
                    ["Available Sizes", product.available_sizes && product.available_sizes.length > 0 ? product.available_sizes.join(", ") : null],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => (
                      <div key={label as string}>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                          {label}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-charcoal">
                          {value}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "materials" && (
                <div className="space-y-2">
                  {product.cloth_type && (
                    <p>
                      <span className="font-semibold text-charcoal">Cloth Type:</span>{" "}
                      {product.cloth_type}
                    </p>
                  )}
                  {product.materials ? (
                    <p>
                      <span className="font-semibold text-charcoal">Composition:</span>{" "}
                      {product.materials}
                    </p>
                  ) : (
                    <p>Material composition information is not available for this item.</p>
                  )}
                  <p className="text-[10px] text-neutral-400 mt-2 italic">
                    Our garments are ethically sourced and responsibly manufactured.
                  </p>
                </div>
              )}

              {activeTab === "care" && (
                <div className="space-y-2">
                  {product.care_instructions ? (
                    <p>
                      <span className="font-semibold text-charcoal">Care Instructions:</span>{" "}
                      {product.care_instructions}
                    </p>
                  ) : (
                    <p>
                      Dry clean recommended. If machine washing, use a delicate cycle with cold
                      water. Lay flat to dry. Do not bleach or tumble dry.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "returns" && (
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-charcoal">Free Shipping:</span>{" "}
                    Complimentary standard shipping on all orders over $100.
                  </p>
                  <p>
                    <span className="font-semibold text-charcoal">Returns:</span>{" "}
                    Accepted within 30 days of delivery in original, unworn condition with tags attached.
                  </p>
                  <p>
                    <span className="font-semibold text-charcoal">Try-On Guarantee:</span>{" "}
                    Fits generated via our Try-On Studio are backed by our accuracy assurance — if the fit is wrong, we make it right.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
