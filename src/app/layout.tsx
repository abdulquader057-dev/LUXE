import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zyvora | Futuristic AI Fashion",
  description: "Zyvora is a next-generation Gen-Z fashion brand combining Indian street culture with futuristic cyber aesthetics and AI-powered shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-mesh">
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}


