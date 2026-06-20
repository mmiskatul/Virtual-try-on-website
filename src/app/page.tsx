import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Upload,
  Shirt,
  Wand2,
  Clock,
  ShieldCheck,
  GitCompare,
} from "lucide-react";

import heroImg from "@/assets/hero-model.jpg";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export const metadata: Metadata = {
  title: "AI Fit Studio - Try Outfits Virtually Before You Buy",
  description:
    "Upload your photo, choose an outfit, and see how it looks on you in seconds. Premium virtual try-on for modern fashion.",
  openGraph: {
    title: "AI Fit Studio - Virtual Try-On",
    description: "Try outfits virtually before you buy with AI-powered fashion previews.",
  },
};

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              AI-powered virtual fitting room
            </span>
            <h1 className="font-display text-5xl leading-[1.05] text-charcoal sm:text-6xl lg:text-7xl">
              Try Outfits <em className="not-italic text-gold">Virtually</em>
              <br />
              Before You Buy
            </h1>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              Upload your photo, choose an outfit, and see how it looks on you in seconds. No app,
              no waiting - just elegant fashion at your fingertips.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/try-on"
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-luxe transition hover:opacity-90"
              >
                Start Virtual Try-On <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 bg-background px-7 py-3.5 text-sm font-medium text-foreground transition hover:border-charcoal"
              >
                View Collection
              </Link>
            </div>
            <div className="flex flex-wrap gap-5 pt-4">
              {[
                { icon: Sparkles, label: "AI Powered" },
                { icon: Zap, label: "Fast Preview" },
                { icon: Globe, label: "No App Required" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-cream-deep text-charcoal">
                    <b.icon className="h-3.5 w-3.5" />
                  </span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-gold opacity-30 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-cream shadow-luxe">
              <img
                src={heroImg.src}
                alt="Fashion model wearing a virtual try-on outfit"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl bg-background/85 p-4 backdrop-blur-xl">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    AI Preview
                  </p>
                  <p className="text-sm font-medium text-foreground">Sand Tailored Blazer</p>
                </div>
                <span className="rounded-full bg-gradient-gold px-3 py-1.5 text-[11px] font-semibold text-charcoal">
                  Generated
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">How it works</p>
          <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            Three simple steps
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Upload,
              title: "Upload Your Photo",
              desc: "Add a clear, front-facing full-body photo in good lighting.",
            },
            {
              icon: Shirt,
              title: "Choose an Outfit",
              desc: "Browse our curated collection and pick a piece you'd love to try.",
            },
            {
              icon: Wand2,
              title: "See Your AI Try-On",
              desc: "Our AI fits the outfit on you while preserving your pose and background.",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-3xl border border-border bg-card p-8 shadow-soft"
            >
              <span className="absolute right-6 top-6 font-display text-5xl text-cream-deep">
                0{i + 1}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold text-charcoal">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-xl text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

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

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Why try-on</p>
          <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            Shop with total confidence
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Clock,
              title: "Save time",
              desc: "Skip the fitting-room queue and try styles instantly from home.",
            },
            {
              icon: ShieldCheck,
              title: "Buy with confidence",
              desc: "See how a piece truly fits before committing to a purchase.",
            },
            {
              icon: Globe,
              title: "Works in browser",
              desc: "No apps, no downloads - just open and try on outfits in seconds.",
            },
            {
              icon: GitCompare,
              title: "Compare easily",
              desc: "Swap outfits quickly to compare looks side by side.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-soft transition hover:shadow-luxe"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cream-deep text-charcoal">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-charcoal px-8 py-16 text-center text-primary-foreground sm:py-20">
          <h2 className="mx-auto max-w-2xl font-display text-4xl sm:text-5xl">
            Ready to see yourself in something new?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-primary-foreground/70 sm:text-base">
            Your virtual fitting room is one click away.
          </p>
          <Link
            href="/try-on"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-medium text-charcoal shadow-luxe transition hover:opacity-95"
          >
            Start Virtual Try-On <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
