import { Router } from 'express';
import {
  getAdminStats,
  getAdminProducts,
  createProduct,
  getAdminOrders,
  updateOrderStatus,
  adjustInventory,
  getInventoryLog,
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.get('/orders', getAdminOrders);
router.put('/orders/:orderId/status', updateOrderStatus);
router.post('/inventory/adjust', adjustInventory);
router.get('/inventory', getInventoryLog);

export default router;
