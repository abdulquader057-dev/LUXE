import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Network Service Parameters",
  description: "Read terms regarding Hyderabad logistics, COD/UPI transactions, and our 7-day style silhouette return framework.",
  alternates: {
    canonical: "https://valceron.in/terms",
  },
  openGraph: {
    title: "LUXE — Network Service Parameters",
    description: "Read terms regarding Hyderabad logistics, COD/UPI transactions, and our 7-day style silhouette return framework.",
    url: "https://valceron.in/terms",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
