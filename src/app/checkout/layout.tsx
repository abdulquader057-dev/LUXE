import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Secure Handoff Terminal",
  description: "Finalize your checkout coordinates for dispatch routing inside the Hyderabad operational zone.",
  alternates: {
    canonical: "https://valceron.in/checkout",
  },
  openGraph: {
    title: "LUXE — Secure Handoff Terminal",
    description: "Finalize your checkout coordinates for dispatch routing inside the Hyderabad operational zone.",
    url: "https://valceron.in/checkout",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
