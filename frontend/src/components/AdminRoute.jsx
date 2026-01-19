import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Warten, bis Login geprüft wurde
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin h-8 w-8 border-4 border-slate-800 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 2. Prüfen: Ist User da? UND Ist er Admin?
  if (!user || user.role !== 'admin') {
    // Wenn nicht, schicken wir ihn zur Startseite oder Login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Zugriff erlaubt
  return children;
}