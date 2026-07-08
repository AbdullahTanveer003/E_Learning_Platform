"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Users, DollarSign, Edit, Trash2 } from 'lucide-react';

const TeacherDashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('/api/courses/my-courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }

        const revRes = await fetch('/api/courses/my-revenue', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (revRes.ok) {
          const revData = await revRes.json();
          setRevenue(revData.totalRevenue);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"?\n\nThis will permanently remove the course, all its sections, and lessons.`)) return;
    
    setDeletingId(courseId);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete course');
      }
      // Remove from local state immediately — no page reload needed
      setCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const publishedCount = courses.filter(c => c.status === 'published').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium" style={{color:'var(--text-primary)'}}>Welcome back, {user.name}</h1>
          <p className="mt-2" style={{color:'var(--text-secondary)'}}>Manage your courses and track your students' progress.</p>
        </div>
        <Link href="/dashboard/create-course" className="google-btn google-btn-primary w-full md:w-auto flex items-center justify-center gap-2">
          <Plus size={20} />
          Create New Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="google-card p-6 flex items-start gap-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl text-blue-600 dark:text-blue-400">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>Total Courses</p>
            <p className="text-2xl font-semibold mt-1" style={{color:'var(--text-primary)'}}>{courses.length}</p>
          </div>
        </div>
        <div className="google-card p-6 flex items-start gap-4">
          <div className="bg-green-50 dark:bg-green-500/10 p-3 rounded-xl text-green-600 dark:text-green-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>Published Courses</p>
            <p className="text-2xl font-semibold mt-1" style={{color:'var(--text-primary)'}}>{publishedCount}</p>
          </div>
        </div>
        <div className="google-card p-6 flex items-start gap-4">
          <div className="bg-purple-50 dark:bg-purple-500/10 p-3 rounded-xl text-purple-600 dark:text-purple-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>Total Revenue</p>
            <p className="text-2xl font-semibold mt-1" style={{color:'var(--text-primary)'}}>${revenue}</p>
          </div>
        </div>
      </div>

      {/* Course Management Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium" style={{color:'var(--text-primary)'}}>Your Courses</h2>
        </div>

        {loading ? (
          <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed" style={{background:'var(--bg-muted)',borderColor:'var(--border-color)'}}>
            <BookOpen size={48} className="mx-auto mb-4" style={{color:'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium" style={{color:'var(--text-primary)'}}>No courses yet</h3>
            <p className="mt-1 mb-4" style={{color:'var(--text-secondary)'}}>You haven't created any courses. Start by creating one!</p>
            <Link href="/dashboard/create-course" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline">
              <Plus size={18} /> Create your first course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="google-card overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto bg-gray-100 relative flex items-center justify-center text-gray-400 overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen size={40} />
                  )}
                  <div className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-md ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    {course.status === 'published' ? 'Published' : 'Draft'}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{color:'var(--text-primary)'}}>{course.title}</h3>
                    <p className="text-sm line-clamp-2" style={{color:'var(--text-secondary)'}}>{course.description}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="text-sm">
                        <span style={{color:'var(--text-secondary)'}}>Category:</span> <span className="font-medium" style={{color:'var(--text-primary)'}}>{course.category}</span>
                      </div>
                      <div className="text-sm">
                        <span style={{color:'var(--text-secondary)'}}>Price:</span> <span className="font-medium" style={{color:'var(--text-primary)'}}>${course.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{borderColor:'var(--border-color)'}}>
                    <Link href={`/dashboard/courses/${course._id}/edit`} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors">
                      <Edit size={16} /> Manage Course
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id, course.title)}
                      disabled={deletingId === course._id}
                      className="p-2 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{color:'var(--text-secondary)'}}
                      title="Delete course"
                    >
                      {deletingId === course._id ? (
                        <div className="animate-spin rounded-full h-[18px] w-[18px] border-t-2 border-b-2 border-red-500" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
