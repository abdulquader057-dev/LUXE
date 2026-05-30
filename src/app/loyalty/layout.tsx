import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Loyalty Inner Circle",
  description: "Join the founding members' circle to unlock elite tier status, personal stylist consoles, and 15% discount privileges.",
  alternates: {
    canonical: "https://valceron.in/loyalty",
  },
  openGraph: {
    title: "LUXE — Loyalty Inner Circle",
    description: "Join the founding members' circle to unlock elite tier status, personal stylist consoles, and 15% discount privileges.",
    url: "https://valceron.in/loyalty",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function LoyaltyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
