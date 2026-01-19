import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Navbar from '../../components/Navbar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Initiales Laden und bei Suche
  useEffect(() => {
    fetchUsers();
  }, [search]); 

  const fetchUsers = () => {
    setLoading(true); // Lade-Spinner starten
    client.get(`/admin/users?search=${search}`)
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fehler beim Laden der User:", err);
        setLoading(false); 
        alert("Fehler beim Laden der User: " + (err.response?.data?.error || err.message));
      });
  };

  const handleRoleChange = async (userId, newRole) => {
    // Bestätigungsdialog mit Hinweis auf Sperre, falls "banned" gewählt wurde
    const message = newRole === 'banned' 
      ? `Möchtest du diesen Nutzer wirklich SPERREN? Er kann sich dann nicht mehr einloggen.` 
      : `Rolle wirklich auf "${newRole}" ändern?`;

    if(!window.confirm(message)) return;
    
    try {
      await client.put(`/admin/users/${userId}`, { role: newRole });
      // Liste lokal aktualisieren
      setUsers(users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Fehler beim Ändern der Rolle: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
           <Link to="/admin" className="text-slate-400 hover:text-slate-800 transition">← Zurück</Link>
           <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
           <div className="relative">
             <input 
               type="text" 
               placeholder="Suchen (Name, Email)..." 
               className="border border-slate-200 rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-brand-primary transition"
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
             {loading && (
               <span className="absolute right-3 top-2.5 animate-spin text-slate-400">🌀</span>
             )}
           </div>
           <div className="text-sm text-slate-500 font-medium">
             {users.length} Nutzer gefunden
           </div>
        </div>

        {/* Tabelle */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
                 <tr>
                   <th className="p-4">ID</th>
                   <th className="p-4">Name</th>
                   <th className="p-4">Email</th>
                   <th className="p-4">Registriert</th>
                   <th className="p-4">Rolle / Status</th>
                   <th className="p-4 text-right">Aktionen</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {users.map(user => (
                   <tr key={user.user_id} className="hover:bg-slate-50 transition">
                     <td className="p-4 text-slate-400">#{user.user_id}</td>
                     <td className="p-4 font-bold text-slate-800">
                        {user.first_name} {user.last_name}
                     </td>
                     <td className="p-4 text-slate-600">{user.email}</td>
                     <td className="p-4 text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                     <td className="p-4">
                       {/* Badge-Farben aktualisiert für 'banned' */}
                       <span className={`px-2 py-1 rounded text-xs font-bold uppercase 
                         ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                           user.role === 'moderator' ? 'bg-blue-100 text-blue-700' : 
                           user.role === 'banned' ? 'bg-red-100 text-red-700' : 
                           'bg-slate-100 text-slate-600'}`}>
                         {user.role === 'banned' ? '🚫 Banned' : user.role}
                       </span>
                     </td>
                     <td className="p-4 text-right">
                        <select 
                          className={`border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-brand-primary cursor-pointer bg-white ${user.role === 'banned' ? 'text-red-600 font-bold' : ''}`}
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                          <option value="banned">🚫 Gesperrt</option>
                        </select>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             
             {/* Empty State / Loading State */}
             {users.length === 0 && !loading && (
                <div className="p-12 text-center text-slate-400">
                  Keine Nutzer gefunden.
                </div>
             )}
             {loading && users.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  Lade Nutzerliste...
                </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}