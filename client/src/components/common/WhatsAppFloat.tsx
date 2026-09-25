import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '919876543210';

  const quickPrompts = [
    { title: 'Track My Order', message: 'Hi Elvra Concierge, I would like to check the tracking status of my order.' },
    { title: 'Size & Fit Advice', message: 'Hello! I need help selecting the perfect size for an Elvra piece.' },
    { title: 'Product Enquiry', message: 'Hi, I have a question about the fabric and availability of a product.' },
    { title: 'Easy Returns & Exchanges', message: 'Hi, I would like to request an exchange or return for an order.' },
    { title: 'Talk to Stylist', message: 'Hi Elvra, I would love styling suggestions for an upcoming trip/event.' },
  ];

  const handleOpenWhatsApp = (message: string) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Concierge Modal */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-xl shadow-luxury border border-sand/60 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-sage p-4 text-cream flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-serif text-lg">
                🌿
              </div>
              <div>
                <h4 className="font-serif font-medium text-base leading-tight">Elvra Concierge</h4>
                <p className="text-[11px] text-sand-light flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  <span>Online &bull; Wings to Explore</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cream/80 hover:text-cream p-1"
              aria-label="Close concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-cream/30 space-y-3">
            <div className="bg-white p-3 rounded-lg border border-sand/30 shadow-soft text-xs text-charcoal/80 space-y-1">
              <p className="font-semibold text-charcoal flex items-center gap-1">
                <span>Welcome to Elvra For Divas 👋</span>
              </p>
              <p>How may our styling and concierge team assist your journey today?</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-charcoal/50 px-1 block">
                Quick Options
              </span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenWhatsApp(p.message)}
                  className="w-full text-left p-2.5 text-xs bg-white hover:bg-sage-light hover:text-sage-dark border border-sand/40 rounded-lg flex items-center justify-between group transition-colors"
                >
                  <span className="font-medium text-charcoal group-hover:text-sage-dark">{p.title}</span>
                  <Send className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Direct message footer */}
          <div className="p-3 border-t border-sand/30 bg-white text-center">
            <button
              onClick={() => handleOpenWhatsApp("Hi Elvra team, I'm reaching out from the website.")}
              className="text-xs text-sage-dark hover:underline font-medium inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Or start a custom conversation on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-cream px-4 py-3 rounded-full shadow-elevated hover:shadow-luxury transition-all duration-300"
        aria-label="Chat with Elvra"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
          {isOpen ? 'Close' : 'Chat with Elvra'}
        </span>
      </button>
    </div>
  );
};
