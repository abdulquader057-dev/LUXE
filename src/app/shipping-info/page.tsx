import React from "react";
import Link from "next/link";

export const metadata = {
  title: "LUXE THREADS | Shipping Information",
  description: "Affordable luxury fashion crafted from premium breathable fabrics. Designed for the bold generation of Hyderabad.",
  openGraph: {
    title: "LUXE THREADS",
    description: "Premium Indian Fashion. Hyderabad · Est. 2026.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXE THREADS",
    description: "Premium Indian Fashion. Hyderabad · Est. 2026.",
    images: ["/og-image.jpg"],
  },
};

export default function ShippingInfoPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen px-6 max-w-3xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="text-[11px] font-mono tracking-widest text-[#9E968A] hover:text-[#C9A962] transition-colors">
          ← BACK TO THE HOUSE
        </Link>
      </div>
      
      <h1 className="font-cormorant text-4xl font-light tracking-wide text-[#F5F0E8] mb-12">Shipping & Delivery</h1>
      
      <div className="space-y-8 text-[#9E968A] font-light leading-relaxed text-sm">
        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Domestic Dispatch (India)</h2>
          <p>
            Every LUXE THREADS garment is meticulously prepared and dispatched from our Hyderabad Atelier. 
            We offer complimentary express shipping on all domestic ensembles. Deliveries typically arrive within 
            3-5 business days from the moment your order is confirmed.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">The Hyderabad Concierge</h2>
          <p>
            For our local patrons within Hyderabad, we offer a specialized same-day or next-day white-glove delivery service. 
            A dedicated concierge will hand-deliver your signature black box directly to your residence.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Tracking Your Ensemble</h2>
          <p>
            Upon dispatch, you will receive an encrypted digital receipt containing a unique tracking identifier. 
            You may follow your garment's journey in real-time through our logistics partner portal.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Packaging & Presentation</h2>
          <p>
            True luxury begins before the garment is worn. Your order will arrive securely encased in our signature, 
            climate-resistant packaging, complete with a wax-sealed envelope and personalized note from the founder. 
            Please ensure you or an authorized representative is available to sign for the delivery.
          </p>
        </section>
      </div>
    </div>
  );
}
