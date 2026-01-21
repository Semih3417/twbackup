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
import ArticleDetail from './pages/ArticleDetail';
import Impressum from './pages/legal/Impressum';
import Datenschutz from './pages/legal/Datenschutz';
import AGB from './pages/legal/AGB';
import HowItWorks from './pages/info/HowItWorks';
import FAQ from './pages/info/FAQ';
import About from './pages/info/About';
import Safety from './pages/info/Safety';
import Contact from './pages/info/Contact';
import Contract from './pages/info/Contract';
import NotFound from './pages/NotFound';

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
          <Route path="/magazine/:slug" element={<ArticleDetail />} />

          {/* === Geschützte Routen (User Login) === */}
          <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
          <Route path="/vehicles/edit/:id" element={<ProtectedRoute><EditVehicle /></ProtectedRoute>} />
          <Route path="/my-garage" element={<ProtectedRoute><MyGarage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          {/* === Admin Routen (Nur für Admins) === */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/magazine" element={
            <AdminRoute>
              <AdminMagazine />
            </AdminRoute>
          } />
          <Route path="/admin/magazine/new" element={
            <AdminRoute>
              <AdminArticleEditor />
            </AdminRoute>
          } />
          <Route path="/admin/magazine/edit/:id" element={
            <AdminRoute>
              <AdminArticleEditor />
            </AdminRoute>
          } />

          {/* === Info & Legal Pages === */}
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/so-gehts" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ueber-uns" element={<About />} />
          <Route path="/sicherheit" element={<Safety />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/vertrag" element={<Contract />} />

          {/* === Catch-All (404) === */}
          {/* Diese Route muss zwingend als letzte stehen */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;