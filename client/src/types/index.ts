export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  product_count?: number;
}

export interface ProductVariant {
  id: number;
  product_id?: number;
  color_name: string;
  color_hex: string;
  size_label: string;
  sku: string;
  price_override?: number | null;
  stock_quantity: number;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Review {
  id: number;
  product_id: number;
  reviewer_name: string;
  rating: number;
  fit_rating: 'tight' | 'perfect' | 'loose';
  comfort_rating: number;
  review_text: string;
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  fabric?: string;
  fit_type?: string;
  care_instructions?: string;
  base_price: number;
  discount_price?: number | null;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  primary_image?: string;
  secondary_image?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  colors?: { color_name: string; color_hex: string }[];
  sizes?: { size_label: string; stock_quantity: number }[];
  availableColors?: { name: string; hex: string }[];
  availableSizes?: string[];
  reviews?: Review[];
  averageRating?: number;
  review_count?: number;
  relatedProducts?: Partial<Product>[];
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
}

export interface CartItem {
  cart_item_id: number;
  variant_id: number;
  product_id: number;
  product_title: string;
  product_slug: string;
  color_name: string;
  color_hex: string;
  size_label: string;
  sku: string;
  unit_price: number;
  original_price: number;
  quantity: number;
  stock_quantity: number;
  in_stock: boolean;
  image_url?: string;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  count: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'super_admin';
  avatar_url?: string;
}

export interface Address {
  id?: number;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface OrderItem {
  id?: number;
  product_name: string;
  sku: string;
  color_name: string;
  size_label: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Address | string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  coupon_code?: string;
  status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  tracking_carrier?: string;
  payment_status?: string;
  payment_method?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface CouponDiscount {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}
