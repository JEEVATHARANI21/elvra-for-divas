import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RotateCcw,
  Image as ImageIcon,
  Check,
  X,
  Tag,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';

const STUDIO_IMAGES = [
  { label: 'Studio 1 (Cream Minimalist Tee)', url: '/images/products/product-1.png' },
  { label: 'Studio 2 (Sage Green Luxe Tee)', url: '/images/products/product-2.png' },
  { label: 'Studio 3 (Ocean Indigo Tee)', url: '/images/products/product-3.png' },
  { label: 'Studio 4 (Terracotta Clay Tee)', url: '/images/products/product-4.png' },
  { label: 'Studio 5 (Magenta Cowl Top)', url: '/images/products/product-5.png' },
  { label: 'Studio 6 (Black Everyday Tee)', url: '/images/products/product-6.png' },
  { label: 'Studio 7 (Berry Fuchsia Tee)', url: '/images/products/product-7.png' },
  { label: 'Studio 8 (Midnight Navy Tee)', url: '/images/products/product-8.png' },
  { label: 'Studio 9 (Mustard Gold Top)', url: '/images/products/product-9.png' },
  { label: 'Studio 10 (Desert Rose Tee)', url: '/images/products/product-10.png' },
];

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields for Editing / Creating
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    categoryId: 1,
    fabric: '',
    fitType: '',
    careInstructions: '',
    basePrice: 899,
    discountPrice: 749,
    primaryImage: '/images/products/product-1.png',
    secondaryImage: '/images/products/product-1.png',
    isFeatured: true,
    isNew: true,
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockQuantity: 20,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getAdminProducts(),
        api.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load admin products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description || '',
      categoryId: p.category_id || 1,
      fabric: p.fabric || '100% Combed Organic Cotton',
      fitType: p.fit_type || 'Relaxed Fit',
      careInstructions: p.care_instructions || 'Machine wash cold with like colors.',
      basePrice: p.base_price,
      discountPrice: p.discount_price || p.base_price,
      primaryImage: p.primary_image || '/images/products/product-1.png',
      secondaryImage: p.secondary_image || p.primary_image || '/images/products/product-1.png',
      isFeatured: !!p.is_featured,
      isNew: !!p.is_new,
      availableSizes: p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ['S', 'M', 'L', 'XL'],
      stockQuantity: p.variants?.[0]?.stock_quantity || 20,
    });
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      categoryId: categories[0]?.id || 1,
      fabric: '100% Combed Organic Cotton (180 GSM)',
      fitType: 'Relaxed Fit',
      careInstructions: 'Machine wash cold on gentle cycle. Lay flat to dry.',
      basePrice: 999,
      discountPrice: 799,
      primaryImage: '/images/products/product-1.png',
      secondaryImage: '/images/products/product-1.png',
      isFeatured: true,
      isNew: true,
      availableSizes: ['S', 'M', 'L', 'XL'],
      stockQuantity: 25,
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const cat = categories.find((c) => c.id === Number(formData.categoryId));

    const updatedProduct: Product = {
      ...editingProduct,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      description: formData.description.trim(),
      category_id: Number(formData.categoryId),
      category_name: cat?.name || editingProduct.category_name,
      category_slug: cat?.slug || editingProduct.category_slug,
      fabric: formData.fabric.trim(),
      fit_type: formData.fitType.trim(),
      care_instructions: formData.careInstructions.trim(),
      base_price: Number(formData.basePrice),
      discount_price: formData.discountPrice ? Number(formData.discountPrice) : null,
      primary_image: formData.primaryImage,
      secondary_image: formData.secondaryImage || formData.primaryImage,
      images: [
        { id: editingProduct.id * 10 + 1, image_url: formData.primaryImage, is_primary: true, sort_order: 1 },
        { id: editingProduct.id * 10 + 2, image_url: formData.secondaryImage || formData.primaryImage, is_primary: false, sort_order: 2 },
      ],
      is_featured: formData.isFeatured,
      is_new: formData.isNew,
      availableSizes: formData.availableSizes,
      variants: formData.availableSizes.map((sz, idx) => ({
        id: editingProduct.id * 100 + idx,
        product_id: editingProduct.id,
        sku: `ELV-${editingProduct.id}-${sz}`,
        color_name: editingProduct.availableColors?.[0]?.name || 'Standard',
        color_hex: editingProduct.availableColors?.[0]?.hex || '#8A9A86',
        size_label: sz,
        stock_quantity: Number(formData.stockQuantity),
      })),
    };

    try {
      await api.updateAdminProduct(updatedProduct);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      await loadCatalog();
      showToast(`✓ "${updatedProduct.title}" updated successfully! Changes are live across the store.`);
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a product title');
      return;
    }

    const cat = categories.find((c) => c.id === Number(formData.categoryId));

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      description: formData.description.trim(),
      categoryId: Number(formData.categoryId),
      categoryName: cat?.name || 'Everyday Tops',
      categorySlug: cat?.slug || 'everyday-tops',
      fabric: formData.fabric.trim(),
      fitType: formData.fitType.trim(),
      careInstructions: formData.careInstructions.trim(),
      basePrice: Number(formData.basePrice),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      primaryImage: formData.primaryImage,
      secondaryImage: formData.secondaryImage || formData.primaryImage,
      images: [formData.primaryImage, formData.secondaryImage || formData.primaryImage],
      isFeatured: formData.isFeatured,
      isNew: formData.isNew,
      availableSizes: formData.availableSizes,
      stockQuantity: Number(formData.stockQuantity),
    };

    try {
      await api.createAdminProduct(payload);
      setIsAddModalOpen(false);
      await loadCatalog();
      showToast(`✓ New product "${formData.title}" published successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (productId: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        await api.deleteAdminProduct(productId);
        await loadCatalog();
        showToast(`✓ "${title}" was removed.`);
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleResetCatalog = async () => {
    if (
      window.confirm(
        'Reset catalog to default studio collection? Any custom changes will be restored to the official Elvra product catalog.'
      )
    ) {
      try {
        await api.resetAdminProducts();
        await loadCatalog();
        showToast('✓ Catalog successfully reset to default studio items!');
      } catch (err: any) {
        alert(err.message || 'Failed to reset catalog');
      }
    }
  };

  const toggleSize = (sz: string) => {
    if (formData.availableSizes.includes(sz)) {
      if (formData.availableSizes.length === 1) return; // Keep at least one size
      setFormData({ ...formData, availableSizes: formData.availableSizes.filter((s) => s !== sz) });
    } else {
      setFormData({ ...formData, availableSizes: [...formData.availableSizes, sz] });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(search.toLowerCase())) ||
      (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category_slug === selectedCategory ||
      String(p.category_id) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-charcoal text-cream px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-sage animate-fade-in text-xs font-medium">
          <Sparkles className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-sand/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Elvra Catalog Management
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-semibold mt-1">
            Products & Pricing Control
          </h1>
          <p className="text-xs text-charcoal/60 mt-1">
            Edit product pictures, live pricing, descriptions, fabric details, and stock. Changes immediately sync across the storefront.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleResetCatalog}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-sand hover:border-charcoal text-charcoal/80 text-xs font-medium rounded-lg transition-colors shadow-sm"
            title="Restore default catalog items"
          >
            <RotateCcw className="w-3.5 h-3.5 text-charcoal/60" />
            <span>Reset Catalog</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-sand/60 w-full sm:w-80 shadow-sm">
          <Search className="w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, subtitle, fabric..."
            className="w-full text-xs focus:outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-charcoal/60 uppercase font-semibold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-sand px-3 py-2 rounded-lg text-xs font-medium text-charcoal focus:outline-none focus:border-sage shadow-sm"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-sand/60 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center font-serif text-charcoal/50">Loading product catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-charcoal/60 space-y-2">
            <p className="font-serif text-lg">No products found matching your search</p>
            <p className="text-xs">Try searching with a different term or clear the filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-sand/40 bg-sand-light/40 text-charcoal/70 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Product / Image</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Fabric & Fit</th>
                  <th className="py-3 px-4">Sizes & Stock</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20">
                {filteredProducts.map((p) => {
                  const hasDiscount = p.discount_price && p.discount_price < p.base_price;
                  const discountPercent = hasDiscount
                    ? Math.round(((p.base_price - (p.discount_price || 0)) / p.base_price) * 100)
                    : 0;
                  const totalUnits = p.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 50;

                  return (
                    <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-md overflow-hidden bg-cream border border-sand/60 shrink-0 relative group">
                            <img
                              src={p.primary_image || '/images/products/product-1.png'}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-xs">
                            <p className="font-serif font-semibold text-charcoal text-sm leading-tight">
                              {p.title}
                            </p>
                            <p className="text-[11px] text-charcoal/60 line-clamp-1 mt-0.5">
                              {p.subtitle || p.description}
                            </p>
                            <a
                              href={`/product/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-sage-dark hover:underline mt-1 font-mono"
                            >
                              <span>view on store</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-sand-light rounded text-[11px] font-medium text-charcoal">
                          {p.category_name}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-semibold text-charcoal text-sm">
                          ₹{p.discount_price || p.base_price}
                        </div>
                        {hasDiscount && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-charcoal/40 line-through">
                              ₹{p.base_price}
                            </span>
                            <span className="text-[10px] font-semibold text-terracotta bg-terracotta-light px-1 rounded">
                              {discountPercent}% OFF
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Fabric & Fit */}
                      <td className="py-3.5 px-4 text-charcoal/80">
                        <p className="font-medium text-[11px] line-clamp-1">{p.fabric || 'Pure Cotton'}</p>
                        <p className="text-[10px] text-charcoal/50">{p.fit_type || 'Relaxed'}</p>
                      </td>

                      {/* Sizes & Stock */}
                      <td className="py-3.5 px-4">
                        <div className="flex gap-1 mb-1">
                          {(p.availableSizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                            <span
                              key={sz}
                              className="text-[10px] bg-white border border-sand px-1.5 py-0.5 rounded font-mono font-medium"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] text-charcoal/60 font-medium">
                          {totalUnits} units in stock
                        </span>
                      </td>

                      {/* Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {p.is_new && (
                            <span className="bg-sage-light text-sage-dark px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">
                              New Arrival
                            </span>
                          )}
                          {p.is_featured && (
                            <span className="bg-sand text-charcoal px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 bg-cream hover:bg-sage hover:text-cream text-charcoal rounded-lg border border-sand transition-colors"
                            title="Edit Product, Image, Pricing, and Content"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="p-2 bg-cream hover:bg-terracotta hover:text-cream text-terracotta rounded-lg border border-sand transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT PRODUCT MODAL */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-3xl w-full p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto border border-sand">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-sand/40 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta">
                  Catalog Editor
                </span>
                <h3 className="font-serif text-2xl text-charcoal font-semibold mt-0.5">
                  Edit Product: {editingProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-charcoal/50 hover:text-charcoal p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-6 text-xs">
              {/* SECTION 1: PRODUCT IMAGES */}
              <div className="p-4 bg-cream/40 rounded-xl border border-sand/70 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sage-dark" />
                  <h4 className="font-semibold uppercase tracking-wider text-charcoal">
                    1. Product Image Settings
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  {/* Current Preview */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] text-charcoal/60 font-medium mb-1.5">
                      Live Image Preview
                    </span>
                    <div className="w-28 h-36 rounded-lg overflow-hidden border border-sand shadow-sm bg-white">
                      <img
                        src={formData.primaryImage || '/images/products/product-1.png'}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Image URL Inputs */}
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                        Primary Image Path or URL *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.primaryImage}
                        onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                        placeholder="/images/products/product-1.png or https://..."
                        className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                        Secondary / Hover Image (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryImage}
                        onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                        placeholder="/images/products/product-2.png"
                        className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-mono text-[11px]"
                      />
                    </div>

                    {/* Quick Select from Studio Photos */}
                    <div>
                      <span className="block text-[11px] text-charcoal/70 font-semibold uppercase mb-1.5">
                        Quick Pick: Real Studio Photoshoot Images
                      </span>
                      <div className="grid grid-cols-5 gap-2">
                        {STUDIO_IMAGES.map((img, idx) => {
                          const isSelected = formData.primaryImage === img.url;
                          return (
                            <button
                              type="button"
                              key={img.url}
                              onClick={() => setFormData({ ...formData, primaryImage: img.url })}
                              className={`relative rounded-md overflow-hidden border transition-all h-16 ${
                                isSelected
                                  ? 'border-sage-dark ring-2 ring-sage shadow'
                                  : 'border-sand hover:border-charcoal opacity-75 hover:opacity-100'
                              }`}
                              title={img.label}
                            >
                              <img src={img.url} alt={`Studio ${idx + 1}`} className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 inset-x-0 bg-charcoal/70 text-[9px] text-cream text-center font-bold py-0.5">
                                #{idx + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING & DISCOUNTS */}
              <div className="p-4 bg-cream/40 rounded-xl border border-sand/70 space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sage-dark" />
                  <h4 className="font-semibold uppercase tracking-wider text-charcoal">
                    2. Pricing & Discounts
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Regular Price / MRP (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Sale / Discount Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage text-sm font-semibold text-terracotta"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-sand/60">
                    <span className="text-[10px] text-charcoal/50 uppercase font-bold block">
                      Customer Discount Preview
                    </span>
                    {formData.discountPrice < formData.basePrice ? (
                      <div className="mt-1">
                        <span className="text-sm font-bold text-terracotta">
                          Save ₹{formData.basePrice - formData.discountPrice}
                        </span>
                        <span className="text-[11px] text-charcoal/70 ml-1.5 font-medium">
                          ({Math.round(((formData.basePrice - formData.discountPrice) / formData.basePrice) * 100)}% off)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal/60 mt-1 block">Full MRP (No discount)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: PRODUCT CONTENT & COPY */}
              <div className="p-4 bg-cream/40 rounded-xl border border-sand/70 space-y-4">
                <h4 className="font-semibold uppercase tracking-wider text-charcoal">
                  3. Content & Product Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Signature soft organic cotton everyday top"
                    className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>

                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                    Full Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-sand p-3 rounded focus:outline-none focus:border-sage"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Fabric Composition
                    </label>
                    <input
                      type="text"
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="e.g. 100% Combed Organic Cotton (180 GSM)"
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Fit Type
                    </label>
                    <input
                      type="text"
                      value={formData.fitType}
                      onChange={(e) => setFormData({ ...formData, fitType: e.target.value })}
                      placeholder="e.g. Relaxed Fit / Easy Silhouette"
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.careInstructions}
                    onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                    placeholder="e.g. Machine wash cold with like colors. Gentle spin."
                    className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>
              </div>

              {/* SECTION 4: SIZES, STOCK & BADGES */}
              <div className="p-4 bg-cream/40 rounded-xl border border-sand/70 space-y-4">
                <h4 className="font-semibold uppercase tracking-wider text-charcoal">
                  4. Inventory, Sizes & Badges
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1.5">
                      Available Sizes (Click to toggle)
                    </label>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL'].map((sz) => {
                        const isIncluded = formData.availableSizes.includes(sz);
                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => toggleSize(sz)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                              isIncluded
                                ? 'bg-charcoal text-cream border-charcoal'
                                : 'bg-white text-charcoal/50 border-sand'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Stock per Size (Units)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-sage focus:ring-sage"
                    />
                    <span className="font-semibold text-charcoal text-xs">Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="rounded text-sage focus:ring-sage"
                    />
                    <span className="font-semibold text-charcoal text-xs">"New Arrival" Badge</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-sand/40">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border border-sand text-charcoal rounded-lg hover:border-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sage hover:bg-sage-dark text-cream font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  Save Changes & Publish Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-3xl w-full p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto border border-sand">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-sand/40 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta">
                  Catalog Creator
                </span>
                <h3 className="font-serif text-2xl text-charcoal font-semibold mt-0.5">
                  Add New Product
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-charcoal/50 hover:text-charcoal p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6 text-xs">
              {/* SECTION 1: PRODUCT IMAGES */}
              <div className="p-4 bg-cream/40 rounded-xl border border-sand/70 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sage-dark" />
                  <h4 className="font-semibold uppercase tracking-wider text-charcoal">
                    1. Product Image Settings
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  {/* Current Preview */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] text-charcoal/60 font-medium mb-1.5">
                      Selected Photo
                    </span>
                    <div className="w-28 h-36 rounded-lg overflow-hidden border border-sand shadow-sm bg-white">
                      <img
                        src={formData.primaryImage || '/images/products/product-1.png'}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Image URL Inputs */}
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                        Primary Image Path or URL *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.primaryImage}
                        onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                        placeholder="/images/products/product-1.png or https://..."
                        className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-mono text-[11px]"
                      />
                    </div>

                    {/* Quick Select from Studio Photos */}
                    <div>
                      <span className="block text-[11px] text-charcoal/70 font-semibold uppercase mb-1.5">
                        Quick Pick: Real Studio Photoshoot Images
                      </span>
                      <div className="grid grid-cols-5 gap-2">
                        {STUDIO_IMAGES.map((img, idx) => {
                          const isSelected = formData.primaryImage === img.url;
                          return (
                            <button
                              type="button"
                              key={img.url}
                              onClick={() => setFormData({ ...formData, primaryImage: img.url })}
                              className={`relative rounded-md overflow-hidden border transition-all h-16 ${
                                isSelected
                                  ? 'border-sage-dark ring-2 ring-sage shadow'
                                  : 'border-sand hover:border-charcoal opacity-75 hover:opacity-100'
                              }`}
                              title={img.label}
                            >
                              <img src={img.url} alt={`Studio ${idx + 1}`} className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 inset-x-0 bg-charcoal/70 text-[9px] text-cream text-center font-bold py-0.5">
                                #{idx + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING & DISCOUNTS */}
              <div className="p-4 bg-cream/40 rounded-xl border border-sand/70 space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sage-dark" />
                  <h4 className="font-semibold uppercase tracking-wider text-charcoal">
                    2. Pricing & Discounts
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Regular Price / MRP (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Sale / Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage text-sm font-semibold text-terracotta"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-sand/60">
                    <span className="text-[10px] text-charcoal/50 uppercase font-bold block">
                      Customer Discount Preview
                    </span>
                    {formData.discountPrice < formData.basePrice ? (
                      <div className="mt-1">
                        <span className="text-sm font-bold text-terracotta">
                          Save ₹{formData.basePrice - formData.discountPrice}
                        </span>
                        <span className="text-[11px] text-charcoal/70 ml-1.5 font-medium">
                          ({Math.round(((formData.basePrice - formData.discountPrice) / formData.basePrice) * 100)}% off)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal/60 mt-1 block">Full MRP (No discount)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: PRODUCT CONTENT */}
              <div className="p-4 bg-cream/40 rounded-xl border border-sand/70 space-y-4">
                <h4 className="font-semibold uppercase tracking-wider text-charcoal">
                  3. Content & Product Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Silk Modal Relaxed Tee"
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Signature soft organic cotton everyday top"
                    className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>

                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                    Full Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the fabric feel, drape, styling recommendations, and comfort..."
                    className="w-full bg-white border border-sand p-3 rounded focus:outline-none focus:border-sage"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Fabric Composition
                    </label>
                    <input
                      type="text"
                      value={formData.fabric}
                      onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="e.g. 100% Combed Organic Cotton (180 GSM)"
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Fit Type
                    </label>
                    <input
                      type="text"
                      value={formData.fitType}
                      onChange={(e) => setFormData({ ...formData, fitType: e.target.value })}
                      placeholder="e.g. Relaxed Fit"
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.careInstructions}
                    onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                    placeholder="e.g. Machine wash cold with like colors. Gentle spin."
                    className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>
              </div>

              {/* SECTION 4: INVENTORY & BADGES */}
              <div className="p-4 bg-cream/40 rounded-xl border border-sand/70 space-y-4">
                <h4 className="font-semibold uppercase tracking-wider text-charcoal">
                  4. Inventory, Sizes & Badges
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1.5">
                      Available Sizes
                    </label>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL'].map((sz) => {
                        const isIncluded = formData.availableSizes.includes(sz);
                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => toggleSize(sz)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                              isIncluded
                                ? 'bg-charcoal text-cream border-charcoal'
                                : 'bg-white text-charcoal/50 border-sand'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-charcoal/70 uppercase font-semibold mb-1">
                      Default Stock per Size (Units)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      className="w-full bg-white border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-sage focus:ring-sage"
                    />
                    <span className="font-semibold text-charcoal text-xs">Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="rounded text-sage focus:ring-sage"
                    />
                    <span className="font-semibold text-charcoal text-xs">"New Arrival" Badge</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-sand/40">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-sand text-charcoal rounded-lg hover:border-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sage hover:bg-sage-dark text-cream font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  Publish New Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
