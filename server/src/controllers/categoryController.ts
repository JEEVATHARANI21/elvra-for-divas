import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [categories] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
       WHERE c.is_active = 1
       GROUP BY c.id
       ORDER BY c.display_order ASC, c.name ASC`
    );

    res.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve categories.' });
  }
};
