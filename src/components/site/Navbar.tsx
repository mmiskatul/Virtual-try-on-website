"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles, ShoppingBag, User, Search } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/collection", label: "Collection" },
    { href: "/try-on", label: "Try-On Studio" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/about", label: "About" },
  ] as const;

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-charcoal text-white shadow-soft">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-lg tracking-tight font-semibold text-charcoal">
            AI Fit Studio
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs uppercase tracking-wider font-medium transition-colors hover:text-foreground ${
                pathname === l.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar (Only shown on /collection page) */}
        {pathname === "/collection" && (
          <div className="hidden md:flex items-center bg-neutral-100 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-charcoal/20 max-w-[200px] lg:max-w-[280px] w-full">
            <Search className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
            <input
              type="text"
              placeholder="SEARCH COLLECTION..."
              className="bg-transparent text-[9px] tracking-wider uppercase focus:outline-none w-full text-charcoal placeholder-neutral-400 font-semibold"
              onChange={(e) => {
                const val = e.target.value;
                const url = new URL(window.location.href);
                if (val) {
                  url.searchParams.set("search", val);
                } else {
                  url.searchParams.delete("search");
                }
                window.history.replaceState({}, "", url.toString());
                window.dispatchEvent(new Event("search-change"));
              }}
            />
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/collection"
            className="text-muted-foreground transition hover:text-foreground"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
          </Link>
          
          <Link
            href="/admin"
            className="text-muted-foreground transition hover:text-foreground"
            aria-label="Profile"
          >
            <User className="h-4.5 w-4.5" />
          </Link>

          <Link
            href="/admin"
            className="hidden rounded-lg bg-charcoal px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-soft transition hover:opacity-90 md:inline-flex"
          >
            Sign In
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-foreground hover:bg-cream"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-charcoal px-5 py-3 text-center text-sm font-medium text-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
