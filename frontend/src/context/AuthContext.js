"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to parse auth data:", err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    // Listen to changes in other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        initializeAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Watch route changes to enforce role protection
  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/courses');
    const isTeacherRoute = pathname.startsWith('/dashboard/create-course') || pathname.endsWith('/edit');
    
    if (isProtectedRoute && !user) {
      router.push('/login');
    } else if (isTeacherRoute && user && user.role !== 'teacher' && user.role !== 'admin') {
      // Direct student away from teacher dashboards
      router.push('/dashboard');
    }
  }, [pathname, user, loading, router]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
