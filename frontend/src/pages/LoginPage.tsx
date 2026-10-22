import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import { Sparkles, Mail, Lock, Loader2, ArrowRight, Shield, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@yogalife.com');
      setPassword('Admin@123');
    } else {
      setEmail('demo@yogalife.com');
      setPassword('User@123');
    }
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-sage-200/80 shadow-xl shadow-sage-900/5 animate-fade-in">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-2xl bg-sage-600 flex items-center justify-center text-white shadow-md shadow-sage-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
          </Link>
          <Badge variant="sage">Welcome Back</Badge>
          <h2 className="font-display text-3xl font-bold text-stone-900">Sign in to YogaLife</h2>
          <p className="text-xs text-stone-500">
            Resume your mindful practice, streaks, and personal wellness goals.
          </p>
        </div>

        {/* Demo Fast Login Buttons for Reviewers/Evaluators */}
        <div className="bg-sage-50/70 p-3.5 rounded-2xl border border-sage-200/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sage-800 block text-center">
            ⚡ Quick Demo Accounts (Click to autofill)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="py-1.5 px-3 rounded-xl bg-white border border-sage-200 text-stone-800 hover:bg-sage-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-sage-600" />
              <span>Practitioner Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 hover:bg-purple-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-sage-500 focus:outline-none text-stone-800"
                placeholder="you@domain.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-sage-700 hover:text-sage-900 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-sage-500 focus:outline-none text-stone-800"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm shadow-md shadow-sage-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-stone-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-sage-700 hover:underline">
              Create an account free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
