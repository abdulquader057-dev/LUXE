import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Rajdhani, Sora, Orbitron, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import "./design-system.css";
import ZyraChat from "@/components/ZyraChat";
import BackToTop from "@/components/BackToTop";
import Sidebar from "@/components/Sidebar";
import { CommerceProvider } from "@/lib/contexts/CommerceContext";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import CartSidebar from "@/components/ui/CartSidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import EntranceAnimation from "@/components/EntranceAnimation";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Toaster } from "react-hot-toast";
import ThemeColorLoader from "@/components/ThemeColorLoader";
import Seo from "@/components/seo/Seo";

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
  title: "LUXE — Luxury Redefined",
  description: "Affordable luxury fashion for the bold generation",
  openGraph: {
    images: [{ url: "/hero/mobile.jpg" }],
  },
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
      <body className="min-h-full flex bg-transparent text-white selection:bg-[#00F0FF]/30 selection:text-white relative overflow-hidden h-screen w-screen">
        <script dangerouslySetInnerHTML={{ __html: "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');" }} />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <ThemeColorLoader />
        <AnimatedBackground />
        <EntranceAnimation />
        <ScrollProgress />
        <div className="film-grain opacity-20 mix-blend-overlay pointer-events-none" />
        <CustomCursor />
        
        <LanguageProvider>
        <AuthProvider>
        <CommerceProvider>
                  <Sidebar />
          <CartSidebar />
          
          <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar">
            <Navbar />
            <div className="flex-1 w-full relative z-10 pt-24 pb-12">
              {/* Page transition wrapper */}
<AnimatePresence mode="wait">
  {children}
</AnimatePresence>
            </div>
            <Footer />
          </main>
          
          {/* FLOATING COMPONENTS GEOMETRY LOCK */}
          <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-end" }}>
            <ZyraChat />
            <BackToTop />
          </div>
                </CommerceProvider>
        </AuthProvider>
        </LanguageProvider>
        <Toaster position="top-center" toastOptions={{ style: { background: '#050508', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </body>
    </html>
  );
}

