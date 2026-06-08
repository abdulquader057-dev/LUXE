import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Cognition Network Hub",
  description: "Monitor real-time AI styling analytics, global logistics routing, data encryption vaults, and style DNA algorithms.",
  alternates: {
    canonical: "https://valceron.in/cognition",
  },
  openGraph: {
    title: "LUXE — Cognition Network Hub",
    description: "Monitor real-time AI styling analytics, global logistics routing, data encryption vaults, and style DNA algorithms.",
    url: "https://valceron.in/cognition",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function CognitionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
