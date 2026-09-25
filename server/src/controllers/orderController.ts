import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { orderService } from '../services/order.service';

export const previewOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cartItems, couponCode } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ success: false, message: 'Bag contains no items to calculate.' });
      return;
    }

    const calculation = await orderService.calculateOrder(
      cartItems.map((i: any) => ({
        variantId: i.variantId || i.product_variant_id,
        quantity: i.quantity,
      })),
      couponCode
    );

    res.json({
      success: true,
      calculation,
    });
  } catch (error: any) {
    console.error('previewOrder error:', error);
    res.status(400).json({ success: false, message: error.message || 'Order preview calculation failed.' });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT 
        o.id, o.order_number, o.created_at, o.order_status, o.payment_status,
        o.total_amount, o.discount_amount, o.shipping_amount, o.tax_amount,
        p.payment_method
       FROM orders o
       LEFT JOIN payments p ON o.id = p.order_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await pool.query<RowDataPacket[]>(
        `SELECT product_name, sku, color, size, unit_price, quantity, total_price, image_url 
         FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
      order.status = order.order_status;
    }

    res.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('getUserOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

export const getOrderDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderNumber } = req.params;

    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT 
        o.*,
        p.razorpay_order_id, p.razorpay_payment_id, p.status as payment_record_status, p.payment_method
       FROM orders o
       LEFT JOIN payments p ON o.id = p.order_id
       WHERE o.order_number = ?`,
      [orderNumber]
    );

    if (orders.length === 0) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const order = orders[0];
    order.status = order.order_status;

    if (req.user && order.user_id && order.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    const [items] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    );
    order.items = items;

    res.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('getOrderDetail error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve order details.' });
  }
};

export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const [orders] = await pool.query<RowDataPacket[]>(
      'SELECT id, order_status, payment_status FROM orders WHERE id = ? AND (user_id = ? OR ? = "admin")',
      [id, userId, req.user?.role]
    );

    if (orders.length === 0) {
      res.status(404).json({ success: false, message: 'Order not found or access denied.' });
      return;
    }

    const order = orders[0];
    if (order.order_status === 'shipped' || order.order_status === 'delivered') {
      res.status(400).json({ success: false, message: 'Orders already dispatched cannot be cancelled.' });
      return;
    }

    await pool.query('UPDATE orders SET order_status = "cancelled" WHERE id = ?', [id]);

    res.json({ success: true, message: 'Order has been cancelled successfully.' });
  } catch (error: any) {
    console.error('cancelOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order.' });
  }
};

export const trackOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderNumber, emailOrPhone } = req.query;

    if (!orderNumber || !emailOrPhone) {
      res.status(400).json({ success: false, message: 'Order number and email/phone are required.' });
      return;
    }

    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT order_number, customer_name, order_status as status, tracking_number, tracking_carrier, created_at, updated_at
       FROM orders 
       WHERE order_number = ? AND (customer_email = ? OR customer_phone = ?)`,
      [orderNumber, emailOrPhone, emailOrPhone]
    );

    if (orders.length === 0) {
      res.status(404).json({ success: false, message: 'No matching order found.' });
      return;
    }

    res.json({
      success: true,
      order: orders[0],
    });
  } catch (error: any) {
    console.error('trackOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to track order.' });
  }
};
