"use client";

import { useEffect, useState } from "react";
import { Check, Palette, Save, Sliders, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/components/admin/admin-auth";
import {
  getAdminSettings,
  updateAdminSettings,
  type AdminStudioSettings,
  type AdminStudioSettingsInput,
} from "@/lib/api";

const defaultDraft: AdminStudioSettingsInput = {
  highFidelityRendering: true,
  realTimePhysics: true,
  precisionCalibration: false,
  themeAccent: "gold",
  typography: "Libre Caslon Text",
};

export default function AdminSettingsPage() {
  const { token } = useAdminAuth();
  const [saved, setSaved] = useState<AdminStudioSettings | null>(null);
  const [draft, setDraft] = useState<AdminStudioSettingsInput>(defaultDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    getAdminSettings(token)
      .then((data) => {
        if (!active) return;
        setSaved(data);
        setDraft({
          highFidelityRendering: data.highFidelityRendering,
          realTimePhysics: data.realTimePhysics,
          precisionCalibration: data.precisionCalibration,
          themeAccent: data.themeAccent,
          typography: data.typography,
        });
      })
      .catch((loadError) => {
        if (active)
          setError(loadError instanceof Error ? loadError.message : "Could not load settings.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  function discard() {
    if (!saved) return;
    setDraft({
      highFidelityRendering: saved.highFidelityRendering,
      realTimePhysics: saved.realTimePhysics,
      precisionCalibration: saved.precisionCalibration,
      themeAccent: saved.themeAccent,
      typography: saved.typography,
    });
    setMessage("Unsaved changes discarded.");
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const data = await updateAdminSettings(draft, token);
      setSaved(data);
      setMessage("Studio settings saved successfully.");
      toast.success("Studio settings saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  const toggles: Array<{
    key: "highFidelityRendering" | "realTimePhysics" | "precisionCalibration";
    label: string;
    description: string;
  }> = [
    {
      key: "highFidelityRendering",
      label: "High-Fidelity Rendering",
      description:
        "Adds explicit texture, stitching, and garment-detail guidance to future generations.",
    },
    {
      key: "realTimePhysics",
      label: "Realistic Fabric Physics",
      description:
        "Guides future generations to preserve fabric drape, folds, weight, and body contact.",
    },
    {
      key: "precisionCalibration",
      label: "Precision Calibration",
      description: "Adds stricter pose, garment-alignment, and lighting calibration guidance.",
    },
  ];

  return (
    <div className="space-y-8 px-5 py-8 sm:px-8">
      <div className="space-y-1.5">
        <h1 className="font-display text-4xl font-medium text-charcoal">Studio Settings</h1>
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Configure generation guidance and saved dashboard identity preferences.
        </p>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        <section className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft lg:col-span-7">
          <div className="flex items-center gap-2 border-b border-neutral-200/40 pb-4">
            <Sliders className="h-4 w-4 text-[#806B4D]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Generation Guidance
            </h2>
          </div>
          <div className="mt-6 space-y-7">
            {toggles.map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-bold text-charcoal">{item.label}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setDraft((current) => ({ ...current, [item.key]: !current[item.key] }))
                  }
                  aria-pressed={draft[item.key]}
                  className={`h-6 w-10 shrink-0 rounded-full p-1 transition-colors ${draft[item.key] ? "bg-charcoal" : "bg-neutral-200"}`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-white transition-transform ${draft[item.key] ? "translate-x-4" : "translate-x-0"}`}
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-[#FAF9F6] p-4 text-[10px] leading-relaxed text-muted-foreground">
            Saved generation settings are read by the backend when a new try-on request is created.
            Existing generated images are not modified.
          </div>
        </section>

        <section className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-neutral-200/50 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2 border-b border-neutral-200/40 pb-4">
              <Palette className="h-4 w-4 text-[#806B4D]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                Dashboard Identity
              </h2>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <label className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                  Theme Accent
                </label>
                <div className="mt-3 flex gap-3">
                  {(["gold", "black", "red"] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, themeAccent: color }))}
                      aria-label={`${color} accent`}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${color === "gold" ? "bg-[#806B4D]" : color === "black" ? "bg-charcoal" : "bg-red-600"}`}
                    >
                      {draft.themeAccent === color && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                  Typography
                </span>
                <select
                  value={draft.typography}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      typography: event.target.value as AdminStudioSettingsInput["typography"],
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-neutral-200 bg-[#FAF9F6] px-4 py-3 text-[10px] font-bold text-charcoal"
                >
                  <option>Libre Caslon Text</option>
                  <option>Inter</option>
                  <option>Georgia</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-[#806B4D]/25 bg-[#806B4D]/10 p-6">
            <h2 className="font-display text-xl font-semibold text-[#806B4D]">
              Apply studio changes?
            </h2>
            <p className="mt-2 text-[10px] leading-relaxed text-[#806B4D]">
              Changes are stored in MongoDB and used by subsequent backend requests.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={save}
                disabled={saving || loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-charcoal py-3.5 text-[9px] font-bold uppercase tracking-wider text-white disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={discard}
                disabled={!saved || saving}
                className="flex-1 rounded-xl border border-charcoal/30 py-3.5 text-[9px] font-bold uppercase tracking-wider text-charcoal disabled:opacity-50"
              >
                Discard
              </button>
            </div>
            {saved?.updatedAt && (
              <p className="mt-4 text-[9px] text-[#806B4D]">
                Last saved {new Date(saved.updatedAt).toLocaleString()} by {saved.updatedBy}
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-3xl border border-neutral-200/50 bg-white shadow-soft">
        <div className="flex items-center gap-2 border-b border-neutral-200 p-6">
          <UserRound className="h-4 w-4 text-[#806B4D]" />
          <h2 className="font-display text-2xl font-medium text-charcoal">
            Administrator Accounts
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="p-5 pl-8">Username</th>
                <th className="p-5">Role</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-8">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs font-semibold text-charcoal">
              {saved?.administrators.map((admin) => (
                <tr key={admin.username}>
                  <td className="p-5 pl-8">{admin.username}</td>
                  <td className="p-5 text-neutral-500">Administrator</td>
                  <td className="p-5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] uppercase ${admin.isActive ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"}`}
                    >
                      {admin.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="p-5 pr-8 text-neutral-500">
                    {admin.lastLoginAt
                      ? new Date(admin.lastLoginAt).toLocaleString()
                      : "Not recorded"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !saved?.administrators.length && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No administrator accounts found.
          </p>
        )}
      </section>
    </div>
  );
}
