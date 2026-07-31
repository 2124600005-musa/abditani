import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abditani.vercel.app';

export const metadata: Metadata = {
  title: {
    default: "AbdiTani — Teknologi untuk Petani, Masa Depan untuk Negeri",
    template: "%s | AbdiTani",
  },
  description: "AbdiTani adalah platform digital pertanian Indonesia yang menyediakan informasi produk, harga komoditas terkini, edukasi pertanian, berita, dan teknologi pertanian modern dalam satu platform.",
  keywords: ["pertanian", "indonesia", "digital", "komoditas", "harga", "produk", "edukasi", "teknologi", "smart farming", "agrikultur"],
  authors: [{ name: "AbdiTani" }],
  creator: "AbdiTani",
  publisher: "AbdiTani",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "AbdiTani",
    title: "AbdiTani — Teknologi untuk Petani, Masa Depan untuk Negeri",
    description: "Platform digital pertanian Indonesia. Informasi produk, harga komoditas, edukasi, berita, dan teknologi pertanian.",
    images: [
      {
        url: "/images/abditani-logo.jpg",
        width: 1200,
        height: 630,
        alt: "AbdiTani - Platform Digital Pertanian Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AbdiTani — Teknologi untuk Petani, Masa Depan untuk Negeri",
    description: "Platform digital pertanian Indonesia. Informasi produk, harga komoditas, edukasi, berita, dan teknologi pertanian.",
    images: ["/images/abditani-logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AbdiTani",
    url: siteUrl,
    logo: `${siteUrl}/images/abditani-logo.jpg`,
    description: "Platform digital pertanian Indonesia yang menghubungkan informasi produk, harga komoditas, edukasi, berita, dan teknologi pertanian.",
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Toko Abdi Tani, Jl. Lintas Sumatera Simp 500 II, RT.2/RW.1",
      addressLocality: "Rambah Hilir",
      addressRegion: "Rokan Hulu, Riau",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+62-813-6408-3093",
      availableLanguage: "Indonesian",
    },
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
