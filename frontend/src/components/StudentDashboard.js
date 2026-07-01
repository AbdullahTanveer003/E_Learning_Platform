"use client";
import React, { useState, useEffect } from 'react';
import { PlayCircle, Clock, Award, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const StudentDashboard = ({ user }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/courses/enrolled/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data);
        }
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Calculate dynamic stats
  const enrolledCount = enrollments.length;
  const certificatesCount = enrollments.filter(e => e.progress === 100).length;
  
  // Est. hours learned = sum of (progress % * 12 hours estimated per course)
  const totalHours = enrollments.reduce((acc, curr) => {
    return acc + (curr.progress / 100) * 12;
  }, 0).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium" style={{color:'var(--text-primary)'}}>Welcome back, {user.name}</h1>
          <p className="mt-2" style={{color:'var(--text-secondary)'}}>Ready to continue your learning journey?</p>
        </div>
        <Link href="/about" className="google-btn google-btn-primary w-full md:w-auto text-center justify-center">
          Explore New Courses
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="google-card p-6 flex items-start gap-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl text-blue-600 dark:text-blue-400">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>Enrolled Courses</p>
            <p className="text-2xl font-semibold mt-1" style={{color:'var(--text-primary)'}}>{enrolledCount}</p>
          </div>
        </div>
        <div className="google-card p-6 flex items-start gap-4">
          <div className="bg-orange-50 dark:bg-orange-500/10 p-3 rounded-xl text-orange-600 dark:text-orange-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>Hours Learned</p>
            <p className="text-2xl font-semibold mt-1" style={{color:'var(--text-primary)'}}>{totalHours}</p>
          </div>
        </div>
        <div className="google-card p-6 flex items-start gap-4">
          <div className="bg-green-50 dark:bg-green-500/10 p-3 rounded-xl text-green-600 dark:text-green-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>Certificates Earned</p>
            <p className="text-2xl font-semibold mt-1" style={{color:'var(--text-primary)'}}>{certificatesCount}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium" style={{color:'var(--text-primary)'}}>Your Active Courses</h2>
        </div>

        {loading ? (
          <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>Loading your courses...</div>
        ) : enrollments.length === 0 ? (
          <div className="google-card p-12 text-center border-dashed border-2" style={{borderColor:'var(--border-color)'}}>
            <BookOpen className="mx-auto mb-4" style={{color:'var(--text-secondary)'}} size={48} />
            <h3 className="text-lg font-medium" style={{color:'var(--text-primary)'}}>Not enrolled in any courses</h3>
            <p className="mt-2 mb-6" style={{color:'var(--text-secondary)'}}>Explore the curriculum catalog and start learning today!</p>
            <Link href="/about" className="google-btn google-btn-primary inline-flex">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;
              
              const handleResumeClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Resume Lesson clicked for course:', course._id);
                window.location.href = `/dashboard/courses/${course._id}/view`;
              };
              
              const handleCardClick = () => {
                console.log('Card clicked for course:', course._id);
                window.location.href = `/dashboard/courses/${course._id}/view`;
              };
              
              return (
                <div 
                  key={enrollment._id} 
                  className="google-card overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={handleCardClick}
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{background:'var(--bg-muted)',color:'var(--text-secondary)'}}>
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <BookOpen size={40} />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle size={40} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                            <TrendingUp size={16} />
                            {course.category}
                          </div>
                          <h3 className="text-lg font-medium leading-snug" style={{color:'var(--text-primary)'}}>
                            {course.title}
                          </h3>
                          <p className="text-sm mt-2 line-clamp-2" style={{color:'var(--text-secondary)'}}>
                            {course.description}
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2" style={{color:'var(--text-secondary)'}}>
                            <span className="font-medium">{enrollment.progress}% Completed</span>
                            <span>{enrollment.completedLessons?.length || 0} Lessons finished</span>
                          </div>
                          <div className="w-full rounded-full h-2 overflow-hidden" style={{background:'var(--bg-muted)'}}>
                            <div 
                              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t flex items-center justify-between" style={{background:'var(--bg-muted)',borderColor:'var(--border-color)'}}>
                    <p className="text-sm" style={{color:'var(--text-secondary)'}}>
                      Instructor: <span className="font-medium" style={{color:'var(--text-primary)'}}>{course.teacher?.name || 'Expert'}</span>
                    </p>
                    <button 
                      onClick={handleResumeClick}
                      className="google-btn google-btn-outline !py-1.5 !px-4 text-xs hover:!bg-blue-50 active:!bg-blue-100"
                    >
                      Resume Lesson
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
