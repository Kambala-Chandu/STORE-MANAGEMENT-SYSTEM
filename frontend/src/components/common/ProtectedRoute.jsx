import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase() || '';
    const allowed = allowedRoles.map(r => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      return (
        <div className="p-8 text-center bg-slate-800/60 rounded-2xl border border-slate-700/50 max-w-lg mx-auto mt-12">
          <h2 className="text-xl font-bold text-red-400">Access Restricted</h2>
          <p className="text-sm text-slate-300 mt-2">
            Your role (<span className="font-bold text-slate-100">{user.role}</span>) does not have permission to view this page.
          </p>
        </div>
      );
    }
  }

  return <Outlet />;
};
