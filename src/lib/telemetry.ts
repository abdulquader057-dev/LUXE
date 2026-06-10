"use client";

import { track as trackVercel } from "@vercel/analytics";

export interface TelemetryEvents {
  product_viewed: { product_id: string; name: string; price: number };
  cart_added: { product_id: string; name: string; price: number; quantity: number };
  checkout_started: { cart_total: number; items_count: number };
  purchase_initiated: { order_id: string; amount: number; payment_method: string };
  purchase_success: { order_id: string; payment_id: string; amount: number };
  payment_failed: { order_id: string; amount: number; reason: string; stage: string; timestamp?: string };
  drop_unlocked: { product_id: string; required_level: number; current_level: number };
  level_up: { old_level: number; new_level: number; current_xp: number };
}

export const telemetry = {
  track<K extends keyof TelemetryEvents>(event: K, properties: TelemetryEvents[K]) {
    // 1. Log to console in development mode
    if (process.env.NODE_ENV === "development") {
      console.log(`[Telemetry Event] ${event}:`, properties);
    }

    // 2. Track with Vercel Analytics
    try {
      trackVercel(event, properties as any);
    } catch (e) {
      console.warn("Vercel Analytics track error:", e);
    }

    // 3. Track with Google Tag Manager Data Layer & PostHog Client
    if (typeof window !== "undefined") {
      const win = window as any;
      win.dataLayer = win.dataLayer || [];
      win.dataLayer.push({
        event,
        ...properties,
      });

      if (win.posthog) {
        try {
          win.posthog.capture(event, properties);
        } catch (phError) {
          console.warn("PostHog event dispatch failed:", phError);
        }
      }
    }
  }
};
