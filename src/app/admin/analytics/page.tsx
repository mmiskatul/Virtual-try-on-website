"use client";

import { useEffect, useState } from "react";
import { Activity, Download, HardDrive, Layers3, Shirt, TrendingUp } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import { getAdminAnalytics, resolveAssetUrl, type AdminAnalyticsData } from "@/lib/api";

function downloadCsv(data: AdminAnalyticsData) {
  const rows = [
    ["date", "try_ons"],
    ...data.dailyTryOns.map((item) => [item.date, String(item.count)]),
    [],
    ["category", "try_ons", "share_percent"],
    ...data.categoryPerformance.map((item) => [
      item.category,
      String(item.tryOnCount),
      String(item.percentage),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell ?? ""}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai-fit-analytics-${data.periodDays}-days.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 ** 2).toFixed(1)} MB`;
}

export default function AdminAnalyticsPage() {
  const { token } = useAdminAuth();
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    setError(null);
    getAdminAnalytics(token, days)
      .then((data) => active && setAnalytics(data))
      .catch((loadError) => {
        if (active)
          setError(loadError instanceof Error ? loadError.message : "Could not load analytics.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [days, token]);

  const maxDaily = Math.max(1, ...(analytics?.dailyTryOns.map((item) => item.count) ?? []));
  const change = analytics?.periodChangePercent;

  return (
    <div className="space-y-8 px-5 py-8 sm:px-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="max-w-2xl space-y-1.5">
          <h1 className="font-display text-4xl font-medium text-charcoal">Analytics & Insights</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Measured try-on activity, inventory reach, and generated-result metadata.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-charcoal"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            type="button"
            disabled={!analytics}
            onClick={() => analytics && downloadCsv(analytics)}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-charcoal transition hover:border-charcoal/50 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: `Try-ons · ${days} days`, value: analytics?.periodTryOns, icon: Shirt },
          { label: "All-time try-ons", value: analytics?.totalTryOns, icon: TrendingUp },
          { label: "Active products", value: analytics?.activeProducts, icon: Layers3 },
          { label: "Products tried", value: analytics?.uniqueProductsTried, icon: Activity },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white p-5 shadow-soft"
          >
            <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
              {label}
            </span>
            <p className="mt-1 font-display text-3xl font-light text-charcoal">
              {loading ? "—" : (value ?? 0).toLocaleString()}
            </p>
            <Icon className="absolute -bottom-3 -right-3 h-16 w-16 text-neutral-100" />
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-medium text-charcoal">Try-On Volume</h2>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Daily completed generations · UTC
            </p>
          </div>
          {!loading && (
            <span
              className={`rounded-full px-3 py-1 text-[9px] font-bold ${change == null ? "bg-neutral-100 text-neutral-500" : change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
            >
              {change == null
                ? "No previous-period baseline"
                : `${change >= 0 ? "+" : ""}${change}% vs previous period`}
            </span>
          )}
        </div>
        <div className="mt-8 flex h-56 items-end gap-1 border-b border-neutral-100">
          {(analytics?.dailyTryOns ?? []).map((item) => (
            <div key={item.date} className="group relative flex h-full flex-1 items-end">
              <div
                className="min-h-1 w-full rounded-t bg-[#806B4D] transition hover:bg-charcoal"
                style={{ height: `${Math.max(2, (item.count / maxDaily) * 100)}%` }}
              />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-charcoal px-2 py-1 text-[8px] text-white group-hover:block">
                {item.date}: {item.count}
              </span>
            </div>
          ))}
          {!loading && analytics?.dailyTryOns.length === 0 && (
            <p className="m-auto text-sm text-muted-foreground">No activity in this period.</p>
          )}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        <section className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft lg:col-span-5">
          <h2 className="border-b border-neutral-200/40 pb-4 font-display text-xl font-medium text-charcoal">
            Category Performance
          </h2>
          <div className="mt-5 space-y-5">
            {analytics?.categoryPerformance.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-charcoal">
                  <span className="capitalize">{item.category}</span>
                  <span>
                    {item.tryOnCount} · {item.percentage}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-[#806B4D]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {!loading && analytics?.categoryPerformance.length === 0 && (
              <p className="text-sm text-muted-foreground">No category activity yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft lg:col-span-7">
          <h2 className="border-b border-neutral-200/40 pb-4 font-display text-xl font-medium text-charcoal">
            Top Products
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {analytics?.topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3"
              >
                <img
                  src={resolveAssetUrl(product.imageUrl)}
                  alt={product.name}
                  className="h-14 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-charcoal">{product.name}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    {product.category} · {product.tryOnCount} try-ons
                  </p>
                </div>
              </div>
            ))}
            {!loading && analytics?.topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">No product performance data yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="grid gap-4 rounded-3xl bg-charcoal p-6 text-white sm:grid-cols-3">
        <div>
          <HardDrive className="h-5 w-5 text-[#B99A6C]" />
          <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            Recorded result storage
          </p>
          <p className="mt-1 font-display text-2xl text-[#B99A6C]">
            {formatBytes(analytics?.resultStorageBytes ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            Results with metadata
          </p>
          <p className="mt-1 font-display text-2xl text-[#B99A6C]">
            {analytics?.resultsWithMetadata ?? 0}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            Latest generation
          </p>
          <p className="mt-1 text-sm text-[#B99A6C]">
            {analytics?.latestTryOnAt
              ? new Date(analytics.latestTryOnAt).toLocaleString()
              : "No generations yet"}
          </p>
        </div>
      </section>
    </div>
  );
}
