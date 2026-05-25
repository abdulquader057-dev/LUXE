import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Rajdhani, Sora, Orbitron, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ZyraChat from "@/components/ZyraChat";
import BackToTop from "@/components/BackToTop";
import Sidebar from "@/components/Sidebar";
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
      <body className="min-h-full flex bg-[#050508] text-white selection:bg-[#00F0FF]/30 selection:text-white relative overflow-hidden h-screen w-screen">
        <ScrollProgress />
        <div className="film-grain opacity-20 mix-blend-overlay pointer-events-none" />
        <CustomCursor />
        
        <CurrencyProvider>
          <Sidebar />
          
          <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar">
            <Navbar />
            <div className="flex-1 w-full relative z-10 pt-24 pb-12">
              {children}
            </div>
            <Footer />
          </main>
          
          {/* FLOATING COMPONENTS GEOMETRY LOCK */}
          <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-end" }}>
            <ZyraChat />
            <BackToTop />
          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}
