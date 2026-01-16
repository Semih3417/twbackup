import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Import des AuthContext, um den Login-Status global verfügbar zu machen
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Der Provider umschließt die App, damit useContext(AuthContext) überall funktioniert */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);