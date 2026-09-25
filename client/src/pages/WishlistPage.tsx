import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        const data = await api.getProducts({ limit: 50 });
        setProducts(data.products.filter((p) => wishlistIds.includes(p.id)));
      } catch (err) {
        console.error('Failed to load wishlist', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-sand/40 pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Saved Pieces</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-1">
          My Wishlist ({wishlistIds.length})
        </h1>
      </div>

      {isLoading ? (
        <div className="py-20 text-center font-serif text-charcoal/50">
          Loading saved favorites...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-sand/60 shadow-soft space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-charcoal/30">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl text-charcoal">Your Wishlist is Empty</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            Save pieces you love while exploring our collections by tapping the heart icon.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
