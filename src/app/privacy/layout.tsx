import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Data Protection Protocol",
  description: "Verify how your telemetry and physical coordinates are secured and handled inside our database.",
  alternates: {
    canonical: "https://valceron.in/privacy",
  },
  openGraph: {
    title: "LUXE — Data Protection Protocol",
    description: "Verify how your telemetry and physical coordinates are secured and handled inside our database.",
    url: "https://valceron.in/privacy",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
