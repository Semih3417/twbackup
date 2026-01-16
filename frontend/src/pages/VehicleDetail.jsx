import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VehicleCard from '../components/VehicleCard';
import { getImageUrl } from '../utils/imageHelper';
import { useAuth } from '../context/AuthContext';

// Icons
const Icons = {
  Back: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Chat: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  Check: () => <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Heart: ({ filled }) => <svg className={`w-6 h-6 transition duration-200 ${filled ? 'fill-red-500 text-red-500 scale-110' : 'fill-transparent text-slate-400 hover:text-red-500'}`} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  ArrowLeft: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ArrowRight: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Expand: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>,
  Close: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Swap: () => <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
};

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [relatedVehicles, setRelatedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Helper zum Gruppieren der Features
  const groupFeatures = (features) => {
    if (!features) return {};
    const groups = {};
    features.forEach(f => {
      // Backend liefert jetzt Objekte {name: "...", category: "..."}
      const cat = f.category || 'Sonstiges';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(f.name);
    });
    return groups;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    client.get(`/vehicles/${id}`)
      .then(res => {
        setVehicle(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
      
    client.get(`/vehicles/${id}/related`).then(res => setRelatedVehicles(res.data)).catch(() => {});
    if (user) client.get(`/vehicles/${id}/favorite`).then(res => setIsFavorite(res.data.isFavorite)).catch(() => {});
  }, [id, user]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Lade Details...</div>;
  if (!vehicle) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Fahrzeug nicht gefunden.</div>;

  const isOwner = user?.id === vehicle.user_id;
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [{ image_url: vehicle.thumbnail_url }];
  const featureGroups = groupFeatures(vehicle.features);

  // Actions
  const nextImage = (e) => { e?.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % images.length); };
  const prevImage = (e) => { e?.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length); };
  const toggleFavorite = async () => {
    if (!user) return navigate('/login');
    setIsFavorite(!isFavorite); 
    try { await client.post(`/vehicles/${id}/favorite`); } catch (err) { setIsFavorite(!isFavorite); }
  };
  const startChat = () => {
    if (!user) return navigate('/login');
    const firstName = vehicle.owner_name.split(' ')[0];
    navigate('/chat', { state: { startChatWith: { user_id: vehicle.user_id, first_name: firstName } } });
  };

  // Helper für leere Werte
  const val = (v, unit = '') => v ? `${v}${unit}` : '-';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-brand-primary mb-6 text-sm font-medium">
          <Icons.Back /> Zurück zur Übersicht
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* === LINKS (2/3) === */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Galerie */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
                <img src={getImageUrl(images[currentImageIndex].image_url)} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100"><div className="bg-white/80 backdrop-blur p-3 rounded-full text-slate-800 shadow-lg"><Icons.Expand /></div></div>
                {images.length > 1 && (<><button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100"><Icons.ArrowLeft /></button><button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100"><Icons.ArrowRight /></button></>)}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pt-2 px-1 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition relative ${currentImageIndex === idx ? 'border-brand-accent ring-2 ring-brand-accent/20' : 'border-transparent opacity-70 hover:opacity-100'}`}><img src={getImageUrl(img.image_url)} className="w-full h-full object-cover" /></button>
                  ))}
                </div>
              )}
            </div>

            {/* Hauptinfos & Technische Daten */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h2 className="text-sm font-bold text-brand-accent uppercase tracking-wider mb-1">{vehicle.manufacturer}</h2>
                   <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{vehicle.model}</h1>
                   <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{vehicle.body_type || 'Fahrzeug'}</span>
                      <span>•</span>
                      <span>{vehicle.condition_rating ? `Zustand ${vehicle.condition_rating}/5` : 'Gepflegt'}</span>
                   </div>
                </div>
                <button onClick={toggleFavorite} className={`p-3 rounded-full transition shadow-sm border ${isFavorite ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}><Icons.Heart filled={isFavorite} /></button>
              </div>

              {/* Quick Facts Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-slate-50 mb-8">
                <div><span className="block text-xs text-slate-400 uppercase mb-1">Erstzulassung</span><span className="font-bold text-slate-800 text-lg">{vehicle.year_of_manufacture}</span></div>
                <div><span className="block text-xs text-slate-400 uppercase mb-1">Kilometer</span><span className="font-bold text-slate-800 text-lg">{vehicle.mileage_km.toLocaleString()} km</span></div>
                <div><span className="block text-xs text-slate-400 uppercase mb-1">Leistung</span><span className="font-bold text-slate-800 text-lg">{val(vehicle.power_hp, ' PS')}</span></div>
                <div><span className="block text-xs text-slate-400 uppercase mb-1">Kraftstoff</span><span className="font-bold text-slate-800 text-lg">{vehicle.fuel_type}</span></div>
              </div>

              {/* Detaillierte Technische Daten */}
              <h3 className="font-bold text-lg text-brand-primary mb-4 border-b border-slate-100 pb-2">Technische Daten</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm mb-8">
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Getriebe</span><span className="font-bold text-slate-700">{val(vehicle.transmission)}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Antriebsart</span><span className="font-bold text-slate-700">{val(vehicle.drive_type)}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Hubraum</span><span className="font-bold text-slate-700">{val(vehicle.engine_displacement, ' ccm')}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Zylinder</span><span className="font-bold text-slate-700">{val(vehicle.cylinders)}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Leergewicht</span><span className="font-bold text-slate-700">{val(vehicle.weight_kg, ' kg')}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Sitzplätze</span><span className="font-bold text-slate-700">{val(vehicle.seats)}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Türen</span><span className="font-bold text-slate-700">{val(vehicle.doors)}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Schiebetür</span><span className="font-bold text-slate-700">{vehicle.has_sliding_door ? 'Ja' : 'Nein'}</span></div>
              </div>

              <h3 className="font-bold text-lg text-brand-primary mb-4 border-b border-slate-100 pb-2">Umwelt & Farbe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm mb-8">
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Außenfarbe</span><span className="font-bold text-slate-700">{val(vehicle.exterior_color)}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Innenausstattung</span><span className="font-bold text-slate-700">{val(vehicle.interior_color)} ({val(vehicle.interior_material)})</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Schadstoffklasse</span><span className="font-bold text-slate-700">{val(vehicle.emission_class)}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Plakette</span><span className="font-bold text-slate-700">{val(vehicle.emission_sticker)}</span></div>
                 <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">HU / TÜV bis</span><span className="font-bold text-slate-700">{vehicle.hu_valid_until ? new Date(vehicle.hu_valid_until).toLocaleDateString() : '-'}</span></div>
              </div>

              {/* Beschreibung */}
              <h3 className="font-bold text-lg text-brand-primary mb-3">Beschreibung</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                {vehicle.description || "Keine Beschreibung vorhanden."}
              </p>

              {/* Ausstattung Gruppiert */}
              <h3 className="font-bold text-lg text-brand-primary mb-4">Ausstattung</h3>
              {Object.keys(featureGroups).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.keys(featureGroups).sort().map(category => (
                    <div key={category}>
                       <h4 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-wider">{category}</h4>
                       <ul className="space-y-2">
                         {featureGroups[category].map((feat, i) => (
                           <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                             <Icons.Check /> {feat}
                           </li>
                         ))}
                       </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">Keine Ausstattungsmerkmale angegeben.</span>
              )}
            </div>
          </div>

          {/* === RECHTS (1/3) - Sidebar === */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Anbieter</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center text-xl font-bold uppercase">{vehicle.owner_name.charAt(0)}</div>
                <div><div className="font-bold text-lg text-slate-800">{vehicle.owner_name}</div><div className="text-sm text-slate-500">Privater Anbieter</div><div className="text-xs text-slate-400 mt-1"><Icons.MapPin /> {vehicle.zip_code} {vehicle.city}</div></div>
              </div>

              {isOwner ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-slate-500 text-sm">Das ist dein eigenes Inserat.<Link to="/my-garage" className="block mt-2 text-brand-primary font-bold hover:underline">Bearbeiten</Link></div>
              ) : (
                <button onClick={startChat} className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"><Icons.Chat /> Nachricht schreiben</button>
              )}
            </div>

            {/* TAUSCHWUNSCH BOX */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
               <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <div className="bg-blue-100 text-blue-600 p-1 rounded"><Icons.Swap /></div>
                 Tauschwunsch
               </h4>
               <p className="text-slate-600 text-sm leading-relaxed italic">
                 {vehicle.swap_preference ? `"${vehicle.swap_preference}"` : "Der Anbieter hat keinen spezifischen Tauschwunsch angegeben. Biete gerne einfach alles an."}
               </p>
            </div>

            <div className="bg-brand-accent/5 rounded-2xl p-6 border border-brand-accent/20">
              <h4 className="font-bold text-brand-primary mb-2 flex items-center gap-2">🛡️ Sicher tauschen</h4>
              <p className="text-sm text-slate-600">Wir prüfen Identitäten. Überweisen Sie niemals Geld vorab.</p>
            </div>
          </div>
        </div>

        {/* === UNTEN: WEITERE FAHRZEUGE === */}
        {relatedVehicles.length > 0 && (
          <div className="pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-brand-primary mb-6">Das könnte dich auch interessieren</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {relatedVehicles.map(v => (
                 <VehicleCard key={v.vehicle_id} vehicle={v} />
               ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center backdrop-blur-sm" onClick={() => setIsLightboxOpen(false)}>
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white"><Icons.Close /></button>
          {images.length > 1 && <><button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 rounded-full bg-white/10 hover:bg-white/20"><Icons.ArrowLeft /></button><button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 rounded-full bg-white/10 hover:bg-white/20"><Icons.ArrowRight /></button></>}
          <img src={getImageUrl(images[currentImageIndex].image_url)} className="max-h-screen max-w-screen object-contain p-4" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium bg-black/50 px-4 py-1 rounded-full text-sm">{currentImageIndex + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}