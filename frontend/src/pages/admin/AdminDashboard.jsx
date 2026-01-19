import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalVehicles: 0, recentUsers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hier rufen wir deinen neuen Backend-Endpunkt auf
    // Der Client sendet automatisch das Token mit!
    client.get('/admin/dashboard')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Admin Access Error:", err);
        alert("Fehler beim Laden der Admin-Daten");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Wir nutzen vorerst die normale Navbar, später bauen wir eine Admin-Sidebar */}
      <Navbar /> 
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Willkommen in der Kommandozentrale.</p>
          </div>
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold border border-amber-200">
             🔒 Admin Area
          </div>
        </div>

        {/* KPI Kacheln */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           {/* Kachel 1 */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm font-bold uppercase mb-1">Registrierte Nutzer</div>
              <div className="text-4xl font-bold text-brand-primary">
                {loading ? "..." : stats.totalUsers}
              </div>
           </div>
           
           {/* Kachel 2 */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm font-bold uppercase mb-1">Fahrzeuge Online</div>
              <div className="text-4xl font-bold text-brand-primary">
                {loading ? "..." : stats.totalVehicles}
              </div>
           </div>

           {/* Kachel 3 (Placeholder) */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 opacity-60">
              <div className="text-slate-500 text-sm font-bold uppercase mb-1">Offene Reports</div>
              <div className="text-4xl font-bold text-slate-400">0</div>
           </div>
        </div>

        {/* Listen Bereich */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Neueste User */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg">Neueste Nutzer</h3>
                 <button className="text-sm text-brand-primary hover:underline">Alle anzeigen</button>
              </div>
              <div className="divide-y divide-slate-100">
                 {loading ? (
                   <div className="p-6 text-center text-slate-400">Lade Daten...</div>
                 ) : stats.recentUsers?.map(u => (
                   <div key={u.user_id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                        {u.first_name?.[0]}
                      </div>
                      <div>
                         <div className="font-bold text-sm">{u.first_name} {u.last_name}</div>
                         <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                      <div className="ml-auto text-xs text-slate-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Quick Actions (Module, die wir noch bauen) */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-lg mb-4">Verwaltung</h3>
              <div className="grid grid-cols-2 gap-4">
                 <Link to="/admin/users" className="p-4 rounded-xl border border-slate-200 hover:border-brand-primary hover:bg-brand-primary/5 transition text-center group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition">👥</div>
                    <div className="font-bold text-slate-700">User Manager</div>
                 </Link>
                 <Link to="/admin/magazine" className="p-4 rounded-xl border border-slate-200 hover:border-brand-primary hover:bg-brand-primary/5 transition text-center group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition">📰</div>
                    <div className="font-bold text-slate-700">Magazin Editor</div>
                 </Link>
                 {/* Weitere Module hier */}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}