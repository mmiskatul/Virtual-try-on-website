import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles.css";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "AI Fit Studio - Virtual Try-On for Fashion",
  description:
    "Upload your photo, pick an outfit, and see how it looks on you in seconds with AI Fit Studio.",
  openGraph: {
    title: "AI Fit Studio - Virtual Try-On for Fashion",
    description:
      "Premium AI-powered virtual try-on for modern fashion. Try outfits virtually before you buy.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fit Studio - Virtual Try-On for Fashion",
    description:
      "AI Style Studio lets users virtually try on fashion outfits using their own photos.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col bg-background">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
