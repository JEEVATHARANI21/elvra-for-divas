import { Router } from 'express';
import { createPaymentOrder, verifyPayment, handleWebhook } from '../controllers/paymentController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/create-order', optionalAuth, createPaymentOrder);
router.post('/verify', optionalAuth, verifyPayment);
router.post('/webhook', handleWebhook);

export default router;
