import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send, Check, Instagram, Sparkles, Clock } from 'lucide-react';
import { openWhatsApp, formatGeneralInquiryMessage, ELVRA_WHATSAPP_DISPLAY } from '../../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Order & Delivery Enquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatGeneralInquiryMessage({
      name,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      topic,
      message,
    });
    openWhatsApp(formatted);
    setSubmitted(true);
  };

  const handleQuickTopic = (quickTopic: string, promptText: string) => {
    setTopic(quickTopic);
    setMessage(promptText);
    const formatted = formatGeneralInquiryMessage({
      name: name || 'Guest Diva',
      phone: phone || undefined,
      email: email || undefined,
      topic: quickTopic,
      message: promptText,
    });
    openWhatsApp(formatted);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-terracotta font-medium">Concierge Service</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">Contact Elvra</h1>
        <p className="text-xs text-charcoal/60 max-w-md mx-auto">
          All inquiries, sizing advice, and orders are answered directly by our founding team on WhatsApp ({ELVRA_WHATSAPP_DISPLAY}).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Information & WhatsApp Concierge */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-sand/60 shadow-soft space-y-4 text-xs">
            <h3 className="font-serif text-lg text-charcoal font-medium">Direct Concierge Channels</h3>

            <div className="space-y-3">
              <a
                href={`https://wa.me/918015848822?text=${encodeURIComponent('Hi Elvra Concierge, I would like to enquire about your collection.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-emerald-950">WhatsApp Concierge</p>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-semibold px-2 py-0.5 rounded-full">Fastest</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-mono mt-0.5">{ELVRA_WHATSAPP_DISPLAY}</p>
                  <p className="text-[10px] text-emerald-700/80">Orders, Sizing, Tracking & Support &bull; Instant Reply</p>
                </div>
              </a>

              <a
                href="tel:+918015848822"
                className="flex items-center gap-3 p-3 bg-cream rounded border border-sand/40 text-charcoal hover:border-sage transition-colors"
              >
                <Phone className="w-5 h-5 text-sage shrink-0" />
                <div>
                  <p className="font-semibold text-charcoal">Call Us Directly</p>
                  <p className="text-[11px] text-charcoal/60">{ELVRA_WHATSAPP_DISPLAY}</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 bg-cream rounded border border-sand/40">
                <Mail className="w-5 h-5 text-sage shrink-0" />
                <div>
                  <p className="font-semibold text-charcoal">Email Support</p>
                  <p className="text-[11px] text-charcoal/60">care@elvrafordivas.com</p>
                </div>
              </div>

              <a
                href="https://instagram.com/elvra_for_divas?rpxt=dWF4YXZudm9sa3Zj"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-pink-50/70 rounded border border-pink-200 text-pink-900 hover:bg-pink-100 transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-700 shrink-0" />
                <div>
                  <p className="font-semibold">Instagram DM</p>
                  <p className="text-[11px] text-pink-800">@elvra_for_divas &bull; Direct Message</p>
                </div>
              </a>

              <a
                href="https://share.google/c1XSNNNCoOUCUEM2M"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-blue-50/70 rounded border border-blue-200 text-blue-900 hover:bg-blue-100 transition-colors"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Find us on Google</p>
                  <p className="text-[11px] text-blue-800">Google Profile &bull; Reviews & Location</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 bg-cream rounded border border-sand/40">
                <MapPin className="w-5 h-5 text-sage shrink-0" />
                <div>
                  <p className="font-semibold text-charcoal">Design Studio</p>
                  <p className="text-[11px] text-charcoal/60">Chennai &bull; Bengaluru, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Topics */}
          <div className="bg-cream/40 p-4 rounded-lg border border-sand/40 space-y-2 text-xs">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal/60 block">
              Instant WhatsApp Enquiries
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickTopic('Track My Order', 'Hi, I would like to know the current tracking status of my recent order.')}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-sand/60 rounded text-[11px] font-medium text-charcoal/80 transition-colors"
              >
                📦 Track Order
              </button>
              <button
                type="button"
                onClick={() => handleQuickTopic('Size Recommendation', 'Hello! Could you suggest the best size for my measurements?')}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-sand/60 rounded text-[11px] font-medium text-charcoal/80 transition-colors"
              >
                📏 Size & Fit Advice
              </button>
              <button
                type="button"
                onClick={() => handleQuickTopic('Custom or Bulk Order', 'Hi Elvra, I want to place a custom / bulk order. Please guide me with catalog and rates.')}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-sand/60 rounded text-[11px] font-medium text-charcoal/80 transition-colors"
              >
                ✨ Bulk / Custom Orders
              </button>
              <button
                type="button"
                onClick={() => handleQuickTopic('Exchange / Return Request', 'Hi team, I would like to request an exchange for an item I received.')}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-sand/60 rounded text-[11px] font-medium text-charcoal/80 transition-colors"
              >
                🔄 Exchange Request
              </button>
            </div>
          </div>
        </div>

        {/* Message Form (Sends to WhatsApp) */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg text-charcoal font-medium">Send an Inquiry</h3>
              <p className="text-xs text-charcoal/60">Redirects directly to WhatsApp chat with our team.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 text-emerald-900 text-xs rounded-lg border border-emerald-300 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">Opening WhatsApp Chat...</p>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Your query has been formulated and sent to {ELVRA_WHATSAPP_DISPLAY}. If WhatsApp didn&apos;t open automatically, click the button below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const formatted = formatGeneralInquiryMessage({ name, phone, email, topic, message });
                  openWhatsApp(formatted);
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Open WhatsApp Again</span>
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-[11px] text-emerald-800 underline hover:text-emerald-950 mt-1"
                >
                  Send another query
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-charcoal/70 uppercase font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                  />
                </div>
                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="diva@example.com (optional)"
                    className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal/70 uppercase font-semibold mb-1">Query Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage text-charcoal"
                >
                  <option value="Order & Delivery Enquiry">Order & Delivery Enquiry</option>
                  <option value="Product Availability & Sizing">Product Availability & Sizing</option>
                  <option value="Custom / Bulk Order">Custom / Bulk Order</option>
                  <option value="Exchange or Return">Exchange or Return</option>
                  <option value="Styling Consultation">Styling Consultation</option>
                  <option value="Feedback & Other">Feedback & Other</option>
                </select>
              </div>

              <div>
                <label className="block text-charcoal/70 uppercase font-semibold mb-1">How can we help? *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you need assistance with..."
                  className="w-full bg-cream/30 border border-sand p-3 rounded focus:outline-none focus:border-sage"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Query to WhatsApp</span>
              </button>

              <p className="text-[11px] text-charcoal/50 text-center flex items-center justify-center gap-1">
                <span>Direct response to your WhatsApp text within minutes during business hours.</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
