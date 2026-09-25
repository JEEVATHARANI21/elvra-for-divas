import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, reviewerName, rating, fitRating, comfortRating, reviewText } = req.body;
    const userId = req.user?.id || null;

    if (!productId || !reviewerName || !rating || !reviewText) {
      res.status(400).json({ success: false, message: 'Missing required review fields.' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO reviews (product_id, user_id, reviewer_name, rating, fit_rating, comfort_rating, review_text, is_approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [productId, userId, reviewerName.trim(), rating, fitRating || 'perfect', comfortRating || 5, reviewText.trim()]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your review is published.',
      reviewId: result.insertId,
    });
  } catch (error: any) {
    console.error('addReview error:', error);
    res.status(500).json({ success: false, message: 'Failed to post review.' });
  }
};
