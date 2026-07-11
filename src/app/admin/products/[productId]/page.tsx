"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ImagePlus, Save, Trash2 } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  deleteProduct,
  getAdminProduct,
  resolveAssetUrl,
  updateProduct,
  uploadProductImage,
} from "@/lib/api";
import type { Gender } from "@/lib/products";

const categories = ["shirt", "t-shirt", "pant", "kurti", "dress"] as const;
type CategoryOption = (typeof categories)[number];
const genders: Gender[] = ["female", "male", "unisex"];

export default function AdminProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const { token } = useAdminAuth();
  const productId = params.productId;

  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [category, setCategory] = useState<CategoryOption>("dress");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !productId) return;

    let active = true;
    setLoading(true);
    setError(null);

    getAdminProduct(productId, token)
      .then((product) => {
        if (!active) return;
        setName(product.name);
        setGender(product.gender);
        setCategory(product.category as CategoryOption);
        setPrice(String(product.price));
        setDescription(product.description ?? "");
        setIsActive(product.isActive ?? true);
        setImageUrl(product.image);
        setPreviewUrl(resolveAssetUrl(product.image));
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load product.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId, token]);

  async function handleImageUpload(file?: File | null) {
    if (!file || !token) return;

    setError(null);
    setMessage(null);
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const uploadedUrl = await uploadProductImage(file, token);
      setImageUrl(uploadedUrl);
      setPreviewUrl(resolveAssetUrl(uploadedUrl));
    } catch (uploadError) {
      setImageUrl("");
      setPreviewUrl("");
      setError(
        uploadError instanceof Error ? uploadError.message : "Could not upload product image.",
      );
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!token || !productId) {
      setError("Product not found.");
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Enter a valid price.");
      return;
    }

    setSaving(true);
    try {
      await updateProduct(
        productId,
        {
          name,
          gender,
          category,
          image_url: imageUrl,
          price: numericPrice,
          description,
          is_active: isActive,
        },
        token,
      );
      setMessage("Product updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token || !productId) return;

    const confirmed = window.confirm(`Delete ${name}?`);
    if (!confirmed) return;

    setRemoving(true);
    setError(null);
    setMessage(null);

    try {
      await deleteProduct(productId, token);
      router.replace("/admin/products");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete product.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Preview</p>
              <h1 className="mt-1 text-xl font-semibold text-foreground">
                {loading ? "Loading product..." : name || "Product"}
              </h1>
            </div>
            {productId && (
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5" />
                {productId}
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-cream/30">
              {previewUrl ? (
                <img src={previewUrl} alt={name || "Product"} className="h-72 w-full object-contain" />
              ) : (
                <div className="grid h-72 place-items-center text-sm text-muted-foreground">
                  No preview available.
                </div>
              )}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-charcoal hover:text-foreground">
              <ImagePlus className="h-4 w-4" />
              {uploading ? "Uploading..." : "Replace image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => handleImageUpload(event.target.files?.[0])}
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <form onSubmit={handleSave} className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Gender
                </span>
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value as Gender)}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                >
                  {genders.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as CategoryOption)}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Price
                </span>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
                <select
                  value={isActive ? "active" : "inactive"}
                  onChange={(event) => setIsActive(event.target.value === "active")}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Image URL
              </span>
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>

            {message && (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </p>
            )}
            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={removing || loading}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {removing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
