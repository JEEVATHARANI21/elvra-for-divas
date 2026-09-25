import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, Shield, ChevronDown, ChevronUp, Check, Ruler, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToBag } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('fabric');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Review Form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFit, setReviewFit] = useState<'tight' | 'perfect' | 'loose'>('perfect');
  const [reviewComfort, setReviewComfort] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await api.getProductBySlug(slug);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
        } else if (data.primary_image) {
          setSelectedImage(data.primary_image);
        }

        // Set default color and size from first available variant
        if (data.variants && data.variants.length > 0) {
          const firstInStock = data.variants.find((v) => v.stock_quantity > 0) || data.variants[0];
          setSelectedColor(firstInStock.color_name);
          setSelectedSize(firstInStock.size_label);
        }
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-serif text-charcoal/50">
        Curating piece details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="font-serif text-2xl text-charcoal">Piece Not Found</h2>
        <p className="text-xs text-charcoal/60">This style may be unavailable or out of season.</p>
        <Link to="/shop" className="px-6 py-3 bg-sage text-cream text-xs uppercase tracking-widest font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Find active variant based on selected color and size
  const currentVariant: ProductVariant | undefined = product.variants?.find(
    (v) => v.color_name === selectedColor && v.size_label === selectedSize
  );

  const isOutOfStock = !currentVariant || currentVariant.stock_quantity <= 0;
  const currentStock = currentVariant ? currentVariant.stock_quantity : 0;
  const price = currentVariant?.price_override || product.discount_price || product.base_price;
  const hasDiscount = product.discount_price && product.discount_price < product.base_price;

  const handleAddToBag = async () => {
    if (!currentVariant) return;
    setIsAdding(true);
    try {
      await addToBag(currentVariant.id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Unable to add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewText.trim()) return;

    try {
      await api.postReview({
        productId: product.id,
        reviewerName,
        rating: reviewRating,
        fitRating: reviewFit,
        comfortRating: reviewComfort,
        reviewText,
      });
      setReviewSubmitted(true);
      setReviewText('');
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-charcoal/50 flex items-center gap-2">
        <Link to="/" className="hover:text-sage">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-sage">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category_slug}`} className="hover:text-sage">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-charcoal font-medium truncate">{product.title}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`aspect-[3/4] w-16 sm:w-full rounded overflow-hidden border transition-all ${
                    selectedImage === img.image_url
                      ? 'border-sage ring-2 ring-sage/30'
                      : 'border-sand/60 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt={img.alt_text || product.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Primary View */}
          <div className="flex-1 aspect-[3/4] bg-cream rounded-none overflow-hidden relative border border-sand/40">
            <img
              src={selectedImage || product.primary_image}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {product.is_new && (
              <span className="absolute top-4 left-4 bg-sage text-cream text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1">
                New Arrival
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Details & Variant Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-charcoal/60 uppercase tracking-widest">
              <span>{product.category_name}</span>
              {product.averageRating && (
                <span className="flex items-center gap-1 text-charcoal font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {product.averageRating} ({product.review_count || product.reviews?.length || 0} reviews)
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-2 leading-tight">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="text-xs text-charcoal/60 font-sans mt-1">
                {product.subtitle}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-sans text-2xl font-semibold text-charcoal">
                ₹{price}
              </span>
              {hasDiscount && (
                <span className="font-sans text-base text-charcoal/40 line-through">
                  ₹{product.base_price}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs text-terracotta font-semibold uppercase tracking-wider">
                  Save ₹{Number(product.base_price) - Number(product.discount_price)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-charcoal/50 mt-1">Inclusive of all taxes &bull; Free express delivery above ₹999</p>
          </div>

          <div className="w-full h-px bg-sand/40" />

          {/* Color Selection */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold uppercase tracking-wider text-charcoal">
                  Color: <span className="font-normal text-charcoal/80">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.availableColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border transition-all relative ${
                      selectedColor === c.name
                        ? 'ring-2 ring-sage ring-offset-2 scale-110'
                        : 'border-sand hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold uppercase tracking-wider text-charcoal">
                  Select Size
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-sage-dark font-medium hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {product.availableSizes.map((sz) => {
                  const variantForSize = product.variants?.find(
                    (v) => v.color_name === selectedColor && v.size_label === sz
                  );
                  const isAvailable = variantForSize && variantForSize.stock_quantity > 0;

                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      disabled={!isAvailable}
                      className={`py-3 text-xs font-semibold text-center border transition-all ${
                        selectedSize === sz
                          ? 'bg-charcoal text-cream border-charcoal'
                          : isAvailable
                          ? 'bg-white text-charcoal border-sand hover:border-charcoal'
                          : 'bg-cream text-charcoal/30 border-sand/40 line-through cursor-not-allowed'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Stock Status notice */}
              {currentVariant && (
                <p className="text-[11px] text-charcoal/60 mt-1">
                  {currentStock > 10 ? (
                    <span className="text-emerald-700">✓ In Stock &bull; Ready to ship</span>
                  ) : currentStock > 0 ? (
                    <span className="text-amber-700">⚡ Only {currentStock} left in this size</span>
                  ) : (
                    <span className="text-terracotta">Out of stock in {selectedColor} - {selectedSize}</span>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Quantity and Add to Bag */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-sand bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-3.5 text-charcoal/70 hover:text-charcoal disabled:opacity-30"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3 py-3.5 text-charcoal/70 hover:text-charcoal disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToBag}
                disabled={isOutOfStock || isAdding}
                className="flex-1 bg-sage hover:bg-sage-dark text-cream py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all shadow-soft hover:shadow-elevated disabled:opacity-50"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-sand-light" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAdding ? 'Adding...' : isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                  </>
                )}
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3.5 border border-sand bg-white hover:border-charcoal transition-colors"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted(product.id) ? 'fill-terracotta text-terracotta' : 'text-charcoal'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Highlights & Guarantees */}
          <div className="border-t border-sand/40 pt-4 grid grid-cols-2 gap-3 text-xs text-charcoal/70">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sage" />
              <span>Complimentary shipping above ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-sage" />
              <span>7-day easy size exchange</span>
            </div>
          </div>

          {/* Collapsible Accordions (Fabric & Care, Shipping, Returns) */}
          <div className="border-t border-sand/40 divide-y divide-sand/30 text-sm">
            {/* Description */}
            <div className="py-3.5">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
                className="w-full flex items-center justify-between text-left font-serif font-medium text-charcoal"
              >
                <span>Product Details</span>
                {openAccordion === 'desc' ? <ChevronUp className="w-4 h-4 text-charcoal/60" /> : <ChevronDown className="w-4 h-4 text-charcoal/60" />}
              </button>
              {openAccordion === 'desc' && (
                <div className="pt-3 text-xs text-charcoal/80 font-sans leading-relaxed space-y-2">
                  <p>{product.description}</p>
                  {product.fit_type && <p><strong>Fit:</strong> {product.fit_type}</p>}
                </div>
              )}
            </div>

            {/* Fabric & Care */}
            <div className="py-3.5">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                className="w-full flex items-center justify-between text-left font-serif font-medium text-charcoal"
              >
                <span>Fabric & Care</span>
                {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4 text-charcoal/60" /> : <ChevronDown className="w-4 h-4 text-charcoal/60" />}
              </button>
              {openAccordion === 'fabric' && (
                <div className="pt-3 text-xs text-charcoal/80 font-sans leading-relaxed space-y-2">
                  <p><strong>Composition:</strong> {product.fabric || '100% Combed Organic Cotton'}</p>
                  <p><strong>Care:</strong> {product.care_instructions || 'Gentle machine wash cold with similar colors. Line dry in shade.'}</p>
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className="py-3.5">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')}
                className="w-full flex items-center justify-between text-left font-serif font-medium text-charcoal"
              >
                <span>Shipping & Returns</span>
                {openAccordion === 'delivery' ? <ChevronUp className="w-4 h-4 text-charcoal/60" /> : <ChevronDown className="w-4 h-4 text-charcoal/60" />}
              </button>
              {openAccordion === 'delivery' && (
                <div className="pt-3 text-xs text-charcoal/80 font-sans leading-relaxed space-y-2">
                  <p>Dispatched within 24-48 business hours across India via BlueDart/Delhivery Express.</p>
                  <p>Enjoy hassle-free 7-day exchanges for sizing peace of mind.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-sand/40 pt-16 space-y-8">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Real Experiences</span>
          <h2 className="font-serif text-3xl text-charcoal font-normal">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-charcoal">{product.averageRating || 5.0} out of 5</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-white border border-sand/50 rounded-lg space-y-3 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-medium text-sm text-charcoal">{rev.reviewer_name}</span>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-charcoal/60">
                  <span className="bg-cream px-2 py-0.5 rounded border border-sand/40 capitalize">Fit: {rev.fit_rating}</span>
                  <span>Comfort: {rev.comfort_rating}/5</span>
                </div>
                <p className="text-xs text-charcoal/80 font-sans leading-relaxed">
                  &ldquo;{rev.review_text}&rdquo;
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-charcoal/50 col-span-2">
              Be the first to share your comfort experience with this piece.
            </p>
          )}
        </div>

        {/* Add Review Form */}
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft space-y-4">
          <h4 className="font-serif text-lg text-charcoal font-medium">Leave a Review</h4>
          {reviewSubmitted ? (
            <div className="p-4 bg-sage-light text-sage-dark text-xs rounded border border-sage/40">
              ✨ Thank you! Your review has been submitted.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-charcoal/70 font-semibold uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Meera S."
                  className="w-full bg-cream/40 border border-sand px-3 py-2 focus:outline-none focus:border-sage"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal/70 font-semibold uppercase mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-cream/40 border border-sand px-3 py-2"
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                    <option value={2}>★★☆☆☆ (2/5)</option>
                    <option value={1}>★☆☆☆☆ (1/5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-charcoal/70 font-semibold uppercase mb-1">How was the fit?</label>
                  <select
                    value={reviewFit}
                    onChange={(e) => setReviewFit(e.target.value as any)}
                    className="w-full bg-cream/40 border border-sand px-3 py-2"
                  >
                    <option value="perfect">Perfect Fit</option>
                    <option value="tight">Slightly Tight</option>
                    <option value="loose">Relaxed / Loose</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-charcoal/70 font-semibold uppercase mb-1">Your Review</label>
                <textarea
                  rows={3}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How does the fabric feel? Tell us about your journey wearing it..."
                  className="w-full bg-cream/40 border border-sand p-3 focus:outline-none focus:border-sage"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-charcoal hover:bg-sage text-cream text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="border-t border-sand/40 pt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-charcoal font-normal">Complete the Look</h3>
            <Link to={`/shop?category=${product.category_slug}`} className="text-xs uppercase tracking-wider font-semibold text-sage-dark hover:underline">
              View More &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel: any) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-sand/40 pb-3">
              <h4 className="font-serif text-lg text-charcoal font-medium">Elvra Size Guide (Inches)</h4>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-charcoal/60 hover:text-charcoal">✕</button>
            </div>
            <table className="w-full text-xs text-charcoal text-center border border-sand/60">
              <thead className="bg-cream font-semibold">
                <tr>
                  <th className="py-2.5 px-3 border border-sand/60">Size</th>
                  <th className="py-2.5 px-3 border border-sand/60">Bust (in)</th>
                  <th className="py-2.5 px-3 border border-sand/60">Waist (in)</th>
                  <th className="py-2.5 px-3 border border-sand/60">Hips (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                <tr><td className="py-2 border border-sand/40 font-semibold">S</td><td>34 - 36</td><td>26 - 28</td><td>36 - 38</td></tr>
                <tr><td className="py-2 border border-sand/40 font-semibold">M</td><td>36 - 38</td><td>28 - 30</td><td>38 - 40</td></tr>
                <tr><td className="py-2 border border-sand/40 font-semibold">L</td><td>38 - 40</td><td>30 - 32</td><td>40 - 42</td></tr>
                <tr><td className="py-2 border border-sand/40 font-semibold">XL</td><td>40 - 42</td><td>32 - 34</td><td>42 - 44</td></tr>
              </tbody>
            </table>
            <p className="text-[11px] text-charcoal/60 italic">
              All Elvra pieces are designed with generous ease for comfort and natural movement. If you prefer a closer fit, consider sizing down.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
