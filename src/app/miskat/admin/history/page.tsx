"use client";

import { useEffect, useState } from "react";

import { getTryOnHistory, resolveAssetUrl } from "@/lib/api";
import type { TryOnResult } from "@/lib/api";

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<TryOnResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getTryOnHistory()
      .then((data) => {
        if (active) setHistory(data);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load history.");
        }
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
          ) : error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No generated results yet.</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-border bg-background p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{item.product_name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Product ID: {item.product_id}
                    </p>
                    <p className="text-sm text-muted-foreground">History ID: {item.id}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-3">
                  {[
                    {
                      label: "User upload",
                      url: item.user_image_url,
                      alt: "User upload",
                    },
                    {
                      label: "Garment image",
                      url: item.garment_image_url,
                      alt: item.product_name,
                    },
                    {
                      label: "Try-on result",
                      url: item.result_image_url,
                      alt: "Try-on result",
                    },
                  ].map((image) => (
                    <div key={image.label} className="grid gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">{image.label}</p>
                        <a
                          href={resolveAssetUrl(image.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-charcoal underline-offset-4 hover:underline"
                        >
                          Open full image
                        </a>
                      </div>
                      <a
                        href={resolveAssetUrl(image.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-2xl border border-border bg-card"
                      >
                        <img
                          src={resolveAssetUrl(image.url)}
                          alt={image.alt}
                          className="h-72 w-full object-contain"
                        />
                      </a>
                      <p className="break-all text-xs text-muted-foreground">{image.url}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Prompt
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{item.prompt}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
