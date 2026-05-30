import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — The Genesis Story",
  description: "Discover the philosophy of LUXE. Rebellious design meets neural curation and accessible everyday luxury.",
  alternates: {
    canonical: "https://valceron.in/brand",
  },
  openGraph: {
    title: "LUXE — The Genesis Story",
    description: "Discover the philosophy of LUXE. Rebellious design meets neural curation and accessible everyday luxury.",
    url: "https://valceron.in/brand",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
