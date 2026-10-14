import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToBag } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const navigate = useNavigate();

  const wishlisted = isWishlisted(product.id);

  const displayImage = isHovered && product.secondary_image
    ? product.secondary_image
    : product.primary_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

  const price = product.discount_price || product.base_price;
  const hasDiscount = product.discount_price && product.discount_price < product.base_price;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has variants, add the first available in-stock variant or navigate to details
    if (product.variants && product.variants.length > 0) {
      const inStockVariant = product.variants.find((v) => v.stock_quantity > 0) || product.variants[0];
      setIsAdding(true);
      try {
        await addToBag(inStockVariant.id, 1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      } finally {
        setIsAdding(false);
      }
    } else {
      navigate(`/product/${product.slug}`);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-none border border-transparent hover:border-sand/60 hover:shadow-soft transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-cream">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.is_new && (
            <span className="bg-sage text-cream text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 shadow-sm">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-terracotta text-cream text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-charcoal hover:text-terracotta transition-colors shadow-sm z-10"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              wishlisted ? 'fill-terracotta text-terracotta scale-110' : 'stroke-[1.75]'
            }`}
          />
        </button>

        {/* Hover Quick Add Overlay for Desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block z-10">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full py-2.5 px-4 bg-white text-charcoal hover:bg-sage hover:text-cream text-[11px] uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-sage-dark" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isAdding ? 'Adding...' : '+ Add to Bag'}</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-charcoal/60 uppercase tracking-wider">
            <span>{product.category_name || 'Elvra Collection'}</span>
            {product.averageRating && (
              <span className="flex items-center gap-1 font-medium text-charcoal/80">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {Number(product.averageRating).toFixed(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block mt-1">
            <h3 className="font-serif text-base text-charcoal font-medium group-hover:text-sage transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Subtitle / Fabric info */}
          {product.fabric && (
            <p className="text-xs text-charcoal/60 font-sans line-clamp-1 mt-0.5">
              {product.fabric}
            </p>
          )}

          {/* Color Swatches */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1.5">
              {product.availableColors.map((col, idx) => (
                <span
                  key={idx}
                  title={col.name}
                  className="w-2.5 h-2.5 rounded-full border border-sand shadow-xs inline-block"
                  style={{ backgroundColor: col.hex }}
                />
              ))}
              <span className="text-[10px] text-charcoal/40 font-sans ml-0.5">
                {product.availableColors.length} {product.availableColors.length === 1 ? 'shade' : 'shades'}
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Variants indicator */}
        <div className="pt-2 border-t border-sand/30 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-semibold text-charcoal text-sm">
              ₹{price}
            </span>
            {hasDiscount && (
              <span className="font-sans text-xs text-charcoal/40 line-through">
                ₹{product.base_price}
              </span>
            )}
          </div>

          {/* Available Sizes preview */}
          {((product.availableSizes && product.availableSizes.length > 0) || (product.sizes && product.sizes.length > 0)) && (
            <div className="text-[10px] text-charcoal/50 font-medium tracking-wider">
              {(product.availableSizes || product.sizes?.map((s) => s.size_label))?.join(' · ')}
            </div>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className="sm:hidden w-full mt-2 py-2 bg-cream-soft hover:bg-sage hover:text-cream text-charcoal text-[11px] uppercase tracking-wider font-semibold border border-sand/60 flex items-center justify-center gap-1.5 transition-colors"
        >
          {justAdded ? '✓ Added' : '+ Add to Bag'}
        </button>
      </div>
    </div>
  );
};
