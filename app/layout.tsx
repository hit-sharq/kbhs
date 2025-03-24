import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "KBHS Teacher Notes",
  description: "Notes management system for Kasikeu Boys High School teachers",
  icons: [
    { rel: "icon", url: "/images/k-favicon.png" },
    { rel: "apple-touch-icon", url: "/images/k-favicon.png" },
  ],
  generator: "v0.dev",
};

// Mark the layout as dynamic to allow server-side features like `cookies`
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Header user={user} />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}