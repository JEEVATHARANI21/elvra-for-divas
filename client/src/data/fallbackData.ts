import { Product, Category, Cart, CartItem, ProductVariant, Review } from '../types';

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Everyday Tops',
    slug: 'everyday-tops',
    description: 'Effortless tees and soft silhouettes designed for daily ease.',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    product_count: 2,
  },
  {
    id: 2,
    name: 'Loungewear',
    slug: 'loungewear',
    description: 'Buttery soft modal and ribbed sets created to unwind and feel weightless.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    product_count: 1,
  },
  {
    id: 3,
    name: 'Track Pants',
    slug: 'track-pants',
    description: 'Relaxed joggers, flared comfort tracks, and wide-leg active bottoms.',
    image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    product_count: 2,
  },
  {
    id: 4,
    name: 'Co-ord Sets',
    slug: 'co-ord-sets',
    description: 'Curated matching ensembles for an elevated, put-together aesthetic.',
    image_url: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=800&q=80',
    display_order: 4,
    product_count: 1,
  },
];

export const FALLBACK_COLLECTIONS = [
  {
    id: 1,
    name: 'Everyday Comfort',
    slug: 'everyday-comfort',
    description: 'Core staples woven from cloud-finish combed organic cotton for effortless everyday journeys.',
    banner_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80',
    is_active: 1,
    product_count: 2,
  },
  {
    id: 2,
    name: 'Lounge Edit',
    slug: 'lounge-edit',
    description: 'Weightless beechwood micro-modal coordinates that breathe and drape softly around the body.',
    banner_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
    is_active: 1,
    product_count: 2,
  },
  {
    id: 3,
    name: 'Weekend Edit',
    slug: 'weekend-edit',
    description: 'Casual elegance made for slow mornings, sunlit brunches, and relaxed weekend travels.',
    banner_image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1600&q=80',
    is_active: 1,
    product_count: 1,
  },
  {
    id: 4,
    name: 'New Collection',
    slug: 'new-collection',
    description: 'The newest seasonal palette of Sage Green, Warm Sand, and Muted Terracotta.',
    banner_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    is_active: 1,
    product_count: 1,
  },
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: 'Elvra Essential Tee',
    slug: 'elvra-essential-tee',
    subtitle: 'Signature soft organic cotton everyday top',
    description: 'Crafted from 100% cloud-finish combed organic cotton. Features a relaxed neckline, gentle drop shoulders, and an airy silhouette engineered to flatter all shapes while breathing with you throughout the day.',
    fabric: '100% Combed Organic Cotton (180 GSM)',
    fit_type: 'Relaxed Fit',
    care_instructions: 'Machine wash cold on gentle cycle. Lay flat to dry or tumble dry low. Cool iron if needed.',
    base_price: 899,
    discount_price: 799,
    is_featured: true,
    is_new: true,
    is_active: true,
    primary_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 1, image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', is_primary: true, sort_order: 1 },
      { id: 2, image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', is_primary: false, sort_order: 2 },
      { id: 3, image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80', is_primary: false, sort_order: 3 },
    ],
    availableColors: [
      { name: 'Sage Green', hex: '#8A9A86' },
      { name: 'Cream', hex: '#FAF8F5' },
      { name: 'Terracotta', hex: '#C88A75' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 1, product_id: 1, sku: 'ELV-TEE-SGE-S', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'S', stock_quantity: 15 },
      { id: 2, product_id: 1, sku: 'ELV-TEE-SGE-M', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'M', stock_quantity: 25 },
      { id: 3, product_id: 1, sku: 'ELV-TEE-SGE-L', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'L', stock_quantity: 20 },
      { id: 4, product_id: 1, sku: 'ELV-TEE-SGE-XL', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'XL', stock_quantity: 10 },
      { id: 5, product_id: 1, sku: 'ELV-TEE-CRM-S', color_name: 'Cream', color_hex: '#FAF8F5', size_label: 'S', stock_quantity: 12 },
      { id: 6, product_id: 1, sku: 'ELV-TEE-CRM-M', color_name: 'Cream', color_hex: '#FAF8F5', size_label: 'M', stock_quantity: 18 },
      { id: 7, product_id: 1, sku: 'ELV-TEE-CRM-L', color_name: 'Cream', color_hex: '#FAF8F5', size_label: 'L', stock_quantity: 14 },
      { id: 8, product_id: 1, sku: 'ELV-TEE-CRM-XL', color_name: 'Cream', color_hex: '#FAF8F5', size_label: 'XL', stock_quantity: 8 },
      { id: 9, product_id: 1, sku: 'ELV-TEE-TER-S', color_name: 'Terracotta', color_hex: '#C88A75', size_label: 'S', stock_quantity: 8 },
      { id: 10, product_id: 1, sku: 'ELV-TEE-TER-M', color_name: 'Terracotta', color_hex: '#C88A75', size_label: 'M', stock_quantity: 16 },
      { id: 11, product_id: 1, sku: 'ELV-TEE-TER-L', color_name: 'Terracotta', color_hex: '#C88A75', size_label: 'L', stock_quantity: 12 },
      { id: 12, product_id: 1, sku: 'ELV-TEE-TER-XL', color_name: 'Terracotta', color_hex: '#C88A75', size_label: 'XL', stock_quantity: 6 },
    ],
    averageRating: 5.0,
    review_count: 2,
    reviews: [
      { id: 1, product_id: 1, reviewer_name: 'Pooja Menon', rating: 5, fit_rating: 'perfect', comfort_rating: 5, review_text: 'The fabric is ridiculously soft! The sage green shade looks so earthy and elegant. Fits true to size with an airy feel.', created_at: '2026-09-18T10:00:00Z' },
      { id: 2, product_id: 1, reviewer_name: 'Rhea Sen', rating: 5, fit_rating: 'perfect', comfort_rating: 5, review_text: 'I have worn this three times this week already. Doesn’t lose shape after washing.', created_at: '2026-09-19T10:00:00Z' },
    ],
  },
  {
    id: 2,
    category_id: 2,
    category_name: 'Loungewear',
    category_slug: 'loungewear',
    title: 'Breeze Modal Lounge Set',
    slug: 'breeze-modal-lounge-set',
    subtitle: 'Ultra-breathable 2-piece loungewear duo',
    description: 'Indulge in pure featherweight luxury. The Breeze Modal Lounge Set blends sustainable beechwood modal with touchable stretch. Designed with fluid drape pants and an effortless kimono-sleeve pullover.',
    fabric: '95% Micro-Modal, 5% Elastane',
    fit_type: 'Easy Drape Fit',
    care_instructions: 'Hand wash cold or gentle machine cycle in wash bag. Do not bleach. Dry in shade.',
    base_price: 1999,
    discount_price: 1699,
    is_featured: true,
    is_new: true,
    is_active: true,
    primary_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 4, image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80', is_primary: true, sort_order: 1 },
      { id: 5, image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80', is_primary: false, sort_order: 2 },
    ],
    availableColors: [
      { name: 'Warm Sand', hex: '#E5D9C5' },
      { name: 'Sage Green', hex: '#8A9A86' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 13, product_id: 2, sku: 'ELV-LNG-SND-S', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'S', stock_quantity: 10 },
      { id: 14, product_id: 2, sku: 'ELV-LNG-SND-M', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'M', stock_quantity: 15 },
      { id: 15, product_id: 2, sku: 'ELV-LNG-SND-L', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'L', stock_quantity: 12 },
      { id: 16, product_id: 2, sku: 'ELV-LNG-SND-XL', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'XL', stock_quantity: 7 },
      { id: 17, product_id: 2, sku: 'ELV-LNG-SGE-S', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'S', stock_quantity: 8 },
      { id: 18, product_id: 2, sku: 'ELV-LNG-SGE-M', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'M', stock_quantity: 14 },
      { id: 19, product_id: 2, sku: 'ELV-LNG-SGE-L', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'L', stock_quantity: 10 },
      { id: 20, product_id: 2, sku: 'ELV-LNG-SGE-XL', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'XL', stock_quantity: 5 },
    ],
    averageRating: 5.0,
    review_count: 1,
    reviews: [
      { id: 3, product_id: 2, reviewer_name: 'Tanvi K.', rating: 5, fit_rating: 'perfect', comfort_rating: 5, review_text: 'Pure luxury for lounging. The drape is so flattering and feminine. Elvra nailed this modal fabric!', created_at: '2026-09-20T10:00:00Z' },
    ],
  },
  {
    id: 3,
    category_id: 3,
    category_name: 'Track Pants',
    category_slug: 'track-pants',
    title: 'Serene Flow Track Pants',
    slug: 'serene-flow-track-pants',
    subtitle: 'High-waisted tapered joggers with deep pockets',
    description: 'The perfect balance of athletic functionality and lounge indulgence. Features a wide, non-pinching waistband, deep hidden phone pockets, and tapered ribbed cuffs.',
    fabric: '88% Cotton, 12% Spandex Interlock',
    fit_type: 'Tapered High-Rise',
    care_instructions: 'Machine wash warm inside out with like colors. Line dry in shade.',
    base_price: 1299,
    discount_price: 1099,
    is_featured: true,
    is_new: false,
    is_active: true,
    primary_image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 6, image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80', is_primary: true, sort_order: 1 },
      { id: 7, image_url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80', is_primary: false, sort_order: 2 },
    ],
    availableColors: [
      { name: 'Deep Charcoal', hex: '#2B2D2F' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 21, product_id: 3, sku: 'ELV-TRK-CHR-S', color_name: 'Deep Charcoal', color_hex: '#2B2D2F', size_label: 'S', stock_quantity: 14 },
      { id: 22, product_id: 3, sku: 'ELV-TRK-CHR-M', color_name: 'Deep Charcoal', color_hex: '#2B2D2F', size_label: 'M', stock_quantity: 22 },
      { id: 23, product_id: 3, sku: 'ELV-TRK-CHR-L', color_name: 'Deep Charcoal', color_hex: '#2B2D2F', size_label: 'L', stock_quantity: 18 },
      { id: 24, product_id: 3, sku: 'ELV-TRK-CHR-XL', color_name: 'Deep Charcoal', color_hex: '#2B2D2F', size_label: 'XL', stock_quantity: 9 },
    ],
    averageRating: 4.8,
    review_count: 1,
    reviews: [
      { id: 4, product_id: 3, reviewer_name: 'Meera R.', rating: 5, fit_rating: 'perfect', comfort_rating: 5, review_text: 'Super comfortable waistband, doesn’t dig into skin at all. Perfect for flights and home office days.', created_at: '2026-09-21T10:00:00Z' },
    ],
  },
  {
    id: 4,
    category_id: 4,
    category_name: 'Co-ord Sets',
    category_slug: 'co-ord-sets',
    title: 'Divas Weekend Relaxed Co-ord',
    slug: 'divas-weekend-relaxed-coord',
    subtitle: 'Sophisticated linen-cotton weekend duo',
    description: 'Curated for sunny brunches and weekend explorations. Breathable, structured yet sumptuously soft against the skin with Mother-of-Pearl finished accent buttons.',
    fabric: '60% Linen, 40% Cotton',
    fit_type: 'Relaxed Tailored',
    care_instructions: 'Gentle machine wash or dry clean. Warm steam iron while damp.',
    base_price: 2499,
    discount_price: 2199,
    is_featured: true,
    is_new: true,
    is_active: true,
    primary_image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1000&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 8, image_url: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1000&q=80', is_primary: true, sort_order: 1 },
      { id: 9, image_url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80', is_primary: false, sort_order: 2 },
    ],
    availableColors: [
      { name: 'Warm Sand', hex: '#E5D9C5' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 25, product_id: 4, sku: 'ELV-CRD-SND-S', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'S', stock_quantity: 8 },
      { id: 26, product_id: 4, sku: 'ELV-CRD-SND-M', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'M', stock_quantity: 12 },
      { id: 27, product_id: 4, sku: 'ELV-CRD-SND-L', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'L', stock_quantity: 9 },
      { id: 28, product_id: 4, sku: 'ELV-CRD-SND-XL', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'XL', stock_quantity: 4 },
    ],
    averageRating: 5.0,
    review_count: 1,
  },
  {
    id: 5,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: 'Aura Ribbed Scoop Top',
    slug: 'aura-ribbed-scoop-top',
    subtitle: 'Flattering contour-fit ribbed knit top',
    description: 'Elevate your core wardrobe with the Aura Ribbed Top. Knit with micro-ribbing that gently hugs without squeezing, finished with an elegant wide scoop neckline.',
    fabric: '92% Cotton Rib, 8% Spandex',
    fit_type: 'Fitted Stretch',
    care_instructions: 'Machine wash cold, gentle cycle. Reshape while damp.',
    base_price: 999,
    discount_price: 849,
    is_featured: false,
    is_new: true,
    is_active: true,
    primary_image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 10, image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Cream', hex: '#FAF8F5' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 29, product_id: 5, sku: 'ELV-RIB-CRM-S', color_name: 'Cream', color_hex: '#FAF8F5', size_label: 'S', stock_quantity: 15 },
      { id: 30, product_id: 5, sku: 'ELV-RIB-CRM-M', color_name: 'Cream', color_hex: '#FAF8F5', size_label: 'M', stock_quantity: 20 },
      { id: 31, product_id: 5, sku: 'ELV-RIB-CRM-L', color_name: 'Cream', color_hex: '#FAF8F5', size_label: 'L', stock_quantity: 15 },
      { id: 32, product_id: 5, sku: 'ELV-RIB-CRM-XL', color_name: 'Cream', color_hex: '#FAF8F5', size_label: 'XL', stock_quantity: 10 },
    ],
    averageRating: 4.9,
    review_count: 1,
  },
  {
    id: 6,
    category_id: 3,
    category_name: 'Track Pants',
    category_slug: 'track-pants',
    title: 'CloudComfort Wide-Leg Trousers',
    slug: 'cloudcomfort-wide-leg-trousers',
    subtitle: 'Fluid wide-leg trousers for effortless movement',
    description: 'Designed for women who refuse to compromise between refinement and comfort. Features a fluid drape, discreet front pleats, and an elasticated back waistband.',
    fabric: '100% Lyocell Twill',
    fit_type: 'Wide Leg / Fluid',
    care_instructions: 'Cold hand wash or dry clean recommended.',
    base_price: 1599,
    discount_price: 1349,
    is_featured: true,
    is_new: false,
    is_active: true,
    primary_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 11, image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Sage Green', hex: '#8A9A86' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 33, product_id: 6, sku: 'ELV-WDL-SGE-S', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'S', stock_quantity: 12 },
      { id: 34, product_id: 6, sku: 'ELV-WDL-SGE-M', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'M', stock_quantity: 18 },
      { id: 35, product_id: 6, sku: 'ELV-WDL-SGE-L', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'L', stock_quantity: 14 },
      { id: 36, product_id: 6, sku: 'ELV-WDL-SGE-XL', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'XL', stock_quantity: 8 },
    ],
    averageRating: 5.0,
    review_count: 1,
  },
];

