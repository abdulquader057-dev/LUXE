import React from "react";
import Link from "next/link";

export const metadata = {
  title: "LUXE THREADS | Sizing Guide",
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

export default function SizingGuidePage() {
  return (
    <div className="pt-32 pb-24 min-h-screen px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="text-[11px] font-mono tracking-widest text-[#9E968A] hover:text-[#C9A962] transition-colors">
          ← BACK TO THE HOUSE
        </Link>
      </div>
      
      <h1 className="font-cormorant text-4xl font-light tracking-wide text-[#F5F0E8] mb-12">Sizing & Fit</h1>
      
      <div className="space-y-12 text-[#9E968A] font-light leading-relaxed text-sm">
        <section>
          <p className="mb-6">
            Our garments are tailored for a modern, slightly relaxed silhouette that emphasizes drape and breathability. 
            Use the measurements below to find your perfect fit.
          </p>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-6">Men's Tops (Shirts & Outerwear)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#C9A962]/20 text-[#F5F0E8] font-mono text-[11px] tracking-wider">
                  <th className="py-4 pr-4">SIZE</th>
                  <th className="py-4 px-4">CHEST (IN)</th>
                  <th className="py-4 px-4">SHOULDER (IN)</th>
                  <th className="py-4 pl-4">LENGTH (IN)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[12px]">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4 text-[#C9A962]">S</td>
                  <td className="py-4 px-4">38 - 40</td>
                  <td className="py-4 px-4">17.5</td>
                  <td className="py-4 pl-4">28</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4 text-[#C9A962]">M</td>
                  <td className="py-4 px-4">40 - 42</td>
                  <td className="py-4 px-4">18</td>
                  <td className="py-4 pl-4">29</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4 text-[#C9A962]">L</td>
                  <td className="py-4 px-4">42 - 44</td>
                  <td className="py-4 px-4">18.5</td>
                  <td className="py-4 pl-4">30</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4 text-[#C9A962]">XL</td>
                  <td className="py-4 px-4">44 - 46</td>
                  <td className="py-4 px-4">19</td>
                  <td className="py-4 pl-4">31</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-cormorant text-2xl text-[#C9A962] mb-4">How to Measure</h2>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the measuring tape horizontal.</li>
            <li><strong>Shoulder:</strong> Measure from the edge of one shoulder across the back to the edge of the other.</li>
            <li><strong>Length:</strong> Measure from the highest point of the shoulder down to the desired hemline.</li>
          </ul>
        </section>

        <section className="bg-[#16161A] p-6 border border-[#C9A962]/10">
          <p className="italic font-cormorant text-lg text-[#F5F0E8]">
            Need bespoke assistance? Contact our Atelier for personalized sizing recommendations.
          </p>
        </section>
      </div>
    </div>
  );
}
