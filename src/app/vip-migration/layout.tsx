import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — VIP Profile Migration",
  description: "Securely migrate your profile coordinates to the LUXE Elite Inner Circle database.",
  alternates: {
    canonical: "https://valceron.in/vip-migration",
  },
  openGraph: {
    title: "LUXE — VIP Profile Migration",
    description: "Securely migrate your profile coordinates to the LUXE Elite Inner Circle database.",
    url: "https://valceron.in/vip-migration",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function VipMigrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
