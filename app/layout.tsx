import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { StoreHydrationGate } from "@/lib/providers/StoreHydrationGate";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Picapool Move Planner - Plan your move to North Campus",
  description:
    "A calmer way to plan your PG search before you ever set foot in Delhi. Built by DU students, for DU students.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f1ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <StoreHydrationGate>{children}</StoreHydrationGate>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
