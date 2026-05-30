import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Map IDs to friendly names
  const productNames: Record<string, string> = {
    "luxe-linen-001": "Luxe Essential Linen Shirt - Pure White",
    "luxe-linen-002": "Luxe Essential Linen Shirt - Sunset Pink",
    "luxe-linen-003": "Premium Short-Sleeve Polo - Carbon Black",
    "luxe-linen-004": "Signature Long-Sleeve Shirt - Bright White",
    "luxe-linen-005": "Polo Ralph Lauren Long-Sleeve - Desert Sand",
    "luxe-linen-006": "USPA Embossed Graphic Tee - Red",
    "luxe-linen-007": "Zara Crew-Neck T-Shirt - Pure White",
    "luxe-linen-008": "Premium Cotton Button-Up - Navy Blue",
  };

  const productName = productNames[id] || "Premium Collection Garment";
  
  return {
    title: `${productName} — LUXE`,
    description: `Shop the ${productName}. Crafted from premium fabric with luxury-inspired aesthetics at an affordable value.`,
    alternates: {
      canonical: `https://valceron.in/product/${id}`,
    },
    openGraph: {
      title: `${productName} — LUXE`,
      description: `Shop the ${productName}. Crafted from premium fabric with luxury-inspired aesthetics at an affordable value.`,
      url: `https://valceron.in/product/${id}`,
      images: [{ url: "/hero/mobile.jpg" }],
      type: "article",
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
