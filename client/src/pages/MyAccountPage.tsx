import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Package, LogOut, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';

export const MyAccountPage: React.FC = () => {
  const { user, addresses, logout, saveAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState<Address>({
    recipient_name: user?.name || '',
    phone: user?.phone || '',
    address_line1: '',
    address_line2: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: '',
    is_default: true,
  });

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAddress(addressForm);
      setIsAddingAddress(false);
      setAddressForm({
        recipient_name: user?.name || '',
        phone: user?.phone || '',
        address_line1: '',
        address_line2: '',
        city: '',
        district: '',
        state: 'Tamil Nadu',
        pincode: '',
        is_default: false,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to save address');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-sand/40 pb-4 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Customer Portal</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-1">
            Hello, {user?.name || 'Diva'}
          </h1>
        </div>
        <button
          onClick={logout}
          className="text-xs text-terracotta hover:underline font-medium flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-sand/40 text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors ${
            activeTab === 'profile' ? 'border-b-2 border-sage text-sage-dark' : 'text-charcoal/50 hover:text-charcoal'
          }`}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 transition-colors ${
            activeTab === 'addresses' ? 'border-b-2 border-sage text-sage-dark' : 'text-charcoal/50 hover:text-charcoal'
          }`}
        >
          Saved Addresses ({addresses.length})
        </button>
        <Link
          to="/account/orders"
          className="pb-3 text-charcoal/50 hover:text-charcoal transition-colors flex items-center gap-1"
        >
          <span>Order History</span>
        </Link>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-sand/60 shadow-soft max-w-xl space-y-4 text-xs">
          <h3 className="font-serif text-xl text-charcoal font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-charcoal/50 block mb-0.5 uppercase">Full Name</span>
              <p className="font-semibold text-charcoal text-sm">{user?.name}</p>
            </div>
            <div>
              <span className="text-charcoal/50 block mb-0.5 uppercase">Email Address</span>
              <p className="font-semibold text-charcoal text-sm">{user?.email}</p>
            </div>
            <div>
              <span className="text-charcoal/50 block mb-0.5 uppercase">Phone</span>
              <p className="font-semibold text-charcoal text-sm">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-charcoal/50 block mb-0.5 uppercase">Account Type</span>
              <span className="inline-block uppercase font-bold text-sage-dark bg-sage-light px-2 py-0.5 rounded">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl text-charcoal font-medium">Delivery Addresses</h3>
            {!isAddingAddress && (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            )}
          </div>

          {/* New Address Form */}
          {isAddingAddress && (
            <form onSubmit={handleSaveAddress} className="bg-white p-6 rounded-lg border border-sand/60 shadow-soft space-y-4 text-xs max-w-xl">
              <h4 className="font-serif text-base text-charcoal font-medium">Add New Address</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-charcoal/70 uppercase mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipient_name}
                    onChange={(e) => setAddressForm({ ...addressForm, recipient_name: e.target.value })}
                    className="w-full bg-cream/30 border border-sand p-2 rounded"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-charcoal/70 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full bg-cream/30 border border-sand p-2 rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-charcoal/70 uppercase mb-1">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={addressForm.address_line1}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                    className="w-full bg-cream/30 border border-sand p-2 rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-charcoal/70 uppercase mb-1">Address Line 2 (Area/Landmark)</label>
                  <input
                    type="text"
                    value={addressForm.address_line2 || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                    className="w-full bg-cream/30 border border-sand p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-charcoal/70 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-cream/30 border border-sand p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-charcoal/70 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full bg-cream/30 border border-sand p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-4 py-2 border border-sand text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sage text-cream font-semibold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* List of Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 bg-white rounded-lg border border-sand/60 text-xs space-y-1 relative">
                {addr.is_default && (
                  <span className="absolute top-3 right-3 text-[10px] bg-sage-light text-sage-dark px-2 py-0.5 rounded font-semibold uppercase">
                    Default
                  </span>
                )}
                <p className="font-semibold text-charcoal text-sm">{addr.recipient_name}</p>
                <p className="text-charcoal/80">{addr.address_line1}</p>
                {addr.address_line2 && <p className="text-charcoal/80">{addr.address_line2}</p>}
                <p className="text-charcoal/80">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-charcoal/60 pt-1">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
