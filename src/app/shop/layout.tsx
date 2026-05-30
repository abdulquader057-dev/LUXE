import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Curated Catalog",
  description: "Browse the exclusive collection of luxury linen apparel, tailored for premium comfort and timeless style.",
  alternates: {
    canonical: "https://valceron.in/shop",
  },
  openGraph: {
    title: "LUXE — Curated Catalog",
    description: "Browse the exclusive collection of luxury linen apparel, tailored for premium comfort and timeless style.",
    url: "https://valceron.in/shop",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
