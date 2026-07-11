"use client";

import { FormEvent, useMemo, useState } from "react";
import { ImagePlus, Save } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import { createProduct, resolveAssetUrl, uploadProductImage } from "@/lib/api";
import type { Gender } from "@/lib/products";

const categories = ["shirt", "t-shirt", "pant", "kurti", "dress"] as const;
type CategoryOption = (typeof categories)[number];
const genders: Gender[] = ["female", "male", "unisex"];

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminAddProductPage() {
  const { token } = useAdminAuth();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [category, setCategory] = useState<CategoryOption>("dress");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const productId = useMemo(() => slugify(name), [name]);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Please log in as admin first.");
      return;
    }

    if (!productId) {
      setError("Product name is required.");
      return;
    }

    if (!imageUrl) {
      setError("Please upload a product image first.");
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Enter a valid price.");
      return;
    }

    setSaving(true);
    try {
      await createProduct(
        {
          id: productId,
          name,
          gender,
          category,
          image_url: imageUrl,
          price: numericPrice,
          description,
          is_active: true,
        },
        token,
      );
      setMessage("Product added and stored in MongoDB.");
      setName("");
      setGender("female");
      setCategory("dress");
      setPrice("");
      setDescription("");
      setImageUrl("");
      setPreviewUrl("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-lg text-foreground">Product image</h2>
        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-cream/40 px-6 py-12 text-center transition hover:border-charcoal/40">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Uploaded product preview"
              className="max-h-[460px] w-full rounded-2xl object-contain"
            />
          ) : (
            <>
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-gold text-charcoal">
                <ImagePlus className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Upload product image</p>
                <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, or WebP up to 10MB</p>
              </div>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => handleImageUpload(event.target.files?.[0])}
          />
        </label>
        {uploading && <p className="mt-4 text-xs text-muted-foreground">Uploading image...</p>}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-border bg-card p-6 shadow-soft"
      >
        <h2 className="text-lg text-foreground">Outfit details</h2>
        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Midnight Chiffon Dress"
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
                placeholder="89"
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the garment, fabric, and fit."
              rows={5}
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Product ID
            </span>
            <input
              value={productId}
              readOnly
              className="rounded-2xl border border-border bg-cream px-4 py-3 text-sm text-muted-foreground outline-none"
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

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save product"}
          </button>
        </div>
      </form>
    </div>
  );
}
