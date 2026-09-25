import { Router } from 'express';
import { getStoreSettings } from '../controllers/settingsController';

const router = Router();

router.get('/', getStoreSettings);

export default router;
