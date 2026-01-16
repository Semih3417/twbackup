import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function HeroSearch() {
  const navigate = useNavigate();
  
  // State für Dropdown-Daten
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  
  // State für Auswahl
  const [search, setSearch] = useState({
    manufacturer_id: '',
    model_id: '',
    min_year: '', // Achtung: Name angepasst an Search Page (min_year statt year)
    zip: ''
  });

  // 1. Hersteller laden
  useEffect(() => {
    client.get('/form-data')
      .then(res => setManufacturers(res.data.manufacturers))
      .catch(err => console.error(err));
  }, []);

  // 2. Modelle laden, wenn Marke gewählt
  useEffect(() => {
    if (search.manufacturer_id) {
      client.get(`/models/${search.manufacturer_id}`)
        .then(res => setModels(res.data))
        .catch(err => console.error(err));
    } else {
      setModels([]);
    }
  }, [search.manufacturer_id]);

  // Handler
  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // Suche starten
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (search.manufacturer_id) params.append('manufacturer_id', search.manufacturer_id);
    if (search.model_id) params.append('model_id', search.model_id);
    if (search.min_year) params.append('min_year', search.min_year);
    if (search.zip) params.append('zip', search.zip);

    // Weiterleitung zur Search Page mit Parametern
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-4xl mx-auto transform translate-y-0 md:translate-y-8 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Marke */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase ml-1 mb-1">Marke</label>
          <select 
            name="manufacturer_id" 
            value={search.manufacturer_id} 
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-accent focus:border-brand-accent block p-3 font-bold outline-none appearance-none"
          >
            <option value="">Alle Marken</option>
            {manufacturers.map(m => (
              <option key={m.manufacturer_id} value={m.manufacturer_id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Modell */}
        <div className="relative">
           <label className="block text-xs font-bold text-slate-500 uppercase ml-1 mb-1">Modell</label>
           <select 
            name="model_id" 
            value={search.model_id} 
            onChange={handleChange}
            disabled={!search.manufacturer_id}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-accent focus:border-brand-accent block p-3 font-bold outline-none appearance-none disabled:opacity-50"
          >
            <option value="">Alle Modelle</option>
            {models.map(m => (
              <option key={m.model_id} value={m.model_id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Baujahr & PLZ */}
        <div className="grid grid-cols-2 gap-2">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase ml-1 mb-1">Ab Jahr</label>
             <input 
              type="number" 
              name="min_year" 
              placeholder="2015" 
              value={search.min_year} 
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-accent focus:border-brand-accent block p-3 font-bold outline-none"
             />
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase ml-1 mb-1">PLZ</label>
             <input 
              type="text" 
              name="zip" 
              placeholder="Ort" 
              value={search.zip} 
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-brand-accent focus:border-brand-accent block p-3 font-bold outline-none"
             />
           </div>
        </div>

        {/* Button */}
        <div className="flex items-end">
          <button 
            onClick={handleSearch}
            className="w-full text-brand-primary bg-brand-accent hover:bg-brand-accent-hover font-bold rounded-xl text-sm px-5 py-3.5 text-center transition-all shadow-lg shadow-brand-accent/30 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Fahrzeuge finden
          </button>
        </div>
      </div>
    </div>
  );
}