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
  HelpCircle,
  Bell,
} from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { username, isAuthenticated, loading, login, logout } = useAdminAuth();
  const [loginUsername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setLoginError(null);

    try {
      await login(loginUsername, password);
      setPassword("");
      router.replace("/miskat/admin/dashboard");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/miskat/admin");
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
                placeholder="admin"
                autoComplete="username"
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
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
            <h1 className="font-display text-xl text-charcoal font-semibold tracking-tight">AI Fit Studio</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Admin Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              { label: "Overview", href: "/miskat/admin/dashboard", icon: LayoutDashboard },
              { label: "Collections", href: "/miskat/admin/products", icon: Layers3 },
              { label: "Try-On Sessions", href: "/miskat/admin/history", icon: UserCheck },
              { label: "Analytics", href: "/miskat/admin/dashboard", icon: TrendingUp },
              { label: "Settings", href: "/miskat/admin/dashboard", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
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
            href="/miskat/admin/add"
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
          <div className="flex items-center bg-neutral-100 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-charcoal/20 max-w-xs w-full">
            <Search className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search analytics or garments..."
              className="bg-transparent text-[9px] tracking-wider uppercase focus:outline-none w-full text-charcoal placeholder-neutral-400 font-semibold"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-charcoal transition">
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </button>

            <button className="relative text-muted-foreground hover:text-charcoal transition">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border border-white" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
              <div className="text-right">
                <p className="text-xs font-bold text-charcoal uppercase tracking-wider">Admin</p>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase">System Root</p>
              </div>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                  alt="Admin profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Children */}
        <main className="flex-1 bg-[#FAF9F6]">
          {children}
        </main>
      </div>
    </div>
  );
}
