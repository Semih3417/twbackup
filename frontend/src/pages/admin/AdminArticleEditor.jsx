import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import Navbar from '../../components/Navbar';

export default function AdminArticleEditor() {
  const { id } = useParams(); // Wenn ID da ist -> Bearbeiten Modus
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '', category: 'Ratgeber', excerpt: '', content: '', image_url: '', is_published: false
  });

  // Falls Bearbeiten: Daten laden
  useEffect(() => {
    if (isEditMode) {
      client.get(`/admin/articles/${id}`).then(res => setFormData(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await client.put(`/admin/articles/${id}`, formData);
      } else {
        await client.post('/admin/articles', formData);
      }
      navigate('/admin/magazine');
    } catch (err) {
      alert("Fehler beim Speichern: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">{isEditMode ? 'Artikel bearbeiten' : 'Neuer Artikel'}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Hauptdaten */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
               <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-slate-700 mb-1">Titel (H1)</label>
                 <input type="text" name="title" required className="w-full border p-2 rounded" value={formData.title} onChange={handleChange} placeholder="z.B. 5 Tipps für den Autotausch" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Kategorie</label>
                 <select name="category" className="w-full border p-2 rounded" value={formData.category} onChange={handleChange}>
                   <option>Ratgeber</option>
                   <option>News</option>
                   <option>Stories</option>
                   <option>Marktanalyse</option>
                 </select>
               </div>
             </div>

             <div className="mb-4">
               <label className="block text-sm font-bold text-slate-700 mb-1">Titelbild URL</label>
               <input type="text" name="image_url" className="w-full border p-2 rounded" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
               <p className="text-xs text-slate-400 mt-1">Hier Link von Unsplash oder Upload einfügen.</p>
             </div>
          </div>

          {/* SEO & Inhalt */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="mb-6">
               <label className="block text-sm font-bold text-slate-700 mb-1">Kurzbeschreibung (SEO Meta Description)</label>
               <textarea name="excerpt" rows="2" className="w-full border p-2 rounded" value={formData.excerpt} onChange={handleChange} placeholder="Erscheint bei Google und in der Übersicht. Max 160 Zeichen empfohlen." />
             </div>

             <div className="mb-6">
               <label className="block text-sm font-bold text-slate-700 mb-1">Inhalt des Artikels</label>
               {/* Für MVP reicht eine Textarea. Später: Rich Text Editor wie Quill */}
               <textarea name="content" rows="15" className="w-full border p-2 rounded font-mono text-sm" value={formData.content} onChange={handleChange} placeholder="Schreibe deinen Text hier... HTML ist erlaubt (<p>, <b> etc.)" />
             </div>

             <div className="flex items-center gap-2 border-t pt-4">
                <input type="checkbox" name="is_published" id="pub" className="w-5 h-5" checked={formData.is_published} onChange={handleChange} />
                <label htmlFor="pub" className="font-bold text-slate-700 cursor-pointer">Diesen Artikel sofort veröffentlichen?</label>
             </div>
          </div>

          <button type="submit" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-slate-800 transition">
            Speichern
          </button>

        </form>
      </div>
    </div>
  );
}