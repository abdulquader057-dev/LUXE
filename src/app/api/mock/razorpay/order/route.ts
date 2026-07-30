import { NextResponse } from 'next/server';
import { RazorpayOrder } from '@/lib/payments/types';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create realistic mock response
    const mockOrder: RazorpayOrder = {
      id: `order_mock_${Math.random().toString(36).substr(2, 9)}`,
      entity: 'order',
      amount: amount * 100, // paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: 'INR',
      receipt: `rcpt_${Math.random().toString(36).substr(2, 9)}`,
      status: 'created',
      attempts: 0,
      notes: {},
      created_at: Math.floor(Date.now() / 1000)
    };

    return NextResponse.json(mockOrder);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create mock order' },
      { status: 500 }
    );
  }
}
