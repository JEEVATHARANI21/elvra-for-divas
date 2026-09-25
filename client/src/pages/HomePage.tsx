import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Feather, ShieldCheck, Heart } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodData, catData] = await Promise.all([
          api.getProducts({ limit: 8 }),
          api.getCategories(),
        ]);
        setProducts(prodData.products);
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);

  return (
    <div className="space-y-24">
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-cream overflow-hidden">
        {/* Background Editorial Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="Elvra For Divas Collection"
            className="w-full h-full object-cover object-center opacity-85 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/60 to-transparent sm:w-2/3" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 backdrop-blur-md rounded-full border border-sand/60 text-xs text-sage-dark font-medium tracking-wide">
              <Feather className="w-3.5 h-3.5 text-sage" />
              <span>Spring & Summer Luxury Edit</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-charcoal font-normal tracking-tight leading-[1.15]">
              Wings to <span className="italic font-light text-terracotta">Explore</span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal/80 font-sans leading-relaxed">
              Effortless comfort designed for every journey. Discover featherweight modal loungewear, combed organic cotton tees, and tailored track pants made to move with you.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-[0.2em] font-semibold text-center transition-all shadow-elevated hover:shadow-luxury"
              >
                Shop Women&apos;s Collection
              </Link>
              <Link
                to="/shop?isNew=1"
                className="px-8 py-4 bg-white/90 hover:bg-white text-charcoal border border-sand hover:border-charcoal text-xs uppercase tracking-[0.2em] font-semibold text-center transition-all"
              >
                Explore New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — BRAND INTRODUCTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-terracotta">
          Our Philosophy
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
          Comfort. Confidence. Freedom.
        </h2>
        <div className="w-12 h-0.5 bg-sage mx-auto" />
        <p className="text-base sm:text-lg text-charcoal/70 font-sans leading-relaxed max-w-2xl mx-auto">
          Elvra For Divas creates modern casualwear and loungewear designed to move with you. Soft fabrics, thoughtful silhouettes, and effortless styles made for everyday living.
        </p>
        <div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-sage-dark hover:text-charcoal transition-colors border-b border-sage-dark pb-1"
          >
            <span>Discover Elvra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* SECTION 3 — SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/40 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-terracotta">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-3xl text-charcoal font-normal mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.15em] font-semibold text-charcoal/70 hover:text-sage transition-colors flex items-center gap-1.5"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Large Editorial Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-cream block shadow-soft hover:shadow-elevated transition-all"
            >
              <img
                src={cat.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <div className="absolute bottom-6 inset-x-6 text-cream space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-sand-light font-medium block">
                  Collection
                </span>
                <h3 className="font-serif text-xl font-medium tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-xs text-cream/80 line-clamp-1 font-sans">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-sand font-medium uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4 — NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/40 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-terracotta">
              Just Landed
            </span>
            <h2 className="font-serif text-3xl text-charcoal font-normal mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?isNew=1"
            className="text-xs uppercase tracking-[0.15em] font-semibold text-charcoal/70 hover:text-sage transition-colors flex items-center gap-1.5"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 text-center text-charcoal/40 font-serif">
            Loading graceful pieces...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {(newArrivals.length > 0 ? newArrivals : products.slice(0, 4)).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5 — EDITORIAL SPOTLIGHT / BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-sage-light/40 border border-sand/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Visual */}
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=80"
                alt="Elvra Weekend Lounge Collection"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Editorial Narrative */}
            <div className="p-8 sm:p-14 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold text-terracotta">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Signature Sensation</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-snug">
                Softness in every single movement.
              </h2>
              <p className="text-sm sm:text-base text-charcoal/70 font-sans leading-relaxed">
                We believe true style begins with how clothing feels against your skin. Every piece in our collection is thoughtfully engineered with cloud-combed fibers, flexible waistbands, and breathable drape so you can step into your day feeling poised and completely relaxed.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop?category=co-ord-sets"
                  className="inline-block px-8 py-4 bg-charcoal hover:bg-sage text-cream text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
                >
                  Shop Co-ord Sets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — INSTAGRAM COMMUNITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-terracotta">
            Community & Stories
          </span>
          <h2 className="font-serif text-3xl text-charcoal font-normal mt-1">
            Follow @elvrafordivas
          </h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Tag us to be featured in our seasonal lookbook.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80', handle: '@elvrafordivas' },
            { img: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=600&q=80', handle: '@elvrafordivas' },
            { img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80', handle: '@elvrafordivas' },
            { img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80', handle: '@elvrafordivas' },
          ].map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com/elvrafordivas"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-cream block"
            >
              <img
                src={item.img}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cream text-xs font-medium">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                  Seen on Instagram &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
