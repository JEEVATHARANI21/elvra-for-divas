import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Package, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderNumber) return;
      try {
        const data = await api.getOrderDetail(orderNumber);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  const parsedAddress = typeof order?.shipping_address === 'string'
    ? JSON.parse(order.shipping_address)
    : order?.shipping_address;

  const handleWhatsAppUpdates = () => {
    const text = `Hi Elvra Concierge, I just placed order ${orderNumber}. Please send me tracking and delivery updates on this number.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8">
      {/* Confirmation Header */}
      <div className="text-center space-y-4 bg-white p-8 sm:p-12 rounded-lg border border-sand/60 shadow-soft">
        <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto text-sage-dark">
          <CheckCircle2 className="w-10 h-10 stroke-[1.75]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">
            Payment Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Thank you, Diva!
          </h1>
          <p className="text-sm text-charcoal/70 font-sans">
            Your order has been placed and is being lovingly prepared.
          </p>
        </div>

        <div className="inline-block bg-cream px-6 py-3 rounded border border-sand/80 text-xs font-mono font-bold text-charcoal">
          Order Reference: <span className="text-sage-dark">{orderNumber}</span>
        </div>

        {/* WhatsApp Notification Opt-in */}
        <div className="pt-4 max-w-md mx-auto">
          <button
            onClick={handleWhatsAppUpdates}
            className="w-full py-3 px-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
            <span>Get Order & Courier Updates on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-sand/40 pb-4">
            <div>
              <h3 className="font-serif text-lg text-charcoal font-medium">Order Overview</h3>
              <p className="text-xs text-charcoal/60">Estimated dispatch: Within 24-48 business hours</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-sage-light text-sage-dark rounded-full">
              Status: {order.status}
            </span>
          </div>

          {/* Ordered Items */}
          <div className="space-y-3 divide-y divide-sand/30">
            {order.items?.map((item, idx) => (
              <div key={idx} className="pt-3 flex gap-4 items-center text-xs">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80'}
                  alt={item.product_name}
                  className="w-14 h-18 object-cover rounded bg-cream shrink-0"
                />
                <div className="flex-1">
                  <p className="font-serif font-medium text-charcoal text-sm">{item.product_name}</p>
                  <p className="text-charcoal/60 mt-0.5">
                    {item.color_name} &bull; Size: {item.size_label} &bull; Qty: {item.quantity}
                  </p>
                  <p className="font-sans font-semibold text-charcoal mt-1">₹{item.total_price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="border-t border-sand/40 pt-4 space-y-2 text-xs text-charcoal/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">₹{order.subtotal}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-terracotta">
                <span>Discount</span>
                <span className="font-semibold">-₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-charcoal">
                {order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-sand/40">
              <span>Paid Amount</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>

          {/* Delivery Address Snapshot */}
          {parsedAddress && (
            <div className="border-t border-sand/40 pt-4 text-xs text-charcoal/80">
              <span className="font-semibold uppercase tracking-wider text-charcoal block mb-1">
                Delivering To:
              </span>
              <p className="font-medium">{parsedAddress.recipient_name} ({parsedAddress.phone})</p>
              <p>{parsedAddress.address_line1}, {parsedAddress.address_line2 || ''}</p>
              <p>{parsedAddress.city}, {parsedAddress.state} - {parsedAddress.pincode}</p>
            </div>
          )}
        </div>
      )}

      {/* Next Actions */}
      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
