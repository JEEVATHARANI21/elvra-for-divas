import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export const getCollections = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [collections] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM collections c
       LEFT JOIN products p ON c.id = p.collection_id AND p.is_active = 1
       WHERE c.is_active = 1
       GROUP BY c.id
       ORDER BY c.id ASC`
    );

    res.json({
      success: true,
      collections,
    });
  } catch (error: any) {
    console.error('getCollections error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve collections.' });
  }
};

export const getCollectionBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const [collections] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM collections WHERE slug = ? AND is_active = 1',
      [slug]
    );

    if (collections.length === 0) {
      res.status(404).json({ success: false, message: 'Collection not found.' });
      return;
    }

    const collection = collections[0];

    const [products] = await pool.query<RowDataPacket[]>(
      `SELECT 
        p.*,
        c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.collection_id = ? AND p.is_active = 1
       ORDER BY p.created_at DESC`,
      [collection.id]
    );

    res.json({
      success: true,
      collection: {
        ...collection,
        products,
      },
    });
  } catch (error: any) {
    console.error('getCollectionBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve collection.' });
  }
};
