"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, ImagePlus, Save, Trash2 } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  deleteProduct,
  getAdminProducts,
  resolveAssetUrl,
  updateProduct,
  uploadProductImage,
} from "@/lib/api";
import type { Gender, Product } from "@/lib/products";

const categories = ["shirt", "t-shirt", "pant", "kurti", "dress"] as const;
type CategoryOption = (typeof categories)[number];
const genders: Gender[] = ["female", "male", "unisex"];

export default function AdminCollectionPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? null,
    [products, selectedId],
  );
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
    if (!token) return;

    let active = true;
    setLoading(true);
    getAdminProducts(token)
      .then((data) => {
        if (!active) return;
        setProducts(data);
        setSelectedId((current) => current || data[0]?.id || "");
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load collection.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!selectedProduct) return;
    setName(selectedProduct.name);
    setGender(selectedProduct.gender);
    setCategory(selectedProduct.category as CategoryOption);
    setPrice(String(selectedProduct.price));
    setDescription(selectedProduct.description ?? "");
    setIsActive(selectedProduct.isActive ?? true);
    setImageUrl(selectedProduct.image);
    setPreviewUrl(resolveAssetUrl(selectedProduct.image));
  }, [selectedProduct]);

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

    if (!token || !selectedProduct) {
      setError("Select a product first.");
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Enter a valid price.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProduct(
        selectedProduct.id,
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
      setProducts((current) =>
        current.map((product) => (product.id === updated.id ? updated : product)),
      );
      setMessage("Product updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token || !selectedProduct) return;

    const confirmed = window.confirm(`Delete ${selectedProduct.name}?`);
    if (!confirmed) return;

    setRemoving(true);
    setError(null);
    setMessage(null);

    try {
      await deleteProduct(selectedProduct.id, token);
      setProducts((current) => {
        const nextProducts = current.filter((product) => product.id !== selectedProduct.id);
        setSelectedId(nextProducts[0]?.id ?? "");
        return nextProducts;
      });
      setMessage("Product deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete product.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Collection</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Stored products</h2>
          </div>
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-muted-foreground">
            {products.length} items
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading collection...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products found.</p>
          ) : (
            products.map((product) => {
              const active = product.id === selectedId;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedId(product.id)}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-charcoal bg-cream/40"
                      : "border-border bg-background hover:border-charcoal/30"
                  }`}
                >
                  <img
                    src={resolveAssetUrl(product.image)}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.id} · {product.gender} · {product.category}
                    </p>
                  </div>
                  {!product.isActive && (
                    <span className="rounded-full bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700">
                      inactive
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Edit</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">
              {selectedProduct ? selectedProduct.name : "Select a product"}
            </h2>
          </div>
          {selectedProduct && (
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" />
              {selectedProduct.id}
            </span>
          )}
        </div>

        {selectedProduct ? (
          <form onSubmit={handleSave} className="mt-6 grid gap-5">
            <div className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Product image
              </span>
              <div className="grid gap-3">
                <div className="overflow-hidden rounded-2xl border border-border bg-cream/30">
                  <img
                    src={previewUrl || resolveAssetUrl(selectedProduct.image)}
                    alt={selectedProduct.name}
                    className="h-72 w-full object-contain"
                  />
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-charcoal hover:text-foreground">
                  <ImagePlus className="h-4 w-4" />
                  Replace image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

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
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={removing}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {removing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-background/60 px-6 py-10 text-sm text-muted-foreground">
            No product selected.
          </div>
        )}
      </section>
    </div>
  );
}
