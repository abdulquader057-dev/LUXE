import type { NextApiRequest, NextApiResponse } from 'next';

// Mock payment verification. In production, integrate with payment gateway.
async function verifyPayment(paymentId: string): Promise<boolean> {
  // Placeholder: assume any non‑empty paymentId is valid
  return !!paymentId;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, tier, paymentId } = req.body;
  if (!userId || !tier || !paymentId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isValid = await verifyPayment(paymentId);
  if (!isValid) {
    return res.status(402).json({ error: 'Payment verification failed' });
  }

  // Here you would update the user's premium tier in your database.
  // For now we mock a successful update.
  console.log(`Granting ${tier} tier to user ${userId}`);

  return res.status(200).json({ success: true, tier });
}