// In-Memory / LocalStorage Mock Cart Engine for Demo Resilience
export function getLocalCart(): Cart {
  try {
    const raw = localStorage.getItem('elvra_offline_cart');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read offline cart', e);
  }
  return { id: 1, items: [], subtotal: 0, count: 0 };
}

export function saveLocalCart(cart: Cart) {
  try {
    localStorage.setItem('elvra_offline_cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not save offline cart', e);
  }
}

export function addLocalCartItem(variantId: number, quantity: number): Cart {
  const cart = getLocalCart();
  // Find product & variant
  let matchedProduct: Product | undefined;
  let matchedVariant: ProductVariant | undefined;

  for (const prod of FALLBACK_PRODUCTS) {
    const v = prod.variants?.find((varItem) => varItem.id === variantId);
    if (v) {
      matchedProduct = prod;
      matchedVariant = v;
      break;
    }
  }

  if (!matchedProduct || !matchedVariant) {
    return cart;
  }

  const existingIdx = cart.items.findIndex((item) => item.variant_id === variantId);
  const effectivePrice = Number(matchedProduct.discount_price || matchedProduct.base_price);

  if (existingIdx > -1) {
    cart.items[existingIdx].quantity += quantity;
    cart.items[existingIdx].subtotal = cart.items[existingIdx].quantity * effectivePrice;
  } else {
    const newItem: CartItem = {
      cart_item_id: Date.now() + Math.floor(Math.random() * 1000),
      variant_id: matchedVariant.id,
      product_id: matchedProduct.id,
      product_title: matchedProduct.title,
      product_slug: matchedProduct.slug,
      color_name: matchedVariant.color_name,
      color_hex: matchedVariant.color_hex,
      size_label: matchedVariant.size_label,
      sku: matchedVariant.sku,
      unit_price: effectivePrice,
      original_price: Number(matchedProduct.base_price),
      quantity,
      stock_quantity: matchedVariant.stock_quantity,
      in_stock: true,
      image_url: matchedProduct.primary_image,
      subtotal: quantity * effectivePrice,
    };
    cart.items.push(newItem);
  }

  cart.subtotal = cart.items.reduce((acc, i) => acc + i.subtotal, 0);
  cart.count = cart.items.reduce((acc, i) => acc + i.quantity, 0);
  saveLocalCart(cart);
  return cart;
}

export function updateLocalCartQuantity(cartItemId: number, quantity: number): Cart {
  const cart = getLocalCart();
  const idx = cart.items.findIndex((i) => i.cart_item_id === cartItemId);
  if (idx > -1) {
    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
      cart.items[idx].subtotal = quantity * cart.items[idx].unit_price;
    }
  }
  cart.subtotal = cart.items.reduce((acc, i) => acc + i.subtotal, 0);
  cart.count = cart.items.reduce((acc, i) => acc + i.quantity, 0);
  saveLocalCart(cart);
  return cart;
}

export function removeLocalCartItem(cartItemId: number): Cart {
  return updateLocalCartQuantity(cartItemId, 0);
}
