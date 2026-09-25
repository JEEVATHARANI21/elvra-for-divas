import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export const applyCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || orderAmount === undefined) {
      res.status(400).json({ success: false, message: 'Coupon code and order amount are required.' });
      return;
    }

    const [coupons] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM coupons 
       WHERE code = ? AND is_active = 1 
       AND (valid_from IS NULL OR valid_from <= NOW())
       AND (valid_to IS NULL OR valid_to >= NOW())`,
      [code.trim().toUpperCase()]
    );

    if (coupons.length === 0) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
      return;
    }

    const coupon = coupons[0];

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      res.status(400).json({ success: false, message: 'Coupon usage limit reached.' });
      return;
    }

    const subtotal = Number(orderAmount);
    if (coupon.min_order_amount && subtotal < Number(coupon.min_order_amount)) {
      res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.min_order_amount} required to use coupon ${coupon.code}.`,
      });
      return;
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * Number(coupon.discount_value)) / 100;
      if (coupon.max_discount_amount && discount > Number(coupon.max_discount_amount)) {
        discount = Number(coupon.max_discount_amount);
      }
    } else {
      discount = Number(coupon.discount_value);
    }

    discount = Math.min(discount, subtotal);

    res.json({
      success: true,
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        discountAmount: discount,
      },
    });
  } catch (error: any) {
    console.error('applyCoupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to apply coupon.' });
  }
};
