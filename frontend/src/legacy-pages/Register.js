"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Mail, Lock, User, UserSquare2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      login(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      <div
        className="w-full max-w-md p-8 rounded-xl border shadow-sm transition-colors"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4 shadow-sm">
            <BookOpen className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-medium" style={{ color: 'var(--text-primary)' }}>Create your Account</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Join LearnSphere today</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
              <User className="h-5 w-5" />
            </div>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="Full Name" />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
              <Mail className="h-5 w-5" />
            </div>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="Email address" />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
              <Lock className="h-5 w-5" />
            </div>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className={inputCls} style={inputStyle} placeholder="Create Password" minLength={6} />
          </div>

          {/* Role Selection */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>I want to join as a:</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'student', label: 'Student', Icon: UserSquare2 },
                { value: 'teacher', label: 'Teacher', Icon: BookOpen },
              ].map(({ value, label, Icon }) => (
                <label
                  key={value}
                  className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center gap-2 transition-all ${
                    formData.role === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'hover:opacity-80'
                  }`}
                  style={formData.role !== value ? { borderColor: 'var(--border-color)', color: 'var(--text-secondary)' } : {}}
                >
                  <input type="radio" name="role" value={value} checked={formData.role === value} onChange={handleChange} className="sr-only" />
                  <Icon size={24} />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full transition-colors shadow-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div
          className="mt-6 flex justify-center items-center pt-6 border-t"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400 text-sm ml-1 hover:opacity-80 transition-opacity">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
