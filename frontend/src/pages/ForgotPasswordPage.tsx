import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';
import { Sparkles, Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{ message: string; resetToken?: string }>('/auth/forgot-password', {
        email,
      });
      setMessage(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-sage-200/80 shadow-xl shadow-sage-900/5 animate-fade-in">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-2xl bg-sage-600 flex items-center justify-center text-white shadow-md shadow-sage-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
          </Link>
          <Badge variant="sage">Account Recovery</Badge>
          <h2 className="font-display text-3xl font-bold text-stone-900">Forgot Password</h2>
          <p className="text-xs text-stone-500">
            Enter your email to receive secure password recovery instructions.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        {message ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recovery Request Processed</span>
              </div>
              <p>{message}</p>
            </div>

            {resetToken && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  ⚡ Demo Reset Token Generated:
                </span>
                <code className="text-[11px] block bg-white p-2 rounded-lg border border-amber-300 break-all text-stone-800">
                  {resetToken}
                </code>
                <button
                  onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                  className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                >
                  Proceed to Reset Password Now →
                </button>
              </div>
            )}

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-bold text-sage-700 hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Account Email
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm shadow-md shadow-sage-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Instructions</span>}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-medium text-stone-500 hover:text-stone-800">
                Cancel and return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
