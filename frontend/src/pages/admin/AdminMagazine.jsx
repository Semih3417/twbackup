import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Navbar from '../../components/Navbar';

export default function AdminMagazine() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    // Ruft die Liste ab (da wir Admin sind, kriegen wir auch Entwürfe)
    client.get('/magazine') 
      .then(res => {
        setArticles(res.data);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Artikel wirklich löschen?")) return;
    try {
      await client.delete(`/admin/articles/${id}`);
      loadArticles();
    } catch (err) {
      alert("Fehler beim Löschen");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-4">
             <Link to="/admin" className="text-slate-400 hover:text-slate-800">← Dashboard</Link>
             <h1 className="text-3xl font-bold text-slate-900">Magazin Verwaltung</h1>
           </div>
           <Link to="/admin/magazine/new" className="bg-brand-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-800 transition">
             + Neuer Artikel
           </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
               <tr>
                 <th className="p-4">Status</th>
                 <th className="p-4">Titel / Kategorie</th>
                 <th className="p-4">Veröffentlicht</th>
                 <th className="p-4 text-right">Aktionen</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {loading ? <tr><td className="p-4">Lade...</td></tr> : articles.map(art => (
                 <tr key={art.article_id} className="hover:bg-slate-50 transition">
                   <td className="p-4">
                     {art.is_published ? (
                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">LIVE</span>
                     ) : (
                       <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">ENTWURF</span>
                     )}
                   </td>
                   <td className="p-4">
                      <div className="font-bold text-slate-800 text-base">{art.title}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{art.category}</div>
                   </td>
                   <td className="p-4 text-slate-500">
                      {new Date(art.created_at).toLocaleDateString()}
                   </td>
                   <td className="p-4 text-right space-x-2">
                      <Link to={`/admin/magazine/edit/${art.article_id}`} className="text-blue-600 font-bold hover:underline">Bearbeiten</Link>
                      <button onClick={() => handleDelete(art.article_id)} className="text-red-500 hover:text-red-700">Löschen</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           {articles.length === 0 && !loading && <div className="p-8 text-center text-slate-400">Noch keine Artikel.</div>}
        </div>
      </div>
    </div>
  );
}