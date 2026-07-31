import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AbdiTani — Solusi Digital untuk Pertanian Indonesia",
  description: "AbdiTani menyediakan informasi produk, harga komoditas, edukasi, berita, dan teknologi pertanian Indonesia.",
  openGraph: { title: "AbdiTani — Solusi Digital untuk Pertanian Indonesia", description: "Platform digital pertanian Indonesia.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
