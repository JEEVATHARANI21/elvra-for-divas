import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const PoliciesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'shipping';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-terracotta font-medium">Customer Transparency</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">Brand Policies</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sand/40 text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 px-4 transition-colors ${activeTab === 'shipping' ? 'border-b-2 border-sage text-sage-dark' : 'text-charcoal/50 hover:text-charcoal'}`}
        >
          Shipping & Delivery
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`pb-3 px-4 transition-colors ${activeTab === 'returns' ? 'border-b-2 border-sage text-sage-dark' : 'text-charcoal/50 hover:text-charcoal'}`}
        >
          Returns & Exchanges
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 px-4 transition-colors ${activeTab === 'privacy' ? 'border-b-2 border-sage text-sage-dark' : 'text-charcoal/50 hover:text-charcoal'}`}
        >
          Privacy & Security
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-8 rounded-lg border border-sand/60 shadow-soft text-sm text-charcoal/80 space-y-6 leading-relaxed">
        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-charcoal font-normal">Shipping Policy</h3>
            <p>
              We deliver across all serviceable pincodes throughout India. Every Elvra garment is inspected and packed in recyclable protective brand packaging.
            </p>
            <h4 className="font-serif text-base text-charcoal font-medium">Order Processing & Timelines:</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Orders placed before 2:00 PM IST are processed and dispatched within 24 to 48 business hours.</li>
              <li>Standard metro delivery takes approximately 3 to 5 business days from dispatch date.</li>
              <li>Non-metro and regional destinations may take 5 to 7 business days.</li>
            </ul>
            <h4 className="font-serif text-base text-charcoal font-medium">Shipping Charges:</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Orders ₹999 and above:</strong> Complimentary Express Delivery across India.</li>
              <li><strong>Orders below ₹999:</strong> Flat nominal shipping fee of ₹50.</li>
            </ul>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-charcoal font-normal">Returns & 7-Day Easy Size Exchanges</h3>
            <p>
              At Elvra For Divas, your comfort is non-negotiable. If your piece does not fit exactly how you dreamed, we provide effortless 7-day doorstep size exchanges.
            </p>
            <h4 className="font-serif text-base text-charcoal font-medium">Exchange Guidelines:</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Requests must be initiated within 7 calendar days of delivery via our WhatsApp concierge or website portal.</li>
              <li>Garments must remain unworn, unwashed, and in original condition with tags intact.</li>
              <li>Once our courier partner inspects and collects the item, your replacement size will be dispatched immediately.</li>
            </ul>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-charcoal font-normal">Privacy & Payment Security</h3>
            <p>
              Your trust and digital privacy are sacred to us. We never sell or distribute personal customer data to third-party marketing entities.
            </p>
            <h4 className="font-serif text-base text-charcoal font-medium">Payment Information:</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>All payments are securely handled by Razorpay with end-to-end 256-bit encryption.</li>
              <li>Elvra never stores or sees credit card numbers, CVV, or UPI PINs on our servers.</li>
              <li>We adhere strictly to RBI and PCI-DSS compliance requirements.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
