import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- SEITEN IMPORTS ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle'; 
import MyGarage from './pages/MyGarage';
import Search from './pages/Search';
import VehicleDetail from './pages/VehicleDetail';
import Favorites from './pages/Favorites';
import UserProfile from './pages/UserProfile';
import Magazine from './pages/Magazine';
import Chat from './pages/Chat';

// --- ADMIN SEITEN IMPORTS ---
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMagazine from './pages/admin/AdminMagazine';
import AdminArticleEditor from './pages/admin/AdminArticleEditor';

// --- KOMPONENTEN IMPORTS ---
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* === Öffentliche Routen === */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/magazine" element={<Magazine />} />

          {/* === Geschützte Routen (User Login) === */}
          <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
          <Route path="/vehicles/edit/:id" element={<ProtectedRoute><EditVehicle /></ProtectedRoute>} />
          <Route path="/my-garage" element={<ProtectedRoute><MyGarage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          {/* === Admin Routen (Nur für Admins) === */}
          
          {/* Dashboard Übersicht */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Benutzerverwaltung */}
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />

          {/* Magazin Liste/Verwaltung */}
          <Route path="/admin/magazine" element={
            <AdminRoute>
              <AdminMagazine />
            </AdminRoute>
          } />

          {/* Magazin Artikel erstellen */}
          <Route path="/admin/magazine/new" element={
            <AdminRoute>
              <AdminArticleEditor />
            </AdminRoute>
          } />

          {/* Bestehenden Artikel bearbeiten */}
          <Route path="/admin/magazine/edit/:id" element={
            <AdminRoute>
              <AdminArticleEditor />
            </AdminRoute>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;