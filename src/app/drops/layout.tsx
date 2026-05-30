import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Limited Drops",
  description: "Access highly limited fashion drops. Secure your allocation before the synchronization countdown ends.",
  alternates: {
    canonical: "https://valceron.in/drops",
  },
  openGraph: {
    title: "LUXE — Limited Drops",
    description: "Access highly limited fashion drops. Secure your allocation before the synchronization countdown ends.",
    url: "https://valceron.in/drops",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function DropsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
