import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle'; // NEU hinzugefügt
import MyGarage from './pages/MyGarage';
import Search from './pages/Search';
import VehicleDetail from './pages/VehicleDetail';
import Favorites from './pages/Favorites';
import UserProfile from './pages/UserProfile';
import Magazine from './pages/Magazine';
import Chat from './pages/Chat';

// Components
import ProtectedRoute from './components/ProtectedRoute';

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

          {/* === Geschützte Routen (Login erforderlich) === */}
          
          {/* Auto inserieren */}
          <Route path="/add-vehicle" element={
            <ProtectedRoute>
              <AddVehicle />
            </ProtectedRoute>
          } />

          {/* NEU: Fahrzeug bearbeiten */}
          <Route path="/vehicles/edit/:id" element={
            <ProtectedRoute>
              <EditVehicle />
            </ProtectedRoute>
          } />

          {/* Meine Garage (Verwalten & Löschen) */}
          <Route path="/my-garage" element={
            <ProtectedRoute>
              <MyGarage />
            </ProtectedRoute>
          } />


          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
              <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
} />
          

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;