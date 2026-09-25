import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export const getStoreSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [settingsRows] = await pool.query<RowDataPacket[]>('SELECT `key`, `value` FROM settings');
    const [banners] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC'
    );

    const settings: Record<string, string> = {};
    settingsRows.forEach((row) => {
      settings[row.key] = row.value;
    });

    res.json({
      success: true,
      settings,
      banners,
    });
  } catch (error: any) {
    console.error('getStoreSettings error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve settings.' });
  }
};
