import { createContext, useState, useContext, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  // NEU: Wir starten im "Lade-Modus"
  const [loading, setLoading] = useState(true);

  // Token im Client setzen, wenn vorhanden
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    // Funktion zum Prüfen des Logins beim Start
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Wir versuchen, die User-Daten zu laden
          const res = await client.get('/users/me');
          setUser(res.data);
        } catch (err) {
          // Wenn Token ungültig -> Alles löschen
          console.error("Auto-Login failed", err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      // WICHTIG: Egal was passiert, wir sind fertig mit Laden
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    const { token, user } = res.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    // Token für zukünftige Requests setzen
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete client.defaults.headers.common['Authorization'];
    // Optional: window.location.href = '/login';
  };

  return (
    // Wir geben 'loading' mit nach draußen
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);