"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";

import { getAdminSession, getTryOnResult, resolveAssetUrl, type TryOnResult } from "@/lib/api";

export default function TryOnHistoryDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center">
          <p className="text-sm text-muted-foreground">Loading try-on details…</p>
        </div>
      }
    >
      <TryOnHistoryDetail />
    </Suspense>
  );
}

function TryOnHistoryDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const historyId = searchParams.get("id");
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        await getAdminSession();
      } catch {
        router.replace("/admin");
        return;
      }

      if (!historyId) {
        if (active) {
          setError("No try-on history ID was provided.");
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getTryOnResult(historyId);
        if (active) setResult(data);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : "Could not load try-on details.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [historyId, router]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <p className="text-sm text-muted-foreground">Loading try-on details…</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-5">
        <div className="text-center">
          <p className="text-sm text-red-600">{error ?? "Try-on result not found."}</p>
          <Link
            href="/admin/history"
            className="mt-5 inline-flex rounded-full bg-charcoal px-5 py-3 text-sm text-white"
          >
            Return to sessions
          </Link>
        </div>
      </div>
    );
  }

  const images = [
    {
      label: "Uploaded Photo",
      description: "The original photo uploaded by the user.",
      url: result.user_image_url,
    },
    {
      label: "Garment Preview",
      description: "The selected product image sent to the AI model.",
      url: result.garment_image_url,
    },
    {
      label: "Generated Output",
      description: "The completed virtual try-on result.",
      url: result.result_image_url,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/admin/history"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#806B4D] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sessions
            </Link>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#806B4D]">
              Try-On Record
            </p>
            <h1 className="mt-2 font-display text-4xl text-charcoal">{result.product_name}</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Generated {new Date(result.created_at).toLocaleString()}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles className="h-3.5 w-3.5" /> Generation complete
          </span>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          {images.map((image) => (
            <article
              key={image.label}
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft"
            >
              <div className="flex aspect-[4/5] items-center justify-center bg-neutral-50 p-3">
                <img
                  src={resolveAssetUrl(image.url)}
                  alt={image.label}
                  className="max-h-full w-full rounded-2xl object-contain"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl text-charcoal">{image.label}</h2>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                      {image.description}
                    </p>
                  </div>
                  <a
                    href={resolveAssetUrl(image.url)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${image.label}`}
                    className="rounded-lg border border-neutral-200 p-2 text-neutral-400 transition hover:text-charcoal"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft md:grid-cols-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              Product ID
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-charcoal">
              {result.product_id}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              Garment Size
            </p>
            <p className="mt-2 text-sm font-semibold text-charcoal">
              {result.selected_size ?? "Not recorded"}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              Normal Body Size
            </p>
            <p className="mt-2 text-sm font-semibold text-charcoal">
              {result.user_body_size ?? "Not recorded"}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
          <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            Generation Prompt
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-charcoal">
            {result.prompt}
          </p>
        </section>
      </div>
    </div>
  );
}
