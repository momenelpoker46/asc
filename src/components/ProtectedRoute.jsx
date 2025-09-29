import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoaderCircle } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-secondary-900">
        <LoaderCircle className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they
    // log in, which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
