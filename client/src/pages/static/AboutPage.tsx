import React from 'react';
import { Feather, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-terracotta font-medium">The Elvra Narrative</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal font-normal">
          Wings to Explore
        </h1>
        <p className="font-serif italic text-lg text-sage-dark">
          &ldquo;Comfort Looks Good On You.&rdquo;
        </p>
      </div>

      {/* Main Feature Image */}
      <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-luxury border border-sand/40 bg-cream">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
          alt="Elvra For Divas Philosophy"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-sm text-charcoal/80 font-sans leading-relaxed">
          <h2 className="font-serif text-2xl text-charcoal font-normal">
            Effortless Movement, Modern Grace.
          </h2>
          <p>
            Elvra For Divas was born from a simple yet radical conviction: that luxury fashion shouldn’t demand compromise on ease. Modern women are constantly in motion—traveling, creating, leading, and unwinding.
          </p>
          <p>
            We set out to engineer clothing that feels weightless and soothing from the moment you slip it on, while maintaining the poised structure and clean silhouette of high-end casualwear.
          </p>
        </div>

        <div className="bg-sage-light/40 p-8 rounded-xl border border-sand/60 space-y-4 text-xs text-charcoal/80">
          <div className="flex items-center gap-2 text-sage-dark font-serif text-base font-semibold">
            <Feather className="w-5 h-5" />
            <span>Our Design Promise</span>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-sage font-bold">•</span>
              <span><strong>Cloud-Combed Organic Cottons:</strong> Sourced with high-grade staples for supreme softness that resists pilling and shrinkage.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage font-bold">•</span>
              <span><strong>Beechwood Micro-Modal:</strong> Featherweight drape that breathes with your skin in all seasons.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage font-bold">•</span>
              <span><strong>Mindful Tailoring:</strong> Non-pinching elasticated bands, deep hidden pockets, and fluid hemlines designed for living.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-sand/40">
        <Link
          to="/shop"
          className="inline-block px-8 py-4 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
        >
          Explore Our Collection
        </Link>
      </div>
    </div>
  );
};
