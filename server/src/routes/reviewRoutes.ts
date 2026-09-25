import { Router } from 'express';
import { addReview } from '../controllers/reviewController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, addReview);

export default router;
