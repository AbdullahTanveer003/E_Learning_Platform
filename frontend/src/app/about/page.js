"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Heart, Users, Award, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="py-24 relative overflow-hidden transition-colors duration-300" style={{ background: 'var(--bg-muted)' }}>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-100/30 dark:bg-blue-900/20 rounded-l-full blur-3xl transform translate-x-1/3 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-medium text-sm"
          >
            Learn About Us
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Empowering Minds, <br/> Shaping the Future
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            We are on a mission to democratize education and empower individuals worldwide through accessible, high-quality learning experiences.
          </motion.p>
        </div>
      </div>

      {/* ── Our Story ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Our Story</h2>
            <div className="space-y-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Founded in 2023, LearnSphere started with a simple idea: education should be accessible to everyone, everywhere, regardless of their background or location.
              </p>
              <p>
                What began as a small platform with just a handful of courses has now grown into a global community of learners and educators. We've partnered with industry experts and top universities to bring the classroom to your screen.
              </p>
              <p>
                Today, we continue to innovate and expand, driven by our belief that learning is a lifelong journey that transforms lives and opens doors to new opportunities.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 font-medium hover:opacity-80 flex items-center gap-2 transition-opacity">
                Get in touch with our team <Globe size={18} />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl relative">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" alt="Our Team" className="w-full h-auto object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-600 dark:bg-blue-700 rounded-3xl -z-10" />
          </motion.div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="bg-blue-600 dark:bg-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, stat: '50k+', label: 'Active Learners', delay: 0.1 },
              { icon: BookOpen, stat: '1,200+', label: 'Expert Courses', delay: 0.2 },
              { icon: Globe, stat: '120+', label: 'Countries Reached', delay: 0.3 },
              { icon: Award, stat: '300+', label: 'Top Instructors', delay: 0.4 },
            ].map(({ icon: Icon, stat, label, delay }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }} className="text-white">
                <div className="flex justify-center mb-4 opacity-80"><Icon size={32} /></div>
                <h3 className="text-4xl font-bold mb-2">{stat}</h3>
                <p className="text-blue-100 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Core Values ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Our Core Values</h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            These are the principles that guide our every decision and shape the platform we build for you.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            { Icon: Target, color: 'blue', title: 'Excellence', text: 'We partner with industry leaders to bring you the most relevant and up-to-date curriculum, ensuring top-tier quality.' },
            { Icon: Shield, color: 'green', title: 'Trust & Transparency', text: 'Your success is our priority. We provide recognized certificates, reliable support, and clear pricing with no hidden fees.' },
            { Icon: Heart, color: 'red', title: 'Community', text: 'Join a vibrant community of learners who support and encourage each other every day through forums and group projects.' },
          ].map(({ Icon, color, title, text }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="p-8 rounded-3xl hover:shadow-lg transition-shadow border text-center space-y-4"
              style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
            >
              <div className={`mx-auto w-16 h-16 bg-${color}-100 dark:bg-${color}-900/30 rounded-2xl flex items-center justify-center text-${color}-600 dark:text-${color}-400 transform rotate-3 hover:rotate-6 transition-transform`}>
                <Icon size={32} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <div className="py-20 border-t transition-colors duration-300" style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Ready to start your journey?</h2>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>Join thousands of students and transform your career today.</p>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full font-medium transition-all shadow-lg hover:-translate-y-1">
            Join for Free
          </Link>
        </div>
      </div>

    </div>
  );
}
