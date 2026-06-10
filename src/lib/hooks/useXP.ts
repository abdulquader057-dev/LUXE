'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';

export type XPEventType =
  | 'product_view'
  | 'swipe_right'
  | 'purchase'
  | 'share'
  | 'wishlist_add'
  | 'review_written';

const XP_LABELS: Record<XPEventType, { amount: number; message: string }> = {
  product_view:   { amount: 5,  message: '+5 XP — Style Eye' },
  swipe_right:    { amount: 10, message: '+10 XP — Taste Curator' },
  purchase:       { amount: 50, message: '+50 XP — LUXE Member' },
  share:          { amount: 15, message: '+15 XP — Trendsetter' },
  wishlist_add:   { amount: 8,  message: '+8 XP — Style Collector' },
  review_written: { amount: 25, message: '+25 XP — Voice of LUXE' },
};

export function useXP() {
  const awardXP = useCallback(async (eventType: XPEventType) => {
    try {
      const res = await fetch('/api/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType }),
      });

      if (!res.ok) return null;

      const data = await res.json();

      // Show toast notification
      const label = XP_LABELS[eventType];
      toast(label.message, {
        icon: '⚡',
        style: {
          background: 'rgba(26, 26, 38, 0.95)',
          border: '1px solid rgba(201, 168, 76, 0.3)',
          color: '#C9A84C',
          fontSize: '11px',
          letterSpacing: '0.1em',
          fontFamily: 'var(--font-sora)',
          backdropFilter: 'blur(20px)',
          borderRadius: '8px',
        },
        duration: 2000,
      });

      if (data.leveledUp) {
        setTimeout(() => {
          toast(`🏆 Level Up! You reached Level ${data.newLevel}`, {
            style: {
              background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(232,201,122,0.1))',
              border: '1px solid rgba(201,168,76,0.5)',
              color: '#E8C97A',
              fontSize: '12px',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-orbitron)',
              backdropFilter: 'blur(20px)',
              borderRadius: '8px',
            },
            duration: 4000,
          });
        }, 500);
      }

      return data;
    } catch (err) {
      console.error('XP award failed:', err);
      return null;
    }
  }, []);

  return { awardXP };
}
