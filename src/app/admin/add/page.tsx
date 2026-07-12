"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Save } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  createCategory,
  createProduct,
  getCategories,
  resolveAssetUrl,
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
const PRODUCT_DRAFT_KEY = "ai-fit-studio:admin:add-product-draft";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminAddProductPage() {
  const { token } = useAdminAuth();
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
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [discardingDraft, setDiscardingDraft] = useState(false);
  const discardingDraftRef = useRef(false);

  const productId = useMemo(() => slugify(name), [name]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PRODUCT_DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<Record<string, unknown>>;
        if (typeof draft.name === "string") setName(draft.name);
        if (typeof draft.gender === "string") setGender(draft.gender as Gender);
        if (typeof draft.category === "string") setCategory(draft.category);
        if (typeof draft.newCategoryName === "string") setNewCategoryName(draft.newCategoryName);
        if (typeof draft.price === "string") setPrice(draft.price);
        if (typeof draft.description === "string") setDescription(draft.description);
        if (typeof draft.materials === "string") setMaterials(draft.materials);
        if (Array.isArray(draft.availableSizes))
          setAvailableSizes(
            draft.availableSizes.filter((item): item is string => typeof item === "string"),
          );
        if (typeof draft.sizeDetails === "string") setSizeDetails(draft.sizeDetails);
        if (typeof draft.coverage === "string") setCoverage(draft.coverage);
        if (typeof draft.fitType === "string") setFitType(draft.fitType);
        if (typeof draft.clothType === "string") setClothType(draft.clothType);
        if (typeof draft.color === "string") setColor(draft.color);
        if (typeof draft.occasion === "string") setOccasion(draft.occasion);
        if (typeof draft.careInstructions === "string") setCareInstructions(draft.careInstructions);
        if (typeof draft.brand === "string") setBrand(draft.brand);
        if (typeof draft.imageUrl === "string") {
          setImageUrl(draft.imageUrl);
          setPreviewUrl(resolveAssetUrl(draft.imageUrl));
        }
      }
    } catch {
      window.localStorage.removeItem(PRODUCT_DRAFT_KEY);
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    try {
      window.localStorage.setItem(
        PRODUCT_DRAFT_KEY,
        JSON.stringify({
          name,
          gender,
          category,
          newCategoryName,
          price,
          description,
          materials,
          availableSizes,
          sizeDetails,
          coverage,
          fitType,
          clothType,
          color,
          occasion,
          careInstructions,
          brand,
          imageUrl,
        }),
      );
    } catch {
      // Draft persistence is best-effort and must not block form editing.
    }
  }, [
    draftReady,
    name,
    gender,
    category,
    newCategoryName,
    price,
    description,
    materials,
    availableSizes,
    sizeDetails,
    coverage,
    fitType,
    clothType,
    color,
    occasion,
    careInstructions,
    brand,
    imageUrl,
  ]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!discardingDraftRef.current && draftReady && (name || description || imageUrl)) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [discardingDraft, draftReady, name, description, imageUrl]);

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
      toast.success(`Category “${created.label}” added.`);
      setShowAddCategory(false);
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
      toast.success("Product image uploaded.");
    } catch (uploadError) {
      setImageUrl("");
      setPreviewUrl("");
      toast.error("Product image upload failed.");
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
      setMaterials("");
      setAvailableSizes([]);
      setSizeDetails("");
      setCoverage("full");
      setFitType("");
      setClothType("");
      setColor("");
      setOccasion("");
      setCareInstructions("");
      setBrand("");
      setImageUrl("");
      setPreviewUrl("");
      window.localStorage.removeItem(PRODUCT_DRAFT_KEY);
      toast.success("Product added successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition hover:text-charcoal"
          >
            ← Back to products
          </Link>
          <h1 className="font-display text-4xl font-medium text-charcoal">New Product</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Create a new product by uploading an image and filling in details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            form="add-product-form"
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-charcoal px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#806B4D] disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save product"}
          </button>
        </div>
      </div>

      <div className="grid w-full gap-5 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)] lg:gap-6">
        {/* Left Column: Image Card */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-4 h-fit">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg text-foreground">Product image</h2>
            {draftReady && (name || description || imageUrl) && (
              <button
                type="button"
                onClick={() => {
                  window.localStorage.removeItem(PRODUCT_DRAFT_KEY);
                  discardingDraftRef.current = true;
                  setDiscardingDraft(true);
                  window.location.reload();
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition hover:text-charcoal"
              >
                Clear draft
              </button>
            )}
          </div>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-cream/40 px-6 py-8 text-center transition hover:border-charcoal/40">
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

        {/* Right Column: Form Card */}
        <form
          id="add-product-form"
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-5 shadow-soft"
        >
          <h2 className="text-lg text-foreground">Outfit details</h2>
          <div className="mt-5 grid gap-4">
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

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="text-xs font-semibold text-charcoal hover:underline"
                  >
                    {showAddCategory ? "Cancel" : "+ Add New Category"}
                  </button>
                </div>
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
                {showAddCategory && (
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
                )}
              </div>
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
          </div>
        </form>
      </div>
    </div>
  );
}
