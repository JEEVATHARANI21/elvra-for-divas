import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { razorpayService, isRazorpayLiveConfigured } from '../services/razorpay.service';
import { orderService } from '../services/order.service';
import { inventoryService } from '../services/inventory.service';
import { couponService } from '../services/coupon.service';
import { ENV } from '../config/env';

export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user?.id || null;
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      cartItems,
      items, // support both payload formats
      couponCode,
      notes,
    } = req.body;

    const rawItems = cartItems || items;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !rawItems || rawItems.length === 0) {
      res.status(400).json({ success: false, message: 'Missing required customer or bag details.' });
      return;
    }

    // 1. Authoritative Server-side Price & Stock Calculation (Never trust client prices)
    const calculation = await orderService.calculateOrder(
      rawItems.map((i: any) => ({
        variantId: i.variantId || i.product_variant_id,
        quantity: i.quantity,
      })),
      couponCode,
      connection
    );

    // 2. Generate unique order reference (e.g. ELV-10245)
    const orderNumber = 'ELV-' + Math.floor(10000 + Math.random() * 90000);

    // 3. Insert local order into MySQL with 'pending' status before payment
    const [orderResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO orders 
        (order_number, user_id, customer_name, customer_email, customer_phone, shipping_address,
         subtotal, discount_amount, shipping_amount, tax_amount, total_amount, coupon_code,
         payment_status, order_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)`,
      [
        orderNumber,
        userId,
        customerName.trim(),
        customerEmail.trim(),
        customerPhone.trim(),
        JSON.stringify(shippingAddress),
        calculation.subtotal,
        calculation.discountAmount,
        calculation.shippingAmount,
        calculation.taxAmount,
        calculation.totalAmount,
        calculation.couponCode || null,
        notes || null,
      ]
    );

    const orderId = orderResult.insertId;

    // 4. Insert order items
    for (const item of calculation.items) {
      await connection.query(
        `INSERT INTO order_items 
          (order_id, product_id, variant_id, product_name, sku, size, color, quantity, unit_price, total_price, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productId,
          item.variantId,
          item.productName,
          item.sku,
          item.size,
          item.color,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
          item.imageUrl || null,
        ]
      );
    }

    // 5. Create Razorpay Order via Official Orders API (Amount in smallest unit: paise)
    const amountInPaise = Math.round(calculation.totalAmount * 100);
    const rzpOrder = await razorpayService.createOrder(amountInPaise, orderNumber, {
      orderNumber,
      customerEmail: customerEmail.trim(),
    });

    const razorpayOrderId = rzpOrder.id;

    // 6. Record initial payment record in payments table
    await connection.query(
      `INSERT INTO payments (order_id, razorpay_order_id, amount, currency, status)
       VALUES (?, ?, ?, 'INR', 'created')`,
      [orderId, razorpayOrderId, calculation.totalAmount]
    );

    await connection.commit();

    res.json({
      success: true,
      order: {
        id: orderId,
        orderNumber,
        subtotal: calculation.subtotal,
        discountAmount: calculation.discountAmount,
        shippingAmount: calculation.shippingAmount,
        taxAmount: calculation.taxAmount,
        totalAmount: calculation.totalAmount,
      },
      payment: {
        razorpayOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: ENV.RAZORPAY_KEY_ID,
        isSandboxMode: !isRazorpayLiveConfigured,
      },
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('createPaymentOrder error:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment initiation failed.' });
  } finally {
    connection.release();
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_number,
      payment_method = 'upi',
      cart_id,
    } = req.body;

    if (!razorpay_order_id || !order_number) {
      res.status(400).json({ success: false, message: 'Missing payment signature verification parameters.' });
      return;
    }

    // 1. Mandatory server-side HMAC-SHA256 signature verification
    const isValid = razorpayService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id || '',
      razorpay_signature || ''
    );

    if (!isValid) {
      await connection.query(
        'UPDATE payments SET status = "failed" WHERE razorpay_order_id = ?',
        [razorpay_order_id]
      );
      await connection.query(
        'UPDATE orders SET payment_status = "failed", order_status = "cancelled" WHERE order_number = ?',
        [order_number]
      );
      await connection.commit();
      res.status(400).json({ success: false, message: 'Invalid payment signature. Verification rejected.' });
      return;
    }

    // 2. Fetch Order
    const [orders] = await connection.query<RowDataPacket[]>(
      'SELECT id, user_id, coupon_code FROM orders WHERE order_number = ?',
      [order_number]
    );

    if (orders.length === 0) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const order = orders[0];

    // 3. Mark Payment Captured & Paid
    await connection.query(
      `UPDATE payments 
       SET razorpay_payment_id = ?, razorpay_signature = ?, status = 'captured', payment_method = ?
       WHERE razorpay_order_id = ?`,
      [razorpay_payment_id, razorpay_signature, payment_method, razorpay_order_id]
    );

    // 4. Update Order Status to Confirmed & Paid
    await connection.query(
      `UPDATE orders 
       SET payment_status = 'paid', order_status = 'confirmed'
       WHERE id = ?`,
      [order.id]
    );

    // 5. Reduce Inventory and log movement history with reason 'sale'
    const [items] = await connection.query<RowDataPacket[]>(
      'SELECT variant_id, quantity FROM order_items WHERE order_id = ?',
      [order.id]
    );

    for (const item of items) {
      if (item.variant_id) {
        await inventoryService.recordMovement(
          connection,
          item.variant_id,
          -item.quantity,
          'sale',
          order.id,
          `Sale order #${order_number}`
        );
      }
    }

    // 6. Record coupon usage if applied
    if (order.coupon_code) {
      const [coupons] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM coupons WHERE code = ?',
        [order.coupon_code]
      );
      if (coupons.length > 0) {
        await couponService.recordUsage(connection, coupons[0].id, order.id, order.user_id);
      }
    }

    // 7. Clear cart items
    if (cart_id) {
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cart_id]);
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Payment verified and order confirmed!',
      orderNumber: order_number,
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('verifyPayment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed.' });
  } finally {
    connection.release();
  }
};

// Razorpay Webhook Handler for Asynchronous Confirmation & Idempotency
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    if (isRazorpayLiveConfigured && signature) {
      const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
        return;
      }
    }

    const event = req.body;
    const eventId = event.event_id || event.id || `evt_${Date.now()}`;
    const eventType = event.event;

    // Idempotency check in payment_webhooks table
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM payment_webhooks WHERE event_id = ?',
      [eventId]
    );

    if (existing.length > 0) {
      // Already processed this webhook event
      res.json({ status: 'ok', message: 'Event already processed (idempotent).' });
      return;
    }

    // Log the webhook
    await pool.query(
      'INSERT INTO payment_webhooks (event_id, event_type, payload, processed) VALUES (?, ?, ?, 1)',
      [eventId, eventType, JSON.stringify(event)]
    );

    // Process event types
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const rzpOrderId = event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id;
      if (rzpOrderId) {
        await pool.query(
          `UPDATE payments SET status = 'captured' WHERE razorpay_order_id = ?`,
          [rzpOrderId]
        );
        await pool.query(
          `UPDATE orders SET payment_status = 'paid', order_status = 'confirmed'
           WHERE id = (SELECT order_id FROM payments WHERE razorpay_order_id = ? LIMIT 1)`,
          [rzpOrderId]
        );
      }
    }

    res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
