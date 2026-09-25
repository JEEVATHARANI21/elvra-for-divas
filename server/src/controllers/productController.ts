import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      color,
      size,
      search,
      sort,
      minPrice,
      maxPrice,
      isFeatured,
      isNew,
      limit = 40,
      offset = 0,
    } = req.query;

    let query = `
      SELECT 
        p.id, p.title, p.slug, p.subtitle, p.description, p.fabric, p.fit_type,
        p.base_price, p.discount_price, p.is_featured, p.is_new, p.is_active,
        c.id as category_id, c.name as category_name, c.slug as category_slug,
        (
          SELECT image_url FROM product_images 
          WHERE product_id = p.id 
          ORDER BY is_primary DESC, sort_order ASC, id ASC LIMIT 1
        ) as primary_image,
        (
          SELECT image_url FROM product_images 
          WHERE product_id = p.id AND is_primary = 0
          ORDER BY sort_order ASC, id ASC LIMIT 1
        ) as secondary_image,
        COALESCE(AVG(r.rating), 5.0) as average_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
      WHERE p.is_active = 1
    `;

    const params: any[] = [];

    if (category) {
      query += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (search) {
      query += ` AND (p.title LIKE ? OR p.subtitle LIKE ? OR p.description LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (isFeatured === 'true' || isFeatured === '1') {
      query += ` AND p.is_featured = 1`;
    }

    if (isNew === 'true' || isNew === '1') {
      query += ` AND p.is_new = 1`;
    }

    if (minPrice) {
      query += ` AND COALESCE(p.discount_price, p.base_price) >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ` AND COALESCE(p.discount_price, p.base_price) <= ?`;
      params.push(Number(maxPrice));
    }

    if (color || size) {
      query += ` AND p.id IN (
        SELECT DISTINCT product_id FROM product_variants WHERE 1=1
      `;
      if (color) {
        query += ` AND color_name = ?`;
        params.push(color);
      }
      if (size) {
        query += ` AND size_label = ?`;
        params.push(size);
      }
      query += `)`;
    }

    query += ` GROUP BY p.id`;

    // Sorting
    if (sort === 'price_asc') {
      query += ` ORDER BY COALESCE(p.discount_price, p.base_price) ASC`;
    } else if (sort === 'price_desc') {
      query += ` ORDER BY COALESCE(p.discount_price, p.base_price) DESC`;
    } else if (sort === 'popular') {
      query += ` ORDER BY review_count DESC, average_rating DESC`;
    } else {
      query += ` ORDER BY p.is_new DESC, p.created_at DESC`;
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [products] = await pool.query<RowDataPacket[]>(query, params);

    // Fetch variant color swatches and available sizes for each product in result
    for (const prod of products) {
      const [variants] = await pool.query<RowDataPacket[]>(
        `SELECT DISTINCT color_name, color_hex FROM product_variants WHERE product_id = ?`,
        [prod.id]
      );
      prod.colors = variants;

      const [sizes] = await pool.query<RowDataPacket[]>(
        `SELECT DISTINCT size_label, stock_quantity FROM product_variants WHERE product_id = ? ORDER BY id ASC`,
        [prod.id]
      );
      prod.sizes = sizes;
    }

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const [products] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE (p.slug = ? OR p.id = ?) AND p.is_active = 1`,
      [slug, slug]
    );

    if (products.length === 0) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const product = products[0];

    // Images
    const [images] = await pool.query<RowDataPacket[]>(
      `SELECT id, image_url, alt_text, is_primary, sort_order 
       FROM product_images 
       WHERE product_id = ? 
       ORDER BY is_primary DESC, sort_order ASC`,
      [product.id]
    );
    product.images = images;

    // Variants (Colors & Sizes with SKU & individual inventory)
    const [variants] = await pool.query<RowDataPacket[]>(
      `SELECT id, color_name, color_hex, size_label, sku, price_override, stock_quantity 
       FROM product_variants 
       WHERE product_id = ? 
       ORDER BY color_name ASC, size_label ASC`,
      [product.id]
    );
    product.variants = variants;

    // Distinct colors & distinct sizes
    const colorsMap = new Map<string, string>();
    const sizesSet = new Set<string>();
    variants.forEach((v: any) => {
      colorsMap.set(v.color_name, v.color_hex);
      sizesSet.add(v.size_label);
    });

    product.availableColors = Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex }));
    product.availableSizes = Array.from(sizesSet);

    // Reviews
    const [reviews] = await pool.query<RowDataPacket[]>(
      `SELECT id, reviewer_name, rating, fit_rating, comfort_rating, review_text, created_at 
       FROM reviews 
       WHERE product_id = ? AND is_approved = 1 
       ORDER BY created_at DESC`,
      [product.id]
    );
    product.reviews = reviews;
    product.averageRating = reviews.length > 0 
      ? Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : 5.0;

    // Related products (same category)
    const [related] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.title, p.slug, p.base_price, p.discount_price,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as primary_image
       FROM products p
       WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
       LIMIT 4`,
      [product.category_id, product.id]
    );
    product.relatedProducts = related;

    res.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error('getProductBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve product details.' });
  }
};
