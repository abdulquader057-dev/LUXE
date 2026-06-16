import type { Metadata, Viewport } from "next";
import { Sora, Orbitron, Cormorant_Garamond } from "next/font/google";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import "./globals.css";
import "./design-system.css";
import Sidebar from "@/components/Sidebar";
import { CommerceProvider } from "@/lib/contexts/CommerceContext";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import CartSidebar from "@/components/ui/CartSidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { Toaster } from "react-hot-toast";
import ThemeColorLoader from "@/components/ThemeColorLoader";
import GtmPageViewTracker from "@/components/GtmPageViewTracker";
import MobileNav from "@/components/MobileNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LuxeLoadingBar from "@/components/ui/LuxeLoadingBar";
import DynamicLayoutWidgets from "@/components/layout/DynamicLayoutWidgets";
import CinematicRevealWrapper from "@/components/layout/CinematicRevealWrapper";

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
  alternates: {
    canonical: "https://valceron.in/",
  },
  openGraph: {
    title: "LUXE — Luxury Redefined",
    description: "Affordable luxury fashion for the bold generation",
    url: "https://valceron.in/",
    images: [{ url: "/hero/mobile.jpg" }],
    type: "website",
  },
  keywords: ["AI Fashion", "Future of Retail", "Luxury Techwear", "Neural Styling", "Luxe"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "TO_BE_FILLED",
  },
};

const THEMES: Record<string, { bg: string; card: string; text: string; accent: string }> = {
  "Noir Gold": { bg: "transparent", card: "#12121A", text: "#F0EDE8", accent: "#C9A84C" },
  "Champagne": { bg: "transparent", card: "#22200A", text: "#F5EDD5", accent: "#E8C97A" },
  "Deep Slate": { bg: "transparent", card: "#111827", text: "#E8EDF5", accent: "#7B9CCC" },
  "Burgundy Luxe": { bg: "transparent", card: "#1E0E1A", text: "#F5E0E8", accent: "#C9506A" },
  "Royal Obsidian": { bg: "transparent", card: "#0E1220", text: "#EDE8FF", accent: "#8B6FD4" },
  "Cognac": { bg: "transparent", card: "#1F1000", text: "#FFE8CC", accent: "#D4AF37" },
  "Midnight Rose": { bg: "transparent", card: "#100818", text: "#FFE8F0", accent: "#E8A0B0" }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("luxe-theme")?.value || "Noir Gold";
  const selectedTheme = THEMES[theme] || THEMES["Noir Gold"];
  const themeClass = theme.toLowerCase().replace(/\s+/g, "-");

  return (
    <html
      lang="en"
      className={`${sora.variable} ${orbitron.variable} ${cormorant.variable} h-full antialiased dark scroll-smooth theme-${themeClass}`}
    >
      <head>
        <meta name="google-site-verification" content="TO_BE_FILLED" />
        <link rel="preload" href="/models/male_model.glb" as="fetch" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --theme-bg: ${selectedTheme.bg};
            --theme-card: ${selectedTheme.card};
            --theme-text: ${selectedTheme.text};
            --theme-accent: ${selectedTheme.accent};
            --bg-void: ${selectedTheme.bg};
            --bg-base: ${selectedTheme.bg};
            --bg-surface: ${selectedTheme.card};
            --bg-elevated: ${selectedTheme.card};
            --text-primary: ${selectedTheme.text};
            --primary-color: ${selectedTheme.accent};
            --gold-accent: ${selectedTheme.accent};
          }
        ` }} />
      </head>
      <body className="min-h-screen flex flex-col bg-transparent text-text-primary selection:bg-primary/30 selection:text-white relative transition-colors duration-1000">
        <script dangerouslySetInnerHTML={{ __html: `
          window.onerror = function(message, source, lineno, colno, error) {
            console.error("Global Luxe Exception caught:", message, error);
            return false;
          };
        ` }} />
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
        <GtmPageViewTracker />
        <ScrollProgress />
        <LuxeLoadingBar />
        <div className="film-grain opacity-20 mix-blend-overlay pointer-events-none" />
        <LanguageProvider>
        <AuthProvider>
        <CommerceProvider>
          <CinematicRevealWrapper>
            <DynamicLayoutWidgets />
            <Sidebar />
            <CartSidebar />
            
            <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative scroll-smooth pb-20 md:pb-0">
              <Navbar />
              <div className="flex-1 w-full relative z-10 animate-page-transition">
                {children}
              </div>
              <Footer />
            </main>
            <MobileNav />
          </CinematicRevealWrapper>
          
          <Analytics />
          <SpeedInsights />
                </CommerceProvider>
        </AuthProvider>
        </LanguageProvider>
        <Toaster position="top-center" toastOptions={{ style: { background: '#050508', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </body>
    </html>
  );
}

