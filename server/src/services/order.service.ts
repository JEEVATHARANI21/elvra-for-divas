import { RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import { pool } from '../config/database';
import { couponService } from './coupon.service';

export interface OrderItemInput {
  variantId: number;
  quantity: number;
}

export interface ValidatedItem {
  productId: number;
  variantId: number;
  productName: string;
  sku: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface OrderCalculationResult {
  items: ValidatedItem[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  couponId?: number;
  freeShippingThreshold: number;
}

export const orderService = {
  async calculateOrder(
    rawItems: OrderItemInput[],
    couponCode?: string,
    conn?: PoolConnection
  ): Promise<OrderCalculationResult> {
    const db = conn || pool;

    if (!rawItems || rawItems.length === 0) {
      throw new Error('Bag contains no valid items.');
    }

    let subtotal = 0;
    const validatedItems: ValidatedItem[] = [];

    // 1. Authoritative DB fetch of prices and stock (Never trust frontend price)
    for (const raw of rawItems) {
      const qty = Number(raw.quantity);
      if (qty <= 0) continue;

      const [variants] = await db.query<RowDataPacket[]>(
        `SELECT pv.id as variant_id, pv.sku, pv.color_name, pv.size_label, pv.stock_quantity,
                pv.price_override, p.id as product_id, p.title as product_title, p.base_price, p.discount_price,
                (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as image_url
         FROM product_variants pv
         JOIN products p ON pv.product_id = p.id
         WHERE pv.id = ? AND p.is_active = 1`,
        [raw.variantId]
      );

      if (variants.length === 0) {
        throw new Error(`Product variant ID ${raw.variantId} was not found or is discontinued.`);
      }

      const v = variants[0];

      if (v.stock_quantity < qty) {
        throw new Error(
          `Only ${v.stock_quantity} units available for "${v.product_title} (${v.color_name} - ${v.size_label})".`
        );
      }

      const unitPrice = Number(v.price_override || v.discount_price || v.base_price);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      validatedItems.push({
        productId: v.product_id,
        variantId: v.variant_id,
        productName: v.product_title,
        sku: v.sku,
        size: v.size_label,
        color: v.color_name,
        unitPrice,
        quantity: qty,
        totalPrice: lineTotal,
        imageUrl: v.image_url,
      });
    }

    // 2. Fetch Store Settings for Shipping & Tax
    const [settingsRows] = await db.query<RowDataPacket[]>(
      'SELECT `key`, `value` FROM settings WHERE `key` IN ("free_shipping_threshold", "shipping_charge", "tax_enabled", "tax_percentage")'
    );
    let freeShippingThreshold = 999;
    let shippingCharge = 50;
    let taxEnabled = false;
    let taxPercentage = 0;

    settingsRows.forEach((row) => {
      if (row.key === 'free_shipping_threshold') freeShippingThreshold = Number(row.value);
      if (row.key === 'shipping_charge') shippingCharge = Number(row.value);
      if (row.key === 'tax_enabled') taxEnabled = row.value === 'true';
      if (row.key === 'tax_percentage') taxPercentage = Number(row.value);
    });

    // 3. Discount calculation
    let discountAmount = 0;
    let validCouponId: number | undefined;

    if (couponCode) {
      const couponRes = await couponService.validate(couponCode, subtotal, conn);
      if (couponRes.isValid) {
        discountAmount = couponRes.discountAmount;
        validCouponId = couponRes.couponId;
      }
    }

    // 4. Shipping calculation
    const shippingAmount = subtotal >= freeShippingThreshold ? 0 : shippingCharge;

    // 5. Tax calculation (if enabled)
    let taxAmount = 0;
    if (taxEnabled && taxPercentage > 0) {
      taxAmount = Math.round(((subtotal - discountAmount) * taxPercentage) / 100);
    }

    // 6. Final Amount
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingAmount + taxAmount);

    return {
      items: validatedItems,
      subtotal,
      discountAmount,
      shippingAmount,
      taxAmount,
      totalAmount,
      couponCode: discountAmount > 0 ? couponCode : undefined,
      couponId: validCouponId,
      freeShippingThreshold,
    };
  },
};
