import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Rajdhani, Sora, Orbitron, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BackToTop from "@/components/BackToTop";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";
import Sidebar from "@/components/Sidebar";
import ZyraChat from "@/components/ZyraChat";
import { CinematicAtmosphere } from "@/components/CinematicAtmosphere";
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
      <body className="min-h-full flex flex-col bg-[#07070F] text-white selection:bg-accent-cyan selection:text-black relative overflow-x-hidden">
        <ScrollProgress />
        <div className="film-grain" />
        <div className="watermark-vertical hidden lg:block">LUXE SYSTEM // CORE V4.2 // NEURAL SYNC</div>
        <CustomCursor />
        <CinematicAtmosphere />
        <CurrencyProvider>
          <Navbar />
          <Sidebar />
          <div className="relative z-10 flex-grow lg:pl-[90px] flex flex-col">
            <div className="flex-grow pt-16">
              {children}
            </div>
            <Footer />
          </div>
          <ZyraChat />
          <WhatsAppWidget />
          <BackToTop />
        </CurrencyProvider>
      </body>
    </html>
  );
}
