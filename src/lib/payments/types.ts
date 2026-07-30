export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: Record<string, string>;
}

export interface ShiprocketPincodeResponse {
  serviceable: boolean;
  estimatedDays?: string;
  cost?: number;
  currency?: string;
  message?: string;
}
