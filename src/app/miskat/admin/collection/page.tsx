"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  Grid,
  List,
  Edit2,
  BarChart2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Hourglass,
  Cloud,
} from "lucide-react";

import p1 from "@/assets/p1.jpg";
import p3 from "@/assets/p3.jpg";
import p5 from "@/assets/p5.jpg";
import p7 from "@/assets/p7.jpg";

export default function AdminCollectionsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "live" | "drafts" | "archived">("all");

  const items = [
    {
      id: "AI-88293-S",
      name: "Silk Bias Midi Dress",
      category: "Evening Wear",
      status: "Live",
      modified: "Oct 24, 2023",
      image: p5.src,
    },
    {
      id: "AI-10294-B",
      name: "Structured Wool Blazer",
      category: "Outerwear",
      status: "Live",
      modified: "Oct 21, 2023",
      image: p7.src,
    },
    {
      id: "AI-55210-K",
      name: "Cashmere Wrap Knit",
      category: "Knitwear",
      status: "Draft",
      modified: "Oct 19, 2023",
      image: p1.src,
    },
    {
      id: "AI-92183-P",
      name: "Vegan Leather Trousers",
      category: "Bottoms",
      status: "Live",
      modified: "Oct 15, 2023",
      image: p3.src,
    },
  ];

  return (
    <div className="px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <h1 className="font-display text-4xl text-charcoal font-medium">Collections</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Manage your virtual inventory, toggle visibility for AI try-on sessions, and track performance across seasonal lookbooks.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="bg-white border border-neutral-200 hover:border-charcoal/50 text-charcoal text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition">
            Export Report
          </button>
          <Link
            href="/miskat/admin/add"
            className="inline-flex items-center gap-1.5 bg-charcoal text-white hover:bg-[#806B4D] text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Collection</span>
          </Link>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex justify-between items-center border-b border-neutral-200/50 pb-px">
        <div className="flex gap-8 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {[
            { id: "all", label: "All", count: 128 },
            { id: "live", label: "Live", count: 42 },
            { id: "drafts", label: "Drafts", count: 14 },
            { id: "archived", label: "Archived", count: 72 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 relative transition ${
                activeTab === tab.id ? "text-charcoal" : "hover:text-charcoal"
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 text-[9px] text-neutral-400 font-semibold">{tab.count}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-charcoal" />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 text-neutral-400 pb-2">
          <button className="p-1 rounded hover:bg-neutral-100 transition" aria-label="Grid View">
            <Grid className="h-4 w-4" />
          </button>
          <button className="p-1 rounded bg-neutral-100 text-charcoal transition" aria-label="List View">
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-neutral-200/50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-150/60 bg-neutral-50/50 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <th className="p-5 pl-8">Apparel Item</th>
                <th className="p-5">Category</th>
                <th className="p-5">Status</th>
                <th className="p-5">Modified</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150/60 text-xs font-semibold text-charcoal">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/20 transition">
                  <td className="p-5 pl-8 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-neutral-100 shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal leading-tight">{item.name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase mt-0.5 font-bold">ID: {item.id}</p>
                    </div>
                  </td>
                  <td className="p-5 text-neutral-500 font-medium">{item.category}</td>
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        item.status === "Live"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <span className={`h-1 w-1 rounded-full ${item.status === "Live" ? "bg-emerald-500" : "bg-neutral-400"}`} />
                      {item.status}
                    </span>
                  </td>
                  <td className="p-5 text-neutral-500 font-medium">{item.modified}</td>
                  <td className="p-5 pr-8 text-right">
                    <div className="inline-flex items-center gap-1 text-neutral-400">
                      <button className="p-2 hover:text-charcoal hover:bg-neutral-50 rounded-lg transition" aria-label="Edit">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-2 hover:text-charcoal hover:bg-neutral-50 rounded-lg transition" aria-label="Analytics">
                        <BarChart2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-2 hover:text-charcoal hover:bg-neutral-50 rounded-lg transition" aria-label="More">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-5 px-8 flex justify-between items-center border-t border-neutral-150/60 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          <span>Showing 1 to 10 of 128 items</span>
          <div className="flex items-center gap-2 text-charcoal">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <span className="h-7 w-7 rounded-lg bg-charcoal text-white flex items-center justify-center cursor-pointer">1</span>
            <span className="h-7 w-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center cursor-pointer">2</span>
            <span className="h-7 w-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center cursor-pointer">3</span>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Bottom KPI Cards Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Top Performer */}
        <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[140px]">
          <div className="flex justify-between items-start">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Top Performer</h4>
            <ArrowUpRight className="h-4 w-4 text-[#806B4D]" />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-10 w-10 rounded-lg overflow-hidden border border-neutral-100 shrink-0">
              <img src={p5.src} alt="Top performer" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-charcoal leading-tight">Silk Bias Midi Dress</p>
              <p className="text-lg font-display font-light text-[#806B4D] mt-0.5">4.2k Tries</p>
            </div>
          </div>
        </div>

        {/* Processing Queue */}
        <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[140px]">
          <div className="flex justify-between items-start">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Processing Queue</h4>
            <Hourglass className="h-4 w-4 text-[#806B4D]" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#806B4D] h-full rounded-full w-[60%]" />
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground">AI Model Generation: 8 items remaining</p>
          </div>
        </div>

        {/* Storage Capacity */}
        <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 flex flex-col justify-between shadow-soft min-h-[140px]">
          <div className="flex justify-between items-start">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Storage Capacity</h4>
            <Cloud className="h-4 w-4 text-[#806B4D]" />
          </div>
          <div className="space-y-1 mt-4">
            <p className="text-2xl font-display font-light text-charcoal">82%</p>
            <p className="text-[10px] font-semibold text-muted-foreground">2.4 TB of 3.0 TB used</p>
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
