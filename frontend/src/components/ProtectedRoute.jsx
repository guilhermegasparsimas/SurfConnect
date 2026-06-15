import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

/**
 * Route guard component that restricts access to authenticated users
 * with appropriate permission roles.
 * 
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string[]} allowedRoles - List of roles permitted to view this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ocean-900 font-semibold text-lg animate-pulse">Carregando SurfConnect...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Show premium "Access Denied" screen if unauthorized
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 text-center rounded-2xl shadow-xl animate-fade-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-9 h-9 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Acesso Negado</h2>
          <p className="text-slate-600 mb-6">
            Sua conta de <strong>{user.role}</strong> não tem permissão para visualizar esta área.
          </p>
          <button
            onClick={() => {
              // Redirect to user's landing page
              if (user.role === 'ADMIN') window.location.href = '/admin';
              else if (user.role === 'INSTRUCTOR') window.location.href = '/instructor';
              else window.location.href = '/student';
            }}
            className="w-full py-3 px-4 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            Ir para meu Painel
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
