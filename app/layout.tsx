// filepath: /home/joshua/joshua/kbhs/app/layout.tsx
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
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/favicon.ico" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KBHS Teacher Notes</title>
        <meta
          name="description"
          content="Notes management system for Kasikeu Boys High School teachers"
        />
      </head>
      <body>
        <Header user={user} />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}