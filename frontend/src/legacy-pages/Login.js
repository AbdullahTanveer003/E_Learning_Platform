"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Mail, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset link');
      setForgotSuccess(data.message);
      setForgotEmail('');
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  // Shared input style
  const inputStyle = {
    background: 'var(--bg-muted)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
  };
  const inputCls = "w-full pl-10 px-4 py-3 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 transition-colors duration-300"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ── Card ─────────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-md p-8 rounded-xl border shadow-sm transition-colors"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4 shadow-sm">
            <BookOpen className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-medium" style={{ color: 'var(--text-primary)' }}>Sign in</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Continue to LearnSphere</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
                <Mail className="h-5 w-5" />
              </div>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="Email address" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
                <Lock className="h-5 w-5" />
              </div>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="Password" />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => { setShowForgotModal(true); setForgotError(''); setForgotSuccess(''); }}
              className="font-medium text-blue-600 dark:text-blue-400 hover:opacity-80 bg-transparent border-none cursor-pointer transition-opacity"
            >
              Forgot password?
            </button>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Not your computer? Use Guest mode to sign in privately.
        </div>

        <div className="mt-6 flex justify-between items-center pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <Link href="/register" className="font-medium text-blue-600 dark:text-blue-400 text-sm hover:opacity-80 transition-opacity">
            Create account
          </Link>
        </div>
      </div>

      {/* ── Forgot Password Modal ─────────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl border shadow-xl w-full max-w-md p-8 relative transition-colors"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 transition-colors hover:opacity-70"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>Reset your password</h3>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-500/30">
                {forgotError}
              </div>
            )}

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm rounded-lg border border-green-200 dark:border-green-500/30">
                  {forgotSuccess}
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full transition-colors"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={inputCls}
                    style={inputStyle}
                    placeholder="Email address"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-3 rounded-full font-semibold border transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)', background: 'transparent' }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={forgotLoading}
                    type="submit"
                    className="flex-1 py-3 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
                  >
                    {forgotLoading ? 'Sending...' : 'Send link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
