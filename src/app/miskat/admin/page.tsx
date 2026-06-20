"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, Lock, LogOut, Save } from "lucide-react";

import {
  clearAdminToken,
  createProduct,
  getAdminSession,
  getStoredAdminToken,
  loginAdmin,
  logoutAdmin,
  resolveAssetUrl,
  uploadProductImage,
} from "@/lib/api";
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

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("mmiskatul");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [category, setCategory] = useState<CategoryOption>("dress");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const productId = useMemo(() => slugify(name), [name]);

  useEffect(() => {
    const storedToken = getStoredAdminToken();
    if (storedToken) {
      setAdminToken(storedToken);
      setIsAuthenticated(true);
      return;
    }

    getAdminSession()
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        clearAdminToken();
        setAdminToken(null);
        setIsAuthenticated(false);
      });
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoggingIn(true);

    try {
      const token = await loginAdmin({ username, password });
      setAdminToken(token);
      setIsAuthenticated(true);
      setPassword("");
      setMessage("Logged in. You can now manage products.");
    } catch (err) {
      clearAdminToken();
      setAdminToken(null);
      setIsAuthenticated(false);
      setError(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutAdmin();
    } catch {
      clearAdminToken();
    }
    setAdminToken(null);
    setIsAuthenticated(false);
    setMessage(null);
    setError(null);
  }

  async function handleImageUpload(file?: File | null) {
    if (!file) return;
    if (!isAuthenticated) {
      setError("Please log in as admin first.");
      return;
    }

    setError(null);
    setMessage(null);
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const uploadedUrl = await uploadProductImage(file, adminToken);
      setImageUrl(uploadedUrl);
      setPreviewUrl(resolveAssetUrl(uploadedUrl));
    } catch (err) {
      setImageUrl("");
      setPreviewUrl("");
      setError(err instanceof Error ? err.message : "Could not upload product image.");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!isAuthenticated) {
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
        adminToken,
      );
      setMessage("Product added. It will now appear in the collection and try-on picker.");
      setName("");
      setGender("female");
      setCategory("dress");
      setPrice("");
      setDescription("");
      setImageUrl("");
      setPreviewUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative bg-background">
      <section className="bg-gradient-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Dashboard</p>
          <h1 className="mt-3 font-display text-5xl text-charcoal sm:text-6xl">Add outfit</h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Upload a dress or outfit image, add the product details, and publish it to the try-on
            collection.
          </p>
        </div>
      </section>

      <section
        className={`mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] ${
          !isAuthenticated ? "pointer-events-none select-none opacity-40" : ""
        }`}
      >
        <div className="flex justify-end lg:col-span-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-charcoal hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </div>

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
                  {genders.map((item) => (
                    <option key={item} value={item}>
                      {item}
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
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

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
                placeholder="129"
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe fabric, fit, style, and try-on details."
                rows={5}
                className="resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
              />
            </label>

            <div className="rounded-2xl bg-cream p-4 text-xs text-muted-foreground">
              Product ID:{" "}
              <span className="font-medium text-foreground">{productId || "auto-generated"}</span>
            </div>

            {error && isAuthenticated && (
              <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {message && isAuthenticated && (
              <div className="flex items-start gap-2 rounded-2xl border border-gold/40 bg-cream p-4 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-luxe transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save outfit"}
            </button>
          </div>
        </form>
      </section>

      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-5 backdrop-blur">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-luxe"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold text-charcoal">
              <Lock className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-lg text-foreground">Admin login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in to continue to the dashboard.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Username
                </span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Password
                </span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-charcoal"
                />
              </label>

              {error && (
                <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loggingIn}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-luxe transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock className="h-4 w-4" />
                {loggingIn ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
