"use client";
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Menu, LogOut, Bell, X, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// ─── Theme Toggle Button ─────────────────────────────────────────────────────
const THEME_OPTIONS = [
  { id: 'light',  label: 'Light',  Icon: Sun },
  { id: 'dark',   label: 'Dark',   Icon: Moon },
  { id: 'system', label: 'System', Icon: Monitor },
];

function ThemeToggle() {
  const { theme, changeTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const ActiveIcon = THEME_OPTIONS.find((o) => o.id === theme)?.Icon ?? Sun;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle theme"
        className="flex items-center gap-1 p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      >
        <ActiveIcon size={19} />
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] w-40 rounded-2xl border shadow-xl overflow-hidden z-50"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {THEME_OPTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => { changeTheme(id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                  ${theme === id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                <Icon size={16} />
                {label}
                {theme === id && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileThemeOpen, setMobileThemeOpen] = useState(false);
  const { theme, changeTheme } = useTheme();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const getNavLinks = () => {
    const baseLinks = [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' }
    ];
    if (user) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' }
      ];
    }
    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* ── Desktop / Tablet Navbar ───────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b transition-colors duration-300"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900">
                <BookOpen className="text-white" size={22} />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300">
                LearnSphere
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme toggle – always visible on desktop */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Desktop user section */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                    <button className="p-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors relative">
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                    </button>
                    <div className="flex items-center gap-2 pl-1">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-full text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors"
                        title="Sign out"
                      >
                        <LogOut size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="text-sm font-bold text-white bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 px-6 py-2.5 rounded-full transition-colors shadow-lg"
                    >
                      Join Free
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-900/40 z-[60] md:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm z-[70] shadow-2xl flex flex-col md:hidden rounded-l-3xl overflow-hidden transition-colors duration-300"
              style={{ background: 'var(--bg-secondary)' }}
            >
              {/* Drawer header */}
              <div
                className="p-6 flex justify-between items-center border-b"
                style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg shadow-md shadow-blue-200 dark:shadow-blue-900">
                    <BookOpen className="text-white" size={18} />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300">
                    LearnSphere
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

                {/* Mobile user profile */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border"
                    style={{
                      background: 'var(--bg-muted)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">{user.role}</p>
                    </div>
                  </motion.div>
                )}

                {/* Mobile nav links */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1 ml-2">Menu</p>
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <div
                          className="p-2 rounded-lg shadow-sm transition-colors"
                          style={{ background: 'var(--bg-muted)' }}
                        >
                          <BookOpen size={18} />
                        </div>
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-500/10 transition-all"
                      >
                        <div className="p-2 rounded-lg bg-white dark:bg-white/10 shadow-sm">
                          <BookOpen size={18} />
                        </div>
                        Dashboard
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Mobile theme picker */}
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2 ml-2">Theme</p>
                  <div
                    className="rounded-2xl border overflow-hidden"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-muted)' }}
                  >
                    {THEME_OPTIONS.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => changeTheme(id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b last:border-b-0
                          ${theme === id
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                            : 'hover:bg-gray-100 dark:hover:bg-white/5'
                          }`}
                        style={{
                          color: theme === id ? undefined : 'var(--text-secondary)',
                          borderColor: 'var(--border-color)',
                        }}
                      >
                        <Icon size={17} />
                        {label}
                        {theme === id && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer footer */}
              <div
                className="p-6 border-t"
                style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
              >
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 font-bold rounded-xl border transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-3.5 text-center font-bold rounded-xl border transition-colors hover:opacity-80"
                      style={{
                        color: 'var(--text-primary)',
                        background: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-3.5 text-center font-bold text-white bg-gray-900 dark:bg-blue-600 rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
                    >
                      Join Free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
