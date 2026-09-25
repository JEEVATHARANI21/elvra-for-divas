import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file uploaded.' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
    });
  }
);

export default router;
