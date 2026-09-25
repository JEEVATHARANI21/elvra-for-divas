import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ChevronRight, Truck, CreditCard, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Customer Details
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: '',
  });

  // Coupon applied
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart');
    }
    // Load coupon if previously applied in drawer/cart
    const saved = localStorage.getItem('elvra_applied_coupon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCouponCode(parsed.code);
        setDiscountAmount(parsed.discountAmount || 0);
      } catch {}
    }
  }, [cart, navigate]);

  const shippingFee = cart.subtotal >= 999 ? 0 : 50;
  const finalTotal = Math.max(0, cart.subtotal - discountAmount + shippingFee);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.addressLine1 || !formData.city || !formData.pincode) {
      setErrorMessage('Please fill in all required delivery fields.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleContinueToDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleContinueToPayment = () => {
    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  // Launch Razorpay Payment
  const handlePayNow = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Call Backend to create order and Razorpay order
      const orderPayload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          recipient_name: formData.name,
          phone: formData.phone,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: cart.items.map((i) => ({
          variantId: i.variant_id,
          quantity: i.quantity,
        })),
        couponCode: couponCode || undefined,
      };

      const { order, payment } = await api.createPaymentOrder(orderPayload);

      // Check if standard Razorpay checkout is available & not simulated
      if (window.Razorpay && !payment.isSandboxMode) {
        const options = {
          key: payment.keyId,
          amount: payment.amount,
          currency: payment.currency,
          name: 'Elvra For Divas',
          description: `Order ${order.orderNumber} - Wings to Explore`,
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80',
          order_id: payment.razorpayOrderId,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#8A9A86', // Brand Sage Green
          },
          handler: async function (response: any) {
            // 2. Signature verification on backend
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_number: order.orderNumber,
              cart_id: cart.id,
            });
            await refreshCart();
            localStorage.removeItem('elvra_applied_coupon');
            navigate(`/order-success/${order.orderNumber}`);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Test / Sandbox Simulation Mode (Placeholder keys active)
        // Simulate real Razorpay checkout and verification flow
        setTimeout(async () => {
          try {
            await api.verifyPayment({
              razorpay_order_id: payment.razorpayOrderId,
              razorpay_payment_id: `pay_test_${Date.now()}`,
              razorpay_signature: 'test_verified_signature',
              order_number: order.orderNumber,
              payment_method: 'UPI / Razorpay Test',
              cart_id: cart.id,
            });
            await refreshCart();
            localStorage.removeItem('elvra_applied_coupon');
            navigate(`/order-success/${order.orderNumber}`);
          } catch (verErr: any) {
            setErrorMessage(verErr.message || 'Payment confirmation failed');
            setIsProcessing(false);
          }
        }, 1200);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Failed to initialize payment.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 3-Step Breadcrumb Indicator */}
      <div className="flex items-center justify-center mb-10 text-xs uppercase tracking-wider font-semibold">
        <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-sage-dark' : 'text-charcoal/40'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-sage text-cream' : 'bg-sand'}`}>
            1
          </span>
          <span>Customer Details</span>
        </div>
        <ChevronRight className="w-4 h-4 mx-3 text-sand" />
        <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-sage-dark' : 'text-charcoal/40'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-sage text-cream' : 'bg-sand'}`}>
            2
          </span>
          <span>Delivery</span>
        </div>
        <ChevronRight className="w-4 h-4 mx-3 text-sand" />
        <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-sage-dark' : 'text-charcoal/40'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-sage text-cream' : 'bg-sand'}`}>
            3
          </span>
          <span>Payment</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-terracotta-light text-terracotta-dark text-xs rounded border border-terracotta/30">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Steps Form Area (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft">
          {/* STEP 1: CUSTOMER DETAILS */}
          {currentStep === 1 && (
            <form onSubmit={handleContinueToDelivery} className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-charcoal font-medium">Step 1 — Customer & Shipping Details</h3>
                <p className="text-xs text-charcoal/60 mt-0.5">Where shall we send your Elvra pieces?</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-charcoal/70 font-semibold uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-cream/40 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal/70 font-semibold uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="diva@example.com"
                      className="w-full bg-cream/40 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal/70 font-semibold uppercase mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-cream/40 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal/70 font-semibold uppercase mb-1">Flat, House no., Apartment *</label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="e.g. 42, Lotus Villa, 3rd Cross"
                    className="w-full bg-cream/40 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                  />
                </div>

                <div>
                  <label className="block text-charcoal/70 font-semibold uppercase mb-1">Area, Street, Landmark</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="e.g. Near Indiranagar Metro"
                    className="w-full bg-cream/40 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-charcoal/70 font-semibold uppercase mb-1">City *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full bg-cream/40 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal/70 font-semibold uppercase mb-1">State *</label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full bg-cream/40 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-charcoal/70 font-semibold uppercase mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="600001"
                      className="w-full bg-cream/40 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Delivery</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: DELIVERY VERIFICATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-charcoal font-medium">Step 2 — Delivery & Shipping Method</h3>
                <p className="text-xs text-charcoal/60 mt-0.5">Please confirm your delivery address and schedule.</p>
              </div>

              {/* Address Card */}
              <div className="p-4 bg-cream/60 border border-sand/60 rounded-lg text-xs space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-charcoal text-sm">{formData.name}</span>
                  <button onClick={() => setCurrentStep(1)} className="text-sage-dark font-medium underline">
                    Edit
                  </button>
                </div>
                <p className="text-charcoal/80">{formData.addressLine1}</p>
                {formData.addressLine2 && <p className="text-charcoal/80">{formData.addressLine2}</p>}
                <p className="text-charcoal/80">{formData.city}, {formData.state} - {formData.pincode}</p>
                <p className="text-charcoal/60 pt-1">Phone: {formData.phone} &bull; Email: {formData.email}</p>
              </div>

              {/* Delivery Speed Card */}
              <div className="border border-sage/60 bg-sage-light/30 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-sage-dark" />
                  <div>
                    <p className="text-xs font-semibold text-charcoal">Express Courier Delivery</p>
                    <p className="text-[11px] text-charcoal/60">Estimated arrival in 3-5 business days</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-sage-dark">
                  {shippingFee === 0 ? 'FREE' : '₹50'}
                </span>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3.5 border border-sand text-xs uppercase tracking-wider font-semibold text-charcoal hover:border-charcoal flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  className="flex-1 py-3.5 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-charcoal font-medium">Step 3 — Payment</h3>
                <p className="text-xs text-charcoal/60 mt-0.5">Encrypted and securely processed by Razorpay.</p>
              </div>

              {/* Payment Methods Info Box */}
              <div className="border border-sand/80 p-5 rounded-lg space-y-4 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-sand/40">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-sage" />
                    <span>Razorpay Secure Payment Gateway</span>
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Upon clicking <strong>&quot;Pay ₹{finalTotal}&quot;</strong>, the official Razorpay checkout popup will open allowing you to complete payment via:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 bg-cream rounded border border-sand/40">
                    <span className="font-bold block">UPI</span>
                    <span className="text-[10px] text-charcoal/60">GPay, PhonePe, Paytm</span>
                  </div>
                  <div className="p-3 bg-cream rounded border border-sand/40">
                    <span className="font-bold block">Cards</span>
                    <span className="text-[10px] text-charcoal/60">Visa, Mastercard, RuPay</span>
                  </div>
                  <div className="p-3 bg-cream rounded border border-sand/40">
                    <span className="font-bold block">Net Banking</span>
                    <span className="text-[10px] text-charcoal/60">All Major Banks</span>
                  </div>
                  <div className="p-3 bg-cream rounded border border-sand/40">
                    <span className="font-bold block">Wallets</span>
                    <span className="text-[10px] text-charcoal/60">Razorpay Wallets</span>
                  </div>
                </div>

                <div className="p-3 bg-sand-light/60 rounded text-[11px] text-charcoal/70 italic flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sage shrink-0" />
                  <span>Your card and banking details are processed directly by Razorpay and never touch our servers.</span>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={isProcessing}
                  className="px-6 py-4 border border-sand text-xs uppercase tracking-wider font-semibold text-charcoal hover:border-charcoal flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-elevated flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Secure Gateway...</span>
                  ) : (
                    <span>Pay ₹{finalTotal}</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Right (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft space-y-6">
          <h3 className="font-serif text-lg text-charcoal font-medium border-b border-sand/40 pb-3">
            Your Order ({cart.count} items)
          </h3>

          {/* Items mini-list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.cart_item_id} className="flex gap-3 text-xs">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80'}
                  alt={item.product_title}
                  className="w-14 h-18 object-cover rounded bg-cream shrink-0"
                />
                <div className="flex-1">
                  <p className="font-serif font-medium text-charcoal line-clamp-1">{item.product_title}</p>
                  <p className="text-charcoal/60 text-[11px] mt-0.5">
                    {item.color_name} &bull; {item.size_label} &bull; Qty: {item.quantity}
                  </p>
                  <p className="font-sans font-semibold text-charcoal mt-1">₹{item.subtotal}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="border-t border-sand/40 pt-4 space-y-2 text-xs text-charcoal/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">₹{cart.subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-terracotta">
                <span>Discount ({couponCode})</span>
                <span className="font-semibold">-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-charcoal">
                {shippingFee === 0 ? <span className="text-sage-dark font-bold">FREE</span> : '₹50'}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-sand/40">
              <span>Amount to Pay</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-charcoal/50 flex items-center justify-center gap-1.5 text-center">
            <ShieldCheck className="w-4 h-4 text-sage" />
            <span>256-bit SSL encryption &bull; 7-day easy exchanges</span>
          </div>
        </div>
      </div>
    </div>
  );
};
