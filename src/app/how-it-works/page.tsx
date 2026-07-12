"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  Award,
  ChevronDown,
  User,
  Scissors,
  Sparkles,
  Zap,
  Play,
  ArrowRight,
} from "lucide-react";

import howHero from "@/assets/how_hero.png";
import textileSimulation from "@/assets/textile_simulation.png";
import photorealisticRendering from "@/assets/photorealistic_rendering.png";
import { resolveImageSrc } from "@/lib/image";

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How accurate is the sizing recommendation?",
      a: "Our sizing engine uses advanced biomechanical mapping to match your proportions to the garment's exact dimensions, achieving over 98% accuracy in fit comfort.",
    },
    {
      q: "Do I need special equipment or a high-end camera?",
      a: "No special equipment is required. A standard smartphone selfie or full-body photo is all our neural networks need to compute your 3D digital model.",
    },
    {
      q: "Where is my data stored?",
      a: "Your privacy is paramount. Your images are processed transiently and deleted immediately after vector extraction. We only store encrypted mathematical body metrics.",
    },
    {
      q: "Can I see different lighting conditions?",
      a: "Yes, our neural rendering engine automatically adjusts the lighting, shadows, and reflections of the digital garment to blend seamlessly with the environment light of your uploaded photo.",
    },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-charcoal">
      {/* 1. Header Section */}
      <section className="text-center py-20 px-5 max-w-4xl mx-auto space-y-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
          The Science of Silhouette
        </span>
        <h1 className="font-display text-5xl sm:text-6xl text-charcoal leading-tight">
          Virtual drape. <br className="sm:hidden" /> Real confidence.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          Discover the neural engine that powers our virtual fitting room. We combine computer
          vision with textile physics to bring the boutique experience to your screen.
        </p>
      </section>

      {/* 2. Hero Video/Image Showcase Section */}
      <section className="px-5 max-w-7xl mx-auto pb-24">
        <div className="relative rounded-[2rem] overflow-hidden aspect-[16/9] shadow-luxe border border-neutral-200/50 group">
          <img
            src={resolveImageSrc(howHero)}
            alt="AI Fit Studio Digital Fitting Lab"
            className="w-full h-full object-cover transition duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/35" />

          {/* Top Metadata */}
          <div className="absolute top-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 uppercase tracking-widest text-[9px] text-white/95 font-semibold">
            <span className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-md">
              AI FIT STUDIO | GENERATIVE FASHION
            </span>
            <span className="text-white/80">HOW IT WORKS | Real-time Digital Fitting</span>
          </div>

          {/* Central Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex items-center gap-3 bg-white/95 text-charcoal hover:bg-[#806B4D] hover:text-white transition duration-300 px-6 py-3.5 rounded-full shadow-luxe border border-neutral-100 text-xs font-semibold uppercase tracking-wider">
              <Play className="h-3 w-3 fill-current" />
              <span>See It In Action</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Bento step cards Section */}
      <section className="px-5 max-w-7xl mx-auto pb-24 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Body Mapping */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/60 p-8 flex flex-col justify-between aspect-[4/3] lg:aspect-auto min-h-[300px] shadow-soft">
            <div className="space-y-4">
              <span className="font-display text-5xl text-[#806B4D]/25 font-light block">01</span>
              <div className="h-9 w-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[#806B4D]">
                <User className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-display text-2xl font-medium text-charcoal">
                Neural Body Mapping
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Our AI analyzes your photo to identify 130+ unique anatomical anchor points,
                creating a precise 3D digital model of your silhouette.
              </p>
            </div>
            <button className="text-[9px] font-bold tracking-widest uppercase text-[#806B4D] hover:underline text-left mt-6">
              Personal Size Estimation
            </button>
          </div>

          {/* Card 2: Textile Physics (Dark Card) */}
          <div className="lg:col-span-8 bg-[#1C1C1C] rounded-3xl overflow-hidden shadow-soft flex flex-col md:flex-row">
            <div className="p-8 flex flex-col justify-between flex-1 md:max-w-[50%] min-h-[250px] md:min-h-auto">
              <div className="space-y-4">
                <span className="font-display text-5xl text-[#806B4D]/35 font-light block">02</span>
                <div className="h-9 w-9 rounded-lg bg-neutral-800/40 border border-neutral-700/30 flex items-center justify-center text-[#806B4D]">
                  <Scissors className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display text-2xl font-medium text-white">
                  Textile Physics Simulation
                </h3>
                <p className="text-xs leading-relaxed text-neutral-400">
                  Every garment is digitized using our proprietary cloth-engine technology,
                  simulating weight, elasticity, and drape in real-time.
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-[200px] md:min-h-auto relative overflow-hidden">
              <img
                src={resolveImageSrc(textileSimulation)}
                alt="Textile simulation fabric"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C] via-[#1C1C1C]/20 to-transparent pointer-events-none hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/20 to-transparent pointer-events-none block md:hidden" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 3: Photorealistic Rendering */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-neutral-200/60 shadow-soft flex flex-col sm:flex-row">
            <div className="p-8 flex flex-col justify-between flex-1 sm:max-w-[60%] min-h-[250px] sm:min-h-auto">
              <div className="space-y-4">
                <span className="font-display text-5xl text-[#806B4D]/25 font-light block">03</span>
                <div className="h-9 w-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[#806B4D]">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display text-2xl font-medium text-charcoal">
                  Photorealistic Rendering
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Using Ray Tracing technology, we match the lighting of your environment to the
                  digital garment, ensuring a seamless visual fit.
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-[220px] sm:min-h-auto flex items-center justify-center bg-neutral-50/50 p-6">
              <div className="h-40 w-40 rounded-full overflow-hidden border border-neutral-200/65 shadow-soft">
                <img
                  src={resolveImageSrc(photorealisticRendering)}
                  alt="Render suit mockup"
                  className="w-full h-full object-cover object-center hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Instant Refinement */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/60 p-8 flex flex-col justify-between aspect-[4/3] lg:aspect-auto min-h-[300px] shadow-soft">
            <div className="space-y-4">
              <span className="font-display text-5xl text-[#806B4D]/25 font-light block">04</span>
              <div className="h-9 w-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[#806B4D]">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-display text-2xl font-medium text-charcoal">
                Instant Refinement
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Adjust sizes or colors instantly. Our engine recalculates the fit in under 5
                seconds, providing immediate visual feedback for your style decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The AI Fit Studio Promise Section */}
      <section className="bg-white border-y border-neutral-200/40 py-24 px-5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="font-display text-4xl text-charcoal font-medium">
              The AI Fit Studio Promise
            </h2>
            <p className="text-xs tracking-wider uppercase text-[#806B4D] font-semibold">
              We prioritize what matters most to the modern shopper.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {/* Promise 1 */}
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <div className="h-10 w-10 rounded-full bg-[#806B4D]/10 text-[#806B4D] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-display text-xl text-charcoal font-semibold">Privacy First</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your body data is encrypted and processed locally. We never store raw images, only
                mathematical vectors of your silhouette.
              </p>
            </div>

            {/* Promise 2 */}
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <div className="h-10 w-10 rounded-full bg-[#806B4D]/10 text-[#806B4D] flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="font-display text-xl text-charcoal font-semibold">Real-Time Engine</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Optimized for mobile browsers. Experience the future of shopping without heavy
                downloads or laggy interfaces.
              </p>
            </div>

            {/* Promise 3 */}
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <div className="h-10 w-10 rounded-full bg-[#806B4D]/10 text-[#806B4D] flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-display text-xl text-charcoal font-semibold">Certified Fit</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Our algorithms are trained on over 500,000+ real-world garment scans to ensure the
                virtual fit matches the physical reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="bg-neutral-50 px-5 py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="font-display text-4xl text-charcoal font-medium text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/50 overflow-hidden shadow-soft transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-500 transition duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`px-6 pb-6 text-xs leading-relaxed text-muted-foreground transition-all duration-300 ${
                    openFaq === idx ? "block" : "hidden"
                  }`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Ready to Evolve Wardrobe CTA */}
      <section className="bg-white py-24 text-center px-5 space-y-8">
        <h2 className="font-display text-4xl sm:text-5xl text-charcoal leading-tight">
          Ready to evolve your <br /> wardrobe?
        </h2>
        <div className="flex justify-center">
          <Link
            href="/try-on"
            className="inline-flex items-center gap-3 bg-charcoal text-white hover:bg-[#806B4D] hover:text-white transition duration-300 px-8 py-4 rounded-full shadow-soft text-xs font-semibold uppercase tracking-widest"
          >
            <span>Start Try-On Experience</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
