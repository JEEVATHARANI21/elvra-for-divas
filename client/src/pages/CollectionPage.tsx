import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCollection() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await api.getCollectionBySlug(slug);
        setCollection(data);
      } catch (err) {
        console.error('Failed to load collection', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCollection();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return <div className="py-24 text-center font-serif text-charcoal/50">Curating collection edit...</div>;
  }

  if (!collection) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-charcoal">Collection Not Found</h2>
        <Link to="/shop" className="text-xs uppercase tracking-wider font-semibold text-sage-dark underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-cream flex items-center justify-center">
        <img
          src={collection.banner_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80'}
          alt={collection.name}
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-cream space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-sand-light font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sand" />
            <span>Curated Edit</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide">
            {collection.name}
          </h1>
          <p className="text-xs sm:text-sm text-cream/90 max-w-xl font-sans leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-sand/40 pb-3">
          <Link to="/shop" className="text-xs text-charcoal/60 hover:text-sage flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Pieces</span>
          </Link>
          <span className="text-xs text-charcoal/60 font-medium">
            {collection.products?.length || 0} styles
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {collection.products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
