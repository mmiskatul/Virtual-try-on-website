"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles, Search } from "lucide-react";

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

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set("search", query);
    } else {
      url.searchParams.delete("search");
    }
    window.history.replaceState({}, "", url.toString());
    window.dispatchEvent(new Event("search-change"));
  }

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
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            AI Fit Studio
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs font-semibold uppercase tracking-wider transition ${
                pathname === l.href ? "text-[#806B4D]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4.5">
          {/* Search form trigger */}
          {pathname === "/collection" && (
            <div className="relative">
              <form onSubmit={handleSearch} className="relative flex items-center bg-[#FAF9F6] border border-neutral-200/60 rounded-full px-3 py-1.5 focus-within:border-charcoal/20">
                <Search className="h-3.5 w-3.5 text-neutral-400 mr-1.5 shrink-0" />
                <input
                  name="q"
                  type="text"
                  placeholder="Search catalog..."
                  defaultValue={new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("search") || ""}
                  className="bg-transparent text-[10px] font-semibold uppercase tracking-wider focus:outline-none w-28 text-charcoal placeholder-neutral-400"
                  onChange={(e) => {
                    const value = e.target.value;
                    const url = new URL(window.location.href);
                    if (value) {
                      url.searchParams.set("search", value);
                    } else {
                      url.searchParams.delete("search");
                    }
                    window.history.replaceState({}, "", url.toString());
                    window.dispatchEvent(new Event("search-change"));
                  }}
                />
              </form>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="grid h-9 w-9 place-items-center rounded-full border border-border md:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
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
          </div>
        </div>
      )}
    </header>
  );
}
