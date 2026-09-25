import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products & Inventory', path: '/admin/products', icon: Package },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen flex bg-sand-light/50 text-charcoal">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-sand/60 flex flex-col justify-between p-6 shadow-sm hidden md:flex">
        <div className="space-y-8">
          {/* Brand Header */}
          <div>
            <Link to="/admin" className="block">
              <span className="font-serif text-xl tracking-[0.2em] text-charcoal font-semibold">ELVRA</span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-sage-dark block font-sans font-bold">
                Admin Control Panel
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sage text-cream font-semibold'
                      : 'text-charcoal/70 hover:text-charcoal hover:bg-cream'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Options */}
        <div className="space-y-3 pt-6 border-t border-sand/40 text-sm">
          <div className="px-2">
            <p className="text-xs font-semibold text-charcoal">{user?.name || 'Administrator'}</p>
            <p className="text-[11px] text-charcoal/50">{user?.email || 'admin@elvra.com'}</p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-sage-dark hover:underline px-2"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View Public Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-medium text-terracotta hover:bg-cream p-2 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-sand/60 p-4 flex items-center justify-between">
          <Link to="/admin" className="font-serif text-lg font-semibold tracking-wider text-charcoal">
            ELVRA ADMIN
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link to="/" className="text-sage font-medium flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Store</span>
            </Link>
            <button onClick={handleLogout} className="text-terracotta">
              Logout
            </button>
          </div>
        </header>

        <main className="p-6 md:p-10 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
