"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, PlusCircle, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function CreateCourse() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    price: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create course');
      }

      // Redirect to course editor to add content
      router.push(`/dashboard/courses/${data._id}/edit`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center transition-colors" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-4 text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Verifying privileges...</p>
      </div>
    );
  }

  if (!user || user.role !== 'teacher') return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create New Course</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Start building your next amazing course</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <div className="google-card p-6 space-y-6">
          <h2 className="text-lg font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Course Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Master React and Next.js"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="What will students learn in this course?"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard" className="px-6 py-3 rounded-xl font-medium transition-colors hover:opacity-80" style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={saveLoading}
            className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saveLoading ? 'Creating...' : (
              <>
                <Save size={18} />
                Save & Continue
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
