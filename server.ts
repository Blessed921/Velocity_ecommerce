import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Paystack verification route
  app.post('/api/verify-payment', async (req, res) => {
    const { reference } = req.body;
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
        res.json({ 
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
        res.status(400).json({ 
          success: false, 
          message: `Payment verification failed: ${paymentData?.gateway_response || 'Unknown reason'}` 
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Paystack API error:', errorMessage);
      res.status(502).json({ 
        success: false, 
        message: 'Could not communicate with payment provider. Please try again.' 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
