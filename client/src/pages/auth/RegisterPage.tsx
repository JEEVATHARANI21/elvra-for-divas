import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register(name.trim(), email.trim(), password, phone.trim() || undefined);
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-lg border border-sand/60 shadow-soft space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">Join The Family</span>
          <h1 className="font-serif text-3xl text-charcoal font-normal">Create Account</h1>
          <p className="text-xs text-charcoal/60">Wings to Explore. Comfort looks good on you.</p>
        </div>

        {error && (
          <div className="p-3 bg-terracotta-light text-terracotta text-xs rounded border border-terracotta/30 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-charcoal/70 uppercase font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aadhya Sharma"
              className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
            />
          </div>

          <div>
            <label className="block text-charcoal/70 uppercase font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="diva@example.com"
              className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
            />
          </div>

          <div>
            <label className="block text-charcoal/70 uppercase font-semibold mb-1">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
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
              placeholder="At least 6 characters"
              className="w-full bg-cream/30 border border-sand px-3 py-2.5 rounded focus:outline-none focus:border-sage"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-sage hover:bg-sage-dark text-cream text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-charcoal/60 border-t border-sand/30">
          Already have an account?{' '}
          <Link to="/account/login" className="text-sage-dark font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
