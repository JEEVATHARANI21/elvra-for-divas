import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/common/CartDrawer';
import { WhatsAppFloat } from '../components/common/WhatsAppFloat';

export const StoreLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CartDrawer />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
};
