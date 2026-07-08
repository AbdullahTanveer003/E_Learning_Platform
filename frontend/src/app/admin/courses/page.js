"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('/api/admin/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setCourses(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This will remove all associated content and enrollments.")) return;
    
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses(courses.filter(c => c._id !== id));
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      alert('Error deleting course');
    }
  };

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
        <p className="text-gray-500 mt-2">View and manage all platform courses.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b font-medium">Title</th>
              <th className="p-4 border-b font-medium">Category</th>
              <th className="p-4 border-b font-medium">Instructor</th>
              <th className="p-4 border-b font-medium">Status</th>
              <th className="p-4 border-b font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{course.title}</td>
                <td className="p-4 text-gray-500">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold uppercase">
                    {course.category}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{course.teacher?.name || 'Unknown'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="p-4 flex items-center justify-end gap-2">
                  <Link
                    href={`/courses/${course._id}`}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Course"
                  >
                    <ExternalLink size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
