"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, PlayCircle, CheckCircle, Clock, List } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../../context/AuthContext';

export default function CourseViewer() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const { user, loading: authLoading } = useAuth();
  const videoRef = useRef(null);

  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const lastSavedTime = useRef(0);

  const fetchEnrollment = async () => {
    try {
      console.log('Fetching enrollments for courseId:', courseId);
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const res = await fetch('http://localhost:5000/api/courses/enrolled/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Enrollments response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to load course details');
      }
      
      const enrollments = await res.json();
      console.log('All enrollments:', enrollments);
      
      const matched = enrollments.find(e => e.course?._id === courseId);
      console.log('Matched enrollment:', matched);
      
      if (!matched) {
        throw new Error('You are not enrolled in this course.');
      }
      
      setEnrollment(matched);
      setCourse(matched.course);
      setCompletedLessonIds(matched.completedLessons || []);
      
      // Determine initial active lesson
      if (matched.course?.sections?.length > 0) {
        let firstLesson = null;
        for (const sec of matched.course.sections) {
          if (sec.lessons?.length > 0) {
            firstLesson = sec.lessons[0];
            break;
          }
        }
        if (firstLesson) {
          setActiveLesson(firstLesson);
        }
      }
    } catch (err) {
      console.error('Error fetching enrollment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchEnrollment();
  }, [courseId, user, authLoading, router]);

  // Resume playback position when active lesson changes
  useEffect(() => {
    if (!activeLesson) return;

    if (!enrollment || !videoRef.current) return;

    const savedPosition = enrollment.playbackPositions?.find(
      pos => pos.lessonId === activeLesson._id
    );

    if (savedPosition && savedPosition.positionSeconds > 0) {
      const video = videoRef.current;
      const setTime = () => {
        video.currentTime = savedPosition.positionSeconds;
        video.removeEventListener('loadedmetadata', setTime);
      };
      video.addEventListener('loadedmetadata', setTime);
    }
  }, [activeLesson, enrollment]);

  // Handle video progress updates
  const handleTimeUpdate = async () => {
    const video = videoRef.current;
    if (!video || !activeLesson || !enrollment) return;

    const currentTime = video.currentTime;
    const duration = video.duration;
    
    if (!duration) return;

    // 1. Periodically save playback position (every 5 seconds)
    if (Math.abs(currentTime - lastSavedTime.current) > 5) {
      lastSavedTime.current = currentTime;
      try {
        const token = sessionStorage.getItem('token');
        await fetch(`http://localhost:5000/api/courses/enrolled/${enrollment._id}/playback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            lessonId: activeLesson._id,
            positionSeconds: Math.round(currentTime)
          })
        });
      } catch (err) {
        console.error('Failed to save playback position:', err);
      }
    }
  };

  const handleMarkAsDone = async () => {
    if (!activeLesson || !enrollment) return;
    
    // Optimistically add to completion
    setCompletedLessonIds(prev => [...prev, activeLesson._id]);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/courses/enrolled/${enrollment._id}/lessons/${activeLesson._id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Update total enrollment progress stats
        setEnrollment(prev => ({
          ...prev,
          progress: data.progress,
          completedLessons: data.completedLessons
        }));
      }
    } catch (err) {
      console.error('Failed to mark lesson completed:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-sm text-gray-400 font-medium animate-pulse">Launching player workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-4">
        <p className="text-red-400 font-medium text-lg">{error}</p>
        <Link href="/dashboard" className="google-btn google-btn-outline !text-white !border-gray-700 hover:!bg-gray-800">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-955 flex flex-col lg:flex-row bg-[#121212] text-white">
      
      {/* Left Column - Video Player & Information */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${enrollment?.progress || 0}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-gray-400">{enrollment?.progress || 0}% Done</span>
          </div>
        </div>

        {/* Video Area */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          {activeLesson ? (
            <video
              ref={videoRef}
              src={activeLesson.videoUrl}
              controls
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-contain"
              controlsList="nodownload" // Secure streaming helper
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <PlayCircle size={64} className="animate-pulse mb-3" />
              <p>Select a lesson from the syllabus to start streaming</p>
            </div>
          )}
        </div>

        {/* Lesson Description */}
        {activeLesson && (
          <div className="space-y-3 bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              Now Streaming
            </span>
            <h2 className="text-2xl font-bold text-white">
              {activeLesson.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400 pt-1">
              <Clock size={16} />
              <span>Est. duration: {activeLesson.duration || 10} minutes</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-gray-800">
              <div className="flex gap-4">
                <button
                  onClick={handleMarkAsDone}
                  disabled={completedLessonIds.includes(activeLesson._id)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors text-sm h-fit ${
                    completedLessonIds.includes(activeLesson._id)
                      ? 'bg-green-600/20 text-green-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {completedLessonIds.includes(activeLesson._id) ? 'Completed' : 'Mark as Done'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Syllabus List Sidebar */}
      <div className="w-full lg:w-96 bg-[#1a1a1a] border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col h-auto lg:h-screen lg:sticky lg:top-0">
        <div className="p-6 border-b border-gray-800 bg-[#1e1e1e]">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <List size={20} className="text-blue-500" />
            Course Curriculum
          </h3>
          <p className="text-xs text-gray-400 mt-1">{course?.title}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {course?.sections?.map((section, sIndex) => (
            <div key={section._id} className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
                Module {sIndex + 1}: {section.title}
              </h4>
              
              <div className="space-y-1">
                {section.lessons?.map((lesson, lIndex) => {
                  const isActive = activeLesson?._id === lesson._id;
                  const isCompleted = completedLessonIds.includes(lesson._id);
                  
                  return (
                    <button
                      key={lesson._id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left text-sm ${
                        isActive 
                          ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/30' 
                          : 'text-gray-300 hover:bg-[#252525] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle size={16} className={isActive ? 'text-white' : 'text-green-500'} />
                        ) : (
                          <PlayCircle size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                        )}
                        <span className="line-clamp-1">{sIndex + 1}.{lIndex + 1} {lesson.title}</span>
                      </div>
                      <span className="text-xs font-mono opacity-80 pl-2">
                        {lesson.duration || 10}m
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
