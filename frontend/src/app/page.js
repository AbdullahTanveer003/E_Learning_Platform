"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Star, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200 dark:bg-purple-900 blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col justify-center relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left – Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium text-sm">
              <Zap size={16} />
              <span>The future of learning is here</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Potential
              </span>
            </h1>

            <p className="text-xl leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of students learning modern skills from industry experts. Advance your career with our professional courses.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full font-medium transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900 hover:-translate-y-1"
              >
                Start Learning Now
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all shadow-sm hover:-translate-y-1 border"
                style={{
                  color: 'var(--text-primary)',
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                Learn More
              </Link>
            </div>

            <div
              className="flex items-center gap-8 pt-8 border-t"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>50+</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Expert Courses</p>
              </div>
              <div className="w-px h-12" style={{ background: 'var(--border-color)' }} />
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>10k+</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active Students</p>
              </div>
            </div>
          </motion.div>

          {/* Right – Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative lg:ml-10"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full blur-2xl -z-10" />

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-3xl overflow-hidden shadow-lg h-48 w-full border-4 border-white dark:border-gray-800">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg h-64 w-full border-4 border-white dark:border-gray-800">
                    <img
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop"
                      alt="Coding"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden shadow-lg h-64 w-full border-4 border-white dark:border-gray-800">
                    <img
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop"
                      alt="Virtual Learning"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg h-48 w-full border-4 border-white dark:border-gray-800 bg-blue-600 dark:bg-blue-700 flex flex-col items-center justify-center text-white relative group cursor-pointer">
                    <div className="absolute inset-0 bg-blue-700 dark:bg-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Star size={40} className="mb-2 relative z-10 text-yellow-300 fill-yellow-300" />
                    <span className="text-2xl font-bold relative z-10">4.9/5</span>
                    <span className="text-sm text-blue-100 relative z-10">Average Rating</span>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute top-1/2 -left-12 -translate-y-1/2 p-4 rounded-2xl shadow-xl border flex items-center gap-4 z-20 transition-colors duration-300"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Over</p>
                  <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>1,200+ Courses</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
