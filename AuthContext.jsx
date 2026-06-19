import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-primary-950 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save location for redirection after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // User role not authorized
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
