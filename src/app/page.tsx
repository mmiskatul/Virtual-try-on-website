import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Volume2,
  Maximize2,
} from "lucide-react";

import heroImg from "@/assets/hero-model.jpg";
import p1 from "@/assets/p1.jpg";
import p3 from "@/assets/p3.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

import stepCapture from "@/assets/step_capture.png";
import stepFitting from "@/assets/step_fitting.png";
import stepCuration from "@/assets/step_curation.png";

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-12 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Text */}
          <div className="space-y-8 lg:col-span-5">
            <h1 className="font-sans text-5xl font-light leading-[1.15] text-charcoal sm:text-6xl lg:text-[4.5rem]">
              The Future of <br />
              Fashion, <br />
              <em className="font-display italic text-[#806B4D] not-italic">Tailored to You</em>
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Experience the pinnacle of digital craftsmanship. Upload a photo to see how luxury
              apparel drapes and fits instantly through our proprietary AI engine.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/try-on"
                className="inline-flex items-center gap-2 rounded-lg bg-[#806B4D] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-soft transition hover:bg-[#6c5a40]"
              >
                Start Virtual Try On <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 rounded-lg border border-charcoal/20 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal transition hover:border-charcoal hover:bg-neutral-50"
              >
                Browse Collection
              </Link>
            </div>
          </div>

          {/* Right Mirror Mockup */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-3xl border border-neutral-100 bg-[#f9f8f6] p-4 shadow-luxe">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-200">
                <img
                  src={heroImg.src}
                  alt="Virtual try-on preview"
                  className="h-full w-full object-cover object-center"
                />
                
                {/* Acrylic Overlay */}
                <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
                  {/* Top Row */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[9px] font-semibold tracking-wider text-white backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#806B4D] animate-pulse" />
                      AUTOPROCESSING RAW PREVIEWS
                    </span>
                    <div className="flex gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur">
                        <Volume2 className="h-3.5 w-3.5" />
                      </span>
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur">
                        <Maximize2 className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Bottom Area */}
                  <div className="space-y-3">
                    {/* Thumbnails */}
                    <div className="flex gap-2 justify-center">
                      {[
                        { src: p1.src, active: false },
                        { src: p6.src, active: true },
                        { src: p3.src, active: false },
                      ].map((thumb, idx) => (
                        <div
                          key={idx}
                          className={`h-12 w-10 overflow-hidden rounded border-2 bg-white ${
                            thumb.active ? "border-[#806B4D]" : "border-transparent opacity-80"
                          }`}
                        >
                          <img src={thumb.src} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>

                    {/* Banner */}
                    <div className="flex items-center justify-between rounded-xl bg-white/90 p-3 shadow-soft backdrop-blur">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
                          Current Item
                        </p>
                        <p className="text-xs font-bold text-charcoal">Sculpted Silk Blouse</p>
                      </div>
                      <span className="text-xs font-semibold text-charcoal">$850</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mockup Camera Footer */}
              <div className="flex items-center justify-between pt-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span>AI Fit Studio - Home</span>
                <span>f/5.6, 1/250s, ISO 400</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="border-y border-border/40 bg-neutral-50/50 py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Partners of Global Brands
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-16 gap-y-6 text-2xl font-light text-neutral-400 font-display">
            <span className="tracking-widest uppercase hover:text-charcoal transition">Lumière</span>
            <span className="font-semibold italic tracking-wider hover:text-charcoal transition font-display">Vogue</span>
            <span className="tracking-wider hover:text-charcoal transition">Élégance</span>
            <span className="tracking-widest font-normal hover:text-charcoal transition">Haute</span>
            <span className="border border-neutral-300 px-3 py-1 text-base tracking-widest uppercase font-sans hover:text-charcoal transition">Muse</span>
          </div>
        </div>
      </section>

      {/* Seamless Transformation Section */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="mb-16 text-center space-y-3">
          <h2 className="font-display text-4xl text-charcoal sm:text-5xl leading-tight">
            Seamless Transformation
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Our AI technology bridges the gap between digital discovery and physical reality in three precise steps.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              num: "01",
              img: stepCapture.src,
              title: "The Capture",
              desc: "Upload a high-resolution photo or take a live mirror-selfie through our secure studio portal.",
            },
            {
              num: "02",
              img: stepFitting.src,
              title: "Neural Fitting",
              desc: "Our engine analyzes your unique proportions and simulates fabric physics for a true-to-life fit.",
            },
            {
              num: "03",
              img: stepCuration.src,
              title: "Perfect Curation",
              desc: "Instantly visualize entire collections on your body and receive personalized styling advice.",
            },
          ].map((step) => (
            <div key={step.num} className="group relative space-y-6">
              {/* Step number overlay */}
              <div className="absolute top-2 left-2 z-10 font-display text-[3.5rem] leading-none font-bold text-white/90 drop-shadow-sm select-none">
                {step.num}
              </div>
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-neutral-100 border border-neutral-100 shadow-soft">
                <img
                  src={step.img}
                  alt={step.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-display font-semibold text-charcoal">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Winter Collection '24 */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 border-t border-border/40">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#806B4D]">
              Limited Release
            </span>
            <h2 className="font-display text-4xl text-charcoal sm:text-5xl">
              Winter Collection '24
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-charcoal hover:bg-neutral-50 transition" aria-label="Previous">
              <span className="text-lg">←</span>
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-charcoal hover:bg-neutral-50 transition" aria-label="Next">
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              category: "OUTERWEAR",
              name: "Architectural Wool Coat",
              price: 1250,
              image: p7.src,
            },
            {
              category: "FOOTWEAR",
              name: "Studio Leather Sneaker",
              price: 450,
              image: p3.src,
            },
            {
              category: "EVENING",
              name: "Midnight Velvet Gown",
              price: 990,
              image: p5.src,
            },
          ].map((item, idx) => (
            <div key={idx} className="group relative space-y-4 cursor-pointer">
              <div className="overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-100 border border-neutral-100 shadow-soft">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
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
            </div>
          ))}
        </div>
      </section>

      {/* Redefine Shopping CTA Section */}
      <section id="about" className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#1c1c1c] px-8 py-20 text-center text-white shadow-luxe">
          <h2 className="mx-auto max-w-3xl font-display text-4xl sm:text-5xl leading-tight">
            Redefine Your Shopping Experience
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            Join the thousands of fashion-forward individuals using AI Fit Studio to find their perfect look without leaving home.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/try-on"
              className="inline-flex items-center gap-2 rounded-lg bg-[#806B4D] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-soft transition hover:bg-[#6c5a40]"
            >
              Get Started Now
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-white hover:bg-white/5"
            >
              Find Details
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
