import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send, Check, Instagram } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-terracotta font-medium">Concierge Service</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">Contact Elvra</h1>
        <p className="text-xs text-charcoal/60 max-w-md mx-auto">
          Whether you need personalized sizing guidance, styling consultation, or order assistance, our team is always delighted to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Information & WhatsApp */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-sand/60 shadow-soft space-y-4 text-xs">
            <h3 className="font-serif text-lg text-charcoal font-medium">Customer Support</h3>

            <div className="space-y-3">
              <a
                href="https://wa.me/919876543210?text=Hello%20Elvra%20team"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 fill-current shrink-0" />
                <div>
                  <p className="font-semibold">WhatsApp Concierge</p>
                  <p className="text-[11px] text-emerald-700">+91 98765 43210 (Mon - Sat, 10 AM - 7 PM)</p>
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

              <div className="flex items-center gap-3 p-3 bg-cream rounded border border-sand/40">
                <MapPin className="w-5 h-5 text-sage shrink-0" />
                <div>
                  <p className="font-semibold text-charcoal">Design Studio</p>
                  <p className="text-[11px] text-charcoal/60">Chennai &bull; Bengaluru, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft">
          <h3 className="font-serif text-lg text-charcoal font-medium mb-4">Send a Message</h3>
          {submitted ? (
            <div className="p-6 bg-sage-light text-sage-dark text-xs rounded border border-sage/40 text-center space-y-2">
              <Check className="w-8 h-8 mx-auto text-sage-dark" />
              <p className="font-semibold text-sm">Message Dispatched</p>
              <p>Thank you, our concierge will respond to your email within 1 business day.</p>
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
                  className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                />
              </div>
              <div>
                <label className="block text-charcoal/70 uppercase font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                />
              </div>
              <div>
                <label className="block text-charcoal/70 uppercase font-semibold mb-1">How can we help? *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-cream/30 border border-sand p-3 rounded focus:outline-none focus:border-sage"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-sage hover:bg-sage-dark text-cream font-semibold uppercase tracking-wider transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
