"use client";

import { useEffect, useState } from "react";

import { getTryOnHistory, resolveAssetUrl } from "@/lib/api";
import type { TryOnResult } from "@/lib/api";

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<TryOnResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getTryOnHistory()
      .then((data) => {
        if (active) setHistory(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">History</p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">Try-on results</h2>
        <div className="mt-6 grid gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No generated results yet.</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-[1fr_1fr_1fr]"
              >
                <img
                  src={resolveAssetUrl(item.user_image_url)}
                  alt="User upload"
                  className="h-40 w-full rounded-xl object-cover"
                />
                <img
                  src={resolveAssetUrl(item.garment_image_url)}
                  alt={item.product_name}
                  className="h-40 w-full rounded-xl object-cover"
                />
                <img
                  src={resolveAssetUrl(item.result_image_url)}
                  alt="Try-on result"
                  className="h-40 w-full rounded-xl object-cover"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
