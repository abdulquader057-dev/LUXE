// src/components/seo/Seo.tsx
import Head from "next/head";

interface SeoProps {
  title?: string;
  description?: string;
}

export default function Seo({ 
  title = "LUXE — Luxury Redefined", 
  description = "Affordable luxury fashion for the bold generation" 
}: SeoProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/hero/mobile.jpg" />
      <meta property="og:type" content="website" />
    </Head>
  );
}
