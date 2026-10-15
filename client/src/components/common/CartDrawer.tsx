import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { openWhatsApp, formatCartWhatsAppMessage } from '../../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeItem, freeShippingThreshold } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingProgress = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await api.applyCoupon(couponInput.trim(), cart.subtotal);
      setCouponDiscount(res.discountAmount);
      setCouponCode(res.code);
      setCouponSuccess(`Coupon ${res.code} applied! Saved ₹${res.discountAmount}`);
      localStorage.setItem('elvra_applied_coupon', JSON.stringify(res));
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    closeDrawer();
    const shippingFee = amountToFreeShipping === 0 ? 0 : 50;
    const estTotal = Math.max(0, cart.subtotal - couponDiscount + shippingFee);
    const message = formatCartWhatsAppMessage(
      cart.items.map((i) => ({
        title: i.product_title,
        color: i.color_name,
        size: i.size_label,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
      cart.subtotal,
      shippingFee,
      estTotal,
      couponCode || undefined,
      couponDiscount || undefined
    );
    openWhatsApp(message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-sand/40 flex items-center justify-between bg-cream">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sage-dark" />
              <h3 className="font-serif text-lg tracking-wide text-charcoal font-medium">Your Bag</h3>
              <span className="text-xs bg-sage/20 text-sage-dark px-2 py-0.5 rounded-full font-semibold">
                {cart.count}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-charcoal/60 hover:text-charcoal transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-sand-light/60 px-5 py-3 border-b border-sand/30">
            {amountToFreeShipping > 0 ? (
              <p className="text-xs text-charcoal/80 font-medium">
                Add <span className="font-bold text-terracotta">₹{amountToFreeShipping}</span> more to unlock <span className="font-bold text-sage-dark">FREE Express Shipping</span>!
              </p>
            ) : (
              <p className="text-xs text-sage-dark font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sage" />
                <span>You qualify for <strong>FREE Express Shipping</strong>!</span>
              </p>
            )}
            <div className="w-full bg-sand/40 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-sage h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-charcoal/30">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-charcoal">Your bag is empty</h4>
                  <p className="text-xs text-charcoal/60 mt-1 max-w-xs">
                    Discover effortless comfort and modern essentials made for your journeys.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/shop');
                  }}
                  className="mt-2 text-xs uppercase tracking-widest font-semibold bg-sage text-cream px-6 py-3 hover:bg-sage-dark transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex gap-4 p-3 rounded-lg border border-sand/40 hover:border-sand bg-white transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product_title}
                    className="w-20 h-24 object-cover rounded bg-cream shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-medium text-charcoal leading-tight line-clamp-1">
                          {item.product_title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.cart_item_id)}
                          className="text-charcoal/40 hover:text-terracotta p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <div className="flex items-center gap-2 mt-1 text-xs text-charcoal/60">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-sand inline-block"
                            style={{ backgroundColor: item.color_hex }}
                          />
                          {item.color_name}
                        </span>
                        <span>&bull;</span>
                        <span className="font-medium bg-cream px-1.5 py-0.5 rounded text-[11px] border border-sand/40">
                          {item.size_label}
                        </span>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-sand/80 rounded bg-cream/60">
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                          className="p-1 text-charcoal/70 hover:text-charcoal"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                          className="p-1 text-charcoal/70 hover:text-charcoal"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-sans text-sm font-semibold text-charcoal">
                          ₹{item.subtotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Subtotal & Checkout */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-sand/40 bg-cream/70 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-charcoal/40" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. ELVRA10)"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-sand rounded uppercase focus:outline-none focus:border-sage"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="text-xs uppercase tracking-wider font-semibold px-4 py-2 bg-charcoal text-cream hover:bg-sage transition-colors disabled:opacity-50"
                  >
                    {isApplying ? '...' : 'Apply'}
                  </button>
                </div>
                {couponSuccess && (
                  <p className="text-[11px] text-sage-dark font-medium">{couponSuccess}</p>
                )}
                {couponError && (
                  <p className="text-[11px] text-terracotta font-medium">{couponError}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal/80 pt-2 border-t border-sand/30">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">₹{cart.subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-terracotta">
                    <span>Discount ({couponCode})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-charcoal">
                    {amountToFreeShipping === 0 ? (
                      <span className="text-sage-dark font-semibold">FREE</span>
                    ) : (
                      '₹50'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-charcoal pt-2 border-t border-sand/40">
                  <span>Estimated Total</span>
                  <span>
                    ₹{Math.max(0, cart.subtotal - couponDiscount + (amountToFreeShipping === 0 ? 0 : 50))}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 text-xs uppercase tracking-[0.12em] flex items-center justify-center gap-2 shadow-sm rounded transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order via WhatsApp (Instant)</span>
                </button>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-sage hover:bg-sage-dark text-cream font-medium py-3 px-4 text-xs uppercase tracking-[0.12em] flex items-center justify-center gap-2 shadow-soft hover:shadow-elevated transition-all rounded"
                >
                  <span>Standard Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
