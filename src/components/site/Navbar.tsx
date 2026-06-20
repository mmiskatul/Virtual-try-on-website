import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/collection", label: "Collection" },
    { to: "/try-on", label: "Try-On" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-gold text-charcoal shadow-soft">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-xl tracking-tight text-charcoal">AI Fit Studio</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/try-on"
            className="hidden rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90 md:inline-flex"
          >
            Start Try-On
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-foreground hover:bg-cream"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/try-on"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-charcoal px-5 py-3 text-center text-sm font-medium text-primary-foreground"
            >
              Start Try-On
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
