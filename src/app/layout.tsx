import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "New Navigation — Home Prototype",
  description: "PROTOTYPE: Figma Foundations Home Page 2487:5908",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
