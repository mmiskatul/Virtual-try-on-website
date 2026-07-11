"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  LayoutDashboard,
  LogOut,
  Layers3,
  UserCheck,
  TrendingUp,
  Settings,
  Shield,
  Search,
  Sparkles,
  Eye,
  EyeOff,
  Shirt,
} from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { username, isAuthenticated, loading, login, logout } = useAdminAuth();
  const [loginUsername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [adminSearch, setAdminSearch] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setLoginError(null);

    try {
      const normalizedUsername = loginUsername.trim();
      if (!normalizedUsername || !password) {
        throw new Error("Username and password are required.");
      }
      setLoginUsername(normalizedUsername);
      await login(normalizedUsername, password);
      setPassword("");
      setShowPassword(false);
      router.replace("/admin/dashboard");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/admin");
  }

  function handleAdminSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = adminSearch.trim();
    router.push(query ? `/admin/collection?q=${encodeURIComponent(query)}` : "/admin/collection");
  }

  if (loading) {
    return (
      <div className="grid min-h-svh place-items-center bg-background px-4">
        <div className="rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-soft">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative grid min-h-svh place-items-center bg-background px-4">
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold/20 text-charcoal">
              <Shield className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Admin access required</p>
              <p className="text-xs text-muted-foreground">Log in to manage products.</p>
            </div>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Username
              </span>
              <input
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                onBlur={() => setLoginUsername((current) => current.trim())}
                placeholder="admin"
                autoComplete="username"
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </span>
              <div className="relative">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-4 pr-12 text-sm outline-none transition focus:border-charcoal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            {loginError && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-white flex flex-col justify-between p-6 shrink-0 relative">
        <div className="space-y-10">
          {/* Logo */}
          <div className="space-y-1">
            <h1 className="font-display text-xl text-charcoal font-semibold tracking-tight">
              AI Fit Studio
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Admin Dashboard
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              {
                label: "Overview",
                href: "/admin/dashboard",
                icon: LayoutDashboard,
                routes: ["/admin/dashboard"],
              },
              {
                label: "Collections",
                href: "/admin/collection",
                icon: Layers3,
                routes: ["/admin/collection"],
              },
              {
                label: "Product Management",
                href: "/admin/products",
                icon: Shirt,
                routes: ["/admin/products", "/admin/add"],
              },
              {
                label: "Virtual Try-On",
                href: "/admin/try-on",
                icon: Sparkles,
                routes: ["/admin/try-on", "/admin/result"],
              },
              {
                label: "Try-On Sessions",
                href: "/admin/history",
                icon: UserCheck,
                routes: ["/admin/history"],
              },
              {
                label: "Analytics",
                href: "/admin/analytics",
                icon: TrendingUp,
                routes: ["/admin/analytics"],
              },
              {
                label: "Settings",
                href: "/admin/settings",
                icon: Settings,
                routes: ["/admin/settings"],
              },
            ].map((item) => {
              const Icon = item.icon;
              const active = item.routes.some(
                (route) => pathname === route || pathname.startsWith(`${route}/`),
              );
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                    active
                      ? "text-[#806B4D] bg-[#FAF9F6]/40"
                      : "text-muted-foreground hover:text-charcoal hover:bg-neutral-50"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.label}</span>
                  {active && (
                    <div className="absolute right-0 top-2 bottom-2 w-[3px] rounded-l bg-[#806B4D]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4">
          <Link
            href="/admin/add"
            className="flex items-center justify-center gap-2 w-full bg-charcoal text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#806B4D] transition"
          >
            <span>+ New Collection</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-charcoal w-full px-4 py-2 transition"
            type="button"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border/40 bg-white flex items-center justify-between px-8">
          {/* Search bar */}
          <form
            onSubmit={handleAdminSearch}
            className="flex items-center bg-neutral-100 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-charcoal/20 max-w-xs w-full"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={adminSearch}
              onChange={(event) => setAdminSearch(event.target.value)}
              className="bg-transparent text-[9px] tracking-wider uppercase focus:outline-none w-full text-charcoal placeholder-neutral-400 font-semibold"
            />
          </form>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
              <div className="text-right">
                <p className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  {username ?? "Admin"}
                </p>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase">
                  System Root
                </p>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-charcoal text-[10px] font-bold uppercase text-white">
                {(username ?? "A").slice(0, 2)}
              </div>
            </div>
          </div>
        </header>

        {/* Children */}
        <main className="flex-1 bg-[#FAF9F6]">{children}</main>
      </div>
    </div>
  );
}
