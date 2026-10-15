import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { openWhatsApp, formatCartWhatsAppMessage } from '../utils/whatsapp';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, freeShippingThreshold } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const shippingCharge = amountToFreeShipping === 0 ? 0 : 50;
  const finalTotal = Math.max(0, cart.subtotal - couponDiscount + shippingCharge);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponMessage(null);
    try {
      const res = await api.applyCoupon(couponInput.trim(), cart.subtotal);
      setCouponDiscount(res.discountAmount);
      setCouponCode(res.code);
      setCouponMessage({ text: `Coupon ${res.code} applied! Saved ₹${res.discountAmount}`, isError: false });
      localStorage.setItem('elvra_applied_coupon', JSON.stringify(res));
    } catch (err: any) {
      setCouponMessage({ text: err.message || 'Invalid coupon code', isError: true });
    } finally {
      setIsApplying(false);
    }
  };

  const handleOrderOnWhatsApp = () => {
    const formatted = formatCartWhatsAppMessage(
      cart.items.map((i) => ({
        title: i.product_title,
        color: i.color_name,
        size: i.size_label,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
      cart.subtotal,
      shippingCharge,
      finalTotal,
      couponCode || undefined,
      couponDiscount || undefined
    );
    openWhatsApp(formatted);
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-cream mx-auto flex items-center justify-center text-charcoal/30">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl text-charcoal">Your Bag is Empty</h1>
        <p className="text-sm text-charcoal/60 max-w-md mx-auto">
          Explore our signature cotton tees, breezy modal loungewear, and relaxed co-ords.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-4 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-sand/40 pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Review Bag</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-1">Shopping Bag</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items Table/List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-sand/40 border-y border-sand/40">
            {cart.items.map((item) => (
              <div key={item.cart_item_id} className="py-6 flex gap-6 items-center">
                <Link to={`/product/${item.product_slug}`}>
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product_title}
                    className="w-24 h-32 object-cover bg-cream rounded shrink-0"
                  />
                </Link>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/product/${item.product_slug}`}>
                        <h3 className="font-serif text-base text-charcoal font-medium hover:text-sage transition-colors">
                          {item.product_title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-charcoal/60 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-sand" style={{ backgroundColor: item.color_hex }} />
                          {item.color_name}
                        </span>
                        <span>&bull;</span>
                        <span className="font-medium">Size: {item.size_label}</span>
                        <span>&bull;</span>
                        <span className="font-sans font-medium text-charcoal">₹{item.unit_price} each</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.cart_item_id)}
                      className="text-charcoal/40 hover:text-terracotta p-1 transition-colors"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity and Subtotal */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center border border-sand bg-white">
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                        className="px-2.5 py-1 text-charcoal/70 hover:text-charcoal text-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                        className="px-2.5 py-1 text-charcoal/70 hover:text-charcoal text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-sans font-semibold text-base text-charcoal">
                      ₹{item.subtotal}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft space-y-6">
          <h2 className="font-serif text-xl text-charcoal font-medium">Order Summary</h2>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-charcoal/40" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-cream/40 border border-sand rounded uppercase focus:outline-none focus:border-sage"
                />
              </div>
              <button
                type="submit"
                disabled={isApplying || !couponInput.trim()}
                className="text-xs uppercase tracking-wider font-semibold px-4 py-2 bg-charcoal text-cream hover:bg-sage transition-colors disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <p className={`text-[11px] font-medium ${couponMessage.isError ? 'text-terracotta' : 'text-sage-dark'}`}>
                {couponMessage.text}
              </p>
            )}
          </form>

          {/* Breakdown */}
          <div className="space-y-3 text-xs text-charcoal/80 border-t border-sand/40 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">₹{cart.subtotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-terracotta">
                <span>Discount ({couponCode})</span>
                <span className="font-semibold">-₹{couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="font-semibold text-charcoal">
                {shippingCharge === 0 ? <span className="text-sage-dark">FREE</span> : '₹50'}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-sand/40">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleOrderOnWhatsApp}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 px-6 text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 transition-all shadow-sm rounded"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp (Instant)</span>
            </button>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-sage hover:bg-sage-dark text-cream py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all shadow-elevated rounded"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal/60 pt-2">
            <ShieldCheck className="w-4 h-4 text-sage" />
            <span>Instant WhatsApp Confirmation & Razorpay Gateway Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};
