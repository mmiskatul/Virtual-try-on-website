"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ImagePlus, Save, Sparkles, Trash2 } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createCategory,
  deleteProduct,
  getCategories,
  getAdminProduct,
  resolveAssetUrl,
  updateProduct,
  uploadProductImage,
} from "@/lib/api";
import type { Gender } from "@/lib/products";
import { formatCategoryLabel, mergeCategoryOptions, type CategoryOption } from "@/lib/categories";

const defaultCategories: CategoryOption[] = [
  { value: "shirt", label: "Shirt" },
  { value: "t-shirt", label: "T-Shirt" },
  { value: "pant", label: "Pant" },
  { value: "kurti", label: "Kurti" },
  { value: "dress", label: "Dress" },
  { value: "panjabi", label: "Panjabi" },
];
const genders: Gender[] = ["female", "male", "unisex"];

export default function AdminProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const { token } = useAdminAuth();
  const productId = params.productId;

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(defaultCategories);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [category, setCategory] = useState("dress");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [sizeDetails, setSizeDetails] = useState("");
  const [coverage, setCoverage] = useState<string>("full");
  const [fitType, setFitType] = useState("");
  const [clothType, setClothType] = useState("");
  const [color, setColor] = useState("");
  const [occasion, setOccasion] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [brand, setBrand] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
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
        setCategory(product.category);
        setPrice(String(product.price));
        setDescription(product.description ?? "");
        setMaterials(product.materials ?? "");
        setAvailableSizes(product.available_sizes ?? []);
        setSizeDetails(product.size_details ?? "");
        setCoverage(product.coverage ?? "full");
        setFitType(product.fit_type ?? "");
        setClothType(product.cloth_type ?? "");
        setColor(product.color ?? "");
        setOccasion(product.occasion ?? "");
        setCareInstructions(product.care_instructions ?? "");
        setBrand(product.brand ?? "");
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

  useEffect(() => {
    let active = true;
    getCategories()
      .then((items) => {
        if (active && items.length) {
          setCategoryOptions((current) => mergeCategoryOptions([...current, ...items]));
        }
      })
      .catch(() => {
        if (active) {
          setCategoryOptions(defaultCategories);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (category && !categoryOptions.some((option) => option.value === category)) {
      setCategoryOptions((current) =>
        mergeCategoryOptions([
          ...current,
          { value: category, label: formatCategoryLabel(category) },
        ]),
      );
    }
  }, [category, categoryOptions]);

  async function handleCreateCategory() {
    if (!token) {
      setError("Please log in as admin first.");
      return;
    }

    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setError("Enter a category name.");
      return;
    }

    setError(null);
    setMessage(null);
    setSavingCategory(true);

    try {
      const created = await createCategory({ name: trimmed }, token);
      setCategoryOptions((current) => mergeCategoryOptions([...current, created]));
      setCategory(created.value);
      setNewCategoryName("");
      setMessage(`Saved category ${created.label}.`);
    } catch (categoryError) {
      setError(categoryError instanceof Error ? categoryError.message : "Could not save category.");
    } finally {
      setSavingCategory(false);
    }
  }

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
          materials: materials || undefined,
          available_sizes: availableSizes,
          size_details: sizeDetails || undefined,
          coverage: coverage || undefined,
          fit_type: fitType || undefined,
          cloth_type: clothType || undefined,
          color: color || undefined,
          occasion: occasion || undefined,
          care_instructions: careInstructions || undefined,
          brand: brand || undefined,
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
                {loading ? <Skeleton className="h-6 w-48" /> : name || "Product"}
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
              {loading ? (
                <Skeleton className="h-72 w-full" />
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt={name || "Product"}
                  className="h-72 w-full object-contain"
                />
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
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full rounded-2xl" />
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-11 w-32 rounded-full" />
                <Skeleton className="h-11 w-32 rounded-full" />
                <Skeleton className="h-11 w-20 rounded-full" />
              </div>
            </div>
          ) : (
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
                  onChange={(event) => setCategory(event.target.value)}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="rounded-2xl border border-dashed border-border bg-cream/30 p-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      value={newCategoryName}
                      onChange={(event) => setNewCategoryName(event.target.value)}
                      placeholder="Add new category, e.g. Panjabi"
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={savingCategory}
                      className="rounded-xl bg-charcoal px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingCategory ? "Saving..." : "Add category"}
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Saved categories are stored in the backend and become available in the dropdown.
                  </p>
                </div>
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

            <div className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Available Sizes
              </span>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                  const checked = availableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setAvailableSizes((prev) =>
                          prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
                        );
                      }}
                      className={`h-11 px-5 rounded-xl border text-xs font-bold uppercase transition flex items-center justify-center ${
                        checked
                          ? "bg-charcoal border-charcoal text-white shadow-sm"
                          : "border-border bg-background text-foreground hover:border-charcoal"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sizing Specifications / Details
              </span>
              <textarea
                value={sizeDetails}
                onChange={(event) => setSizeDetails(event.target.value)}
                placeholder="e.g., XS: chest 34, length 26 | S: chest 36, length 27 | M: chest 38, length 28"
                rows={3}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Coverage
                </span>
                <select
                  value={coverage}
                  onChange={(event) => setCoverage(event.target.value)}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                >
                  <option value="upper">Upper Body</option>
                  <option value="lower">Lower Body</option>
                  <option value="full">Full Body</option>
                  <option value="accessory">Accessory</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Fit Type
                </span>
                <input
                  type="text"
                  value={fitType}
                  onChange={(event) => setFitType(event.target.value)}
                  placeholder="e.g. Slim, Regular, Relaxed"
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Fabric / Cloth Type
                </span>
                <input
                  type="text"
                  value={clothType}
                  onChange={(event) => setClothType(event.target.value)}
                  placeholder="e.g. Linen, Cotton, Chiffon"
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Color
                </span>
                <input
                  type="text"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  placeholder="e.g. Midnight Black, Ivory White"
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Occasion
                </span>
                <input
                  type="text"
                  value={occasion}
                  onChange={(event) => setOccasion(event.target.value)}
                  placeholder="e.g. Casual, Evening wear"
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Brand
                </span>
                <input
                  type="text"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  placeholder="e.g. Atelier, Levi's"
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Care Instructions
              </span>
              <textarea
                value={careInstructions}
                onChange={(event) => setCareInstructions(event.target.value)}
                placeholder="e.g. Dry clean recommended. Wash cold."
                rows={3}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Materials
              </span>
              <input
                type="text"
                value={materials}
                onChange={(event) => setMaterials(event.target.value)}
                placeholder="e.g. 100% Organic Silk Crepe de Chine"
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
              <Link
                href={`/admin/try-on?product=${productId}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:border-charcoal"
              >
                <Sparkles className="h-4 w-4" /> Virtual Try-On
              </Link>
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
          )}
        </section>
      </div>
    </div>
  );
}
