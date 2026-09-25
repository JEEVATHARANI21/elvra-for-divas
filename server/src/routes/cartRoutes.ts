import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cartController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeCartItem);

export default router;
