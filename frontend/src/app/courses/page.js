"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Star, ArrowRight, Search, ShieldCheck, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function CoursesCatalog() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let res;
        if (isTeacher) {
          // Teachers only see their own courses
          const token = localStorage.getItem('token');
          res = await fetch('http://localhost:5000/api/courses/my-courses', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } else {
          // Students see all published courses
          res = await fetch('http://localhost:5000/api/courses');
        }
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [isTeacher]);

  const categories = ['All', 'Programming', 'Design', 'Business', 'Marketing'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12 transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {isTeacher ? 'My Courses' : 'Explore Our Professional Courses'}
            </h1>
            <p className="text-lg mt-2" style={{ color: 'var(--text-secondary)' }}>
              {isTeacher
                ? 'Manage and track all the courses you have created.'
                : 'Find the perfect course to upgrade your skills. Learn from expert instructors and earn certified badges.'}
            </p>
          </div>
          {isTeacher && (
            <Link
              href="/dashboard/create-course"
              className="google-btn google-btn-primary whitespace-nowrap flex items-center gap-2"
            >
              <Plus size={18} /> Create New Course
            </Link>
          )}
        </div>

        {/* Search & Filters */}
        <div
          className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl border shadow-sm transition-colors"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 px-4 py-3 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              style={{
                background: 'var(--bg-muted)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'hover:opacity-80'
                }`}
                style={selectedCategory === category
                  ? {}
                  : { background: 'var(--bg-muted)', color: 'var(--text-secondary)' }
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400" />
            <p className="mt-4 text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Fetching catalogs...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div
            className="p-16 text-center border-dashed border-2 rounded-xl"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
          >
            <BookOpen className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} size={56} />
            {isTeacher ? (
              <>
                <h3 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>You haven't created any courses yet</h3>
                <p className="mt-2 mb-4" style={{ color: 'var(--text-secondary)' }}>Start by creating your first course!</p>
                <Link href="/dashboard/create-course" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  <Plus size={18} /> Create your first course
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>No courses match your filters</h3>
                <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Try revising your search query or selecting a different category.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link
                href={isTeacher ? `/dashboard/courses/${course._id}/edit` : `/courses/${course._id}`}
                key={course._id}
                className="flex flex-col justify-between overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 group"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  <div
                    className="relative h-48 flex items-center justify-center"
                    style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                  >
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <BookOpen size={48} />
                    )}
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm border"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    >
                      {course.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3
                      className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {course.title}
                    </h3>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {course.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-2">
                      <ShieldCheck size={18} className="text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Instructor: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{course.teacher?.name || 'Expert'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="p-6 pt-0 border-t mt-4 flex items-center justify-between transition-colors"
                  style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-color)' }}
                >
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
