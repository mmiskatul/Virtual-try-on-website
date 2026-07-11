"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAdminAuth } from "@/components/admin/admin-auth";

export default function AdminEntryPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuth();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="grid min-h-[40vh] place-items-center px-4 py-10">
      <p className="text-sm text-muted-foreground">
        {loading ? "Loading admin area..." : "Redirecting..."}
      </p>
    </div>
  );
}
