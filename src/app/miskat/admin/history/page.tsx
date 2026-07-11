"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  BarChart2,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

import p3 from "@/assets/p3.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

export default function AdminHistoryPage() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const sessions = [
    {
      userId: "usr_98**23",
      userType: "PREMIUM MEMBER",
      garment: "Architectural Wool Coat",
      image: p7.src,
      duration: "05:12",
      outcome: "PURCHASED",
      statusClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    },
    {
      userId: "usr_44**12",
      userType: "GUEST USER",
      garment: "Silk Column Blouse",
      image: p6.src,
      duration: "03:45",
      outcome: "SAVED",
      statusClass: "bg-amber-50 text-amber-600 border border-amber-100",
    },
    {
      userId: "usr_11**77",
      userType: "PREMIUM MEMBER",
      garment: "Leather Wrap Belt",
      image: p3.src,
      duration: "01:22",
      outcome: "CLOSED",
      statusClass: "bg-neutral-100 text-neutral-500 border border-neutral-150",
    },
  ];

  return (
    <div className="px-8 py-8 space-y-8 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <h1 className="font-display text-4xl text-charcoal font-medium">Try-On Sessions</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Real-time engagement and behavioral analytics.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="bg-white border border-neutral-200 hover:border-charcoal/50 text-charcoal text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition">
            Export Report
          </button>
          <button className="flex items-center gap-2 bg-charcoal text-white hover:bg-[#806B4D] text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition">
            <span>Last 30 Days</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Top Bento Grid Section */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Session Volume */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[360px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                Activity Overview
              </span>
              <h3 className="font-display text-2xl font-medium text-charcoal">Session Volume</h3>
            </div>
            <div className="text-right space-y-1">
              <span className="text-3xl font-display font-light text-charcoal block">12,482</span>
              <span className="inline-block text-[8px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                +14.2% vs last month
              </span>
            </div>
          </div>

          {/* Smooth Line Chart Mockup */}
          <div className="relative flex-1 flex items-end justify-center pt-8 pb-4">
            <svg viewBox="0 0 500 150" className="w-full h-full text-[#806B4D]">
              {/* Grid Lines */}
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f0ec" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f0ec" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f0ec" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Smooth curve */}
              <path
                d="M 0 110 Q 70 80 125 90 T 250 70 T 375 95 T 500 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 110 Q 70 80 125 90 T 250 70 T 375 95 T 500 50 L 500 150 L 0 150 Z"
                fill="url(#grad)"
                className="opacity-[0.08]"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-neutral-400 pt-3 border-t border-neutral-100">
            <span>01 Oct</span>
            <span>08 Oct</span>
            <span>15 Oct</span>
            <span>22 Oct</span>
            <span>30 Oct</span>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="lg:col-span-4 space-y-6">
          {/* Most Popular Garment */}
          <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[105px]">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">
              Most Popular Garment
            </span>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-10 w-10 rounded-lg overflow-hidden border border-neutral-100 shrink-0">
                <img src={p7.src} alt="Popular garment" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal leading-tight">Architectural Wool Coat</p>
              </div>
            </div>
          </div>

          {/* Average Session Duration */}
          <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                Average Session Duration
              </span>
              {/* Mini Bar Chart */}
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 bg-[#806B4D]/30 h-2 rounded-t-sm" />
                <div className="w-1 bg-[#806B4D] h-3 rounded-t-sm" />
                <div className="w-1 bg-[#806B4D]/50 h-1 rounded-t-sm" />
              </div>
            </div>
            <div className="space-y-1.5 mt-3">
              <p className="text-2xl font-display font-light text-[#806B4D]">4.2 m</p>
              <p className="text-[8px] font-semibold text-neutral-400">
                Optimal engagement threshold reached in 82% of sessions.
              </p>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[105px]">
            <div className="flex justify-between items-center">
              <div className="space-y-1.5">
                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">
                  Conversion Rate
                </span>
                <p className="text-3xl font-display font-light text-charcoal">12.5%</p>
              </div>
              {/* Circular gauge */}
              <div className="relative h-11 w-11 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="transparent" stroke="#f1f0ec" strokeWidth="3" />
                  <circle cx="22" cy="22" r="18" fill="transparent" stroke="#806B4D" strokeWidth="3" strokeDasharray="113" strokeDashoffset="80" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Sessions */}
      <div className="bg-white rounded-3xl border border-neutral-200/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-neutral-150/60 flex justify-between items-center">
          <h3 className="font-display text-2xl text-charcoal font-medium">Recent Sessions</h3>
          <Link href="/miskat/admin/history" className="text-[10px] font-bold uppercase tracking-wider text-[#806B4D] hover:underline flex items-center gap-1">
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-150/60 bg-neutral-50/50 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="p-5 pl-8">User ID</th>
                <th className="p-5">Garment</th>
                <th className="p-5">Duration</th>
                <th className="p-5">Outcome</th>
                <th className="p-5 pr-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150/60 text-xs font-semibold text-charcoal">
              {sessions.map((session, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/20 transition">
                  <td className="p-5 pl-8">
                    <p className="font-bold text-charcoal leading-tight">{session.userId}</p>
                    <p className="text-[9px] text-muted-foreground uppercase mt-0.5 font-bold">{session.userType}</p>
                  </td>
                  <td className="p-5 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg overflow-hidden border border-neutral-100 shrink-0">
                      <img src={session.image} alt={session.garment} className="h-full w-full object-cover" />
                    </div>
                    <span className="font-bold text-charcoal">{session.garment}</span>
                  </td>
                  <td className="p-5 text-neutral-500 font-medium">{session.duration}</td>
                  <td className="p-5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase ${session.statusClass}`}>
                      {session.outcome}
                    </span>
                  </td>
                  <td className="p-5 pr-8 text-right relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                      className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-charcoal transition"
                      aria-label="More Options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Insights Badge */}
      <div className="fixed bottom-6 right-8 z-50">
        <div className="bg-black/95 text-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-luxe flex items-center gap-2 border border-neutral-800 text-[8.5px] font-bold uppercase tracking-widest animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-[#806B4D]" />
          <span>AI Insights Updating...</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-12 border-t border-neutral-200/40 text-center text-[9px] uppercase tracking-widest font-semibold text-neutral-400">
        AI Fit Studio © 2024 — Proprietary Algorithms Active
      </footer>
    </div>
  );
}
