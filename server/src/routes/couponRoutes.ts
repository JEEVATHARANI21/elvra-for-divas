import { Router } from 'express';
import { applyCoupon } from '../controllers/couponController';

const router = Router();

router.post('/apply', applyCoupon);

export default router;
