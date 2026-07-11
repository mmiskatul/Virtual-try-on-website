"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { getProducts, resolveAssetUrl } from "@/lib/api";

import p1 from "@/assets/p1.jpg";
import p3 from "@/assets/p3.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

import newArrivalTrench from "@/assets/new_arrival_trench.png";
import sculptedTote from "@/assets/sculpted_tote.png";

export default function Collection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState<any[]>([]);

  const displayProducts = [
    {
      id: "sculpted-wool-overcoat",
      name: "Sculpted Wool Overcoat",
      category: "CHARCOAL / TAILORED",
      price: 1250,
      image: p7.src,
    },
    {
      id: "silk-bias-midi-dress",
      name: "Silk Bias Midi Dress",
      category: "CHAMPAGNE / EVENING",
      price: 890,
      image: p5.src,
    },
    {
      id: "pleated-crepe-trousers",
      name: "Pleated Crepe Trousers",
      category: "ESPRESSO / TAILORED",
      price: 450,
      image: p3.src,
    },
    {
      id: "cloud-cashmere-knit",
      name: "Cloud Cashmere Knit",
      category: "OATMEAL / RELAXED",
      price: 820,
      image: p1.src,
    },
    {
      id: "the-sculpted-tote",
      name: "The Sculpted Tote",
      category: "MAHOGANY / CALFSKIN",
      price: 1500,
      image: sculptedTote.src,
    },
    {
      id: "the-signature-blazer",
      name: "The Signature Blazer",
      category: "ONYX / PRIMA",
      price: 1100,
      image: p6.src,
    },
  ];

  useEffect(() => {
    setProductsList(displayProducts);
    
    getProducts().then((loadedProducts) => {
      if (loadedProducts && loadedProducts.length > 0) {
        const activeProducts = loadedProducts.filter((p) => p.isActive !== false);
        if (activeProducts.length > 0) {
          setProductsList(activeProducts);
        }
      }
    }).catch((err) => {
      console.error("Failed to load products from api:", err);
    });
  }, []);

  useEffect(() => {
    const handleSearchChange = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("search") || "");
    };

    window.addEventListener("search-change", handleSearchChange);
    handleSearchChange(); // initial check

    return () => {
      window.removeEventListener("search-change", handleSearchChange);
    };
  }, []);

  // Filter products based on search query
  const filteredProducts = productsList.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="bg-white border-b border-border/40 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
              Editorial Selection
            </span>
            <h1 className="font-display text-5xl text-charcoal sm:text-6xl leading-tight">
              The Collection
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Explore our curated selection of luxury apparel, meticulously designed to blend technological innovation with timeless silhouette.
            </p>
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground shrink-0 pb-1">
            {filteredProducts.length} Items Found
          </span>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 border-b border-border/20">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Dropdowns */}
          <div className="flex flex-wrap gap-3">
            {["Category", "Style", "Occasion", "Price Range"].map((filterName) => (
              <div key={filterName} className="relative group">
                <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:border-charcoal transition">
                  {filterName}
                  <span className="text-[8px]">▼</span>
                </button>
              </div>
            ))}
          </div>

          {/* Active Tags */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-neutral-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-charcoal">
              Outerwear
              <span className="text-[8px] opacity-60 cursor-pointer">✕</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-neutral-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-charcoal">
              In Stock
              <span className="text-[8px] opacity-60 cursor-pointer">✕</span>
            </span>
            <button className="text-[10px] font-bold uppercase tracking-wider text-[#806B4D] hover:underline ml-2">
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* Asymmetric Product Grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Column 1 */}
          <div className="space-y-8">
            {filteredProducts
              .filter((_, idx) => idx % 2 === 0)
              .map((p) => (
                <ProductCardItem key={p.id} item={p} />
              ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            {filteredProducts
              .filter((_, idx) => idx % 2 === 1)
              .map((p) => (
                <ProductCardItem key={p.id} item={p} />
              ))}
          </div>

          {/* Column 3 - Large Card Spanning 2 rows */}
          {!searchQuery && (
            <div className="lg:row-span-2 h-full flex flex-col justify-between gap-8">
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-[#f9f8f6] aspect-[4/5] lg:aspect-auto lg:flex-1 shadow-soft flex flex-col justify-between">
                <img
                  src={newArrivalTrench.src}
                  alt="New Arrival Trench"
                  className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Top Label */}
                <div className="relative p-6">
                  <span className="inline-block bg-[#806B4D] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
                    New Arrival
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 flex justify-center border-t border-border/20">
        <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-charcoal">
          <button className="text-muted-foreground hover:text-foreground transition">←</button>
          <span className="cursor-pointer text-[#806B4D] underline decoration-2 underline-offset-4">01</span>
          <span className="cursor-pointer text-muted-foreground hover:text-foreground transition">02</span>
          <span className="cursor-pointer text-muted-foreground hover:text-foreground transition">03</span>
          <span className="text-muted-foreground select-none">...</span>
          <span className="cursor-pointer text-muted-foreground hover:text-foreground transition">15</span>
          <button className="text-muted-foreground hover:text-foreground transition">→</button>
        </div>
      </section>

      {/* Precision Fit Section */}
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#1c1c1c] px-8 py-16 text-white shadow-luxe md:px-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Info */}
            <div className="space-y-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
                Precision Fit
              </span>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl">
                Your perfect fit, <br />
                guaranteed by <br />
                neural physics.
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-neutral-400">
                Our AI doesn't just overlay clothes—it simulates fabric drape and tension based on your unique biometric data for an indistinguishable virtual mirror experience.
              </p>
              <div className="pt-4">
                <Link
                  href="/try-on"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#806B4D] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-soft transition hover:bg-[#6c5a40]"
                >
                  Launch Try-On Studio
                </Link>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="flex justify-center">
              <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#121212] p-5 shadow-soft">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  <span>COLLECTION - AI Fit Studio</span>
                  <span className="text-[#806B4D]">Active Simulation</span>
                </div>
                
                {/* Subtitle */}
                <p className="pt-3 text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                  Step-by-Step Composition: Digital Wireframe vs. Realistic Simulation
                </p>

                {/* Grid */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {/* Left Column (Wireframe Grid) */}
                  <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 aspect-[3/4] p-4 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:14px_24px] opacity-40" />
                    
                    {/* Glowing Mesh Mockup */}
                    <div className="relative flex-1 flex items-center justify-center">
                      <div className="h-28 w-14 rounded-full border border-[#806B4D]/30 bg-gradient-to-b from-[#806B4D]/10 to-transparent flex items-center justify-center">
                        <span className="text-[9px] font-bold text-[#806B4D]/60 tracking-wider">MESH</span>
                      </div>
                    </div>

                    <div className="relative space-y-1">
                      <p className="text-[9px] font-semibold text-white">Structural Data</p>
                      <p className="text-[7.5px] uppercase tracking-wider text-neutral-500 font-bold">Measurement Integrity</p>
                      <p className="text-[7.5px] uppercase tracking-wider text-[#806B4D] font-bold">Posture Analysis</p>
                    </div>
                  </div>

                  {/* Right Column (Realistic Texture) */}
                  <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 aspect-[3/4] p-4 flex flex-col justify-between relative font-sans">
                    <img
                      src={p5.src}
                      alt="Texture close-up"
                      className="absolute inset-0 h-full w-full object-cover object-center opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" />
                    
                    <div className="relative flex justify-end">
                      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[7px] font-bold tracking-widest text-[#806B4D] uppercase">
                        Render
                      </span>
                    </div>

                    <div className="relative space-y-1">
                      <p className="text-[9px] font-semibold text-white font-sans">Final Garment Prototype</p>
                      <p className="text-[7.5px] uppercase tracking-wider text-neutral-300 font-bold">Texture & Draping</p>
                    </div>
                  </div>
                </div>

                {/* Footer Banner */}
                <div className="mt-4 rounded-lg bg-black px-4 py-2.5 text-center text-[8.5px] font-semibold uppercase tracking-widest text-[#806B4D] border border-neutral-800">
                  AI Processing: 100% Crepe de Chine
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCardItem({ item }: { item: any }) {
  return (
    <div className="group relative block space-y-4">
      {/* Product Image Link */}
      <Link href={`/collection/${item.id}`} className="block cursor-pointer">
        <div className="overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-100 border border-neutral-100 shadow-soft relative">
          <img
            src={resolveAssetUrl(item.image)}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Floating Try On Virtually Action */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300 z-10">
        <Link
          href={`/try-on?product=${item.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-2 text-[9px] font-bold uppercase tracking-wider text-charcoal border border-neutral-200/40 shadow-soft hover:bg-charcoal hover:text-white transition duration-200"
        >
          <Sparkles className="h-3 w-3 text-[#806B4D]" />
          <span>Try On Virtually</span>
        </Link>
      </div>

      {/* Info Link */}
      <Link href={`/collection/${item.id}`} className="block cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {item.category}
            </p>
            <h3 className="mt-1 font-display text-lg font-medium text-charcoal group-hover:text-[#806B4D] transition">
              {item.name}
            </h3>
          </div>
          <span className="text-sm font-semibold text-charcoal">${item.price}</span>
        </div>
      </Link>
    </div>
  );
}
