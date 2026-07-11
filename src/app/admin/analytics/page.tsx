"use client";

import { useState } from "react";
import {
  Calendar,
  Download,
  Shirt,
  ShoppingCart,
  Clock,
  Ruler,
  Globe,
} from "lucide-react";

import p3 from "@/assets/p3.jpg";
import p5 from "@/assets/p5.jpg";
import p7 from "@/assets/p7.jpg";

export default function AdminAnalyticsPage() {
  const [activeReach, setActiveReach] = useState<"region" | "country">("country");

  return (
    <div className="px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <h1 className="font-display text-4xl text-charcoal font-medium">Analytics & Insights</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            A comprehensive overview of your studio's performance, user engagement, and AI engine efficiency.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-charcoal/50 text-charcoal text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition">
            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
            <span>Oct 01 - Oct 31, 2023</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-neutral-200 hover:border-charcoal/50 text-charcoal text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition">
            <Download className="h-3.5 w-3.5 text-neutral-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl border border-neutral-200/50 p-5 flex flex-col justify-between shadow-soft relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">
              Total Try-Ons
            </span>
            <p className="text-2xl font-display font-light text-charcoal">124,802</p>
          </div>
          <div className="flex items-center justify-between mt-4 z-10">
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +12%
            </span>
          </div>
          <Shirt className="absolute -right-4 -bottom-4 h-16 w-16 text-neutral-50/50 pointer-events-none" />
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl border border-neutral-200/50 p-5 flex flex-col justify-between shadow-soft relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">
              Conversion Rate
            </span>
            <p className="text-2xl font-display font-light text-charcoal">18.4%</p>
          </div>
          <div className="flex items-center justify-between mt-4 z-10">
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +3.2%
            </span>
          </div>
          <ShoppingCart className="absolute -right-4 -bottom-4 h-16 w-16 text-neutral-50/50 pointer-events-none" />
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl border border-neutral-200/50 p-5 flex flex-col justify-between shadow-soft relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">
              Avg. Session
            </span>
            <p className="text-2xl font-display font-light text-charcoal">04:12</p>
          </div>
          <div className="flex items-center justify-between mt-4 z-10">
            <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded">
              -0%
            </span>
          </div>
          <Clock className="absolute -right-4 -bottom-4 h-16 w-16 text-neutral-50/50 pointer-events-none" />
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl border border-neutral-200/50 p-5 flex flex-col justify-between shadow-soft relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">
              Fit Accuracy
            </span>
            <p className="text-2xl font-display font-light text-charcoal">99.2%</p>
          </div>
          <div className="flex items-center justify-between mt-4 z-10">
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +0.5%
            </span>
          </div>
          <Ruler className="absolute -right-4 -bottom-4 h-16 w-16 text-neutral-50/50 pointer-events-none" />
        </div>
      </div>

      {/* Central Graph Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[400px]">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <h3 className="font-display text-2xl font-medium text-charcoal">Engagement Trends</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">
              Daily virtual try-on volume across all categories
            </p>
          </div>
          <div className="flex gap-4 items-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#806B4D]" /> Active Try-Ons
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" /> Projected
            </span>
          </div>
        </div>

        {/* Chart representation */}
        <div className="relative flex-1 flex items-end justify-center pt-10 pb-4">
          <svg viewBox="0 0 800 200" className="w-full h-full text-[#806B4D]">
            {/* Grid dotted lines */}
            <line x1="0" y1="160" x2="800" y2="160" stroke="#f1f0ec" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="#f1f0ec" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#f1f0ec" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="0" y1="40" x2="800" y2="40" stroke="#f1f0ec" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Smooth trend curve */}
            <path
              d="M 20 140 C 150 140 180 120 280 120 C 380 120 420 70 520 90 C 620 110 650 150 780 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Projected dotted curve */}
            <path
              d="M 780 100 Q 800 90 820 92"
              fill="none"
              stroke="#d4d4d4"
              strokeWidth="3.5"
              strokeDasharray="5 5"
              strokeLinecap="round"
            />

            {/* Data points */}
            <circle cx="20" cy="140" r="5" fill="currentColor" />
            <circle cx="280" cy="120" r="5" fill="currentColor" />
            <circle cx="520" cy="90" r="5" fill="currentColor" />
            <circle cx="780" cy="100" r="5" fill="currentColor" />
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-neutral-400 pt-3 border-t border-neutral-100">
          <span>Oct 01</span>
          <span>Oct 08</span>
          <span>Oct 15</span>
          <span>Oct 22</span>
          <span>Oct 29</span>
        </div>
      </div>

      {/* Middle Grid Row */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Card: Garment Performance */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[300px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200/40 pb-4">
              <h3 className="font-display text-xl text-charcoal font-medium">Garment Performance</h3>
              <button className="text-[9px] font-bold uppercase tracking-wider text-[#806B4D] hover:underline">
                View Details
              </button>
            </div>

            <div className="grid gap-4 grid-cols-3">
              {/* Product 1 */}
              <div className="space-y-2.5">
                <div className="aspect-square rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50">
                  <img src={p7.src} alt="Outerwear" className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-charcoal leading-tight">Outerwear</p>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase">42.1k Try-ons</p>
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-[#806B4D] h-full w-[85%]" />
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="space-y-2.5">
                <div className="aspect-square rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50">
                  <img src={p5.src} alt="Evening Wear" className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-charcoal leading-tight">Evening Wear</p>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase">31.5k Try-ons</p>
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-[#806B4D] h-full w-[65%]" />
                  </div>
                </div>
              </div>

              {/* Product 3 */}
              <div className="space-y-2.5">
                <div className="aspect-square rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50">
                  <img src={p3.src} alt="Bottoms" className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-charcoal leading-tight">Bottoms</p>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase">28.9k Try-ons</p>
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-[#806B4D] h-full w-[55%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Device Usage */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[300px]">
          <div className="space-y-4">
            <div className="border-b border-neutral-200/40 pb-4">
              <h3 className="font-display text-xl text-charcoal font-medium">Device Usage</h3>
            </div>

            {/* Donut representation */}
            <div className="flex justify-center items-center py-4 relative">
              <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Total circle */}
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="#f1f0ec" strokeWidth="10" />
                  {/* 75% segment */}
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="#806B4D" strokeWidth="10" strokeDasharray="301" strokeDashoffset="75" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[8px] font-bold uppercase text-neutral-400 tracking-wider">Mobile First</p>
                  <p className="text-sm font-bold text-charcoal">75%</p>
                </div>
              </div>
            </div>

            {/* Legend grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border-t border-neutral-100">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#806B4D]" /> iOS (Mobile)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#bfaf97]" /> Android
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-neutral-300" /> Desktop Web
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-neutral-100" /> In-Store Kiosk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Row */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Technical Performance Card */}
        <div className="lg:col-span-6 bg-[#1C1C1C] text-white rounded-3xl p-6 flex flex-col justify-between shadow-soft min-h-[220px]">
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <h3 className="font-display text-xl text-white font-medium">Technical Performance</h3>
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
                  Real-time AI engine health metrics
                </p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                System Operational
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              {/* Metric 1 */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">AI Latency</p>
                <p className="text-4xl font-display font-light text-[#806B4D]">1.2s</p>
                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-[#806B4D] h-full w-[45%]" />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Server Uptime</p>
                <p className="text-4xl font-display font-light text-[#806B4D]">99.98%</p>
                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-[#806B4D] h-full w-[98%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Reach Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[220px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200/40 pb-4">
              <h3 className="font-display text-xl text-charcoal font-medium">Global Reach</h3>
              <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveReach("region")}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    activeReach === "region" ? "bg-[#FAF9F6] border-neutral-200 text-charcoal" : "border-transparent text-neutral-400 hover:text-charcoal"
                  }`}
                >
                  Region
                </button>
                <button
                  onClick={() => setActiveReach("country")}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    activeReach === "country" ? "bg-charcoal border-transparent text-white" : "border-transparent text-neutral-400 hover:text-charcoal"
                  }`}
                >
                  Country
                </button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-2 items-center">
              {/* Globe Visual placeholder */}
              <div className="flex items-center justify-center py-2">
                <div className="h-24 w-24 bg-[#FAF9F6] rounded-full border border-neutral-200 flex items-center justify-center relative overflow-hidden shadow-inner">
                  <Globe className="h-10 w-10 text-[#806B4D] animate-spin" style={{ animationDuration: '60s' }} />
                  <div className="absolute top-4 left-6 h-2 w-2 rounded-full bg-[#806B4D]" />
                  <div className="absolute bottom-6 right-5 h-2 w-2 rounded-full bg-[#806B4D]" />
                </div>
              </div>

              {/* Regions metrics list */}
              <div className="space-y-4 text-xs font-semibold text-charcoal">
                {/* Row 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>North America</span>
                    <span className="font-bold">42%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#806B4D] h-full w-[42%]" />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Europe</span>
                    <span className="font-bold">35%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#806B4D] h-full w-[35%]" />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Asia Pacific</span>
                    <span className="font-bold">18%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#806B4D] h-full w-[18%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-neutral-200/40 text-center text-[9px] uppercase tracking-widest font-semibold text-neutral-400">
        AI Fit Studio © 2024 — Proprietary Algorithms Active
      </footer>
    </div>
  );
}
