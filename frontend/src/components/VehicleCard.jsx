import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper'; // <--- NEU: Import

// Icons für die Karte
const CardIcons = {
  Calendar: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Speedometer: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Fuel: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
};

export default function VehicleCard({ vehicle }) {
  const ownerFirstName = vehicle.owner_name ? vehicle.owner_name.split(' ')[0] : 'User';
  const formattedMileage = vehicle.mileage_km ? vehicle.mileage_km.toLocaleString('de-DE') : '0';

  return (
    <Link 
      to={`/vehicles/${vehicle.vehicle_id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 h-full"
    >
      {/* === BILD BEREICH === */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img 
          src={getImageUrl(vehicle.thumbnail_url)} // <--- NEU: Helper Funktion nutzen
          alt={`${vehicle.manufacturer} ${vehicle.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
      </div>

      {/* === CONTENT BEREICH === */}
      <div className="p-5 flex flex-col grow">
        <div className="mb-4">
            <p className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">
                {vehicle.manufacturer}
            </p>
            <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition">
                {vehicle.model}
            </h3>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5">
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <CardIcons.Calendar /><span>{vehicle.year_of_manufacture}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <CardIcons.Speedometer /><span>{formattedMileage} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <CardIcons.Fuel /><span className="truncate">{vehicle.fuel_type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <CardIcons.MapPin /><span className="truncate">{vehicle.city || 'Deutschland'}</span>
            </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {ownerFirstName.charAt(0)}
                 </div>
                 <span className="text-xs text-slate-400">Von {ownerFirstName}</span>
            </div>
            <span className="text-sm font-bold text-brand-primary group-hover:translate-x-1 transition duration-300">
                Anfragen &rarr;
            </span>
        </div>
      </div>
    </Link>
  );
}