import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Rajdhani, Sora, Orbitron, Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import "./design-system.css";
import ZyraChat from "@/components/ZyraChat";
import BackToTop from "@/components/BackToTop";
import Sidebar from "@/components/Sidebar";
import { CommerceProvider } from "@/lib/contexts/CommerceContext";
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

const outfit = Outfit({
  weight: ["400", "600"],
  variable: "--font-outfit",
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
      className={`${sora.variable} ${bebasNeue.variable} ${rajdhani.variable} ${orbitron.variable} ${cormorant.variable} ${outfit.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-bg-base text-text-primary selection:bg-primary/30 selection:text-white relative transition-colors duration-1000">
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('luxe-theme') || 'Noir Gold';
              var themes = {
                'Noir Gold': { bg: '#0D0A06', card: '#1A1408', text: '#F5E6C8', accent: '#D4AF37' },
                'Champagne': { bg: '#1C1410', card: '#2A1F0E', text: '#F5E6C8', accent: '#D4AF37' },
                'Deep Slate': { bg: '#0A0F1A', card: '#111827', text: '#E8E0D0', accent: '#D4AF37' },
                'Burgundy Luxe': { bg: '#0F0608', card: '#1A0A0E', text: '#F5E0E8', accent: '#D4AF37' },
                'Royal Obsidian': { bg: '#050308', card: '#0D0A14', text: '#EDE8FF', accent: '#D4AF37' },
                'Cognac': { bg: '#0F0800', card: '#1F1000', text: '#FFE8CC', accent: '#D4AF37' },
                'Midnight Rose': { bg: '#080510', card: '#100818', text: '#FFE8F0', accent: '#D4AF37' }
              };
              var selected = themes[theme] || themes['Noir Gold'];
              var root = document.documentElement;
              
              root.style.setProperty('--theme-bg', selected.bg);
              root.style.setProperty('--theme-card', selected.card);
              root.style.setProperty('--theme-text', selected.text);
              root.style.setProperty('--theme-accent', selected.accent);
              
              root.style.setProperty('--bg-void', selected.bg);
              root.style.setProperty('--bg-base', selected.bg);
              root.style.setProperty('--bg-surface', selected.card);
              root.style.setProperty('--bg-elevated', selected.card);
              root.style.setProperty('--text-primary', selected.text);
              
              root.style.setProperty('--primary-color', selected.accent);
              root.style.setProperty('--gold-accent', selected.accent);
              
              root.classList.add('theme-' + theme.toLowerCase().replace(/\\s+/g, '-'));
            } catch (e) {}
          })();
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
          
          <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative scroll-smooth">
            <Navbar />
            <div className="flex-1 w-full relative z-10 animate-page-transition">
              {children}
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

