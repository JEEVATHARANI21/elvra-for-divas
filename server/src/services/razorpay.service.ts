import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ENV } from '../config/env';

export const isRazorpayLiveConfigured =
  ENV.RAZORPAY_KEY_ID &&
  ENV.RAZORPAY_KEY_SECRET &&
  !ENV.RAZORPAY_KEY_ID.includes('placeholder') &&
  !ENV.RAZORPAY_KEY_SECRET.includes('placeholder');

export const razorpayClient = isRazorpayLiveConfigured
  ? new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    })
  : null;

export const razorpayService = {
  async createOrder(amountInPaise: number, receipt: string, notes?: Record<string, string>) {
    if (isRazorpayLiveConfigured && razorpayClient) {
      return await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: notes || {},
      });
    }

    // High-fidelity sandbox order generation for immediate local testing
    return {
      id: `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      status: 'created',
    };
  },

  verifySignature(serverOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean {
    if (!isRazorpayLiveConfigured) {
      // Sandbox test accepts simulated signature
      return true;
    }
    const hmac = crypto.createHmac('sha256', ENV.RAZORPAY_KEY_SECRET);
    hmac.update(`${serverOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === razorpaySignature;
  },

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!isRazorpayLiveConfigured) return true;
    const hmac = crypto.createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET);
    hmac.update(rawBody);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  },
};
