"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen py-20 relative overflow-hidden transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      {/* Background blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Have questions about our courses or platform? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">

          {/* ── Contact Info Cards ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Email */}
            <div
              className="p-6 rounded-2xl shadow-sm border flex items-start gap-4 transition-colors"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Email Us</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Our friendly team is here to help.</p>
                <a href="mailto:support@learnsphere.com" className="text-blue-600 dark:text-blue-400 font-medium">support@learnsphere.com</a>
              </div>
            </div>

            {/* Office */}
            <div
              className="p-6 rounded-2xl shadow-sm border flex items-start gap-4 transition-colors"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="bg-purple-50 dark:bg-purple-500/10 p-3 rounded-xl text-purple-600 dark:text-purple-400">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Office</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Come say hello at our HQ.</p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>100 Innovation Drive<br/>Tech City, TC 10020</p>
              </div>
            </div>

            {/* Phone */}
            <div
              className="p-6 rounded-2xl shadow-sm border flex items-start gap-4 transition-colors"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="bg-green-50 dark:bg-green-500/10 p-3 rounded-xl text-green-600 dark:text-green-400">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Phone</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+1234567890" className="font-medium" style={{ color: 'var(--text-primary)' }}>+1 (234) 567-8900</a>
              </div>
            </div>
          </motion.div>

          {/* ── Contact Form ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 p-8 md:p-10 rounded-3xl shadow-xl border transition-colors"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                  style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900 flex items-center justify-center gap-2"
              >
                Send Message
                <Send size={18} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
