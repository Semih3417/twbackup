import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VehicleCard from '../components/VehicleCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    client.get('/favorites')
      .then(res => setFavorites(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Meine Merkliste</h1>
          <p className="text-slate-500">
            Hier findest du alle Fahrzeuge, die du dir für später gespeichert hast.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
             {[1,2,3].map(i => <div key={i} className="h-80 bg-slate-200 rounded-2xl"></div>)}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map(vehicle => (
              <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ❤️
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Deine Merkliste ist noch leer</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Du hast noch keine Fahrzeuge markiert. Stöbere durch die Angebote und klicke auf das Herz-Symbol, um sie hier wiederzufinden.
            </p>
            <Link 
              to="/search" 
              className="inline-block bg-brand-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-brand-primary/20"
            >
              Fahrzeuge entdecken
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}