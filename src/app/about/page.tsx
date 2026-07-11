"use client";

import Link from "next/link";
import { User, Scissors, Sparkles, Mail, MapPin, ChevronDown } from "lucide-react";

import aboutHero from "@/assets/about_hero.png";
import aboutAtelier from "@/assets/about_atelier.png";
import aboutWorkspace from "@/assets/about_workspace.png";

export default function About() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen text-charcoal">
      {/* 1. Hero Section */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Info */}
          <div className="space-y-8">
            <h1 className="font-display text-5xl sm:text-6xl text-charcoal leading-tight">
              The Intersection of <br />
              <span className="italic font-light">Art</span> and Algorithm.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Born in the digital atelier, AI Fit Studio redefines the relationship between the
              human form and high fashion. We believe that true luxury lies in the precision of the
              fit and the elegance of the experience.
            </p>
            <div className="pt-4">
              <button
                onClick={() =>
                  document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-soft transition hover:bg-[#806B4D]"
              >
                <span>Acquire The Fit</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <div className="overflow-hidden rounded-[2rem] aspect-[4/5] max-w-[460px] w-full border border-neutral-200/50 shadow-soft">
              <img
                src={aboutHero.src}
                alt="Structured cream champagne pleated gown"
                className="w-full h-full object-cover object-center hover:scale-[1.02] transition duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission Section */}
      <section
        id="mission"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 border-t border-neutral-200/40"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Image */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="overflow-hidden rounded-[2rem] aspect-[4/5] max-w-[460px] w-full border border-neutral-200/50 shadow-soft">
              <img
                src={aboutAtelier.src}
                alt="Mannequin in luxury fashion atelier"
                className="w-full h-full object-cover object-center hover:scale-[1.02] transition duration-700"
              />
            </div>
          </div>

          {/* Right Text */}
          <div className="space-y-8 order-1 lg:order-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
              Our Mission
            </span>
            <h2 className="font-display text-4xl text-charcoal leading-tight">
              Digital Precision. <br /> Human Elegance.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              In an era of mass-market saturation, we return to the core of tailoring: the
              individual. Our mission is to bridge the gap between digital convenience and the
              tactile soul of fashion. Through sophisticated AI, we ensure every silhouette is
              honored and every garment is experienced with absolute clarity.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-neutral-200/40">
              <div className="space-y-1">
                <span className="font-display text-5xl font-light text-[#806B4D]">99.8%</span>
                <p className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
                  Fit Accuracy
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-display text-5xl font-light text-[#806B4D]">0ms</span>
                <p className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
                  Latency Engine
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Neural Fitting Engine Section */}
      <section className="bg-white border-y border-neutral-200/40 py-24 px-5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
              The Core
            </span>
            <h2 className="font-display text-4xl text-charcoal font-medium">
              The Neural Fitting Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Core 1 */}
            <div className="bg-[#FAF9F6] rounded-3xl border border-neutral-200/40 p-8 space-y-4 shadow-soft">
              <div className="h-9 w-9 rounded-lg bg-white border border-neutral-100 flex items-center justify-center text-[#806B4D]">
                <User className="h-4.5 w-4.5" />
              </div>
              <h4 className="font-display text-xl text-charcoal font-semibold">
                Biometric Sculpting
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Our engine analyzes 2,000+ data points to recreate your unique silhouette with
                millimetric precision in 3D space.
              </p>
            </div>

            {/* Core 2 */}
            <div className="bg-[#FAF9F6] rounded-3xl border border-neutral-200/40 p-8 space-y-4 shadow-soft">
              <div className="h-9 w-9 rounded-lg bg-white border border-neutral-100 flex items-center justify-center text-[#806B4D]">
                <Scissors className="h-4.5 w-4.5" />
              </div>
              <h4 className="font-display text-xl text-charcoal font-semibold">Fabric Physics</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                We simulate the drape, weight, and elasticity of silk, wool, and leather using
                real-world Newtonian dynamics.
              </p>
            </div>

            {/* Core 3 */}
            <div className="bg-[#FAF9F6] rounded-3xl border border-neutral-200/40 p-8 space-y-4 shadow-soft">
              <div className="h-9 w-9 rounded-lg bg-white border border-neutral-100 flex items-center justify-center text-[#806B4D]">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <h4 className="font-display text-xl text-charcoal font-semibold">
                Luminous Ray-Tracing
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                AI-driven lighting models ensure that textures react naturally to your environment,
                from candlelight to sunlight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Timeline Section */}
      <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
            Our Story
          </span>
          <h2 className="font-display text-4xl text-charcoal font-medium">
            A Fusion of Heritage & Future
          </h2>
        </div>

        {/* Timeline List */}
        <div className="relative border-l border-neutral-200/80 pl-8 ml-4 space-y-12">
          {/* Item 1 */}
          <div className="relative">
            <div className="absolute -left-[37px] top-1.5 h-4.5 w-4.5 rounded-full border-4 border-[#FAF9F6] bg-[#806B4D]" />
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="font-display text-2xl font-semibold text-charcoal">2021</span>
                <p className="text-[9px] font-bold tracking-widest text-[#806B4D] uppercase">
                  The Science meets Showcase
                </p>
              </div>
              <div className="sm:col-span-2 text-xs leading-relaxed text-muted-foreground">
                Founded by a collective of AI researchers and couture pattern makers, we set out to
                solve the "fitting room friction" that plagued digital luxury.
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="relative">
            <div className="absolute -left-[37px] top-1.5 h-4.5 w-4.5 rounded-full border-4 border-[#FAF9F6] bg-[#806B4D]" />
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="font-display text-2xl font-semibold text-charcoal">2022</span>
                <p className="text-[9px] font-bold tracking-widest text-[#806B4D] uppercase">
                  The Prototype
                </p>
              </div>
              <div className="sm:col-span-2 text-xs leading-relaxed text-muted-foreground">
                Launched our first Virtual Mirror prototypes in collaboration with Parisian fashion
                houses, proving that AI could capture the "soul" of a designer's cut.
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="relative">
            <div className="absolute -left-[37px] top-1.5 h-4.5 w-4.5 rounded-full border-4 border-[#FAF9F6] bg-[#806B4D]" />
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="font-display text-2xl font-semibold text-charcoal">2024</span>
                <p className="text-[9px] font-bold tracking-widest text-[#806B4D] uppercase">
                  Global Studio Ecosystem
                </p>
              </div>
              <div className="sm:col-span-2 text-xs leading-relaxed text-muted-foreground">
                Today, AI Fit Studio powers the digital ateliers of the world's leading luxury
                houses, harmonizing code and cashmere for the modern global shopper.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mid Banner Section */}
      <section className="relative h-[480px] w-full overflow-hidden flex items-center justify-center shadow-soft">
        <img
          src={aboutWorkspace.src}
          alt="Studio workspace monitor mesh"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.4]"
        />
        <div className="relative z-10 px-5 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white font-medium italic tracking-wide">
            "Tailoring the Tides of Technology."
          </h2>
        </div>
      </section>

      {/* 6. Get in Touch Section */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
                Contact
              </span>
              <h2 className="font-display text-4xl text-charcoal font-medium">Get in Touch</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
              Whether you have questions about our technology or wish to explore partnership, our
              team is at your service.
            </p>

            <div className="space-y-4 pt-4 text-xs font-semibold uppercase tracking-wider text-charcoal">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#806B4D]" />
                <a href="mailto:hello@aifitstudio.com" className="hover:underline">
                  hello@aifitstudio.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#806B4D] shrink-0 mt-0.5" />
                <span>Plaza Vendôme, Paris / Fifth Avenue, NY</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-[#806B4D] pt-4">
              <a href="#" className="hover:underline">
                Instagram
              </a>
              <a href="#" className="hover:underline">
                Linkedin
              </a>
              <a href="#" className="hover:underline">
                Twitter
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/60 p-8 shadow-soft">
            <form
              className="space-y-6 text-xs font-semibold tracking-wider text-charcoal"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-widest text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Evelyn Reed"
                  className="w-full bg-[#FAF9F6] border border-neutral-200/60 rounded-xl px-4 py-3 focus:outline-none focus:border-[#806B4D] font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-widest text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="evelyn@aurelia.com"
                  className="w-full bg-[#FAF9F6] border border-neutral-200/60 rounded-xl px-4 py-3 focus:outline-none focus:border-[#806B4D] font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-widest text-muted-foreground">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Partnership Inquiry"
                  className="w-full bg-[#FAF9F6] border border-neutral-200/60 rounded-xl px-4 py-3 focus:outline-none focus:border-[#806B4D] font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we assist you?"
                  className="w-full bg-[#FAF9F6] border border-neutral-200/60 rounded-xl px-4 py-3 focus:outline-none focus:border-[#806B4D] font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-charcoal hover:bg-[#806B4D] text-white py-4 rounded-xl shadow-soft font-bold uppercase transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
