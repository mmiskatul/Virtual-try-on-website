import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-gold text-charcoal">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-xl text-charcoal">AI Fit Studio</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Premium virtual try-on for modern fashion — see how every outfit looks on you before you buy.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/collection" className="hover:text-foreground">Collection</Link></li>
            <li><Link to="/try-on" className="hover:text-foreground">Try-On Studio</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@aifitstudio.com</li>
            <li>+1 (555) 248-7700</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} AI Fit Studio. All rights reserved.</p>
          <p>Crafted with care for fashion lovers.</p>
        </div>
      </div>
    </footer>
  );
}
