"use client";

import Link from "next/link";
import { Cpu, Zap, UserCheck, User } from "lucide-react";

import p5 from "@/assets/p5.jpg";
import p7 from "@/assets/p7.jpg";

export default function AdminDashboardPage() {
  return (
    <div className="px-8 py-8 space-y-12">
      {/* Title Header */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#806B4D]">
          Studio Core
        </span>
        <h2 className="font-display text-4xl text-charcoal leading-tight relative">
          <span className="relative pb-2.5 inline-block">
            Performance Intelligence
            <span className="absolute bottom-0 left-0 w-24 h-[3px] bg-[#806B4D]" />
          </span>
        </h2>
      </div>

      {/* Three KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Fit Accuracy */}
        <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[180px]">
          <div className="flex justify-between items-start">
            <span className="text-[#806B4D] bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-100">
              <Cpu className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
              +0.12% vs LY
            </span>
          </div>
          <div className="space-y-1 mt-4">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Fit Accuracy</p>
            <p className="text-4xl font-display font-light text-charcoal">99.8%</p>
          </div>
          <div className="w-full h-1 bg-[#806B4D] rounded-full mt-4" />
        </div>

        {/* Card 2: System Latency */}
        <div className="bg-[#1C1C1C] text-white rounded-3xl p-6 flex flex-col justify-between shadow-soft min-h-[180px]">
          <div className="flex justify-between items-start">
            <span className="text-[#806B4D] bg-neutral-800/40 p-2.5 rounded-xl border border-neutral-700/20">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-bold text-[#806B4D] bg-[#806B4D]/10 px-2 py-0.5 rounded uppercase tracking-wider">
              Optimized
            </span>
          </div>
          <div className="space-y-1 mt-4">
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">System Latency</p>
            <p className="text-4xl font-display font-light text-white">240ms</p>
          </div>
          {/* Latency Trend bar chart */}
          <div className="flex items-end gap-1 h-6 mt-4">
            <div className="w-full bg-[#806B4D]/30 h-[40%] rounded-t-sm" />
            <div className="w-full bg-[#806B4D]/50 h-[60%] rounded-t-sm" />
            <div className="w-full bg-[#806B4D]/70 h-[50%] rounded-t-sm" />
            <div className="w-full bg-[#806B4D]/90 h-[80%] rounded-t-sm" />
            <div className="w-full bg-[#806B4D] h-[100%] rounded-t-sm" />
          </div>
        </div>

        {/* Card 3: Active Sessions */}
        <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[180px]">
          <div className="flex justify-between items-start">
            <span className="text-[#806B4D] bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-100">
              <UserCheck className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
              Peak Time
            </span>
          </div>
          <div className="space-y-1 mt-4">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Active Sessions</p>
            <p className="text-4xl font-display font-light text-charcoal">1,280</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex -space-x-2">
              <img
                className="h-6 w-6 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="User 1"
              />
              <img
                className="h-6 w-6 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                alt="User 2"
              />
              <img
                className="h-6 w-6 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                alt="User 3"
              />
            </div>
            <button className="text-[9px] font-bold uppercase text-[#806B4D] hover:underline" type="button">
              View Live Map
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Area: Collection Overview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end border-b border-neutral-200/50 pb-4">
            <h3 className="font-display text-2xl text-charcoal font-medium">Collection Overview</h3>
            <Link href="/admin/collection" className="text-[10px] font-bold uppercase tracking-wider text-[#806B4D] hover:underline flex items-center gap-1">
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Product Card 1 */}
            <div className="group relative space-y-4 cursor-pointer bg-white rounded-3xl p-4 border border-neutral-200/40 shadow-soft">
              <div className="overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-100 border border-neutral-100 relative">
                <img
                  src={p5.src}
                  alt="Crushed Silk Evening Gown"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Atelier Series</p>
                <h4 className="font-display text-lg font-medium text-charcoal">Crushed Silk Evening Gown</h4>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase">ID: #9921-X</p>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group relative space-y-4 cursor-pointer bg-white rounded-3xl p-4 border border-neutral-200/40 shadow-soft">
              <div className="overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-100 border border-neutral-100 relative">
                <img
                  src={p7.src}
                  alt="Structured Linen Blazer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-4 right-4 bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Processing
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Seasonal Core</p>
                <h4 className="font-display text-lg font-medium text-charcoal">Structured Linen Blazer</h4>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase">ID: #4402-A</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Real-Time Activity */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[400px]">
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200/40 pb-4">
              Real-Time Activity
            </h3>

            {/* Activity List */}
            <div className="space-y-6">
              {/* Item 1 */}
              <div className="flex gap-3 items-start text-xs font-semibold text-charcoal">
                <div className="h-8 w-8 rounded-full bg-neutral-50 border border-neutral-150 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-charcoal">User_782</span>
                    <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">2m ago</span>
                  </div>
                  <p className="text-neutral-500 text-[11px] font-medium leading-relaxed">
                    Completed 3D Try-on for{" "}
                    <Link href="/collection" className="text-[#806B4D] underline cursor-pointer">
                      Silk Evening Gown
                    </Link>
                    .
                  </p>
                  <span className="inline-block text-[8px] font-bold text-emerald-600 uppercase tracking-widest">
                    Successful Fit
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-3 items-start text-xs font-semibold text-charcoal">
                <div className="h-8 w-8 rounded-full bg-neutral-50 border border-neutral-150 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-charcoal">User_114</span>
                    <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">5m ago</span>
                  </div>
                  <p className="text-neutral-500 text-[11px] font-medium leading-relaxed">
                    Adjusting measurement parameters: <span className="font-bold text-charcoal italic">Shoulder Width</span>.
                  </p>
                  <span className="inline-block text-[8px] font-bold text-amber-600 uppercase tracking-widest">
                    Active Session
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-3 items-start text-xs font-semibold text-charcoal">
                <div className="h-8 w-8 rounded-full bg-neutral-50 border border-neutral-150 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-charcoal">User_309</span>
                    <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">12m ago</span>
                  </div>
                  <p className="text-neutral-500 text-[11px] font-medium leading-relaxed">
                    System aborted try-on. Texture map error.
                  </p>
                  <span className="inline-block text-[8px] font-bold text-red-600 uppercase tracking-widest">
                    Failure Logged
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full border border-neutral-200 hover:border-charcoal/50 text-charcoal py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition mt-6" type="button">
            View Full Logs
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-12 border-t border-neutral-200/40 text-center text-[9px] uppercase tracking-widest font-semibold text-neutral-400">
        AI Fit Studio © 2024 — Proprietary Algorithms Active
      </footer>
    </div>
  );
}
