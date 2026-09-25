import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { inventoryService } from '../services/inventory.service';

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [salesRow] = await pool.query<RowDataPacket[]>(
      `SELECT 
        COALESCE(SUM(total_amount), 0) as totalRevenue,
        COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total_amount ELSE 0 END), 0) as todayRevenue,
        COUNT(*) as totalOrders,
        SUM(CASE WHEN order_status = 'pending' OR order_status = 'confirmed' THEN 1 ELSE 0 END) as pendingOrders
       FROM orders`
    );

    const [customerRow] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as totalCustomers FROM users WHERE role = 'customer'`
    );

    const [productRow] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as totalProducts FROM products WHERE is_active = 1`
    );

    const [lowStockRow] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as lowStockCount FROM product_variants WHERE stock_quantity <= 8`
    );

    const [recentOrders] = await pool.query<RowDataPacket[]>(
      `SELECT 
        o.id, o.order_number, o.customer_name, o.total_amount, o.order_status as status, o.payment_status, o.created_at
       FROM orders o
       ORDER BY o.created_at DESC
       LIMIT 8`
    );

    res.json({
      success: true,
      stats: {
        totalRevenue: Number(salesRow[0]?.totalRevenue || 0),
        todayRevenue: Number(salesRow[0]?.todayRevenue || 0),
        totalOrders: Number(salesRow[0]?.totalOrders || 0),
        pendingOrders: Number(salesRow[0]?.pendingOrders || 0),
        totalCustomers: Number(customerRow[0]?.totalCustomers || 0),
        totalProducts: Number(productRow[0]?.totalProducts || 0),
        lowStockCount: Number(lowStockRow[0]?.lowStockCount || 0),
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error('getAdminStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
};

export const getAdminProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [products] = await pool.query<RowDataPacket[]>(
      `SELECT 
        p.id, p.title, p.slug, p.base_price, p.discount_price, p.is_active, p.is_featured, p.is_new,
        c.name as category_name, col.name as collection_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as primary_image,
        COALESCE(SUM(pv.stock_quantity), 0) as total_stock,
        COUNT(pv.id) as variant_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN collections col ON p.collection_id = col.id
       LEFT JOIN product_variants pv ON p.id = pv.product_id
       GROUP BY p.id
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error('getAdminProducts error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      title,
      categoryId,
      collectionId,
      subtitle,
      shortDescription,
      description,
      fabric,
      fitType,
      careInstructions,
      basePrice,
      discountPrice,
      isFeatured,
      isNew,
      images = [],
      variants = [],
    } = req.body;

    if (!title || !basePrice || !description) {
      res.status(400).json({ success: false, message: 'Title, base price, and description are required.' });
      return;
    }

    const slug =
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      Math.floor(100 + Math.random() * 900);

    const [prodResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO products 
        (category_id, collection_id, title, slug, subtitle, short_description, description, fabric, fit_type, care_instructions, base_price, discount_price, is_featured, is_new)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId || null,
        collectionId || null,
        title.trim(),
        slug,
        subtitle || null,
        shortDescription || null,
        description.trim(),
        fabric || null,
        fitType || null,
        careInstructions || null,
        basePrice,
        discountPrice || null,
        isFeatured ? 1 : 0,
        isNew ? 1 : 0,
      ]
    );

    const productId = prodResult.insertId;

    // Images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await connection.query(
          `INSERT INTO product_images (product_id, image_url, image_type, alt_text, sort_order, is_primary)
           VALUES (?, ?, 'front', ?, ?, ?)`,
          [productId, typeof img === 'string' ? img : img.url, title, i + 1, i === 0 ? 1 : 0]
        );
      }
    }

    // Variants and initial inventory movements
    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        const sku = `ELV-${productId}-${v.colorName.substring(0, 3).toUpperCase()}-${v.sizeLabel.toUpperCase()}`;
        const [varResult] = await connection.query<ResultSetHeader>(
          `INSERT INTO product_variants (product_id, sku, color_name, color_hex, size_label, stock_quantity, price_override)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            productId,
            sku,
            v.colorName || 'Default',
            v.colorHex || '#8A9A86',
            v.sizeLabel || 'Free Size',
            v.stockQuantity || 0,
            v.priceOverride || null,
          ]
        );

        if (v.stockQuantity > 0) {
          await connection.query(
            `INSERT INTO inventory (variant_id, change_quantity, reason, notes) VALUES (?, ?, 'purchase', 'Initial production setup')`,
            [varResult.insertId, v.stockQuantity]
          );
        }
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Product created successfully with variant inventory.',
      productId,
      slug,
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('createProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  } finally {
    connection.release();
  }
};

export const getAdminOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [orders] = await pool.query<RowDataPacket[]>(
      `SELECT 
        o.id, o.order_number, o.customer_name, o.customer_email, o.customer_phone,
        o.total_amount, o.order_status as status, o.payment_status, o.tracking_number, o.created_at,
        p.payment_method,
        COUNT(oi.id) as total_items
       FROM orders o
       LEFT JOIN payments p ON o.id = p.order_id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );

    res.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('getAdminOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, trackingCarrier } = req.body;

    await pool.query(
      `UPDATE orders 
       SET order_status = COALESCE(?, order_status),
           tracking_number = COALESCE(?, tracking_number),
           tracking_carrier = COALESCE(?, tracking_carrier)
       WHERE id = ?`,
      [status || null, trackingNumber || null, trackingCarrier || null, orderId]
    );

    res.json({
      success: true,
      message: `Order status updated to ${status}.`,
    });
  } catch (error: any) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

export const adjustInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { variantId, changeQuantity, reason, notes } = req.body;

    if (!variantId || changeQuantity === undefined || !reason) {
      res.status(400).json({ success: false, message: 'Variant ID, quantity, and reason are required.' });
      return;
    }

    await inventoryService.adjustStock(Number(variantId), Number(changeQuantity), reason, notes);

    res.json({
      success: true,
      message: 'Stock adjusted and recorded in inventory movement ledger.',
    });
  } catch (error: any) {
    console.error('adjustInventory error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to adjust inventory.' });
  }
};

export const getInventoryLog = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [movements] = await pool.query<RowDataPacket[]>(
      `SELECT i.*, pv.sku, pv.color_name, pv.size_label, p.title as product_title
       FROM inventory i
       JOIN product_variants pv ON i.variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       ORDER BY i.created_at DESC
       LIMIT 50`
    );

    res.json({
      success: true,
      movements,
    });
  } catch (error: any) {
    console.error('getInventoryLog error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve inventory history.' });
  }
};
