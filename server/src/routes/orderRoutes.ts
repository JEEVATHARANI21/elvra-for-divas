import { Router } from 'express';
import { previewOrder, getUserOrders, getOrderDetail, trackOrder, cancelOrder } from '../controllers/orderController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/preview', optionalAuth, previewOrder);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/track', trackOrder);
router.get('/:orderNumber', optionalAuth, getOrderDetail);
router.post('/:id/cancel', authenticateToken, cancelOrder);

export default router;
