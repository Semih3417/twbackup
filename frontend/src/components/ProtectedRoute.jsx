import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token } = useAuth(); // Prüfen, ob Token existiert

  if (!token) {
    // Wenn nicht eingeloggt, ab zum Login!
    return <Navigate to="/login" replace />;
  }

  return children;
}