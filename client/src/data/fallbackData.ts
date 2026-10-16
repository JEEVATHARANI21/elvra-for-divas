import { Product, Category, Cart, CartItem, ProductVariant, Review } from '../types';

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Everyday Tops',
    slug: 'everyday-tops',
    description: 'Effortless graphic & plain tees, relaxed boyfriend cuts, and feminine collared tops.',
    image_url: '/images/products/product-9.png',
    display_order: 1,
    product_count: 7,
  },
  {
    id: 2,
    name: 'Loungewear',
    slug: 'loungewear',
    description: 'Buttery soft modal coordinates and relaxed weekend tees made to unwind.',
    image_url: '/images/products/product-4.png',
    display_order: 2,
    product_count: 2,
  },
  {
    id: 3,
    name: 'Track Pants',
    slug: 'track-pants',
    description: 'Relaxed joggers, tapered comfort tracks, and wide-leg bottoms for easy movement.',
    image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    product_count: 2,
  },
  {
    id: 4,
    name: 'Co-ord Sets',
    slug: 'co-ord-sets',
    description: 'Architectural silhouettes and coordinated sets for an elevated everyday look.',
    image_url: '/images/products/product-5.png',
    display_order: 4,
    product_count: 2,
  },
];

export const FALLBACK_COLLECTIONS = [
  {
    id: 1,
    name: 'Everyday Comfort',
    slug: 'everyday-comfort',
    description: 'Core graphic tees and essential basics crafted from cloud-soft combed organic cotton.',
    banner_image: '/images/products/product-9.png',
    is_active: 1,
    product_count: 4,
  },
  {
    id: 2,
    name: 'Lounge Edit',
    slug: 'lounge-edit',
    description: 'Featherweight weekend tees and fluid modal sets that breathe and move with your body.',
    banner_image: '/images/products/product-4.png',
    is_active: 1,
    product_count: 3,
  },
  {
    id: 3,
    name: 'Weekend Edit',
    slug: 'weekend-edit',
    description: 'Vibrant pop tones and relaxed boyfriend fits made for slow mornings and café catchups.',
    banner_image: '/images/products/product-6.png',
    is_active: 1,
    product_count: 3,
  },
  {
    id: 4,
    name: 'New Collection',
    slug: 'new-collection',
    description: 'Our newest seasonal release of statement typography and sculptural feminine tops.',
    banner_image: '/images/products/product-5.png',
    is_active: 1,
    product_count: 4,
  },
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: '"Be You" Sage Graphic Oversized Tee',
    slug: 'be-you-sage-graphic-tee',
    subtitle: 'Signature oversized organic cotton tee with positive statement typography',
    description: 'The defining piece of the Elvra collection. Crafted from 100% cloud-finish combed organic cotton in our signature Sage Green. Features a relaxed drop-shoulder cut, breathable crewneck, and clean chest embroidery: "Be you, The world will adjust."',
    fabric: '100% Combed Organic Cotton (190 GSM)',
    fit_type: 'Oversized Boyfriend Fit',
    care_instructions: 'Machine wash cold inside out on gentle cycle. Reshape while damp, line dry in shade. Warm iron on reverse.',
    base_price: 999,
    discount_price: 799,
    is_featured: true,
    is_new: true,
    is_active: true,
    primary_image: '/images/products/product-9.png',
    secondary_image: '/images/products/product-10.png',
    images: [
      { id: 1, image_url: '/images/products/product-9.png', is_primary: true, sort_order: 1 },
      { id: 2, image_url: '/images/products/product-10.png', is_primary: false, sort_order: 2 },
    ],
    availableColors: [
      { name: 'Sage Green', hex: '#8A9A86' },
      { name: 'Pistachio', hex: '#A3B899' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 1, product_id: 1, sku: 'ELV-BYU-SGE-S', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'S', stock_quantity: 20 },
      { id: 2, product_id: 1, sku: 'ELV-BYU-SGE-M', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'M', stock_quantity: 35 },
      { id: 3, product_id: 1, sku: 'ELV-BYU-SGE-L', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'L', stock_quantity: 25 },
      { id: 4, product_id: 1, sku: 'ELV-BYU-SGE-XL', color_name: 'Sage Green', color_hex: '#8A9A86', size_label: 'XL', stock_quantity: 15 },
    ],
    averageRating: 5.0,
    review_count: 5,
    reviews: [
      { id: 1, product_id: 1, reviewer_name: 'Kavya S.', rating: 5, fit_rating: 'perfect', comfort_rating: 5, review_text: 'The sage color is even prettier in person! Super soft fabric and the print quality is top-notch.', created_at: '2026-10-10T10:00:00Z' },
      { id: 2, product_id: 1, reviewer_name: 'Divya M.', rating: 5, fit_rating: 'perfect', comfort_rating: 5, review_text: 'Love the oversized drape. The message always brings compliments!', created_at: '2026-10-12T12:30:00Z' },
    ],
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: '"Satisfy Your Soul" Lavender Boyfriend Tee',
    slug: 'satisfy-your-soul-lavender-tee',
    subtitle: 'Relaxed side-slit boyfriend tee in soothing pastel lilac',
    description: 'Designed for effortless casual days. Soft lilac combed jersey featuring minimal typography: "Satisfy your soul, not the society." Built with subtle side-slits at the hem for a modern French tuck or easy flow over track pants.',
    fabric: '100% Cloud Cotton Jersey (180 GSM)',
    fit_type: 'Relaxed Drop-Shoulder',
    care_instructions: 'Gentle machine wash with like colors. Do not bleach. Cool tumble dry.',
    base_price: 999,
    discount_price: 849,
    is_featured: true,
    is_new: true,
    is_active: true,
    primary_image: '/images/products/product-6.png',
    secondary_image: '/images/products/product-6.png',
    images: [
      { id: 3, image_url: '/images/products/product-6.png', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Soft Lilac', hex: '#C8B6DB' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 5, product_id: 2, sku: 'ELV-SOUL-LIL-S', color_name: 'Soft Lilac', color_hex: '#C8B6DB', size_label: 'S', stock_quantity: 18 },
      { id: 6, product_id: 2, sku: 'ELV-SOUL-LIL-M', color_name: 'Soft Lilac', color_hex: '#C8B6DB', size_label: 'M', stock_quantity: 28 },
      { id: 7, product_id: 2, sku: 'ELV-SOUL-LIL-L', color_name: 'Soft Lilac', color_hex: '#C8B6DB', size_label: 'L', stock_quantity: 22 },
      { id: 8, product_id: 2, sku: 'ELV-SOUL-LIL-XL', color_name: 'Soft Lilac', color_hex: '#C8B6DB', size_label: 'XL', stock_quantity: 12 },
    ],
    averageRating: 4.9,
    review_count: 4,
    reviews: [
      { id: 3, product_id: 2, reviewer_name: 'Ananya P.', rating: 5, fit_rating: 'perfect', comfort_rating: 5, review_text: 'The lavender hue is serene and elegant. Does not shrink after washing.', created_at: '2026-10-11T14:00:00Z' },
    ],
  },
  {
    id: 3,
    category_id: 2,
    category_name: 'Loungewear',
    category_slug: 'loungewear',
    title: '"Busy Doing Sunday" Berry Lounge Tee',
    slug: 'busy-doing-sunday-berry-tee',
    subtitle: 'Playful weekend scoop-neck lounge tee in radiant berry pink',
    description: 'Celebrate the art of slow weekends. Radiant berry-pink cotton with celestial doodles and "I\'m busy doing SUNDAY" lettering. Flattering feminine scoop neckline and slightly elongated curved hem.',
    fabric: '95% Breathable Cotton, 5% Stretch Spandex',
    fit_type: 'Comfort Scoop Fit',
    care_instructions: 'Machine wash cold on gentle cycle. Lay flat or hang to dry in shade.',
    base_price: 899,
    discount_price: 699,
    is_featured: true,
    is_new: false,
    is_active: true,
    primary_image: '/images/products/product-4.png',
    secondary_image: '/images/products/product-4.png',
    images: [
      { id: 4, image_url: '/images/products/product-4.png', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Berry Fuchsia', hex: '#DE3163' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 9, product_id: 3, sku: 'ELV-SUN-BRY-S', color_name: 'Berry Fuchsia', color_hex: '#DE3163', size_label: 'S', stock_quantity: 16 },
      { id: 10, product_id: 3, sku: 'ELV-SUN-BRY-M', color_name: 'Berry Fuchsia', color_hex: '#DE3163', size_label: 'M', stock_quantity: 24 },
      { id: 11, product_id: 3, sku: 'ELV-SUN-BRY-L', color_name: 'Berry Fuchsia', color_hex: '#DE3163', size_label: 'L', stock_quantity: 18 },
      { id: 12, product_id: 3, sku: 'ELV-SUN-BRY-XL', color_name: 'Berry Fuchsia', color_hex: '#DE3163', size_label: 'XL', stock_quantity: 8 },
    ],
    averageRating: 4.8,
    review_count: 3,
  },
  {
    id: 4,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: '"New Beginnings" Ocean Indigo Tee',
    slug: 'new-beginnings-ocean-indigo-tee',
    subtitle: 'Subtle embroidered script tee in rich deep indigo',
    description: 'Deep ocean indigo crewneck tee featuring delicate white script: "new beginnings ♡". Breathable pure cotton designed for peaceful everyday journeys and confidence in movement.',
    fabric: '100% Ringspun Combed Cotton (185 GSM)',
    fit_type: 'Classic Regular Fit',
    care_instructions: 'Machine wash cold with darks. Warm iron on reverse.',
    base_price: 899,
    discount_price: 749,
    is_featured: true,
    is_new: true,
    is_active: true,
    primary_image: '/images/products/product-3.png',
    secondary_image: '/images/products/product-3.png',
    images: [
      { id: 5, image_url: '/images/products/product-3.png', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Ocean Indigo', hex: '#2B547E' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 13, product_id: 4, sku: 'ELV-NEW-IND-S', color_name: 'Ocean Indigo', color_hex: '#2B547E', size_label: 'S', stock_quantity: 15 },
      { id: 14, product_id: 4, sku: 'ELV-NEW-IND-M', color_name: 'Ocean Indigo', color_hex: '#2B547E', size_label: 'M', stock_quantity: 25 },
      { id: 15, product_id: 4, sku: 'ELV-NEW-IND-L', color_name: 'Ocean Indigo', color_hex: '#2B547E', size_label: 'L', stock_quantity: 18 },
      { id: 16, product_id: 4, sku: 'ELV-NEW-IND-XL', color_name: 'Ocean Indigo', color_hex: '#2B547E', size_label: 'XL', stock_quantity: 10 },
    ],
    averageRating: 5.0,
    review_count: 3,
  },
  {
    id: 5,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: 'Origami Asymmetric Collar Cap-Sleeve Top',
    slug: 'origami-collar-cap-sleeve-top',
    subtitle: 'Sculpted foldover cowl collar with cap sleeves in deep magenta',
    description: 'An architectural silhouette crafted for discerning women. Features an elegant asymmetric foldover collar inspired by Japanese origami, paired with gently gathered cap sleeves in rich saturated magenta.',
    fabric: '92% Mercerized Cotton, 8% Elastane',
    fit_type: 'Tailored Feminine Contour',
    care_instructions: 'Hand wash cold or gentle machine cycle in mesh bag. Reshape collar while damp.',
    base_price: 1299,
    discount_price: 999,
    is_featured: true,
    is_new: true,
    is_active: true,
    primary_image: '/images/products/product-5.png',
    secondary_image: '/images/products/product-5.png',
    images: [
      { id: 6, image_url: '/images/products/product-5.png', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Deep Magenta', hex: '#C2185B' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 17, product_id: 5, sku: 'ELV-ORI-MAG-S', color_name: 'Deep Magenta', color_hex: '#C2185B', size_label: 'S', stock_quantity: 12 },
      { id: 18, product_id: 5, sku: 'ELV-ORI-MAG-M', color_name: 'Deep Magenta', color_hex: '#C2185B', size_label: 'M', stock_quantity: 18 },
      { id: 19, product_id: 5, sku: 'ELV-ORI-MAG-L', color_name: 'Deep Magenta', color_hex: '#C2185B', size_label: 'L', stock_quantity: 14 },
      { id: 20, product_id: 5, sku: 'ELV-ORI-MAG-XL', color_name: 'Deep Magenta', color_hex: '#C2185B', size_label: 'XL', stock_quantity: 8 },
    ],
    averageRating: 5.0,
    review_count: 2,
  },
  {
    id: 6,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: 'Elvra Essential Cream Minimalist Tee',
    slug: 'elvra-essential-cream-tee',
    subtitle: 'The timeless neutral foundation piece in cloud-finish cotton',
    description: 'Every curated wardrobe starts here. Natural off-white cream tone with featherweight drape, non-sheer premium weave, and ribbed micro-collar that holds its shape forever.',
    fabric: '100% Combed Organic Cotton (180 GSM)',
    fit_type: 'Relaxed Straight Fit',
    care_instructions: 'Machine wash cold with whites. Tumble dry low.',
    base_price: 799,
    discount_price: 649,
    is_featured: true,
    is_new: false,
    is_active: true,
    primary_image: '/images/products/product-1.png',
    secondary_image: '/images/products/product-1.png',
    images: [
      { id: 7, image_url: '/images/products/product-1.png', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Cream White', hex: '#FAF8F5' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 21, product_id: 6, sku: 'ELV-ESS-CRM-S', color_name: 'Cream White', color_hex: '#FAF8F5', size_label: 'S', stock_quantity: 25 },
      { id: 22, product_id: 6, sku: 'ELV-ESS-CRM-M', color_name: 'Cream White', color_hex: '#FAF8F5', size_label: 'M', stock_quantity: 35 },
      { id: 23, product_id: 6, sku: 'ELV-ESS-CRM-L', color_name: 'Cream White', color_hex: '#FAF8F5', size_label: 'L', stock_quantity: 30 },
      { id: 24, product_id: 6, sku: 'ELV-ESS-CRM-XL', color_name: 'Cream White', color_hex: '#FAF8F5', size_label: 'XL', stock_quantity: 15 },
    ],
    averageRating: 4.9,
    review_count: 6,
  },
  {
    id: 7,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: 'Vivid Pink Statement Crewneck Tee',
    slug: 'vivid-pink-statement-crew-tee',
    subtitle: 'High-energy statement crewneck in rich hot pink',
    description: 'Inject joyous color into your casual rotation. Premium enzyme-washed cotton ensures rich color vibrancy wash after wash, while maintaining touchable softness.',
    fabric: '100% Enzyme-Washed Combed Cotton',
    fit_type: 'Classic Regular',
    care_instructions: 'Machine wash warm with like colors. Line dry.',
    base_price: 799,
    discount_price: 649,
    is_featured: false,
    is_new: true,
    is_active: true,
    primary_image: '/images/products/product-2.png',
    secondary_image: '/images/products/product-2.png',
    images: [
      { id: 8, image_url: '/images/products/product-2.png', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Vivid Pink', hex: '#FF3399' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 25, product_id: 7, sku: 'ELV-VVD-PNK-S', color_name: 'Vivid Pink', color_hex: '#FF3399', size_label: 'S', stock_quantity: 15 },
      { id: 26, product_id: 7, sku: 'ELV-VVD-PNK-M', color_name: 'Vivid Pink', color_hex: '#FF3399', size_label: 'M', stock_quantity: 22 },
      { id: 27, product_id: 7, sku: 'ELV-VVD-PNK-L', color_name: 'Vivid Pink', color_hex: '#FF3399', size_label: 'L', stock_quantity: 18 },
      { id: 28, product_id: 7, sku: 'ELV-VVD-PNK-XL', color_name: 'Vivid Pink', color_hex: '#FF3399', size_label: 'XL', stock_quantity: 10 },
    ],
    averageRating: 4.8,
    review_count: 2,
  },
  {
    id: 8,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: 'Heritage Crimson Pique Cotton Polo',
    slug: 'heritage-crimson-pique-polo',
    subtitle: 'Classic ribbed collar polo with chest pocket in Crimson Red',
    description: 'Structured elegance made for active days, travel, and smart-casual outings. Features breathable honeycomb pique knit, Mother-of-Pearl finished tonal buttons, and reinforced chest pocket.',
    fabric: '100% Pique Knit Cotton (220 GSM)',
    fit_type: 'Tailored Polo Fit',
    care_instructions: 'Machine wash warm inside out. Flat dry collar to preserve crisp line.',
    base_price: 1399,
    discount_price: 1099,
    is_featured: false,
    is_new: false,
    is_active: true,
    primary_image: '/images/products/product-7.png',
    secondary_image: '/images/products/product-7.png',
    images: [
      { id: 9, image_url: '/images/products/product-7.png', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Crimson Red', hex: '#D32F2F' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 29, product_id: 8, sku: 'ELV-POLO-RED-S', color_name: 'Crimson Red', color_hex: '#D32F2F', size_label: 'S', stock_quantity: 14 },
      { id: 30, product_id: 8, sku: 'ELV-POLO-RED-M', color_name: 'Crimson Red', color_hex: '#D32F2F', size_label: 'M', stock_quantity: 20 },
      { id: 31, product_id: 8, sku: 'ELV-POLO-RED-L', color_name: 'Crimson Red', color_hex: '#D32F2F', size_label: 'L', stock_quantity: 16 },
      { id: 32, product_id: 8, sku: 'ELV-POLO-RED-XL', color_name: 'Crimson Red', color_hex: '#D32F2F', size_label: 'XL', stock_quantity: 8 },
    ],
    averageRating: 4.9,
    review_count: 2,
  },
  {
    id: 9,
    category_id: 1,
    category_name: 'Everyday Tops',
    category_slug: 'everyday-tops',
    title: 'Sunshine Yellow Combed Cotton Tee',
    slug: 'sunshine-yellow-combed-tee',
    subtitle: 'Cheerful sunshine yellow essential with interior comfort collar band',
    description: 'Brimming with optimism and warmth. Saturated canary yellow crewneck knit with combed cotton yarn for a feather-light feel on warm sunny days.',
    fabric: '100% Combed Cotton (180 GSM)',
    fit_type: 'Classic Regular',
    care_instructions: 'Gentle wash with brights. Dry in shade.',
    base_price: 799,
    discount_price: 649,
    is_featured: false,
    is_new: false,
    is_active: true,
    primary_image: '/images/products/product-8.png',
    secondary_image: '/images/products/product-8.png',
    images: [
      { id: 10, image_url: '/images/products/product-8.png', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Canary Yellow', hex: '#FBC02D' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 33, product_id: 9, sku: 'ELV-SUN-YEL-S', color_name: 'Canary Yellow', color_hex: '#FBC02D', size_label: 'S', stock_quantity: 15 },
      { id: 34, product_id: 9, sku: 'ELV-SUN-YEL-M', color_name: 'Canary Yellow', color_hex: '#FBC02D', size_label: 'M', stock_quantity: 20 },
      { id: 35, product_id: 9, sku: 'ELV-SUN-YEL-L', color_name: 'Canary Yellow', color_hex: '#FBC02D', size_label: 'L', stock_quantity: 15 },
      { id: 36, product_id: 9, sku: 'ELV-SUN-YEL-XL', color_name: 'Canary Yellow', color_hex: '#FBC02D', size_label: 'XL', stock_quantity: 8 },
    ],
    averageRating: 5.0,
    review_count: 1,
  },
  {
    id: 10,
    category_id: 3,
    category_name: 'Track Pants',
    category_slug: 'track-pants',
    title: 'Serene Flow Tapered Track Pants',
    slug: 'serene-flow-track-pants',
    subtitle: 'High-waisted tapered joggers with deep phone pockets',
    description: 'The perfect pairing for all Elvra graphic and essential tees. Features a wide, non-pinching waistband, deep hidden phone pockets, and tapered ribbed cuffs.',
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
      { id: 11, image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Deep Charcoal', hex: '#2B2D2F' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 37, product_id: 10, sku: 'ELV-TRK-CHR-S', color_name: 'Deep Charcoal', color_hex: '#2B2D2F', size_label: 'S', stock_quantity: 14 },
      { id: 38, product_id: 10, sku: 'ELV-TRK-CHR-M', color_name: 'Deep Charcoal', color_hex: '#2B2D2F', size_label: 'M', stock_quantity: 22 },
      { id: 39, product_id: 10, sku: 'ELV-TRK-CHR-L', color_name: 'Deep Charcoal', color_hex: '#2B2D2F', size_label: 'L', stock_quantity: 18 },
      { id: 40, product_id: 10, sku: 'ELV-TRK-CHR-XL', color_name: 'Deep Charcoal', color_hex: '#2B2D2F', size_label: 'XL', stock_quantity: 9 },
    ],
    averageRating: 4.8,
    review_count: 3,
  },
  {
    id: 11,
    category_id: 2,
    category_name: 'Loungewear',
    category_slug: 'loungewear',
    title: 'Breeze Modal 2-Piece Lounge Set',
    slug: 'breeze-modal-lounge-set',
    subtitle: 'Ultra-breathable 2-piece loungewear duo in sustainable modal',
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
      { id: 12, image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80', is_primary: true, sort_order: 1 },
    ],
    availableColors: [
      { name: 'Warm Sand', hex: '#E5D9C5' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 41, product_id: 11, sku: 'ELV-LNG-SND-S', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'S', stock_quantity: 10 },
      { id: 42, product_id: 11, sku: 'ELV-LNG-SND-M', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'M', stock_quantity: 15 },
      { id: 43, product_id: 11, sku: 'ELV-LNG-SND-L', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'L', stock_quantity: 12 },
      { id: 44, product_id: 11, sku: 'ELV-LNG-SND-XL', color_name: 'Warm Sand', color_hex: '#E5D9C5', size_label: 'XL', stock_quantity: 7 },
    ],
    averageRating: 5.0,
    review_count: 4,
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

export function clearLocalCart(): Cart {
  const emptyCart: Cart = { id: 1, items: [], subtotal: 0, count: 0 };
  saveLocalCart(emptyCart);
  return emptyCart;
}

const LOCAL_PRODUCTS_KEY = 'elvra_custom_products';

export function getActiveProducts(): Product[] {
  const custom = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {}
  }
  return FALLBACK_PRODUCTS;
}

export function saveActiveProduct(updatedProduct: Product): Product[] {
  const list = [...getActiveProducts()];
  const idx = list.findIndex((p) => p.id === updatedProduct.id);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...updatedProduct };
  } else {
    list.unshift(updatedProduct);
  }
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
  return list;
}

export function deleteActiveProduct(productId: number): Product[] {
  const list = getActiveProducts().filter((p) => p.id !== productId);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
  return list;
}

export function createActiveProduct(data: any): Product {
  const list = getActiveProducts();
  const newId = Date.now();
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${newId}`;

  const newProduct: Product = {
    id: newId,
    title: data.title,
    slug,
    subtitle: data.subtitle || '',
    description: data.description || '',
    fabric: data.fabric || '100% Combed Cotton',
    fit_type: data.fitType || 'Relaxed Fit',
    care_instructions: data.careInstructions || 'Machine wash cold with like colors.',
    base_price: Number(data.basePrice) || 899,
    discount_price: data.discountPrice ? Number(data.discountPrice) : null,
    category_id: data.categoryId || 1,
    category_name: data.categoryName || 'Everyday Tops',
    category_slug: data.categorySlug || 'everyday-tops',
    primary_image: data.primaryImage || data.images?.[0] || '/images/products/product-1.png',
    secondary_image: data.secondaryImage || data.images?.[1] || data.primaryImage || '/images/products/product-1.png',
    images: (data.images || [data.primaryImage || '/images/products/product-1.png']).map((url: string, i: number) => ({
      id: newId + i,
      image_url: url,
      is_primary: i === 0,
      sort_order: i,
    })),
    variants: data.variants && data.variants.length > 0 ? data.variants : [
      { id: newId * 10 + 1, size_label: 'S', color_name: 'Standard', color_hex: '#8A9A86', sku: `ELV-${newId}-S`, stock_quantity: 15 },
      { id: newId * 10 + 2, size_label: 'M', color_name: 'Standard', color_hex: '#8A9A86', sku: `ELV-${newId}-M`, stock_quantity: 20 },
      { id: newId * 10 + 3, size_label: 'L', color_name: 'Standard', color_hex: '#8A9A86', sku: `ELV-${newId}-L`, stock_quantity: 18 },
      { id: newId * 10 + 4, size_label: 'XL', color_name: 'Standard', color_hex: '#8A9A86', sku: `ELV-${newId}-XL`, stock_quantity: 12 },
    ],
    availableSizes: data.availableSizes || ['S', 'M', 'L', 'XL'],
    availableColors: data.availableColors || [{ name: 'Standard', hex: '#8A9A86' }],
    is_featured: !!data.isFeatured,
    is_new: !!data.isNew,
    is_active: data.isActive !== false,
  };

  list.unshift(newProduct);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
  return newProduct;
}

export function resetActiveProducts(): Product[] {
  localStorage.removeItem(LOCAL_PRODUCTS_KEY);
  return FALLBACK_PRODUCTS;
}


