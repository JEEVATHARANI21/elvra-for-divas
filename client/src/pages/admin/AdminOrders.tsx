import React, { useEffect, useState } from 'react';
import { ShoppingCart, Search, Truck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.updateAdminOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Fulfillment & Logistics
        </span>
        <h1 className="font-serif text-3xl text-charcoal font-semibold mt-1">
          Order Management
        </h1>
        <p className="text-xs text-charcoal/60 mt-0.5">
          Process customer orders, update delivery milestones, and attach tracking numbers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-sand/60 max-w-md w-full">
          <Search className="w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, email..."
            className="w-full text-xs focus:outline-none bg-transparent"
          />
        </div>

        {/* Status Pills Filter */}
        <div className="flex flex-wrap gap-2 text-xs">
          {['', 'placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full capitalize font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-sage text-cream'
                  : 'bg-white border border-sand text-charcoal/70 hover:text-charcoal'
              }`}
            >
              {st || 'All Orders'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-sand/60 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center font-serif text-charcoal/50">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-xs text-charcoal/50">No orders found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-sand/40 bg-sand-light/40 text-charcoal/60 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20">
                {filteredOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-charcoal text-sm">
                      {ord.order_number}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-charcoal">{ord.customer_name}</p>
                      <p className="text-[11px] text-charcoal/50">{ord.customer_phone}</p>
                    </td>
                    <td className="py-4 px-4 font-sans font-bold text-charcoal text-sm">
                      ₹{ord.total_amount}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                        {ord.payment_status || 'captured'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-sage-light text-sage-dark'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-charcoal/60">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <select
                        disabled={updatingOrderId === ord.id}
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="bg-white border border-sand px-2.5 py-1.5 rounded text-xs text-charcoal focus:outline-none focus:border-sage font-medium disabled:opacity-50"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
