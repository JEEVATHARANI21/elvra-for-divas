import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, ExternalLink } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await api.getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'packed':
      case 'confirmed':
        return 'bg-sage-light text-sage-dark';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-sand/40 pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Account Portal</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-1">My Orders</h1>
      </div>

      {isLoading ? (
        <div className="py-20 text-center font-serif text-charcoal/50">
          Fetching your order journey...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-sand/60 shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-charcoal/30">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl text-charcoal">No orders yet</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            Once you experience the comfort of Elvra pieces, your past orders will appear here.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-sand/60 shadow-soft p-6 space-y-4 transition-all hover:border-sand"
            >
              {/* Top Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand/30 pb-4 text-xs">
                <div>
                  <span className="text-charcoal/50 block">Order Number</span>
                  <span className="font-mono font-bold text-charcoal text-sm">{order.order_number}</span>
                </div>
                <div>
                  <span className="text-charcoal/50 block">Date Placed</span>
                  <span className="font-medium text-charcoal">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal/50 block">Total Amount</span>
                  <span className="font-sans font-bold text-charcoal text-sm">₹{order.total_amount}</span>
                </div>
                <div>
                  <span className="text-charcoal/50 block">Fulfillment Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center text-xs">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80'}
                      alt={item.product_name}
                      className="w-12 h-16 object-cover rounded bg-cream shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-serif font-medium text-charcoal text-sm">{item.product_name}</p>
                      <p className="text-charcoal/60 mt-0.5">
                        {item.color_name} &bull; Size: {item.size_label} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-sans font-semibold text-charcoal">
                      ₹{item.total_price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action footer */}
              <div className="pt-2 border-t border-sand/30 flex justify-end">
                <Link
                  to={`/order-success/${order.order_number}`}
                  className="text-xs font-semibold text-sage-dark hover:underline flex items-center gap-1"
                >
                  <span>View Receipt Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
