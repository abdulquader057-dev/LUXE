import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Rajdhani, Sora, Orbitron } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BackToTop from "@/components/BackToTop";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";
import Sidebar from "@/components/Sidebar";
import AIChatbot from "@/components/ai/AIChatbot";
import { CinematicAtmosphere } from "@/components/CinematicAtmosphere";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
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
      className={`${sora.variable} ${bebasNeue.variable} ${rajdhani.variable} ${orbitron.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-primary selection:text-black relative cursor-none">
        <div className="film-grain" />
        <div className="watermark-vertical">LUXE SYSTEM // CORE V4.2 // NEURAL SYNC</div>
        <CustomCursor />
        <CinematicAtmosphere />
        <CurrencyProvider>
          <Navbar />
          <Sidebar />
          <div className="relative z-10 flex-grow lg:pl-[90px] transition-all duration-500 flex flex-col">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
          <AIChatbot />
          <WhatsAppWidget />
          <BackToTop />
        </CurrencyProvider>
      </body>
    </html>
  );
}
