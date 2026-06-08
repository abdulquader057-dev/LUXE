import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Map IDs to friendly names
  const productNames: Record<string, string> = {
    "00000000-0000-4000-a000-000000000001": "Luxe Signature Short-Sleeve Linen Shirt",
    "00000000-0000-4000-a000-000000000002": "Luxe Premium Long-Sleeve Knit Polo",
    "00000000-0000-4000-a000-000000000003": "Luxe Signature Cotton Button-Up",
    "00000000-0000-4000-a000-000000000004": "Luxe Premium Crew-Neck Tee",
    "00000000-0000-4000-a000-000000000005": "Luxe Tipped Collar Polo",
    "00000000-0000-4000-a000-000000000006": "Luxe Crew-Neck Embossed Tee",
    "00000000-0000-4000-a000-000000000007": "Luxe Signature Luxury Polo",
    "00000000-0000-4000-a000-000000000008": "Luxe Classic Long-Sleeve Shirt",
  };

  const productName = productNames[id] || "Premium Collection Garment";
  
  return {
    title: `${productName} | Buy Online | LUXE Fashion India`,
    description: `Shop the ${productName}. Crafted from premium fabric with luxury-inspired aesthetics at an affordable value.`,
    alternates: {
      canonical: `https://valceron.in/product/${id}`,
    },
    openGraph: {
      title: `${productName} | Buy Online | LUXE Fashion India`,
      description: `Shop the ${productName}. Crafted from premium fabric with luxury-inspired aesthetics at an affordable value.`,
      url: `https://valceron.in/product/${id}`,
      images: [{ url: "https://valceron.in/og-image.jpg", width: 1200, height: 630, alt: productName }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | Buy Online | LUXE Fashion India`,
      description: `Shop the ${productName}. Crafted from premium fabric with luxury-inspired aesthetics at an affordable value.`,
      images: ["https://valceron.in/og-image.jpg"],
    }
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
