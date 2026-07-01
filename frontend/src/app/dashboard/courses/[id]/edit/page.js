"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Video, GripVertical, Settings, CheckCircle, Upload } from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';
import Link from 'next/link';

export default function CourseBuilder() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for adding new sections/lessons
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  
  const [addingLessonTo, setAddingLessonTo] = useState(null); // section ID
  const [newLessonData, setNewLessonData] = useState({ title: '', videoUrl: '', duration: '' });
  const [videoUploading, setVideoUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoUploading(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/upload/video', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Video upload failed');

      setNewLessonData(prev => ({
        ...prev,
        videoUrl: data.url,
        duration: data.duration
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setVideoUploading(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnailUploading(true);
    const formData = new FormData();
    formData.append('thumbnail', file);

    try {
      const token = localStorage.getItem('token');
      // 1. Upload image to Cloudinary
      const uploadRes = await fetch('http://localhost:5000/api/upload/thumbnail', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');

      // 2. Save the thumbnail URL on the course record
      const patchRes = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ thumbnail: uploadData.url })
      });
      if (!patchRes.ok) throw new Error('Failed to save thumbnail to course');

      // 3. Refresh course so the preview updates
      fetchCourse();
    } catch (err) {
      alert(err.message);
    } finally {
      setThumbnailUploading(false);
    }
  };

  const fetchCourse = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
      if (!res.ok) throw new Error('Failed to fetch course');
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || user.role !== 'teacher') {
      router.push('/dashboard');
      return;
    }
    
    fetchCourse();
  }, [courseId, router, user, authLoading]);

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: newSectionTitle,
          order: course.sections.length 
        })
      });

      if (!res.ok) throw new Error('Failed to create section');
      
      setNewSectionTitle('');
      setIsAddingSection(false);
      fetchCourse(); // Refresh data
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddLesson = async (e, sectionId) => {
    e.preventDefault();
    if (!newLessonData.title.trim() || !newLessonData.videoUrl.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/courses/sections/${sectionId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: newLessonData.title,
          videoUrl: newLessonData.videoUrl,
          duration: Number(newLessonData.duration) || 0,
          // order could be calculated based on existing lessons, omitting for simplicity
        })
      });

      if (!res.ok) throw new Error('Failed to create lesson');
      
      setAddingLessonTo(null);
      setNewLessonData({ title: '', videoUrl: '', duration: '' });
      fetchCourse(); // Refresh data
    } catch (err) {
      alert(err.message);
    }
  };

  const togglePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = course.status === 'published' ? 'draft' : 'published';
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error('Failed to update status');
      fetchCourse();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a73e8]"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">Loading course builder...</p>
      </div>
    );
  }
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!course) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              Curriculum Builder
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                {course.status.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Settings size={16} /> Settings
          </button>
          <button 
            onClick={togglePublish}
            className={`px-4 py-2 font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2 ${
              course.status === 'published' 
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200' 
                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
            }`}
          >
            {course.status === 'published' ? 'Unpublish Course' : <><CheckCircle size={16} /> Publish Course</>}
          </button>
        </div>
      </div>

      {/* Course Thumbnail */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Course Thumbnail</h2>
          <p className="text-xs text-gray-500 mt-0.5">This image is shown on the course catalog page. Best size: 800×450px.</p>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Preview */}
          <div className="w-full sm:w-72 h-40 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={32} />
                <span className="text-xs font-medium">No thumbnail yet</span>
              </div>
            )}
          </div>
          {/* Upload button */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Upload a high-quality image (JPG, PNG, or WEBP) to make your course stand out.</p>
            {thumbnailUploading ? (
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#1a73e8]"></div>
                <span className="font-medium animate-pulse">Uploading to Cloudinary...</span>
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                <Upload size={16} />
                {course.thumbnail ? 'Replace Thumbnail' : 'Upload Thumbnail'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </label>
            )}
            {course.thumbnail && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle size={13} /> Thumbnail saved
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
        </div>

        <div className="space-y-4">
          {course.sections && course.sections.length === 0 && !isAddingSection && (
            <div className="text-center py-12 bg-blue-50/50 rounded-2xl border border-dashed border-blue-200">
              <p className="text-blue-800 font-medium mb-4">Start by adding your first section!</p>
              <button 
                onClick={() => setIsAddingSection(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} /> Add Section
              </button>
            </div>
          )}

          {/* Render existing sections */}
          {course.sections && course.sections.map((section, index) => (
            <div key={section._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <GripVertical className="text-gray-400 cursor-grab" size={20} />
                  <h3 className="font-bold text-gray-900">Section {index + 1}: {section.title}</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Lessons in this section */}
                {section.lessons && section.lessons.length > 0 ? (
                  <div className="space-y-2">
                    {section.lessons.map((lesson, lIndex) => (
                      <div key={lesson._id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-100 hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-3">
                          <GripVertical className="text-gray-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <Video size={16} />
                          </div>
                          <span className="font-medium text-gray-700">Lesson {lIndex + 1}: {lesson.title}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                          {lesson.duration} min
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic pl-8">No lessons in this section yet.</p>
                )}

                {/* Add Lesson UI */}
                {addingLessonTo === section._id ? (
                  <div className="pl-8 pt-4">
                    <form onSubmit={(e) => handleAddLesson(e, section._id)} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Lesson Title</label>
                        <input 
                          type="text" 
                          required
                          value={newLessonData.title}
                          onChange={(e) => setNewLessonData({...newLessonData, title: e.target.value})}
                          placeholder="e.g. Setting up the environment"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Video URL (or auto-filled below)</label>
                          <input 
                            type="text" 
                            required
                            value={newLessonData.videoUrl}
                            onChange={(e) => setNewLessonData({...newLessonData, videoUrl: e.target.value})}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Duration (mins)</label>
                          <input 
                            type="number" 
                            value={newLessonData.duration}
                            onChange={(e) => setNewLessonData({...newLessonData, duration: e.target.value})}
                            placeholder="10"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          />
                        </div>
                      </div>

                      {/* Video File Uploader */}
                      <div className="bg-white p-3.5 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center">
                        {videoUploading ? (
                          <div className="flex items-center gap-2.5 text-sm text-gray-500 py-1">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#1a73e8]"></div>
                            <span className="font-medium animate-pulse">Uploading video to Cloudinary...</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer text-xs font-bold text-[#1a73e8] hover:text-[#1557b0] transition-colors flex items-center gap-1.5 py-1">
                            <Upload size={15} /> Upload Video File (.mp4, .mov, etc.)
                            <input 
                              type="file" 
                              accept="video/*" 
                              onChange={handleVideoUpload}
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setAddingLessonTo(null)} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                          Cancel
                        </button>
                        <button type="submit" className="px-3 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                          Save Lesson
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="pl-8">
                    <button 
                      onClick={() => setAddingLessonTo(section._id)}
                      className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors"
                    >
                      <Plus size={16} /> Add Lesson
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Section UI */}
          {isAddingSection ? (
            <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
              <form onSubmit={handleAddSection}>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Section Title</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    required
                    autoFocus
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="e.g. Module 1: Basics"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setIsAddingSection(false)} className="px-4 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-colors">
                    Save Section
                  </button>
                </div>
              </form>
            </div>
          ) : (
            course.sections && course.sections.length > 0 && (
              <button 
                onClick={() => setIsAddingSection(true)}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Add Another Section
              </button>
            )
          )}

        </div>
      </div>
    </div>
  );
}
