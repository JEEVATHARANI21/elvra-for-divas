import React, { useEffect, useState } from 'react';
import { Plus, Package, X, Check, Search, Tag } from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // New Product Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [fitType, setFitType] = useState('Relaxed Fit');
  const [careInstructions, setCareInstructions] = useState('');
  const [basePrice, setBasePrice] = useState<number>(899);
  const [discountPrice, setDiscountPrice] = useState<number>(799);
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isNew, setIsNew] = useState(true);

  // Variant Matrix Generator State
  const [selectedColors, setSelectedColors] = useState<string[]>(['Sage Green']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [defaultStock, setDefaultStock] = useState<number>(15);

  const availableColors = [
    { name: 'Sage Green', hex: '#8A9A86' },
    { name: 'Warm Sand', hex: '#E5D9C5' },
    { name: 'Terracotta', hex: '#C88A75' },
    { name: 'Cream', hex: '#FAF8F5' },
    { name: 'Deep Charcoal', hex: '#2B2D2F' },
  ];

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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !basePrice || !description) return;

    // Generate variants array
    const variants: any[] = [];
    for (const cName of selectedColors) {
      const cObj = availableColors.find((c) => c.name === cName);
      for (const sLabel of selectedSizes) {
        variants.push({
          colorName: cName,
          colorHex: cObj?.hex || '#8A9A86',
          sizeLabel: sLabel,
          stockQuantity: defaultStock,
        });
      }
    }

    const payload = {
      title,
      categoryId,
      subtitle,
      description,
      fabric,
      fitType,
      careInstructions,
      basePrice,
      discountPrice,
      isFeatured,
      isNew,
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
      variants,
    };

    try {
      await api.createAdminProduct(payload);
      setIsModalOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setSubtitle('');
      await loadCatalog();
      alert('Product created successfully with variant inventory!');
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Catalog & Inventory
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-semibold mt-1">
            Product Management
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-sand/60 max-w-md">
        <Search className="w-4 h-4 text-charcoal/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by title or category..."
          className="w-full text-xs focus:outline-none bg-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-sand/60 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center font-serif text-charcoal/50">Loading product catalog...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-sand/40 bg-sand-light/40 text-charcoal/60 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20">
                {filteredProducts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={p.primary_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80'}
                        alt={p.title}
                        className="w-10 h-12 object-cover rounded bg-cream shrink-0"
                      />
                      <div>
                        <p className="font-serif font-semibold text-charcoal text-sm">{p.title}</p>
                        <p className="text-[10px] text-charcoal/50 font-mono">{p.slug}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-charcoal">{p.category_name}</td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-charcoal">
                      ₹{p.discount_price || p.base_price}
                      {p.discount_price && (
                        <span className="text-[10px] text-charcoal/40 line-through block font-normal">
                          ₹{p.base_price}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          p.total_stock <= 8 ? 'text-amber-800' : 'text-charcoal'
                        }`}
                      >
                        {p.total_stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {p.variant_count} matrix SKUs
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1">
                        {p.is_new ? (
                          <span className="bg-sage-light text-sage-dark px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">
                            New
                          </span>
                        ) : null}
                        {p.is_featured ? (
                          <span className="bg-sand text-charcoal px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">
                            Featured
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-sand/40 pb-3">
              <h3 className="font-serif text-xl text-charcoal font-semibold">Add New Luxury Piece</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Silk Modal Relaxed Tee"
                    className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-charcoal/70 uppercase font-semibold mb-1">Short Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Signature soft organic cotton everyday top"
                  className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                />
              </div>

              <div>
                <label className="block text-charcoal/70 uppercase font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Crafted from cloud-finish combed organic cotton with relaxed neckline..."
                  className="w-full bg-cream/30 border border-sand p-3 rounded focus:outline-none focus:border-sage"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% Combed Organic Cotton (180 GSM)"
                    className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>
                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">Fit Type</label>
                  <input
                    type="text"
                    value={fitType}
                    onChange={(e) => setFitType(e.target.value)}
                    placeholder="e.g. Relaxed Fit / Easy Drape"
                    className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>
                <div>
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-charcoal/70 uppercase font-semibold mb-1">Default Units / Variant</label>
                  <input
                    type="number"
                    value={defaultStock}
                    onChange={(e) => setDefaultStock(Number(e.target.value))}
                    className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal/70 uppercase font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-cream/30 border border-sand px-3 py-2 rounded focus:outline-none focus:border-sage"
                />
              </div>

              {/* Variant Matrix Checkboxes */}
              <div className="p-4 bg-sand-light/50 rounded-lg space-y-3 border border-sand/40">
                <span className="font-semibold uppercase text-charcoal block">Variant Matrix Configuration</span>

                {/* Colors */}
                <div>
                  <span className="text-[11px] text-charcoal/60 block mb-1">Select Colors to Generate:</span>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((c) => {
                      const isChecked = selectedColors.includes(c.name);
                      return (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() => {
                            setSelectedColors(
                              isChecked ? selectedColors.filter((n) => n !== c.name) : [...selectedColors, c.name]
                            );
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] ${
                            isChecked ? 'bg-white border-charcoal font-semibold' : 'border-sand opacity-60'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: c.hex }} />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <span className="text-[11px] text-charcoal/60 block mb-1">Select Sizes:</span>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL'].map((sz) => {
                      const isChecked = selectedSizes.includes(sz);
                      return (
                        <button
                          type="button"
                          key={sz}
                          onClick={() => {
                            setSelectedSizes(
                              isChecked ? selectedSizes.filter((s) => s !== sz) : [...selectedSizes, sz]
                            );
                          }}
                          className={`px-3 py-1 rounded border text-xs font-semibold ${
                            isChecked ? 'bg-charcoal text-cream border-charcoal' : 'bg-white text-charcoal border-sand opacity-60'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[11px] text-charcoal/60 italic">
                  Will generate {selectedColors.length * selectedSizes.length} individual SKUs with {defaultStock} stock each ({selectedColors.length * selectedSizes.length * defaultStock} total inventory).
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-sand/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-sand text-charcoal rounded hover:border-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sage hover:bg-sage-dark text-cream font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
