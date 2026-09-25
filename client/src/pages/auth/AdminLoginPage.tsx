import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@elvra.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-sand/70 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center mx-auto text-sage-dark">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal/60 font-sans font-bold block">
            ELVRA FOR DIVAS
          </span>
          <h1 className="font-serif text-2xl text-charcoal font-semibold">Admin Portal</h1>
          <p className="text-xs text-charcoal/60">Manage catalog, inventory, orders, and sales performance.</p>
        </div>

        {error && (
          <div className="p-3 bg-terracotta-light text-terracotta text-xs rounded border border-terracotta/30 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-charcoal/70 uppercase font-semibold mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage font-medium"
            />
          </div>

          <div>
            <label className="block text-charcoal/70 uppercase font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
            />
          </div>

          <div className="p-3 bg-sand-light/50 rounded border border-sand/40 text-[11px] text-charcoal/70">
            <strong>Default Credentials:</strong> <br />
            Email: <code className="text-charcoal font-semibold">admin@elvra.com</code> <br />
            Password: <code className="text-charcoal font-semibold">admin123</code>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-charcoal hover:bg-sage text-cream text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs border-t border-sand/30">
          <Link to="/" className="text-sage-dark hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
