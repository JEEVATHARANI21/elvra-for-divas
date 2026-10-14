import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User as UserIcon, Search, Menu, X, ChevronDown, Sparkles, Instagram } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-sage text-cream text-xs tracking-widest uppercase py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-sand animate-pulse" />
        <span>Complimentary Express Delivery on orders above ₹999 &bull; <span className="font-serif italic capitalize">Wings to Explore</span></span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-sand/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-charcoal hover:text-sage transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop Navigation Links Left */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
              <Link to="/shop" className="text-charcoal hover:text-sage transition-colors">
                Shop All
              </Link>
              <Link to="/shop?category=everyday-tops" className="text-charcoal hover:text-sage transition-colors">
                Everyday Tops
              </Link>
              <Link to="/shop?category=loungewear" className="text-charcoal hover:text-sage transition-colors">
                Loungewear
              </Link>
              <Link to="/shop?category=track-pants" className="text-charcoal hover:text-sage transition-colors">
                Track Pants
              </Link>
              <Link to="/shop?category=co-ord-sets" className="text-charcoal hover:text-sage transition-colors">
                Co-ord Sets
              </Link>
              <Link to="/collections/lounge-edit" className="text-charcoal hover:text-sage transition-colors">
                Lounge Edit
              </Link>
              <Link to="/collections/weekend-edit" className="text-charcoal hover:text-sage transition-colors">
                Weekend Edit
              </Link>
            </nav>

            {/* Brand Logo (Center) */}
            <div className="flex-1 lg:flex-initial text-center">
              <Link to="/" className="inline-block group">
                <div className="flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.25em] text-charcoal group-hover:text-sage transition-colors">
                    ELVRA
                  </span>
                  <div className="flex items-center gap-1 -mt-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal/70 font-sans">
                      FOR DIVAS
                    </span>
                  </div>
                  <span className="text-[9px] font-serif italic text-terracotta tracking-wider">
                    Wings to Explore
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation & Actions Right */}
            <div className="flex items-center space-x-5 sm:space-x-6">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 text-charcoal hover:text-sage transition-colors"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-1.5 text-charcoal hover:text-sage transition-colors relative"
                aria-label="View Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terracotta text-cream text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-1 p-1.5 text-charcoal hover:text-sage transition-colors"
                  aria-label="Account Menu"
                >
                  <UserIcon className="w-5 h-5 stroke-[1.75]" />
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 hidden sm:block" />
                </button>

                {isAccountOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-elevated border border-sand/50 py-2 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setIsAccountOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-sand/30">
                          <p className="font-medium text-charcoal">{user.name}</p>
                          <p className="text-xs text-charcoal/60 truncate">{user.email}</p>
                          {user.role === 'admin' && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-sage/20 text-sage-dark text-[10px] rounded uppercase font-semibold">
                              Admin Portal
                            </span>
                          )}
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 hover:bg-cream text-charcoal hover:text-sage transition-colors"
                        >
                          My Profile & Addresses
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 hover:bg-cream text-charcoal hover:text-sage transition-colors"
                        >
                          Order History
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-4 py-2 bg-sage-light/60 font-medium text-sage-dark hover:bg-sage-light transition-colors"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountOpen(false);
                            navigate('/');
                          }}
                          className="w-full text-left px-4 py-2 text-terracotta hover:bg-cream transition-colors border-t border-sand/30"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-xs text-charcoal/60 border-b border-sand/30">
                          Welcome to Elvra For Divas
                        </div>
                        <Link
                          to="/account/login"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 hover:bg-cream font-medium text-charcoal hover:text-sage transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/account/register"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 hover:bg-cream text-charcoal/80 hover:text-sage transition-colors"
                        >
                          Create Account
                        </Link>
                        <Link
                          to="/track-order"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 hover:bg-cream text-charcoal/80 hover:text-sage transition-colors border-t border-sand/30"
                        >
                          Track An Order
                        </Link>
                        <Link
                          to="/admin/login"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 text-xs text-charcoal/50 hover:text-sage hover:bg-cream transition-colors"
                        >
                          Admin Access &rarr;
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Bag Button */}
              <button
                onClick={openDrawer}
                className="p-1.5 text-charcoal hover:text-sage transition-colors relative flex items-center gap-1.5"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                <span className="bg-sage text-cream text-[11px] font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {cart.count}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-sand/40 bg-cream-soft py-4 px-4 sm:px-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tees, loungewear, modal sets, track pants..."
                className="w-full bg-transparent border-b border-charcoal/30 py-2 text-sm focus:outline-none focus:border-sage placeholder:text-charcoal/40"
                autoFocus
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-wider font-semibold bg-charcoal text-cream px-4 py-2 hover:bg-sage transition-colors rounded-none"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-charcoal/60 hover:text-charcoal p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-sand/50 px-6 py-6 space-y-4 text-base font-medium">
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-charcoal hover:text-sage py-2 border-b border-sand/20"
            >
              Shop All Products
            </Link>
            <Link
              to="/shop?category=everyday-tops"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-charcoal hover:text-sage py-2 border-b border-sand/20"
            >
              Everyday Tops
            </Link>
            <Link
              to="/shop?category=loungewear"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-charcoal hover:text-sage py-2 border-b border-sand/20"
            >
              Loungewear & Sets
            </Link>
            <Link
              to="/shop?category=track-pants"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-charcoal hover:text-sage py-2 border-b border-sand/20"
            >
              Track Pants & Joggers
            </Link>
            <Link
              to="/shop?category=co-ord-sets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-charcoal hover:text-sage py-2 border-b border-sand/20"
            >
              Co-ord Sets
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-charcoal hover:text-sage py-2 border-b border-sand/20"
            >
              About Elvra
            </Link>
            <Link
              to="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-charcoal hover:text-sage py-2 border-b border-sand/20"
            >
              Track Your Order
            </Link>
            <a
              href="https://instagram.com/elvra_for_divas?rpxt=dWF4YXZudm9sa3Zj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sage-dark font-medium py-2 hover:text-charcoal transition-colors"
            >
              <Instagram className="w-4 h-4 text-terracotta" />
              <span>Follow @elvra_for_divas</span>
            </a>
          </div>
        )}
      </header>
    </>
  );
};
