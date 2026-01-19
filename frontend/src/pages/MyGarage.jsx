import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/imageHelper'; // Helper für Bilder

export default function MyGarage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Daten laden
  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = () => {
    client.get('/my-vehicles')
      .then(res => setVehicles(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // Auto löschen
  const handleDelete = async (vehicleId) => {
    if (!window.confirm("Möchtest du dieses Fahrzeug wirklich unwiderruflich löschen?")) return;

    try {
      await client.delete(`/vehicles/${vehicleId}`);
      // Liste lokal aktualisieren (schneller als neu laden)
      setVehicles(prev => prev.filter(v => v.vehicle_id !== vehicleId));
    } catch (err) {
      alert("Fehler beim Löschen: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-primary mb-2">Meine Garage</h1>
            <p className="text-slate-500">Verwalte deine Inserate und halte sie aktuell.</p>
          </div>
          <Link 
            to="/add-vehicle" 
            className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-brand-primary/20 flex items-center gap-2"
          >
            <span>+</span> Neues Fahrzeug
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
             {[1,2].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>)}
           </div>
        )}

        {/* Content State */}
        {!loading && vehicles.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="text-6xl mb-6">🏎️</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Deine Garage ist leer</h2>
            <p className="text-slate-500 mb-8">Du hast noch keine Fahrzeuge zum Tausch angeboten.</p>
            <Link to="/add-vehicle" className="text-brand-accent font-bold hover:underline">
              Jetzt erstes Auto inserieren &rarr;
            </Link>
          </div>
        ) : (
          // Grid List
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map(vehicle => (
              <div key={vehicle.vehicle_id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group">
                
                {/* Bild Bereich */}
                <div className="relative h-48 bg-slate-100">
                  <img 
                    src={getImageUrl(vehicle.thumbnail_url)} 
                    alt={vehicle.model} 
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-600 shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Aktiv
                  </div>
                </div>

                {/* Content Bereich */}
                <div className="p-5 grow flex-col">
                  <div className="mb-4">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">{vehicle.manufacturer}</div>
                    <h3 className="text-xl font-bold text-slate-800 truncate" title={vehicle.model}>{vehicle.model}</h3>
                  </div>

                  <div className="flex gap-4 text-sm text-slate-500 mb-6">
                    <span>{vehicle.year_of_manufacture}</span>
                    <span>•</span>
                    <span>{vehicle.mileage_km.toLocaleString()} km</span>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-auto pt-4 border-t border-slate-50 grid grid-cols-3 gap-2">
                    {/* Ansehen */}
                    <Link 
                      to={`/vehicles/${vehicle.vehicle_id}`} 
                      className="flex justify-center items-center py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition"
                      title="Vorschau ansehen"
                    >
                      👁️
                    </Link>

                    {/* Bearbeiten */}
                    <Link 
                      to={`/vehicles/edit/${vehicle.vehicle_id}`} 
                      className="flex justify-center items-center py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition font-medium"
                      title="Bearbeiten"
                    >
                      ✏️ Bearbeiten
                    </Link>

                    {/* Löschen */}
                    <button 
                      onClick={() => handleDelete(vehicle.vehicle_id)}
                      className="flex justify-center items-center py-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                      title="Löschen"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}