import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import { api } from '../services/api';

export const TrackOrderPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !emailOrPhone) return;
    setIsLoading(true);
    setError('');
    setOrderData(null);
    try {
      const data = await api.trackOrder(orderNumber.trim(), emailOrPhone.trim());
      setOrderData(data);
    } catch (err: any) {
      setError(err.message || 'No order found matching these details.');
    } finally {
      setIsLoading(false);
    }
  };

  const stages = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
  const currentStageIndex = orderData ? stages.indexOf(orderData.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Fulfillment</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">Track Your Order</h1>
        <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
          Enter your Elvra order number (e.g. ELV-10245) and the mobile number or email you ordered with.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleTrack} className="bg-white p-6 rounded-lg border border-sand/60 shadow-soft space-y-4 text-xs">
        <div>
          <label className="block text-charcoal/70 uppercase font-semibold mb-1">Order Number *</label>
          <input
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="e.g. ELV-10245"
            className="w-full bg-cream/30 border border-sand px-3 py-2.5 uppercase font-mono focus:outline-none focus:border-sage"
          />
        </div>
        <div>
          <label className="block text-charcoal/70 uppercase font-semibold mb-1">Email or Mobile *</label>
          <input
            type="text"
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="e.g. diva@example.com or +91 98765 43210"
            className="w-full bg-cream/30 border border-sand px-3 py-2.5 focus:outline-none focus:border-sage"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-sage hover:bg-sage-dark text-cream font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Track Order'}
        </button>

        <div className="pt-2 text-center border-t border-sand/40">
          <a
            href={`https://wa.me/918015848822?text=${encodeURIComponent(
              orderNumber
                ? `Hi Elvra Concierge, I would like to get tracking updates for order ${orderNumber}.`
                : 'Hi Elvra Concierge, I would like assistance with my order tracking.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 hover:text-emerald-950 font-medium hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-current" />
            <span>Need instant assistance? Track & chat directly on WhatsApp</span>
          </a>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-terracotta-light text-terracotta text-xs rounded border border-terracotta/30 text-center">
          {error}
        </div>
      )}

      {/* Progress Timeline */}
      {orderData && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft space-y-6">
          <div className="flex justify-between items-center border-b border-sand/40 pb-4">
            <div>
              <p className="font-serif text-lg font-medium text-charcoal">Order {orderData.order_number}</p>
              <p className="text-xs text-charcoal/60">For {orderData.customer_name}</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-sage-light text-sage-dark rounded-full">
              {orderData.status}
            </span>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-5 gap-1 text-center text-[10px] uppercase tracking-wider font-semibold">
            {stages.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    i <= currentStageIndex
                      ? 'bg-sage text-cream'
                      : 'bg-sand/40 text-charcoal/40'
                  }`}
                >
                  {i < currentStageIndex ? '✓' : i + 1}
                </div>
                <span className={i <= currentStageIndex ? 'text-charcoal' : 'text-charcoal/40'}>
                  {stage}
                </span>
              </div>
            ))}
          </div>

          {orderData.tracking_number && (
            <div className="pt-4 border-t border-sand/30 text-xs text-charcoal/80 space-y-1">
              <p><strong>Courier Carrier:</strong> {orderData.tracking_carrier || 'BlueDart Express'}</p>
              <p><strong>Tracking AWB:</strong> {orderData.tracking_number}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
