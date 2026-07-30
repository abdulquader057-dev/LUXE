import React from "react";
import Link from "next/link";

export const metadata = {
  title: "LUXE THREADS | Return Policy",
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

export default function ReturnPolicyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen px-6 max-w-3xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="text-[11px] font-mono tracking-widest text-[#9E968A] hover:text-[#C9A962] transition-colors">
          ← BACK TO THE HOUSE
        </Link>
      </div>
      
      <h1 className="font-cormorant text-4xl font-light tracking-wide text-[#F5F0E8] mb-12">Returns & Exchanges</h1>
      
      <div className="space-y-8 text-[#9E968A] font-light leading-relaxed text-sm">
        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Our Philosophy</h2>
          <p>
            At LUXE THREADS, we believe in the absolute quality of our garments. If your ensemble does not perfectly match your expectations, we offer a seamless 14-day return and exchange policy from the date of delivery.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Conditions for Return</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Garments must be unworn, unwashed, and in their original pristine condition.</li>
            <li>All original tags, including the LUXE authentication seal, must be fully attached.</li>
            <li>The original packaging, including the ribbon and presentation box, must be included.</li>
            <li>Fragrances, bespoke tailoring, and intimate wear are strictly non-refundable.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">The Process</h2>
          <p>
            To initiate a return, simply contact our Atelier support team via email. A dedicated concierge will arrange a complimentary pickup from your address within Hyderabad, or provide a prepaid shipping label for the rest of India.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Refunds</h2>
          <p>
            Once our quality assurance team inspects and approves the returned garment, your refund will be processed to the original payment method within 5-7 business days. 
          </p>
        </section>
      </div>
    </div>
  );
}
