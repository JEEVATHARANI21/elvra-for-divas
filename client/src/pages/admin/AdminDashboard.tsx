import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return <div className="py-20 text-center font-serif text-charcoal/50">Loading dashboard metrics...</div>;
  }

  const statCards = [
    {
      title: "Today's Sales",
      value: `₹${stats?.todayRevenue || 0}`,
      sub: `Lifetime: ₹${stats?.totalRevenue || 0}`,
      icon: DollarSign,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Orders',
      value: stats?.totalOrders || 0,
      sub: `${stats?.pendingOrders || 0} requiring fulfillment`,
      icon: ShoppingCart,
      color: 'text-sage-dark bg-sage-light border-sage/40',
    },
    {
      title: 'Customers',
      value: stats?.totalCustomers || 0,
      sub: 'Registered divas',
      icon: Users,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      title: 'Active Products',
      value: stats?.totalProducts || 0,
      sub: 'In seasonal catalogue',
      icon: Package,
      color: 'text-charcoal bg-sand-light border-sand',
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockCount || 0,
      sub: 'Variants with ≤ 8 units',
      icon: AlertTriangle,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Overview
        </span>
        <h1 className="font-serif text-3xl text-charcoal font-semibold mt-1">
          ELVRA Store Metrics
        </h1>
        <p className="text-xs text-charcoal/60 mt-0.5">
          Real-time summary of sales performance, orders, inventory, and customer activity.
        </p>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-white p-5 rounded-xl border border-sand/60 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg font-semibold text-charcoal">Catalog & Pricing Manager</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Quickly edit product images, update selling prices, modify descriptions, and manage stock inventory.
          </p>
        </div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Package className="w-4 h-4" />
          <span>Manage Products & Pricing</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-xl border border-sand/60 shadow-soft space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="font-sans text-2xl font-bold text-charcoal">{card.value}</p>
                <p className="text-[11px] text-charcoal/50 mt-0.5">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl border border-sand/60 shadow-soft p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-sand/40 pb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">Recent Customer Orders</h3>
            <p className="text-xs text-charcoal/50">Latest orders placed across website channels</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-sage-dark hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <p className="text-xs text-charcoal/50 py-8 text-center">No orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-sand/40 text-charcoal/50 uppercase tracking-wider">
                  <th className="py-3 px-3">Order Number</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20">
                {stats?.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-charcoal">{ord.order_number}</td>
                    <td className="py-3.5 px-3 font-medium text-charcoal">{ord.customer_name}</td>
                    <td className="py-3.5 px-3 font-sans font-semibold text-charcoal">₹{ord.total_amount}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-sage-light text-sage-dark">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-medium capitalize text-emerald-700">
                        {ord.payment_status || 'captured'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs font-semibold text-sage-dark hover:underline"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
