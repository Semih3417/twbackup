import { createContext, useState, useContext, useEffect } from 'react';
import client from '../api/client'; // Dein Axios Client

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Beim Start: Wenn Token da ist, User-Status setzen (hier vereinfacht)
  useEffect(() => {
    if (token) {
        // Optional: Hier könnte man /api/me aufrufen um Userdaten zu prüfen
        // Fürs MVP nehmen wir an, wenn Token da ist, sind wir eingeloggt.
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    const { token, user } = res.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    
    // Token für alle zukünftigen Requests setzen
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete client.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);