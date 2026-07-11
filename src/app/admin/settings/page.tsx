"use client";

import { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  UserPlus,
  MoreVertical,
  Sliders,
  Palette,
  Check,
  Download,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [fidelity, setFidelity] = useState(true);
  const [physics, setPhysics] = useState(true);
  const [calibration, setCalibration] = useState(false);
  const [themeAccent, setThemeAccent] = useState<"gold" | "black" | "red">("gold");
  const [typography, setTypography] = useState("Libre Caslon Text");

  const team = [
    {
      name: "Julian Vane",
      email: "julian@atelier.ai",
      role: "SUPER ADMIN",
      status: "Active Now",
      statusClass: "text-emerald-500",
      active: "Just now",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    },
    {
      name: "Elena Rossi",
      email: "elena.r@atelier.ai",
      role: "EDITOR",
      status: "Away",
      statusClass: "text-neutral-400",
      active: "2 hours ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    },
    {
      name: "Marcus Thorne",
      email: "m.thorne@atelier.ai",
      role: "VIEWER",
      status: "Online",
      statusClass: "text-emerald-500",
      active: "15 mins ago",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    },
  ];

  return (
    <div className="px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="space-y-1.5">
        <h1 className="font-display text-4xl text-charcoal font-medium">System Settings & Calibration</h1>
        <p className="text-xs leading-relaxed text-muted-foreground max-w-2xl">
          Configure the core AI neural parameters, brand aesthetic, and administrative access for the Atelier network.
        </p>
      </div>

      {/* Grid Settings Section */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Card: Neural Engine Settings */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[460px]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-200/40 pb-4">
              <Sliders className="h-4 w-4 text-[#806B4D]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Neural Engine Settings</h3>
            </div>

            <div className="space-y-6">
              {/* Parameter 1 */}
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-charcoal leading-tight">High-Fidelity Rendering</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Enables 8K texture mapping and sub-pixel garment weaving details for high-end displays.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFidelity(!fidelity)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                    fidelity ? "bg-charcoal" : "bg-neutral-200"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    fidelity ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Parameter 2 */}
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-charcoal leading-tight">Real-Time Physics</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Calculates fabric drape and collision dynamics at 120fps for fluid virtual movement.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPhysics(!physics)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                    physics ? "bg-charcoal" : "bg-neutral-200"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    physics ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Parameter 3 */}
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-charcoal leading-tight">Precision Calibration</p>
                    <span className="bg-[#806B4D]/10 text-[#806B4D] text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
                      AI Active
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Automated adjustment of lighting vectors based on user's ambient environmental data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCalibration(!calibration)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                    calibration ? "bg-charcoal" : "bg-neutral-200"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    calibration ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Processing Banner */}
          <div className="bg-[#FAF9F6] border border-neutral-250/30 rounded-2xl p-4 flex justify-between items-center mt-6">
            <div className="space-y-1">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">
                Processing Status
              </span>
              <p className="text-[10px] text-charcoal leading-normal italic">
                Neural nodes operating at 98.4% efficiency. Latency optimized.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-[#806B4D] shrink-0" />
          </div>
        </div>

        {/* Right Stack Area */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Brand Identity Card */}
          <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 space-y-6 shadow-soft flex-1">
            <div className="flex items-center gap-2 border-b border-neutral-200/40 pb-4">
              <Palette className="h-4 w-4 text-[#806B4D]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Brand Identity</h3>
            </div>

            {/* Logo File upload */}
            <div className="space-y-2">
              <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                Studio Logo
              </label>
              <div className="flex items-center justify-between border border-neutral-200 rounded-xl p-3 bg-[#FAF9F6]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-charcoal text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-charcoal leading-tight">Studio_Logo_Primary.svg</p>
                    <p className="text-[8px] text-neutral-400 mt-0.5">Uploaded 2 days ago • 12kb</p>
                  </div>
                </div>
                <button className="text-neutral-400 hover:text-charcoal transition p-1.5" aria-label="Download Logo">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Accent theme */}
            <div className="space-y-2">
              <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                Theme Accent
              </label>
              <div className="flex items-center gap-3 pt-1">
                {[
                  { id: "gold", colorClass: "bg-[#806B4D]" },
                  { id: "black", colorClass: "bg-[#1C1C1C]" },
                  { id: "red", colorClass: "bg-red-600" },
                ].map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setThemeAccent(color.id as any)}
                    className={`h-7 w-7 rounded-full ${color.colorClass} border border-neutral-250 flex items-center justify-center transition hover:scale-105`}
                  >
                    {themeAccent === color.id && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                ))}
                <button className="h-7 w-7 rounded-full border border-neutral-200 border-dashed text-neutral-400 hover:text-charcoal transition flex items-center justify-center">
                  +
                </button>
              </div>
            </div>

            {/* Font Typography selection */}
            <div className="space-y-2">
              <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                Typography
              </label>
              <div className="relative">
                <button className="w-full flex items-center justify-between border border-neutral-200 rounded-xl px-4 py-3 bg-[#FAF9F6] text-[10px] font-bold text-charcoal text-left">
                  <span>{typography}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Save / Apply Changes Card */}
          <div className="bg-[#806B4D]/10 border border-[#806B4D]/25 rounded-3xl p-6 space-y-4 shadow-soft">
            <h3 className="font-display text-xl text-[#806B4D] font-semibold">Apply changes to global dashboard?</h3>
            <p className="text-[10px] text-[#806B4D] leading-relaxed font-medium">
              This will update all instances across the Studio environment including mobile applications.
            </p>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 bg-charcoal text-white hover:bg-[#6c5a40] text-[9px] font-bold uppercase tracking-wider py-3.5 rounded-xl transition">
                Save Changes
              </button>
              <button className="flex-1 border border-charcoal/30 text-charcoal hover:bg-charcoal/5 text-[9px] font-bold uppercase tracking-wider py-3.5 rounded-xl transition">
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Team Access Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-neutral-150/60 flex justify-between items-center">
          <h3 className="font-display text-2xl text-charcoal font-medium">Team Access</h3>
          <button className="text-[9px] font-bold uppercase tracking-wider text-[#806B4D] hover:underline flex items-center gap-1.5" type="button">
            <UserPlus className="h-3.5 w-3.5" />
            <span>Invite New Member</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-150/60 bg-neutral-50/50 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="p-5 pl-8">Admin User</th>
                <th className="p-5">Role</th>
                <th className="p-5">Status</th>
                <th className="p-5">Last Active</th>
                <th className="p-5 pr-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150/60 text-xs font-semibold text-charcoal">
              {team.map((member, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/20 transition">
                  <td className="p-5 pl-8 flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-neutral-100 shrink-0">
                      <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-charcoal leading-tight">{member.name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase mt-0.5 font-bold">{member.email}</p>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="bg-neutral-100 text-neutral-500 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-5 flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full bg-current ${member.statusClass}`} />
                    <span className="font-semibold text-neutral-500">{member.status}</span>
                  </td>
                  <td className="p-5 text-neutral-500 font-medium">{member.active}</td>
                  <td className="p-5 pr-8 text-right">
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-charcoal transition" aria-label="Settings Action">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-neutral-200/40 text-center text-[9px] uppercase tracking-widest font-semibold text-neutral-400">
        AI Fit Studio © 2024 — Proprietary Algorithms Active
      </footer>
    </div>
  );
}
