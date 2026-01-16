import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import VehicleCard from '../components/VehicleCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Icons
const Icons = {
  Filter: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Sort: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stammdaten für Dropdowns
  const [manufacturers, setManufacturers] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  
  // Statische Listen (identisch zu AddVehicle)
  const bodyTypes = ["Limousine", "Kombi", "SUV / Geländewagen", "Cabrio / Roadster", "Coupé", "Kleinwagen", "Van / Minibus", "Transporter"];
  const transmissions = ["Schaltgetriebe", "Automatik", "Halbautomatik"];
  const colors = ["Schwarz", "Weiß", "Silber", "Grau", "Blau", "Rot", "Grün", "Gelb", "Braun", "Orange", "Beige", "Violett", "Gold"];

  // Filter State
  const [filters, setFilters] = useState({
    manufacturer_id: searchParams.get('manufacturer_id') || '',
    min_year: searchParams.get('min_year') || '',
    max_year: searchParams.get('max_year') || '',
    min_km: searchParams.get('min_km') || '',
    max_km: searchParams.get('max_km') || '',
    fuel_type_id: searchParams.get('fuel_type_id') || '',
    // Neue Filter
    body_type: searchParams.get('body_type') || '',
    transmission: searchParams.get('transmission') || '',
    min_hp: searchParams.get('min_hp') || '',
    max_hp: searchParams.get('max_hp') || '',
    min_seats: searchParams.get('min_seats') || '',
    exterior_color: searchParams.get('exterior_color') || '',
    zip: searchParams.get('zip') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  // 1. Stammdaten laden
  useEffect(() => {
    client.get('/form-data').then(res => {
      setManufacturers(res.data.manufacturers || []);
      setFuelTypes(res.data.fuelTypes || []);
    });
  }, []);

  // 2. Fahrzeuge laden (bei URL Änderung)
  useEffect(() => {
    fetchVehicles();
    
    // Sync URL -> State (wichtig beim Reload oder Browser-Zurück)
    const currentParams = Object.fromEntries([...searchParams]);
    setFilters(prev => ({ ...prev, ...currentParams }));
  }, [searchParams]);

  const fetchVehicles = () => {
    setLoading(true);
    client.get(`/vehicles?${searchParams.toString()}`)
      .then(res => setVehicles(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyParams = (newSortValue = null) => {
    const params = {};
    Object.keys(filters).forEach(key => {
      const value = (key === 'sort' && newSortValue) ? newSortValue : filters[key];
      if (value) params[key] = value;
    });
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setFilters(prev => ({ ...prev, sort: newSort }));
    applyParams(newSort);
  };

  const resetFilters = () => {
    setFilters({
      manufacturer_id: '', min_year: '', max_year: '', min_km: '', max_km: '',
      fuel_type_id: '', body_type: '', transmission: '', min_hp: '', max_hp: '',
      min_seats: '', exterior_color: '', zip: '', sort: 'newest'
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* === SIDEBAR FILTER === */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Icons.Filter /> Filter
              </h2>
              <button onClick={resetFilters} className="text-xs text-brand-accent hover:underline font-bold flex items-center gap-1">
                <Icons.Refresh /> Reset
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Marke */}
              <div>
                <label className="filter-label">Marke</label>
                <select name="manufacturer_id" value={filters.manufacturer_id} onChange={handleFilterChange} className="filter-input">
                  <option value="">Alle Marken</option>
                  {manufacturers.map(m => <option key={m.manufacturer_id} value={m.manufacturer_id}>{m.name}</option>)}
                </select>
              </div>

              {/* Karosserie & Getriebe */}
              <div className="grid grid-cols-1 gap-3">
                 <div>
                    <label className="filter-label">Fahrzeugtyp</label>
                    <select name="body_type" value={filters.body_type} onChange={handleFilterChange} className="filter-input">
                        <option value="">Beliebig</option>
                        {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="filter-label">Getriebe</label>
                    <select name="transmission" value={filters.transmission} onChange={handleFilterChange} className="filter-input">
                        <option value="">Beliebig</option>
                        {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
              </div>

              {/* Preis / KM / Jahr (Bereiche) */}
              <div>
                <label className="filter-label">Kilometerstand</label>
                <div className="flex gap-2">
                  <input type="number" name="min_km" placeholder="von" value={filters.min_km} onChange={handleFilterChange} className="filter-input" />
                  <input type="number" name="max_km" placeholder="bis" value={filters.max_km} onChange={handleFilterChange} className="filter-input" />
                </div>
              </div>

              <div>
                <label className="filter-label">Erstzulassung</label>
                <div className="flex gap-2">
                  <input type="number" name="min_year" placeholder="von" value={filters.min_year} onChange={handleFilterChange} className="filter-input" />
                  <input type="number" name="max_year" placeholder="bis" value={filters.max_year} onChange={handleFilterChange} className="filter-input" />
                </div>
              </div>

              <div>
                <label className="filter-label">Leistung (PS)</label>
                <div className="flex gap-2">
                  <input type="number" name="min_hp" placeholder="min" value={filters.min_hp} onChange={handleFilterChange} className="filter-input" />
                  <input type="number" name="max_hp" placeholder="max" value={filters.max_hp} onChange={handleFilterChange} className="filter-input" />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="filter-label">Kraftstoff</label>
                    <select name="fuel_type_id" value={filters.fuel_type_id} onChange={handleFilterChange} className="filter-input">
                        <option value="">Alle</option>
                        {fuelTypes.map(f => <option key={f.fuel_type_id} value={f.fuel_type_id}>{f.name}</option>)}
                    </select>
                  </div>
                   <div>
                    <label className="filter-label">Sitze (min)</label>
                    <input type="number" name="min_seats" placeholder="z.B. 5" value={filters.min_seats} onChange={handleFilterChange} className="filter-input" />
                  </div>
              </div>
              
              <div>
                <label className="filter-label">Farbe</label>
                <select name="exterior_color" value={filters.exterior_color} onChange={handleFilterChange} className="filter-input">
                    <option value="">Alle Farben</option>
                    {colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="filter-label">Standort (PLZ)</label>
                <input type="text" name="zip" value={filters.zip} onChange={handleFilterChange} placeholder="z.B. 10115" className="filter-input" />
              </div>

              <button onClick={() => applyParams()} className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-brand-primary/20 mt-2">
                Treffer anzeigen
              </button>
            </div>
          </div>
        </aside>

        {/* === MAIN CONTENT === */}
        <main className="w-full lg:w-3/4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800">
              {loading ? <span className="text-slate-400 animate-pulse">Suche...</span> : <><span className="text-brand-accent">{vehicles.length}</span> Ergebnisse</>}
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 hidden sm:inline"><Icons.Sort /></span>
              <select name="sort" value={filters.sort} onChange={handleSortChange} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand-accent font-medium cursor-pointer">
                <option value="newest">Neueste Inserate</option>
                <option value="oldest">Älteste Inserate</option>
                <option value="km_asc">Kilometer (wenig zuerst)</option>
                <option value="km_desc">Kilometer (viel zuerst)</option>
                <option value="year_desc">Baujahr (neu zuerst)</option>
                <option value="year_asc">Baujahr (alt zuerst)</option>
                <option value="hp_desc">Leistung (stark zuerst)</option>
              </select>
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
               {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-slate-200 rounded-2xl"></div>)}
             </div>
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(v => <VehicleCard key={v.vehicle_id} vehicle={v} />)}
            </div>
          ) : (
            <div className="bg-white p-16 rounded-2xl text-center border border-slate-100 flex flex-col items-center">
              <div className="text-6xl mb-4 opacity-20">🚙</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Keine Treffer</h3>
              <p className="text-slate-500 mb-6 max-w-sm">Deine Suche war leider erfolglos. Versuche es mit weniger Filtern.</p>
              <button onClick={resetFilters} className="text-brand-accent font-bold hover:underline">Alle Filter zurücksetzen</button>
            </div>
          )}
        </main>
      </div>
      <Footer />
      
      <style>{`
        .filter-label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; }
        .filter-input { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.5rem; font-size: 0.875rem; outline: none; }
        .filter-input:focus { border-color: #0ea5e9; }
      `}</style>
    </div>
  );
}