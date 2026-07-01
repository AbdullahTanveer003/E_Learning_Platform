"use client";
import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a73e8]"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      {user.role === 'teacher' ? (
        <TeacherDashboard user={user} />
      ) : (
        <StudentDashboard user={user} />
      )}
    </>
  );
};

export default Dashboard;
