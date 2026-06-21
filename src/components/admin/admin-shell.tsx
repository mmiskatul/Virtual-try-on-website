"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { LayoutDashboard, LogOut, Package, Shield } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  { href: "/miskat/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/miskat/admin/products", label: "Products", icon: Package },
];

function matchesRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
    <SidebarProvider>
      <Sidebar className="border-r border-border/70 bg-background">
        <SidebarHeader className="border-b border-border/70 px-3 py-4">
          <Link
            href="/miskat/admin/dashboard"
            className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-sidebar-accent"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-charcoal text-primary-foreground">
              <Shield className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">Admin Panel</p>
              <p className="truncate text-xs text-muted-foreground">
                {username ? `Signed in as ${username}` : "Restricted access"}
              </p>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel>Routes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = matchesRoute(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-border/70 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background">
        <main className="min-h-svh flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
