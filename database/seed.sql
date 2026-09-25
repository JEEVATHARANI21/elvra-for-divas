USE elvra_for_divas;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payment_webhooks;
TRUNCATE TABLE refunds;
TRUNCATE TABLE coupon_usages;
TRUNCATE TABLE coupons;
TRUNCATE TABLE reviews;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE wishlist_items;
TRUNCATE TABLE wishlists;
TRUNCATE TABLE inventory;
TRUNCATE TABLE product_variants;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE collections;
TRUNCATE TABLE categories;
TRUNCATE TABLE addresses;
TRUNCATE TABLE users;
TRUNCATE TABLE banners;
TRUNCATE TABLE settings;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users
INSERT INTO users (id, first_name, last_name, email, password_hash, phone, role, is_verified, is_active) VALUES
(1, 'Elvra', 'Admin', 'admin@elvra.com', '$2a$10$rC0i6xK8wzP0g6Y49hZ1..GjY52Lz1M5vT9k8Q7P6o5N4m3L2k1J.', '+919876543210', 'admin', 1, 1),
(2, 'Aadhya', 'Sharma', 'diva@elvra.com', '$2a$10$rC0i6xK8wzP0g6Y49hZ1..GjY52Lz1M5vT9k8Q7P6o5N4m3L2k1J.', '+919876543211', 'customer', 1, 1);

