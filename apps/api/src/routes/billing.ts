import { Router } from 'express';
import Razorpay from 'razorpay';

const router = Router();

// Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || 'mock_key',
//   key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret'
// });

router.post('/checkout', async (req, res) => {
  // Mock order creation for now
  res.json({
    success: true,
    data: {
      orderId: 'order_mock_123',
      amount: 1500,
      currency: 'USD'
    }
  });
});

router.post('/webhook', (req, res) => {
  // TODO: Verify Razorpay webhook signature
  console.log('Razorpay webhook received');
  res.json({ status: 'ok' });
});

export default router;
