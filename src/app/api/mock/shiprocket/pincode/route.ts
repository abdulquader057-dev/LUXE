import { NextResponse } from 'next/server';
import { ShiprocketPincodeResponse } from '@/lib/payments/types';

export async function POST(req: Request) {
  try {
    const { pincode } = await req.json();

    if (!pincode || pincode.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid pincode' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock logic: 999999 represents unserviceable
    if (pincode === '999999') {
      const response: ShiprocketPincodeResponse = {
        serviceable: false,
        message: "We do not deliver to this location yet."
      };
      return NextResponse.json(response);
    }

    // Mock successful response
    const response: ShiprocketPincodeResponse = {
      serviceable: true,
      estimatedDays: "3-4",
      cost: 0,
      currency: "INR",
      message: "Complimentary shipping across India"
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
