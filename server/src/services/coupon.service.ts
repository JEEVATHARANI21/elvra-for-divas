import { RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import { pool } from '../config/database';

export interface CouponValidationResult {
  isValid: boolean;
  couponId?: number;
  code?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount: number;
  message?: string;
}

export const couponService = {
  async validate(code: string, subtotal: number, conn?: PoolConnection): Promise<CouponValidationResult> {
    const db = conn || pool;
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM coupons 
       WHERE code = ? AND is_active = 1
       AND (start_date IS NULL OR start_date <= NOW())
       AND (end_date IS NULL OR end_date >= NOW())`,
      [code.trim().toUpperCase()]
    );

    if (rows.length === 0) {
      return { isValid: false, discountAmount: 0, message: 'Invalid or expired promotional code.' };
    }

    const coupon = rows[0];

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { isValid: false, discountAmount: 0, message: 'Coupon usage limit has been reached.' };
    }

    if (coupon.minimum_order_amount && subtotal < Number(coupon.minimum_order_amount)) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Minimum bag value of ₹${coupon.minimum_order_amount} required to use ${coupon.code}.`,
      };
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * Number(coupon.discount_value)) / 100;
      if (coupon.maximum_discount_amount && discount > Number(coupon.maximum_discount_amount)) {
        discount = Number(coupon.maximum_discount_amount);
      }
    } else {
      discount = Number(coupon.discount_value);
    }

    discount = Math.min(discount, subtotal);

    return {
      isValid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: Number(coupon.discount_value),
      discountAmount: discount,
      message: `Coupon ${coupon.code} applied! Saved ₹${discount}`,
    };
  },

  async recordUsage(connection: PoolConnection, couponId: number, orderId: number, userId?: number | null) {
    await connection.query(
      'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
      [couponId]
    );
    await connection.query(
      'INSERT INTO coupon_usages (coupon_id, user_id, order_id) VALUES (?, ?, ?)',
      [couponId, userId || null, orderId]
    );
  },
};
