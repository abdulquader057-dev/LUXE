import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Your Style Profile",
  description: "Check your loyalty tiers, wardrobe completion metrics, and profile parameters.",
  alternates: {
    canonical: "https://valceron.in/profile",
  },
  openGraph: {
    title: "LUXE — Your Style Profile",
    description: "Check your loyalty tiers, wardrobe completion metrics, and profile parameters.",
    url: "https://valceron.in/profile",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
