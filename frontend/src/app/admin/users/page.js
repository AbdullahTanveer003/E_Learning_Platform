"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert('Error deleting user');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 mt-2">View and manage all registered users.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 border-b font-medium">Name</th>
              <th className="p-4 border-b font-medium">Email</th>
              <th className="p-4 border-b font-medium">Role</th>
              <th className="p-4 border-b font-medium">Status</th>
              <th className="p-4 border-b font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                  {u.name}
                  {u._id === currentUser?._id && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">You</span>}
                </td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'teacher' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  {u.role === 'teacher' && !u.isApproved ? (
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <AlertTriangle size={14} /> Pending
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 font-medium">Active</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {u._id !== currentUser?._id && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
