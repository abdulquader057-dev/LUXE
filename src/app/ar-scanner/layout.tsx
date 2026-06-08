import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Neural Fit Scanner",
  description: "Virtual fitting and custom sizing using spatial camera scanning. Join the Luxe Beta waitlist now.",
  alternates: {
    canonical: "https://valceron.in/ar-scanner",
  },
  openGraph: {
    title: "LUXE — Neural Fit Scanner",
    description: "Virtual fitting and custom sizing using spatial camera scanning. Join the Luxe Beta waitlist now.",
    url: "https://valceron.in/ar-scanner",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function ARScannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
