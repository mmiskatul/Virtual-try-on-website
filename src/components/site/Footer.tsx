"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Sparkles, Share2, Globe, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  const [email, setEmail] = useState("");

  async function shareStudio() {
    const shareData = {
      title: "AI Fit Studio",
      text: "Try outfits virtually with AI Fit Studio.",
      url: window.location.origin,
    };
    try {
      const share = (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share;
      if (typeof share === "function") await share.call(navigator, shareData);
      else await navigator.clipboard.writeText(window.location.href);
      toast.success(
        typeof share === "function"
          ? "Thanks for sharing AI Fit Studio."
          : "Link copied to clipboard.",
      );
    } catch {
      // Sharing can be cancelled by the user.
    }
  }

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setEmail("");
    toast.success("You’re subscribed to the AI Fit Studio newsletter.");
  }

  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-12">
        {/* Left Brand Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-charcoal text-white shadow-soft">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-lg tracking-tight font-semibold text-charcoal">
              AI Fit Studio
            </span>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            Redefining the boundaries between digital luxury and physical elegance through advanced
            generative AI.
          </p>
          <div className="flex gap-3 text-muted-foreground pt-2">
            <button
              type="button"
              onClick={shareStudio}
              className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-neutral-50 transition"
              aria-label="Share"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => toast("English is currently selected.")}
              className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-neutral-50 transition"
              aria-label="Language"
            >
              <Globe className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Collections Links */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">
            Collections
          </h4>
          <ul className="space-y-2 text-xs font-medium text-muted-foreground">
            <li>
              <Link prefetch={false} href="/collection" className="hover:text-charcoal transition">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/collection" className="hover:text-charcoal transition">
                Ready-to-Wear
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/collection" className="hover:text-charcoal transition">
                Accessories
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/collection" className="hover:text-charcoal transition">
                Editorial
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">
            Support
          </h4>
          <ul className="space-y-2 text-xs font-medium text-muted-foreground">
            <li>
              <a href="#" className="hover:text-charcoal transition">
                Contact Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-charcoal transition">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-charcoal transition">
                Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-charcoal transition">
                Size Guide
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">
            Newsletter
          </h4>
          <p className="text-xs text-muted-foreground">
            Subscribe for early access to drops and exclusive style releases.
          </p>
          <form
            onSubmit={subscribe}
            className="flex items-center border-b border-charcoal/20 py-2 focus-within:border-charcoal transition max-w-sm"
          >
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-label="Email address"
              className="bg-transparent text-[10px] tracking-wider uppercase focus:outline-none w-full text-charcoal placeholder-neutral-400 font-medium"
            />
            <button
              type="submit"
              className="text-charcoal hover:text-neutral-600 transition"
              aria-label="Subscribe"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="border-t border-border/40 py-6 bg-neutral-50/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:flex-row sm:px-8">
          <p>
            &copy; {COPYRIGHT_YEAR} AI Fit Studio. Editorial Precision. Neural Technology. Cat
            Elegance.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-charcoal transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-charcoal transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-charcoal transition">
              Press Kit
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
