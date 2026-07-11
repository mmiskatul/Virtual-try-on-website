"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Trash2 } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  deleteTryOnHistory,
  getAdminAnalytics,
  getTryOnHistory,
  resolveAssetUrl,
  type AdminAnalyticsData,
  type TryOnResult,
} from "@/lib/api";

function exportSessions(sessions: TryOnResult[]) {
  const rows = [
    ["id", "created_at", "product_id", "product_name", "garment_size", "body_size", "result_url"],
    ...sessions.map((item) => [
      item.id,
      item.created_at,
      item.product_id,
      item.product_name,
      item.selected_size ?? "",
      item.user_body_size ?? "",
      item.result_image_url,
    ]),
  ];
  const csv = rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "ai-fit-try-on-sessions.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminHistoryPage() {
  const { token } = useAdminAuth();
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [history, setHistory] = useState<TryOnResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    Promise.all([getAdminAnalytics(token, days), getTryOnHistory(token)])
      .then(([analyticsData, historyData]) => {
        if (active) {
          setAnalytics(analyticsData);
          setHistory(historyData);
        }
      })
      .catch((loadError) => {
        if (active)
          setError(loadError instanceof Error ? loadError.message : "Could not load sessions.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [days, token]);

  const sessions = useMemo(() => {
    const start = analytics
      ? new Date(analytics.periodStart).getTime()
      : Date.now() - days * 24 * 60 * 60 * 1000;
    return history.filter((item) => new Date(item.created_at).getTime() >= start);
  }, [analytics, days, history]);
  const maxDaily = Math.max(1, ...(analytics?.dailyTryOns.map((item) => item.count) ?? []));
  const topProduct = analytics?.topProducts[0];

  async function removeSession(item: TryOnResult) {
    if (!token || !window.confirm(`Delete the try-on result for ${item.product_name}?`)) return;
    setDeletingId(item.id);
    setError(null);
    try {
      await deleteTryOnHistory(item.id, token);
      setHistory((current) => current.filter((entry) => entry.id !== item.id));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Could not delete session.");
    } finally {
      setDeletingId(null);
    }
  }

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
          <button
            type="button"
            disabled={!sessions.length}
            onClick={() => exportSessions(sessions)}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-charcoal disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
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

      <section className="overflow-hidden rounded-3xl border border-neutral-200/50 bg-white shadow-soft">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="font-display text-2xl font-medium text-charcoal">Recorded Sessions</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Showing {sessions.length} sessions from the selected period.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="p-5 pl-8">Result</th>
                <th className="p-5">Garment</th>
                <th className="p-5">Sizes</th>
                <th className="p-5">Generated</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs font-semibold text-charcoal">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-neutral-50/40">
                  <td className="p-5 pl-8">
                    <img
                      src={resolveAssetUrl(session.result_image_url)}
                      alt="Try-on result"
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-5">
                    <p>{session.product_name}</p>
                    <p className="mt-0.5 text-[9px] uppercase text-muted-foreground">
                      {session.product_id}
                    </p>
                  </td>
                  <td className="p-5 font-medium text-neutral-500">
                    <p>Garment: {session.selected_size ?? "Not recorded"}</p>
                    <p>Body: {session.user_body_size ?? "Not recorded"}</p>
                  </td>
                  <td className="p-5 font-medium text-neutral-500">
                    {new Date(session.created_at).toLocaleString()}
                  </td>
                  <td className="p-5 pr-8 text-right">
                    <button
                      type="button"
                      onClick={() => removeSession(session)}
                      disabled={deletingId === session.id}
                      aria-label="Delete session"
                      className="inline-flex rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && sessions.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No sessions were recorded in this period.
          </p>
        )}
        {loading && (
          <p className="p-8 text-center text-sm text-muted-foreground">Loading sessions…</p>
        )}
      </section>
    </div>
  );
}
