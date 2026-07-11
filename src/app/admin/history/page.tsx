"use client";

import { useEffect, useState } from "react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import { getAdminAnalytics, type AdminAnalyticsData } from "@/lib/api";

export default function AdminHistoryPage() {
  const { token } = useAdminAuth();
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    getAdminAnalytics(token, days)
      .then((analyticsData) => {
        if (active) {
          setAnalytics(analyticsData);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load data.");
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [days, token]);

  const maxDaily = Math.max(1, ...(analytics?.dailyTryOns.map((item) => item.count) ?? []));
  const topProduct = analytics?.topProducts[0];

  return (
    <div className="space-y-8 px-5 py-8 sm:px-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="max-w-2xl space-y-1.5">
          <h1 className="font-display text-4xl font-medium text-charcoal">Try-On Sessions</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Completed generations recorded by the virtual try-on service.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-xl bg-charcoal px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="flex min-h-[320px] flex-col justify-between rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft lg:col-span-8">
          <div className="flex justify-between gap-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                Activity Overview
              </span>
              <h2 className="font-display text-2xl font-medium text-charcoal">Session Volume</h2>
            </div>
            <div className="text-right">
              <span className="block font-display text-3xl font-light text-charcoal">
                {loading ? "—" : (analytics?.periodTryOns ?? 0)}
              </span>
              <span className="text-[8px] font-bold uppercase text-muted-foreground">
                completed sessions
              </span>
            </div>
          </div>
          <div className="mt-8 flex h-44 items-end gap-1 border-b border-neutral-100">
            {analytics?.dailyTryOns.map((item) => (
              <div key={item.date} className="group relative flex h-full flex-1 items-end">
                <div
                  className="min-h-1 w-full rounded-t bg-[#806B4D]"
                  style={{ height: `${Math.max(3, (item.count / maxDaily) * 100)}%` }}
                />
                <span className="absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-charcoal px-2 py-1 text-[8px] text-white group-hover:block">
                  {item.date}: {item.count}
                </span>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
            <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
              Most Popular Garment
            </span>
            <p className="mt-3 text-sm font-bold text-charcoal">
              {topProduct?.name ?? "No activity yet"}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {topProduct?.tryOnCount ?? 0} try-ons in this period
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
            <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
              Unique Products Tried
            </span>
            <p className="mt-2 font-display text-3xl text-[#806B4D]">
              {analytics?.uniqueProductsTried ?? 0}
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
            <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
              All-Time Sessions
            </span>
            <p className="mt-2 font-display text-3xl text-charcoal">
              {analytics?.totalTryOns ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
