import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { BoardView } from './pages/BoardView';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 grid grid-cols-2 gap-1">
              <div className="w-2 h-2 bg-white rounded-sm animate-pulse"></div>
              <div className="w-2 h-2 bg-white/70 rounded-sm animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-white/70 rounded-sm animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-white rounded-sm animate-pulse delay-225"></div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">ProjectFlow</h2>
            <p className="text-sm text-gray-600">Loading your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/" /> : <Auth />} 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/board/:id"
        element={
          <ProtectedRoute>
            <BoardView boardId={window.location.pathname.split('/')[2]} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;