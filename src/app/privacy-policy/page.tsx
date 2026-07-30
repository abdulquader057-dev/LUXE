import React from "react";
import Link from "next/link";

export const metadata = {
  title: "LUXE THREADS | Privacy Policy",
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

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen px-6 max-w-3xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="text-[11px] font-mono tracking-widest text-[#9E968A] hover:text-[#C9A962] transition-colors">
          ← BACK TO THE HOUSE
        </Link>
      </div>
      
      <h1 className="font-cormorant text-4xl font-light tracking-wide text-[#F5F0E8] mb-12">Privacy & Security</h1>
      
      <div className="space-y-8 text-[#9E968A] font-light leading-relaxed text-sm">
        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Our Commitment</h2>
          <p>
            At LUXE THREADS, discretion is a cornerstone of our brand. We treat your personal data with the same uncompromising care as we do our garments. This policy outlines how we collect, protect, and utilize your information to enhance your bespoke shopping experience.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Information Architecture</h2>
          <p>
            When you join the Inner Circle, purchase an ensemble, or interact with our digital flagship, we may collect:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Contact details (Name, Email, Delivery Address, Mobile Number)</li>
            <li>Sizing profiles and purchase history for personalized curation</li>
            <li>Encrypted payment tokens (we do not store your raw credit card data)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Data Utilization</h2>
          <p>
            Your data is strictly utilized to facilitate seamless transactions, deliver your orders securely, and provide highly personalized styling recommendations. We will never sell your profile to third-party data brokers.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Digital Security (Obsidian Core)</h2>
          <p>
            All transactions and data transfers are protected by military-grade SSL encryption. Our payment gateways (Razorpay/Stripe) are PCI-DSS compliant, ensuring that your financial information remains impenetrable.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">Your Rights</h2>
          <p>
            You retain full sovereignty over your digital footprint. At any point, you may request to view, modify, or permanently delete your profile from the LUXE THREADS ecosystem by contacting our Atelier.
          </p>
        </section>
      </div>
    </div>
  );
}
