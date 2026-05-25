import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Rajdhani, Sora, Orbitron, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BackToTop from "@/components/BackToTop";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  subsets: ["latin"],
});

const sora = Sora({
  weight: ["300", "400", "500"],
  variable: "--font-sora",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  weight: ["400", "500", "600"],
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "LUXE | Cognitive Fashion Operating System",
  description: "Experience the future of fashion. AI-native, luxury-grade, neural-powered style curation for the next generation of digital identities.",
  keywords: ["AI Fashion", "Future of Retail", "Luxury Techwear", "Neural Styling", "Luxe"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${bebasNeue.variable} ${rajdhani.variable} ${orbitron.variable} ${cormorant.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#050508] text-white selection:bg-white selection:text-black relative overflow-x-hidden">
        <ScrollProgress />
        <div className="film-grain" />
        <CustomCursor />
        
        <CurrencyProvider>
          <Navbar />
          {/* GLOBAL CONTAINMENT ARCHITECTURE */}
          <main 
            className="relative z-10 w-full max-w-[1440px] mx-auto pt-16 md:pt-24"
            style={{ display: "block", minHeight: "100vh", visibility: "visible", opacity: 1 }}
          >
            {children}
            <Footer />
          </main>
        </CurrencyProvider>
      </body>
    </html>
  );
}
