"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Placeholder — wire to Supabase in v2
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer
      className="relative border-t py-20 pb-10"
      style={{
        background: 'rgba(10, 10, 12, 0.95)',
        backdropFilter: 'blur(10px)',
        borderColor: 'rgba(201, 169, 98, 0.08)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          {/* Column 1 — Brand */}
          <div>
            <h3
              className="font-cormorant text-2xl font-light uppercase mb-3"
              style={{ letterSpacing: '0.3em', color: '#F5F0E8' }}
            >
              LUXE THREADS<span style={{ color: '#C9A962' }}>.</span>
            </h3>
            <p
              className="text-[10px] uppercase mb-4"
              style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', color: '#6B655D' }}
            >
              Hyderabad · Est. 2026
            </p>
            <p
              className="text-[13px] font-light leading-relaxed"
              style={{ color: '#9E968A', maxWidth: '280px', lineHeight: 1.6 }}
            >
              Crafting affordable luxury for the bold generation.
            </p>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p
              className="text-[11px] font-medium uppercase mb-6"
              style={{ letterSpacing: '0.2em', color: '#C9A962' }}
            >
              Navigate
            </p>
            <div className="flex flex-col gap-4">
              {[
                { name: 'The House', href: '/' },
                { name: 'Boutique', href: '/shop' },
                { name: 'Atelier', href: '/ai-style' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[12px] font-normal transition-all duration-300 hover:translate-x-1"
                  style={{ letterSpacing: '0.1em', color: 'rgba(245, 240, 232, 0.4)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F0E8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 232, 0.4)')}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 — Support */}
          <div>
            <p
              className="text-[11px] font-medium uppercase mb-6"
              style={{ letterSpacing: '0.2em', color: '#C9A962' }}
            >
              Support
            </p>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Sizing Guide', href: '/sizing-guide' },
                { name: 'Shipping & Delivery', href: '/shipping-info' },
                { name: 'Returns & Exchanges', href: '/return-policy' },
                { name: 'Privacy & Security', href: '/privacy-policy' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[12px] font-normal transition-all duration-300 hover:translate-x-1"
                  style={{ letterSpacing: '0.1em', color: 'rgba(245, 240, 232, 0.4)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F0E8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 232, 0.4)')}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <p
              className="text-[11px] font-medium uppercase mb-6"
              style={{ letterSpacing: '0.2em', color: '#C9A962' }}
            >
              Join the Inner Circle
            </p>
            {subscribed ? (
              <p
                className="text-[14px] font-light italic font-cormorant"
                style={{ color: 'rgba(201, 169, 98, 0.7)' }}
              >
                Welcome to the inner circle.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="bg-transparent text-[14px] font-light py-2 outline-none transition-colors duration-300"
                  style={{
                    borderBottom: '1px solid rgba(245, 240, 232, 0.2)',
                    color: '#9E968A',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#C9A962')}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(245, 240, 232, 0.2)')}
                />
                <button
                  type="submit"
                  className="self-start text-[12px] font-medium uppercase transition-all duration-300"
                  style={{ letterSpacing: '0.15em', color: '#C9A962' }}
                  onMouseEnter={(e) => (e.currentTarget.style.letterSpacing = '0.2em')}
                  onMouseLeave={(e) => (e.currentTarget.style.letterSpacing = '0.15em')}
                >
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ borderTop: '1px solid rgba(201, 169, 98, 0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: '#4ADE80' }} />
            <span
              className="text-[10px] font-light"
              style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', color: 'rgba(158, 150, 138, 0.3)' }}
            >
              Node: DXB-01 · Status: Online
            </span>
          </div>
          <p className="text-[10px] font-normal" style={{ color: 'rgba(158, 150, 138, 0.25)' }}>
            © {new Date().getFullYear()} LUXE THREADS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:abdulquader057@gmail.com"
              className="text-[10px] transition-colors duration-300"
              style={{ color: 'rgba(158, 150, 138, 0.3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F0E8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(158, 150, 138, 0.3)')}
            >
              Support
            </a>
            <a
              href="https://wa.me/917337246297"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] transition-colors duration-300"
              style={{ color: 'rgba(158, 150, 138, 0.3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F0E8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(158, 150, 138, 0.3)')}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
