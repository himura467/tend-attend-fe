import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { ReactNode } from "react";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", fontHeading.variable, fontBody.variable)}>{children}</body>
    </html>
  );
}
