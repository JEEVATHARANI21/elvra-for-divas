import { Product, Category, Cart, User, Address, Order, CouponDiscount, Review } from '../types';

const API_BASE = '/api';

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

export const api = {
  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; count: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
    return data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Product not found');
    return data.product;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
    return data.categories;
  },

  // Collections
  async getCollections(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/collections`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch collections');
    return data.collections;
  },

  async getCollectionBySlug(slug: string): Promise<any> {
    const res = await fetch(`${API_BASE}/collections/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Collection not found');
    return data.collection;
  },

  // Order Preview (Authoritative server calculation)
  async previewOrder(cartItems: { variantId: number; quantity: number }[], couponCode?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/orders/preview`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cartItems, couponCode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to calculate order preview');
    return data.calculation;
  },

  // Settings & Banners
  async getSettings(): Promise<{ settings: Record<string, string>; banners: any[] }> {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch settings');
    return data;
  },

  // Cart
  async getCart(): Promise<Cart> {
    const sessionId = getSessionId();
    const res = await fetch(`${API_BASE}/cart?sessionId=${sessionId}`, {
      headers: {
        ...getAuthHeaders(),
        'x-session-id': sessionId,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch cart');
    return data.cart;
  },

  async addToCart(productVariantId: number, quantity: number = 1): Promise<void> {
    const sessionId = getSessionId();
    const res = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'x-session-id': sessionId,
      },
      body: JSON.stringify({ productVariantId, quantity, sessionId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add item to bag');
  },

  async updateCartItem(itemId: number, quantity: number): Promise<void> {
    const res = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update bag');
  },

  async removeCartItem(itemId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/cart/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to remove item');
  },

  // Coupons
  async applyCoupon(code: string, orderAmount: number): Promise<CouponDiscount> {
    const res = await fetch(`${API_BASE}/coupons/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code, orderAmount }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to apply coupon');
    return data.coupon;
  },

  // Payments & Checkout
  async createPaymentOrder(orderData: any): Promise<{
    order: { id: number; orderNumber: string; totalAmount: number; subtotal: number };
    payment: { razorpayOrderId: string; amount: number; currency: string; keyId: string; isSandboxMode: boolean };
  }> {
    const res = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create payment order');
    return data;
  },

  async verifyPayment(verificationData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(verificationData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Payment verification failed');
    return data;
  },

  // Orders
  async getUserOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch your orders');
    return data.orders;
  },

  async getOrderDetail(orderNumber: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderNumber}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order not found');
    return data.order;
  },

  async trackOrder(orderNumber: string, emailOrPhone: string): Promise<any> {
    const query = new URLSearchParams({ orderNumber, emailOrPhone });
    const res = await fetch(`${API_BASE}/orders/track?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order tracking not found');
    return data.order;
  },

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getProfile(): Promise<{ user: User; addresses: Address[] }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  },

  async saveAddress(address: Address): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/address`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(address),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save address');
  },

  // Reviews
  async postReview(reviewData: any): Promise<void> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit review');
  },

  // Admin
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load admin stats');
    return data.stats;
  },

  async getAdminProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load products');
    return data.products;
  },

  async createAdminProduct(productData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  },

  async getAdminOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load orders');
    return data.orders;
  },

  async updateAdminOrderStatus(orderId: number, status: string, trackingNumber?: string, trackingCarrier?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, trackingNumber, trackingCarrier }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order status');
  },
};