-- 2. Categories
INSERT INTO categories (id, name, slug, description, image_url, display_order) VALUES
(1, 'Everyday Tops', 'everyday-tops', 'Effortless tees and soft silhouettes designed for daily ease.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 1),
(2, 'Loungewear', 'loungewear', 'Buttery soft modal and ribbed sets created to unwind and feel weightless.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', 2),
(3, 'Track Pants', 'track-pants', 'Relaxed joggers, flared comfort tracks, and wide-leg active bottoms.', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80', 3),
(4, 'Co-ord Sets', 'co-ord-sets', 'Curated matching ensembles for an elevated, put-together aesthetic.', 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=800&q=80', 4);

-- 3. Collections
INSERT INTO collections (id, name, slug, description, banner_image, is_active) VALUES
(1, 'Everyday Comfort', 'everyday-comfort', 'Core staples woven from cloud-finish combed organic cotton for effortless everyday journeys.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80', 1),
(2, 'Lounge Edit', 'lounge-edit', 'Weightless beechwood micro-modal coordinates that breathe and drape softly around the body.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80', 1),
(3, 'Weekend Edit', 'weekend-edit', 'Casual elegance made for slow mornings, sunlit brunches, and relaxed weekend travels.', 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1600&q=80', 1),
(4, 'New Collection', 'new-collection', 'The newest seasonal palette of Sage Green, Warm Sand, and Muted Terracotta.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80', 1);

-- 4. Products
INSERT INTO products (id, category_id, collection_id, title, slug, subtitle, short_description, description, fabric, fit_type, care_instructions, base_price, discount_price, sku, is_featured, is_new) VALUES
(1, 1, 1, 'Elvra Essential Tee', 'elvra-essential-tee', 'Signature soft organic cotton everyday top', 'Ultra-breathable combed organic cotton essential top.', 'Crafted from 100% cloud-finish combed organic cotton. Features a relaxed neckline, gentle drop shoulders, and an airy silhouette engineered to flatter all shapes while breathing with you throughout the day.', '100% Combed Organic Cotton (180 GSM)', 'Relaxed Fit', 'Machine wash cold on gentle cycle. Lay flat to dry or tumble dry low. Cool iron if needed.', 899.00, 799.00, 'ELV-TEE-001', 1, 1),
(2, 2, 2, 'Breeze Modal Lounge Set', 'breeze-modal-lounge-set', 'Ultra-breathable 2-piece loungewear duo', 'Weightless beechwood modal pullover and wide-leg set.', 'Indulge in pure featherweight luxury. The Breeze Modal Lounge Set blends sustainable beechwood modal with touchable stretch. Designed with fluid drape pants and an effortless kimono-sleeve pullover.', '95% Micro-Modal, 5% Elastane', 'Easy Drape Fit', 'Hand wash cold or gentle machine cycle in wash bag. Do not bleach. Dry in shade.', 1999.00, 1699.00, 'ELV-LNG-001', 1, 1),
(3, 3, 1, 'Serene Flow Track Pants', 'serene-flow-track-pants', 'High-waisted tapered joggers with deep pockets', 'Non-pinching wide waistband joggers with phone pockets.', 'The perfect balance of athletic functionality and lounge indulgence. Features a wide, non-pinching waistband, deep hidden phone pockets, and tapered ribbed cuffs.', '88% Cotton, 12% Spandex Interlock', 'Tapered High-Rise', 'Machine wash warm inside out with like colors. Line dry in shade.', 1299.00, 1099.00, 'ELV-TRK-001', 1, 0),
(4, 4, 3, 'Divas Weekend Relaxed Co-ord', 'divas-weekend-relaxed-coord', 'Sophisticated linen-cotton weekend duo', 'Curated for sunny brunches and weekend explorations.', 'Curated for sunny brunches and weekend explorations. Breathable, structured yet sumptuously soft against the skin with Mother-of-Pearl finished accent buttons.', '60% Linen, 40% Cotton', 'Relaxed Tailored', 'Gentle machine wash or dry clean. Warm steam iron while damp.', 2499.00, 2199.00, 'ELV-CRD-001', 1, 1),
(5, 1, 4, 'Aura Ribbed Scoop Top', 'aura-ribbed-scoop-top', 'Flattering contour-fit ribbed knit top', 'Micro-ribbed contour top with wide scoop neck.', 'Elevate your core wardrobe with the Aura Ribbed Top. Knit with micro-ribbing that gently hugs without squeezing, finished with an elegant wide scoop neckline.', '92% Cotton Rib, 8% Spandex', 'Fitted Stretch', 'Machine wash cold, gentle cycle. Reshape while damp.', 999.00, 849.00, 'ELV-RIB-001', 0, 1),
(6, 3, 2, 'CloudComfort Wide-Leg Trousers', 'cloudcomfort-wide-leg-trousers', 'Fluid wide-leg trousers for effortless movement', 'Drape trousers with pleated front and elastic back.', 'Designed for women who refuse to compromise between refinement and comfort. Features a fluid drape, discreet front pleats, and an elasticated back waistband.', '100% Lyocell Twill', 'Wide Leg / Fluid', 'Cold hand wash or dry clean recommended.', 1599.00, 1349.00, 'ELV-WDL-001', 1, 0);

-- 5. Product Images
INSERT INTO product_images (product_id, image_url, image_type, alt_text, sort_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', 'front', 'Elvra Essential Tee Front in Sage Green', 1, 1),
(1, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', 'lifestyle', 'Elvra Essential Tee Lifestyle Model', 2, 0),
(1, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', 'detail', 'Elvra Essential Tee Fabric Close Up', 3, 0),

(2, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80', 'front', 'Breeze Modal Lounge Set Front', 1, 1),
(2, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80', 'lifestyle', 'Breeze Modal Lounge Set Movement', 2, 0),

(3, 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80', 'front', 'Serene Flow Track Pants Model', 1, 1),
(3, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80', 'detail', 'Serene Flow Track Pants Pocket', 2, 0),

(4, 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1000&q=80', 'front', 'Divas Weekend Relaxed Co-ord Full', 1, 1),
(4, 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80', 'detail', 'Divas Weekend Co-ord Buttons', 2, 0),

(5, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', 'front', 'Aura Ribbed Scoop Top', 1, 1),
(6, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80', 'front', 'CloudComfort Wide-Leg Trousers', 1, 1);

-- 6. Product Variants
INSERT INTO product_variants (id, product_id, sku, color_name, color_hex, size_label, stock_quantity) VALUES
(1, 1, 'ELV-TEE-SGE-S', 'Sage Green', '#8A9A86', 'S', 15),
(2, 1, 'ELV-TEE-SGE-M', 'Sage Green', '#8A9A86', 'M', 25),
(3, 1, 'ELV-TEE-SGE-L', 'Sage Green', '#8A9A86', 'L', 20),
(4, 1, 'ELV-TEE-SGE-XL', 'Sage Green', '#8A9A86', 'XL', 10),
(5, 1, 'ELV-TEE-CRM-S', 'Cream', '#FAF8F5', 'S', 12),
(6, 1, 'ELV-TEE-CRM-M', 'Cream', '#FAF8F5', 'M', 18),
(7, 1, 'ELV-TEE-CRM-L', 'Cream', '#FAF8F5', 'L', 14),
(8, 1, 'ELV-TEE-CRM-XL', 'Cream', '#FAF8F5', 'XL', 8),
(9, 1, 'ELV-TEE-TER-S', 'Terracotta', '#C88A75', 'S', 8),
(10, 1, 'ELV-TEE-TER-M', 'Terracotta', '#C88A75', 'M', 16),
(11, 1, 'ELV-TEE-TER-L', 'Terracotta', '#C88A75', 'L', 12),
(12, 1, 'ELV-TEE-TER-XL', 'Terracotta', '#C88A75', 'XL', 6),

(13, 2, 'ELV-LNG-SND-S', 'Warm Sand', '#E5D9C5', 'S', 10),
(14, 2, 'ELV-LNG-SND-M', 'Warm Sand', '#E5D9C5', 'M', 15),
(15, 2, 'ELV-LNG-SND-L', 'Warm Sand', '#E5D9C5', 'L', 12),
(16, 2, 'ELV-LNG-SND-XL', 'Warm Sand', '#E5D9C5', 'XL', 7),
(17, 2, 'ELV-LNG-SGE-S', 'Sage Green', '#8A9A86', 'S', 8),
(18, 2, 'ELV-LNG-SGE-M', 'Sage Green', '#8A9A86', 'M', 14),
(19, 2, 'ELV-LNG-SGE-L', 'Sage Green', '#8A9A86', 'L', 10),
(20, 2, 'ELV-LNG-SGE-XL', 'Sage Green', '#8A9A86', 'XL', 5),

(21, 3, 'ELV-TRK-CHR-S', 'Deep Charcoal', '#2B2D2F', 'S', 14),
(22, 3, 'ELV-TRK-CHR-M', 'Deep Charcoal', '#2B2D2F', 'M', 22),
(23, 3, 'ELV-TRK-CHR-L', 'Deep Charcoal', '#2B2D2F', 'L', 18),
(24, 3, 'ELV-TRK-CHR-XL', 'Deep Charcoal', '#2B2D2F', 'XL', 9),

(25, 4, 'ELV-CRD-SND-S', 'Warm Sand', '#E5D9C5', 'S', 8),
(26, 4, 'ELV-CRD-SND-M', 'Warm Sand', '#E5D9C5', 'M', 12),
(27, 4, 'ELV-CRD-SND-L', 'Warm Sand', '#E5D9C5', 'L', 9),
(28, 4, 'ELV-CRD-SND-XL', 'Warm Sand', '#E5D9C5', 'XL', 4),

(29, 5, 'ELV-RIB-CRM-S', 'Cream', '#FAF8F5', 'S', 15),
(30, 5, 'ELV-RIB-CRM-M', 'Cream', '#FAF8F5', 'M', 20),
(31, 5, 'ELV-RIB-CRM-L', 'Cream', '#FAF8F5', 'L', 15),
(32, 5, 'ELV-RIB-CRM-XL', 'Cream', '#FAF8F5', 'XL', 10),

(33, 6, 'ELV-WDL-SGE-S', 'Sage Green', '#8A9A86', 'S', 12),
(34, 6, 'ELV-WDL-SGE-M', 'Sage Green', '#8A9A86', 'M', 18),
(35, 6, 'ELV-WDL-SGE-L', 'Sage Green', '#8A9A86', 'L', 14),
(36, 6, 'ELV-WDL-SGE-XL', 'Sage Green', '#8A9A86', 'XL', 8);

-- 7. Seed Initial Inventory Movement Log
INSERT INTO inventory (variant_id, change_quantity, reason, notes)
SELECT id, stock_quantity, 'purchase', 'Initial seasonal production run'
FROM product_variants;

-- 8. Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_amount, maximum_discount_amount, is_active) VALUES
('ELVRA10', 'Enjoy 10% off your entire order', 'percentage', 10.00, 999.00, 300.00, 1),
('WELCOME15', 'Welcome diva! 15% off first purchase', 'percentage', 15.00, 1299.00, 500.00, 1),
('FREESHIP', 'Complimentary Express Delivery', 'fixed', 50.00, 0.00, 50.00, 1);

-- 9. Reviews
INSERT INTO reviews (product_id, reviewer_name, rating, fit_rating, comfort_rating, title, review_text, status) VALUES
(1, 'Pooja Menon', 5, 'perfect', 5, 'Absolute luxury everyday tee', 'The fabric is ridiculously soft! The sage green shade looks so earthy and elegant. Fits true to size with an airy feel.', 'approved'),
(1, 'Rhea Sen', 5, 'perfect', 5, 'Breathable & well-made', 'I have worn this three times this week already. Doesn’t lose shape after washing.', 'approved'),
(2, 'Tanvi K.', 5, 'perfect', 5, 'Featherweight modal perfection', 'Pure luxury for lounging. The drape is so flattering and feminine. Elvra nailed this modal fabric!', 'approved'),
(3, 'Meera R.', 4, 'perfect', 4, 'Super comfortable waistband', 'Super comfortable waistband, doesn’t dig into skin at all. Perfect for flights and home office days.', 'approved');

-- 10. Banners
INSERT INTO banners (title, subtitle, image_url, button_text, button_link, position, display_order, is_active) VALUES
('Wings to Explore', 'Effortless comfort designed for every journey.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80', 'Shop Collection', '/shop', 'hero', 1, 1);

-- 11. Settings
INSERT INTO settings (`key`, `value`, description) VALUES
('free_shipping_threshold', '999', 'Order amount in INR to qualify for free express shipping'),
('shipping_charge', '50', 'Standard delivery fee in INR'),
('tax_enabled', 'false', 'Enable separate GST/Tax line (prices already tax-inclusive)'),
('tax_percentage', '0', 'GST percentage if enabled'),
('support_whatsapp', '+919876543210', 'Customer concierge WhatsApp number'),
('support_email', 'care@elvrafordivas.com', 'Customer service email address'),
('brand_tagline', 'Wings to Explore', 'Official brand tagline'),
('brand_message', 'Comfort Looks Good On You.', 'Official brand philosophy message');
