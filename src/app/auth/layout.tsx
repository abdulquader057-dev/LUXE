import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUXE — Neural Access Gate",
  description: "Authenticate or initialize your identity link to sync your custom style matrix.",
  alternates: {
    canonical: "https://valceron.in/auth",
  },
  openGraph: {
    title: "LUXE — Neural Access Gate",
    description: "Authenticate or initialize your identity link to sync your custom style matrix.",
    url: "https://valceron.in/auth",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
