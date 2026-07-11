"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { Sparkles, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { getProduct, resolveAssetUrl } from "@/lib/api";

export default function ProductDetailsPage({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setProduct(null);

    getProduct(productId)
      .then((loadedProduct) => {
        if (loadedProduct) {
          setProduct(loadedProduct);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load product details from API:", err);
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  const [selectedSize, setSelectedSize] = useState("S");
  const [activeTab, setActiveTab] = useState<"physics" | "materials" | "returns">("physics");

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
          <span className="font-mono text-charcoal">{productId}</span> could not be found in the collection.
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
        <div className="lg:col-span-6 space-y-8 flex flex-col justify-center">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#806B4D]">
              {product.category}{product.gender ? ` · ${product.gender}` : ""}
            </span>
            <h1 className="font-display text-4xl text-charcoal font-medium leading-tight">
              {product.name}
            </h1>
            <p className="text-xl font-light text-charcoal/90">${product.price}</p>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Size picker */}
          <div className="space-y-3">
            <p className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest">Select Size</p>
            <div className="flex items-center gap-3">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-9 w-9 rounded-full border text-[10px] font-bold uppercase transition flex items-center justify-center ${
                    selectedSize === size
                      ? "bg-charcoal border-transparent text-white"
                      : "border-neutral-200 text-charcoal hover:border-charcoal"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href={`/try-on?product=${product.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#806B4D] hover:bg-[#6c5a40] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-soft transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Try on in Studio</span>
            </Link>
            <button className="flex-1 inline-flex items-center justify-center gap-2 border border-charcoal/30 hover:bg-charcoal/5 text-charcoal text-xs font-bold uppercase tracking-wider py-4 rounded-xl transition">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add to Bag</span>
            </button>
          </div>

          {/* Accordion Tabs */}
          <div className="border-t border-neutral-200/60 pt-6 space-y-4">
            {/* Tab buttons */}
            <div className="flex gap-6 border-b border-neutral-100 pb-px text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              {[
                { id: "physics", label: "Neural Drape Physics" },
                { id: "materials", label: "Atelier Fabric Info" },
                { id: "returns", label: "Shipping & Returns" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 relative transition ${
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
            <div className="text-[11px] leading-relaxed text-muted-foreground min-h-[60px]">
              {activeTab === "physics" && (
                <p>
                  This garment features integrated structural mesh simulation files. In the Try-on Studio, our fabric mechanics calculator parses the drape density and elasticity constants of{" "}
                  <span className="font-semibold text-charcoal">{product.name}</span> against body maps, ensuring a highly accurate fit preview.
                </p>
              )}
              {activeTab === "materials" && (
                <p>
                  {product.materials
                    ? (
                      <>Crafted using atelier grade materials: <span className="font-semibold text-charcoal">{product.materials}</span>. We prioritize environmental durability and luxury texturing.</>
                    )
                    : "Material composition information is not available for this item. Contact our atelier team for details."}
                </p>
              )}
              {activeTab === "returns" && (
                <p>
                  Complimentary standard shipping on all orders. Returns are accepted within 30 days of delivery in pristine condition. Fits generated via Try-on Studio are backed by our accuracy assurance.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

