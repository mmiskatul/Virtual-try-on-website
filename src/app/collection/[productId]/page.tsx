"use client";

import Link from "next/link";
import { use, useState } from "react";
import { Sparkles, ShoppingBag, ArrowLeft, ShieldCheck, Info, ChevronDown } from "lucide-react";

import p1 from "@/assets/p1.jpg";
import p3 from "@/assets/p3.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import sculptedTote from "@/assets/sculpted_tote.png";

const products = [
  {
    id: "sculpted-wool-overcoat",
    name: "Sculpted Wool Overcoat",
    category: "CHARCOAL / TAILORED",
    price: 1250,
    image: p7.src,
    description: "Meticulously crafted from high-grade wool blend, this sculpted overcoat features structured shoulders, deep notch lapels, and a classic tailored silhouette. Built to withstand winter winds with absolute poise.",
    materials: "80% Virgin Wool, 20% Cashmere. Lining: 100% Silk.",
  },
  {
    id: "silk-bias-midi-dress",
    name: "Silk Bias Midi Dress",
    category: "CHAMPAGNE / EVENING",
    price: 890,
    image: p5.src,
    description: "Elegant bias-cut midi dress fluidly drapes along body contours. Features a cowl neckline, delicate spaghetti straps, and a low open back. Constructed from luxurious silk crepe de chine for a lustrous drape.",
    materials: "100% Organic Silk Crepe de Chine. Delicate dry clean only.",
  },
  {
    id: "pleated-crepe-trousers",
    name: "Pleated Crepe Trousers",
    category: "ESPRESSO / TAILORED",
    price: 450,
    image: p3.src,
    description: "Flowing crepe trousers designed with double front pleats, high-rise waistline, and relaxed wide legs. An elegant staple matching structured blazers and delicate silk shirts.",
    materials: "70% Triacetate, 30% Polyester. Dry clean only.",
  },
  {
    id: "cloud-cashmere-knit",
    name: "Cloud Cashmere Knit",
    category: "OATMEAL / RELAXED",
    price: 820,
    image: p1.src,
    description: "Incredibly soft mock-neck knit sweater woven from premium long-fiber cashmere. Relaxed drop shoulders, ribbed cuffs, and an airy texture providing cloud-like warmth.",
    materials: "100% Grade-A Mongolian Cashmere. Hand wash cold, flat dry.",
  },
  {
    id: "the-sculpted-tote",
    name: "The Sculpted Tote",
    category: "MAHOGANY / CALFSKIN",
    price: 1500,
    image: sculptedTote.src,
    description: "Geometric sculpted tote bag handcrafted in Florence. Architectural lines, structured top handles, and spacious interior lined in soft suede. Completed with gold-plated brass hardware.",
    materials: "100% Genuine Full-Grain Calfskin Leather. Suede lining.",
  },
  {
    id: "the-signature-blazer",
    name: "The Signature Blazer",
    category: "ONYX / PRIMA",
    price: 1100,
    image: p6.src,
    description: "Single-breasted signature blazer featuring a tailored waist, structured shoulders, and classic notched collar. An empowering outerwear layer transitioning effortlessly from boardroom to bistro.",
    materials: "90% Italian Merino Wool, 10% Elastane. Dry clean.",
  },
];

export default function ProductDetailsPage({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;
  
  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedSize, setSelectedSize] = useState("S");
  const [activeTab, setActiveTab] = useState<"physics" | "materials" | "returns">("physics");

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
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right Column: Garment info */}
        <div className="lg:col-span-6 space-y-8 flex flex-col justify-center">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#806B4D]">
              {product.category}
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
                  This garment features integrated structural mesh simulation files. In the Try-on Studio, our fabric mechanics calculator parses the drape density and elasticity constants of {product.name.toLowerCase()} against body maps, ensuring a highly accurate fit preview.
                </p>
              )}
              {activeTab === "materials" && (
                <p>
                  Crafted using atelier grade materials: {product.materials} We prioritize environmental durability and luxury texturing. Refer to care labels for washing parameters.
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
