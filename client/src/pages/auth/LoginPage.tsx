import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-lg border border-sand/60 shadow-soft space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Welcome Back</span>
          <h1 className="font-serif text-3xl text-charcoal font-normal">Sign In</h1>
          <p className="text-xs text-charcoal/60">Access your saved addresses and order journey.</p>
        </div>

        {error && (
          <div className="p-3 bg-terracotta-light text-terracotta text-xs rounded border border-terracotta/30 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-charcoal/70 uppercase font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="diva@elvra.com"
              className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
            />
          </div>

          <div>
            <label className="block text-charcoal/70 uppercase font-semibold mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-charcoal/60 space-y-2 border-t border-sand/30">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/account/register" className="text-sage-dark font-semibold hover:underline">
              Create an account
            </Link>
          </p>
          <p>
            <Link to="/admin/login" className="text-charcoal/40 hover:text-charcoal hover:underline">
              Admin Portal Access &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
