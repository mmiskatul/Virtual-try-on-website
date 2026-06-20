"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Upload, ImageIcon, X, Sparkles, Check, AlertCircle } from "lucide-react";

import { products, type Gender, type Product } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

const LOADING_STEPS = [
  "Analyzing your photo",
  "Applying selected outfit",
  "Preserving pose and background",
  "Generating final preview",
];

export default function TryOn() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center">
          <p className="text-sm text-muted-foreground">Loading try-on studio...</p>
        </div>
      }
    >
      <TryOnContent />
    </Suspense>
  );
}

function TryOnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const initialId = searchParams.get("product");
  const [photo, setPhoto] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(
    initialId ? (products.find((p) => p.id === initialId) ?? null) : null,
  );
  const [genderFilter, setGenderFilter] = useState<"all" | Gender>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = sessionStorage.getItem("tryon:photo");
    if (p) setPhoto(p);
  }, []);

  useEffect(() => {
    if (!initialId) return;
    const product = products.find((p) => p.id === initialId);
    if (product) setSelected(product);
  }, [initialId]);

  const cats = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = products.filter(
    (p) =>
      (genderFilter === "all" || p.gender === genderFilter) &&
      (catFilter === "all" || p.category === catFilter),
  );

  function handleFile(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG or PNG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPhoto(url);
      sessionStorage.setItem("tryon:photo", url);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    setPhoto(null);
    sessionStorage.removeItem("tryon:photo");
  }

  async function generate() {
    if (!photo) {
      setError("Please upload a photo first.");
      return;
    }
    if (!selected) {
      setError("Please select an outfit.");
      return;
    }
    setError(null);
    setLoading(true);
    setStep(0);
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 900));
      setStep(i + 1);
    }
    sessionStorage.setItem("tryon:product", selected.id);
    await new Promise((r) => setTimeout(r, 400));
    router.push("/result");
  }

  return (
    <div className="bg-background pb-28 md:pb-12">
      <section className="bg-gradient-cream">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Try-On Studio
          </p>
          <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">Create your look</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Add a clear full-body photo, pick an outfit, and we'll generate a preview in seconds.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg text-foreground">1. Your photo</h2>
              {photo && (
                <button
                  onClick={clearPhoto}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-charcoal hover:text-foreground"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
            </div>

            {photo ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-cream">
                <img
                  src={photo}
                  alt="Uploaded preview"
                  className="max-h-[500px] w-full object-contain"
                />
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
                  dragOver
                    ? "border-charcoal bg-cream"
                    : "border-border bg-cream/40 hover:border-charcoal/40"
                }`}
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-gold text-charcoal">
                  <Upload className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Upload a clear full-body photo
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Drag & drop, or click to browse
                  </p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
            )}

            <ul className="mt-5 space-y-2">
              {[
                "Use a front-facing photo",
                "Good, even lighting",
                "Avoid covered or cropped body",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {selected && (
            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Selected outfit
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="h-20 w-16 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.category} - ${selected.price}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={generate}
            className="hidden w-full items-center justify-center gap-2 rounded-full bg-charcoal py-4 text-sm font-medium text-primary-foreground shadow-luxe transition hover:opacity-90 md:inline-flex"
          >
            <Sparkles className="h-4 w-4" /> Generate Try-On
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="mb-5 text-lg text-foreground">2. Choose an outfit</h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {(["all", "male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
                    genderFilter === g
                      ? "bg-charcoal text-primary-foreground"
                      : "border border-border text-foreground hover:border-charcoal"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  className={`rounded-full px-3.5 py-1 text-[11px] uppercase tracking-wider transition ${
                    catFilter === c
                      ? "bg-cream-deep text-charcoal"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c === "all" ? "All categories" : c}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-cream/40 p-12 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No outfits in this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    variant="select"
                    selected={selected?.id === p.id}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-4 backdrop-blur-xl md:hidden">
        <button
          onClick={generate}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-4 text-sm font-medium text-primary-foreground shadow-luxe"
        >
          <Sparkles className="h-4 w-4" /> Generate Try-On
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-5 backdrop-blur">
          <div className="w-full max-w-md rounded-3xl bg-background p-8 shadow-luxe">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-11 w-11 animate-pulse place-items-center rounded-full bg-gradient-gold text-charcoal">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg text-foreground">Creating your virtual try-on...</h3>
                <p className="text-xs text-muted-foreground">
                  Hold tight, this takes a few seconds.
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {LOADING_STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-[10px] transition ${
                        done
                          ? "bg-charcoal text-primary-foreground"
                          : active
                            ? "bg-gradient-gold text-charcoal"
                            : "bg-cream-deep text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className={done || active ? "text-foreground" : "text-muted-foreground"}>
                      {s}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
