import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle options preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests for verification
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { reference } = req.body || {};
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!reference || typeof reference !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Transaction reference is required.'
    });
  }

  if (!secretKey) {
    console.error('PAYSTACK_SECRET_KEY is missing from environment variables');
    return res.status(500).json({
      success: false,
      message: 'Payment system configuration error. Please contact support.'
    });
  }

  try {
    console.log(`Verifying Paystack transaction: ${reference}...`);
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10s timeout
      }
    );

    const paymentData = response.data.data;

    if (paymentData && paymentData.status === 'success') {
      console.log(`Payment verified successfully for ref: ${reference}`);
      return res.status(200).json({
        success: true,
        data: {
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          paid_at: paymentData.paid_at,
          customer: paymentData.customer
        }
      });
    } else {
      console.warn(`Payment verification failed for ref: ${reference}. Status: ${paymentData?.status}`);
      return res.status(400).json({
        success: false,
        message: `Payment verification failed: ${paymentData?.gateway_response || 'Unknown reason'}`
      });
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Paystack API error:', errorMessage);
    return res.status(502).json({
      success: false,
      message: 'Could not communicate with payment provider. Please try again.'
    });
  }
}
