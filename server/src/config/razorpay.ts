import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

export const isRazorpayConfigured =
  keyId &&
  keySecret &&
  !keyId.includes('placeholder') &&
  !keySecret.includes('placeholder');

export const razorpayInstance = isRazorpayConfigured
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  : null;
