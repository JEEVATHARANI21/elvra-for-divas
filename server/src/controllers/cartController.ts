import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

// Helper to get or create cart
async function getOrCreateCart(userId?: number, sessionId?: string): Promise<number> {
  if (userId) {
    const [userCarts] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM carts WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [userId]
    );
    if (userCarts.length > 0) {
      return userCarts[0].id;
    }
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );
    return result.insertId;
  } else if (sessionId) {
    const [sessionCarts] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM carts WHERE session_id = ? ORDER BY id DESC LIMIT 1',
      [sessionId]
    );
    if (sessionCarts.length > 0) {
      return sessionCarts[0].id;
    }
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO carts (session_id) VALUES (?)',
      [sessionId]
    );
    return result.insertId;
  }
  throw new Error('Either userId or sessionId is required to access cart.');
}

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const sessionId = (req.query.sessionId as string) || (req.headers['x-session-id'] as string);

    if (!userId && !sessionId) {
      res.json({ success: true, cart: { items: [], subtotal: 0, count: 0 } });
      return;
    }

    const cartId = await getOrCreateCart(userId, sessionId);

    const [items] = await pool.query<RowDataPacket[]>(
      `SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        pv.id as variant_id,
        pv.color_name,
        pv.color_hex,
        pv.size_label,
        pv.sku,
        pv.stock_quantity,
        p.id as product_id,
        p.title as product_title,
        p.slug as product_slug,
        COALESCE(pv.price_override, p.discount_price, p.base_price) as unit_price,
        p.base_price as original_price,
        (
          SELECT image_url FROM product_images 
          WHERE product_id = p.id 
          ORDER BY is_primary DESC LIMIT 1
        ) as image_url
       FROM cart_items ci
       JOIN product_variants pv ON ci.product_variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    let subtotal = 0;
    let totalItems = 0;

    const formattedItems = items.map((item) => {
      const itemSubtotal = Number(item.unit_price) * item.quantity;
      subtotal += itemSubtotal;
      totalItems += item.quantity;
      return {
        ...item,
        subtotal: itemSubtotal,
        in_stock: item.stock_quantity >= item.quantity,
      };
    });

    res.json({
      success: true,
      cart: {
        id: cartId,
        items: formattedItems,
        subtotal,
        count: totalItems,
      },
    });
  } catch (error: any) {
    console.error('getCart error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve cart.' });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { sessionId, productVariantId, quantity = 1 } = req.body;

    if (!productVariantId) {
      res.status(400).json({ success: false, message: 'Product variant ID is required.' });
      return;
    }

    const [variants] = await pool.query<RowDataPacket[]>(
      'SELECT id, stock_quantity FROM product_variants WHERE id = ?',
      [productVariantId]
    );

    if (variants.length === 0) {
      res.status(404).json({ success: false, message: 'Product variant not found.' });
      return;
    }

    const variant = variants[0];
    if (variant.stock_quantity < quantity) {
      res.status(400).json({ success: false, message: 'Insufficient stock available for this selection.' });
      return;
    }

    const cartId = await getOrCreateCart(userId, sessionId);

    // Check if item already in cart
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_variant_id = ?',
      [cartId, productVariantId]
    );

    if (existing.length > 0) {
      const newQty = existing[0].quantity + quantity;
      if (newQty > variant.stock_quantity) {
        res.status(400).json({
          success: false,
          message: `Only ${variant.stock_quantity} units available in stock.`,
        });
        return;
      }
      await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
    } else {
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_variant_id, quantity) VALUES (?, ?, ?)',
        [cartId, productVariantId, quantity]
      );
    }

    res.json({ success: true, message: 'Added to your bag.' });
  } catch (error: any) {
    console.error('addToCart error:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to bag.' });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
      res.json({ success: true, message: 'Item removed from bag.' });
      return;
    }

    // Verify stock
    const [items] = await pool.query<RowDataPacket[]>(
      `SELECT pv.stock_quantity 
       FROM cart_items ci 
       JOIN product_variants pv ON ci.product_variant_id = pv.id 
       WHERE ci.id = ?`,
      [itemId]
    );

    if (items.length === 0) {
      res.status(404).json({ success: false, message: 'Cart item not found.' });
      return;
    }

    if (items[0].stock_quantity < quantity) {
      res.status(400).json({
        success: false,
        message: `Only ${items[0].stock_quantity} available in stock.`,
      });
      return;
    }

    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
    res.json({ success: true, message: 'Bag updated.' });
  } catch (error: any) {
    console.error('updateCartItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to update bag.' });
  }
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    res.json({ success: true, message: 'Item removed from bag.' });
  } catch (error: any) {
    console.error('removeCartItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item.' });
  }
};
