"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, ChevronRight, PlayCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`/api/courses/${courseId}`);
        if (!courseRes.ok) throw new Error('Course not found');
        const courseData = await courseRes.json();
        setCourse(courseData);

        // Fetch enrollment status if logged in
        const token = sessionStorage.getItem('token');
        if (token && user && user.role === 'student') {
          const enrolledRes = await fetch('/api/courses/enrolled/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (enrolledRes.ok) {
            const enrollments = await enrolledRes.json();
            const enrolled = enrollments.some(e => e.course?._id === courseId);
            setIsEnrolled(enrolled);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrollLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enroll');

      setIsEnrolled(true);
      router.push('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a73e8]"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">Loading course info...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-medium text-lg">{error}</p>
        <Link href="/courses" className="text-[#1a73e8] hover:underline font-semibold flex items-center gap-1">
          <ArrowLeft size={16} /> Back to explore
        </Link>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
          <ArrowLeft size={20} /> Back to Catalog
        </Link>

        {/* Hero Course Header Card */}
        <div className="google-card bg-white p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative overflow-hidden">
          <div className="lg:col-span-2 space-y-6">
            <span className="bg-blue-50 text-[#1a73e8] border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {course.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {course.title}
            </h1>
            <p className="text-gray-600 leading-relaxed text-base">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-600" size={18} />
                <span>Instructor: <span className="font-semibold text-gray-900">{course.teacher?.name || 'Expert'}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-blue-500" />
                <span>{course.sections?.length || 0} Modules</span>
              </div>
            </div>
          </div>

          {/* Action sidebar */}
          <div className="google-card p-6 bg-gray-50/50 border border-gray-200/60 rounded-2xl flex flex-col justify-between h-full space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Price</span>
              <p className="text-4xl font-bold text-gray-900">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </p>
            </div>

            {user?.role === 'teacher' || user?.role === 'admin' ? (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-xl text-center">
                You are registered as a **{user.role}**. Students can enroll in this course.
              </div>
            ) : isEnrolled ? (
              <Link 
                href="/dashboard" 
                className="google-btn google-btn-primary w-full !py-3 text-center justify-center shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                disabled={enrollLoading}
                onClick={handleEnroll}
                className="google-btn google-btn-primary w-full !py-3 text-center justify-center shadow-lg disabled:opacity-75"
              >
                {enrollLoading ? 'Enrolling...' : user ? 'Enroll in Course' : 'Sign in to Enroll'}
              </button>
            )}
          </div>
        </div>

        {/* Curriculum section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Course Syllabus & Curriculum</h2>
          
          <div className="space-y-4">
            {course.sections && course.sections.length === 0 ? (
              <p className="text-gray-500 italic">No modules have been loaded for this syllabus yet.</p>
            ) : (
              course.sections.map((section, index) => (
                <div key={section._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50/70 px-6 py-4 flex items-center justify-between border-b border-gray-150">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <ChevronRight size={18} className="text-[#1a73e8]" />
                      Module {index + 1}: {section.title}
                    </h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {section.lessons?.length || 0} Lessons
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {section.lessons && section.lessons.length > 0 ? (
                      section.lessons.map((lesson, lIndex) => (
                        <div key={lesson._id} className="flex items-center justify-between p-4 pl-8 bg-white hover:bg-gray-50/50 transition-all">
                          <div className="flex items-center gap-3">
                            <PlayCircle size={18} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              {lIndex + 1}. {lesson.title}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> {lesson.duration || 10} mins
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic p-4 pl-8">No lessons in this section yet.</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
