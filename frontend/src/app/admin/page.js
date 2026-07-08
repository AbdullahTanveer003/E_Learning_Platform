"use client";
import React, { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      
      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      const teachersRes = await fetch('/api/admin/pending-teachers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (teachersRes.ok) setPendingTeachers(await teachersRes.json());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`/api/admin/approve-teacher/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchDashboardData(); // Refresh list
    } catch (err) {
      alert('Error approving teacher');
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Error loading stats</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Platform statistics and pending actions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totals.users}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl"><GraduationCap size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totals.students}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><BookOpen size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Teachers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totals.teachers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Courses</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totals.courses}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Enrolled Courses */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Most Enrolled Courses</h2>
          <div className="space-y-4">
            {stats.popularCourses.length > 0 ? stats.popularCourses.map((course, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-medium text-gray-900">{course.title}</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  {course.count} Enrollments
                </span>
              </div>
            )) : <p className="text-gray-500 text-sm">No enrollments yet.</p>}
          </div>
        </div>

        {/* Pending Teacher Approvals */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            Pending Teacher Approvals
            {pendingTeachers.length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                {pendingTeachers.length}
              </span>
            )}
          </h2>
          <div className="space-y-4">
            {pendingTeachers.length > 0 ? pendingTeachers.map((teacher) => (
              <div key={teacher._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{teacher.name}</p>
                  <p className="text-xs text-gray-500">{teacher.email}</p>
                </div>
                <button
                  onClick={() => handleApprove(teacher._id)}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <CheckCircle size={16} /> Approve
                </button>
              </div>
            )) : <p className="text-gray-500 text-sm italic">All caught up! No pending approvals.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
