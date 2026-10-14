import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Heart, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-cream-soft border-t border-sand/40 text-charcoal mt-20">
      {/* Brand Value Pillars */}
      <div className="border-b border-sand/30 py-10 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center text-sage-dark shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-base text-charcoal">Complimentary Delivery</h4>
              <p className="text-xs text-charcoal/60 mt-0.5">Free express shipping across India on orders above ₹999.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-sand-light flex items-center justify-center text-charcoal shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-base text-charcoal">7-Day Easy Exchanges</h4>
              <p className="text-xs text-charcoal/60 mt-0.5">Hassle-free size exchanges and doorstep pickup.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-terracotta-light flex items-center justify-center text-terracotta shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-base text-charcoal">Pure Fabric Integrity</h4>
              <p className="text-xs text-charcoal/60 mt-0.5">Cloud-finish organic cottons and sustainable modal blends.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-[0.25em] text-charcoal">ELVRA</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal/70">FOR DIVAS</span>
              <span className="text-xs font-serif italic text-terracotta mt-1">Wings to Explore</span>
            </div>
            <p className="text-sm text-charcoal/70 max-w-sm font-sans leading-relaxed">
              Elvra creates modern casualwear and loungewear designed to move with you. Soft fabrics, thoughtful silhouettes, and effortless styles made for everyday living.
            </p>
            <p className="text-xs italic font-serif text-sage-muted">
              &ldquo;Comfort Looks Good On You.&rdquo;
            </p>

            {/* Social Connection */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest font-medium text-charcoal/80 block mb-3">
                Follow The Journey
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/elvra_for_divas?rpxt=dWF4YXZudm9sa3Zj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-sand flex items-center justify-center text-charcoal hover:text-sage hover:border-sage transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/918015848822?text=Hi%20Elvra%20team,%20I'm%20reaching%20out%20from%20the%20website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-sand flex items-center justify-center text-charcoal hover:text-sage hover:border-sage transition-colors"
                  aria-label="WhatsApp Concierge"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://share.google/c1XSNNNCoOUCUEM2M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-sand flex items-center justify-center hover:border-sage transition-colors shadow-xs"
                  aria-label="Google Profile"
                  title="Find us on Google"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </a>
                <div className="flex items-center gap-2 text-xs">
                  <a
                    href="https://instagram.com/elvra_for_divas?rpxt=dWF4YXZudm9sa3Zj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal/70 hover:text-sage font-medium transition-colors"
                  >
                    @elvra_for_divas
                  </a>
                  <span className="text-sand-dark">&bull;</span>
                  <a
                    href="https://share.google/c1XSNNNCoOUCUEM2M"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal/70 hover:text-sage font-medium transition-colors"
                  >
                    Google
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h5 className="font-serif text-base tracking-wide text-charcoal font-medium">Collections</h5>
            <ul className="space-y-2.5 text-sm text-charcoal/70 font-sans">
              <li><Link to="/shop" className="hover:text-sage transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=everyday-tops" className="hover:text-sage transition-colors">Everyday Tops</Link></li>
              <li><Link to="/shop?category=loungewear" className="hover:text-sage transition-colors">Loungewear & Sets</Link></li>
              <li><Link to="/shop?category=track-pants" className="hover:text-sage transition-colors">Track Pants</Link></li>
              <li><Link to="/shop?category=co-ord-sets" className="hover:text-sage transition-colors">Co-ord Sets</Link></li>
              <li><Link to="/shop?isNew=1" className="hover:text-sage transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h5 className="font-serif text-base tracking-wide text-charcoal font-medium">Customer Care</h5>
            <ul className="space-y-2.5 text-sm text-charcoal/70 font-sans">
              <li><Link to="/track-order" className="hover:text-sage transition-colors">Track Order</Link></li>
              <li><Link to="/policies?tab=shipping" className="hover:text-sage transition-colors">Shipping Policy</Link></li>
              <li><Link to="/policies?tab=returns" className="hover:text-sage transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/policies?tab=privacy" className="hover:text-sage transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-sage transition-colors">Contact Concierge</Link></li>
              <li><Link to="/about" className="hover:text-sage transition-colors">Our Story</Link></li>
            </ul>
          </div>

          {/* Newsletter / Join The Club */}
          <div className="space-y-4">
            <h5 className="font-serif text-base tracking-wide text-charcoal font-medium">The Diva Club</h5>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Receive private preview invitations to new collections, style edits, and 10% off your first purchase.
            </p>
            {isSubscribed ? (
              <div className="p-3 bg-sage-light text-sage-dark text-xs rounded border border-sage/30">
                ✨ Welcome to the Elvra family! Check your inbox for your 10% welcome coupon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white border border-sand px-3 py-2 text-xs focus:outline-none focus:border-sage placeholder:text-charcoal/40"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 bg-charcoal text-cream px-3 flex items-center justify-center hover:bg-sage transition-colors text-xs"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-charcoal/50 block">By subscribing you agree to receive Elvra updates.</span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sand/40 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal/60">
          <p>&copy; {new Date().getFullYear()} Elvra For Divas. All rights reserved. Wings to Explore&trade;.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Razorpay Secure &bull; UPI &bull; Cards &bull; NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
