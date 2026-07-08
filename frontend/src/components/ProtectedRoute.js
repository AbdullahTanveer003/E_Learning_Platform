"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * Wraps any page/layout that requires authentication.
 * - While auth is loading  → shows a full-screen branded spinner (no flash)
 * - If not authenticated  → redirects to /login
 * - If role is specified  → redirects to /dashboard if the user's role doesn't match
 * - If all checks pass    → renders children normally
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, loading, requiredRole, router]);

  // ── 1. Auth is still resolving → show branded loader ──────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
          {/* Logo */}
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl shadow-blue-200 dark:shadow-blue-900">
            <BookOpen className="text-white" size={32} />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            LearnSphere
          </span>
          {/* Spinner */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-[3px] border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
              Verifying your session…
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Unauthenticated or wrong role → render nothing (redirect fires above) ─
  if (!user) return null;
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') return null;

  // ── 3. All good → render the protected page ────────────────────────────────
  return <>{children}</>;
}
