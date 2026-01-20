import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// WICHTIG: Nutze react-quill-new, nicht das alte react-quill!
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css';

// Pfad zum Client: Wir müssen 2 Ordner hoch (../../), da wir in /pages/admin sind
import client from '../../api/client'; 
import Navbar from '../../components/Navbar';

export default function AdminArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [activeTab, setActiveTab] = useState('content');

  const [formData, setFormData] = useState({
    title: '', 
    teaser: '',
    content: '', 
    excerpt: '',
    category: 'Ratgeber', 
    image_url: '', 
    status: 'draft',
    // SEO Defaults
    focus_keyword: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    schema_type: 'Article',
    show_toc: true,
    robots_index: true
  });

  // --- EDITOR EINSTELLUNGEN ---
  const modules = {
    toolbar: [
      [{ 'header': [2, 3, 4, false] }], // H2, H3, H4
      ['bold', 'italic', 'underline', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'clean'] // Links, Bilder, Formatierung löschen
    ],
  };

  // --- SEO LIVE ANALYSE ---
  const seoScore = useMemo(() => {
    let score = 0;
    const checks = [];
    const keyword = formData.focus_keyword?.toLowerCase();
    
    // Basis Score (Startwert)
    if (!keyword) {
        return { score: 0, checks: [{ label: "Kein Fokus-Keyword definiert", status: 'red' }] };
    }

    // 1. Keyword im Titel?
    if (formData.title.toLowerCase().includes(keyword)) {
      score += 20; checks.push({ label: "Keyword im Titel gefunden", status: 'green' });
    } else {
      checks.push({ label: "Keyword fehlt im Titel", status: 'red' });
    }

    // 2. Keyword im Teaser?
    if (formData.teaser && formData.teaser.toLowerCase().includes(keyword)) {
      score += 20; checks.push({ label: "Keyword im Teaser gefunden", status: 'green' });
    } else {
      checks.push({ label: "Keyword fehlt im Teaser", status: 'yellow' });
    }

    // 3. Textlänge (ohne HTML Tags zählen)
    const textOnly = formData.content.replace(/<[^>]*>/g, ' '); 
    const wordCount = textOnly.split(/\s+/).filter(w => w !== '').length;

    if (wordCount > 800) {
      score += 20; checks.push({ label: `Perfekte Länge (${wordCount} Wörter)`, status: 'green' });
    } else if (wordCount > 300) {
      score += 10; checks.push({ label: `Gute Länge (${wordCount} Wörter)`, status: 'green' });
    } else {
      checks.push({ label: "Text zu kurz (<300 Wörter)", status: 'red' });
    }

    // 4. Meta Description Länge
    if (formData.meta_description.length >= 120 && formData.meta_description.length <= 160) {
      score += 20; checks.push({ label: "Meta Description optimal", status: 'green' });
    } else if (formData.meta_description) {
      score += 10; checks.push({ label: "Meta Description vorhanden", status: 'yellow' });
    } else {
      checks.push({ label: "Meta Description fehlt!", status: 'red' });
    }

    // 5. Titel Länge
    if (formData.title.length >= 30 && formData.title.length <= 60) {
      score += 20; checks.push({ label: "Titel-Länge optimal (SEO)", status: 'green' });
    } else {
      checks.push({ label: "Titel zu kurz oder zu lang", status: 'yellow' });
    }

    return { score, checks };
  }, [formData]);

  // Daten laden (falls Bearbeiten-Modus)
  useEffect(() => {
    if (isEditMode) {
      client.get(`/admin/articles/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => alert("Fehler beim Laden: " + err.message));
    }
  }, [id]);

  // Eingabe-Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Spezieller Handler für den Editor (gibt HTML zurück)
  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content: content }));
  };

  // Speichern
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) await client.put(`/admin/articles/${id}`, formData);
      else await client.post('/admin/articles', formData);
      navigate('/admin/magazine'); // Zurück zur Übersicht
    } catch (err) {
      alert("Fehler beim Speichern: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* === LINKE SPALTE: EDITOR (2/3) === */}
        <div className="w-full lg:w-2/3 space-y-6">
           
           <div className="flex items-center justify-between">
             <h1 className="text-2xl font-bold">{isEditMode ? 'Artikel bearbeiten' : 'Neuer Artikel'}</h1>
             {/* Tabs Umschalter */}
             <div className="flex bg-white rounded-lg p-1 shadow-sm">
                {['content', 'seo', 'settings'].map(tab => (
                  <button type="button" key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition ${activeTab === tab ? 'bg-brand-primary text-white' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {tab === 'content' ? 'Inhalt' : tab === 'seo' ? 'SEO' : 'Technik'}
                  </button>
                ))}
             </div>
           </div>

           {/* --- TAB 1: INHALT --- */}
           <div className={activeTab === 'content' ? 'block space-y-6' : 'hidden'}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <div className="mb-4">
                   <label className="block text-sm font-bold text-slate-700 mb-1">Titel (H1) *</label>
                   <input type="text" name="title" required className="w-full border border-slate-300 p-3 rounded-lg text-lg font-bold" value={formData.title} onChange={handleChange} placeholder="Der perfekte Titel..." />
                   <p className="text-xs text-slate-400 mt-1 text-right">{formData.title.length}/60 Zeichen</p>
                 </div>
                 
                 <div className="mb-6">
                   <label className="block text-sm font-bold text-slate-700 mb-1">Einleitung / Teaser</label>
                   <textarea name="teaser" rows="3" className="w-full border border-slate-300 p-3 rounded-lg" value={formData.teaser} onChange={handleChange} placeholder="Die ersten 2-3 Sätze, die Lust auf mehr machen..." />
                 </div>

                 <div className="mb-4">
                   <label className="block text-sm font-bold text-slate-700 mb-1">Haupt-Inhalt</label>
                   
                   {/* DER EDITOR */}
                   <div className="bg-white rounded-lg overflow-hidden editor-container h-[500px]">
                     <ReactQuill 
                        theme="snow"
                        value={formData.content} 
                        onChange={handleEditorChange} 
                        modules={modules}
                        className="h-[450px]"
                        placeholder="Schreibe hier deinen Artikel..."
                     />
                   </div>

                 </div>
              </div>
           </div>

           {/* --- TAB 2: SEO --- */}
           <div className={activeTab === 'seo' ? 'block space-y-6' : 'hidden'}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🔎 SEO Optimierung</h3>
                 
                 <div className="mb-6">
                   <label className="block text-sm font-bold text-slate-700 mb-1">Haupt-Keyword</label>
                   <input type="text" name="focus_keyword" className="w-full border border-slate-300 p-2 rounded-lg" value={formData.focus_keyword} onChange={handleChange} placeholder="z.B. auto tauschen" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">SEO Titel (Meta Title)</label>
                      <input type="text" name="meta_title" className="w-full border border-slate-300 p-2 rounded-lg" value={formData.meta_title} onChange={handleChange} placeholder="Standard: Wie H1" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Canonical URL</label>
                      <input type="text" name="canonical_url" className="w-full border border-slate-300 p-2 rounded-lg" value={formData.canonical_url} onChange={handleChange} placeholder="Optional" />
                    </div>
                 </div>

                 <div className="mb-6">
                   <label className="block text-sm font-bold text-slate-700 mb-1">Meta Beschreibung</label>
                   <textarea name="meta_description" rows="2" className="w-full border border-slate-300 p-2 rounded-lg" value={formData.meta_description} onChange={handleChange} placeholder="Erscheint bei Google..." />
                   <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
                      <div className={`h-full ${formData.meta_description.length > 160 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, (formData.meta_description.length/160)*100)}%`}}></div>
                   </div>
                   <p className="text-xs text-slate-400 mt-1 text-right">{formData.meta_description.length}/160</p>
                 </div>

                 {/* Google Vorschau */}
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Google Vorschau</p>
                    <div className="font-sans">
                       <div className="text-sm text-slate-800 mb-0.5 flex items-center gap-1">
                          <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                          <span>tauschwagen.de › magazin</span>
                       </div>
                       <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">
                          {formData.meta_title || formData.title || "Titel deines Beitrags"}
                       </div>
                       <div className="text-sm text-[#4d5156] line-clamp-2">
                          {formData.meta_description || formData.teaser || "Hier steht die Beschreibung..."}
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* --- TAB 3: SETTINGS --- */}
           <div className={activeTab === 'settings' ? 'block space-y-6' : 'hidden'}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-lg mb-4">⚙️ Technik & Struktur</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Schema.org Typ</label>
                       <select name="schema_type" className="w-full border border-slate-300 p-2 rounded-lg" value={formData.schema_type} onChange={handleChange}>
                          <option value="Article">Article (Standard)</option>
                          <option value="NewsArticle">NewsArticle</option>
                          <option value="BlogPosting">BlogPosting</option>
                          <option value="HowTo">HowTo (Anleitung)</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Kategorie</label>
                       <select name="category" className="w-full border border-slate-300 p-2 rounded-lg" value={formData.category} onChange={handleChange}>
                          <option>Ratgeber</option>
                          <option>News</option>
                          <option>Stories</option>
                          <option>Marktanalyse</option>
                       </select>
                    </div>
                 </div>

                 <div className="mb-4">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Beitragsbild URL</label>
                    <input type="text" name="image_url" className="w-full border border-slate-300 p-2 rounded-lg" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
                 </div>

                 <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" name="show_toc" className="w-5 h-5 rounded text-brand-primary" checked={formData.show_toc} onChange={handleChange} />
                       <span>Inhaltsverzeichnis automatisch generieren</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" name="robots_index" className="w-5 h-5 rounded text-brand-primary" checked={formData.robots_index} onChange={handleChange} />
                       <span>Suchmaschinen Indexierung erlauben (index)</span>
                    </label>
                 </div>
              </div>
           </div>

        </div>

        {/* === RECHTE SPALTE: SIDEBAR (1/3) === */}
        <div className="w-full lg:w-1/3 space-y-6">
           
           {/* Box: Status / Speichern */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24 z-10">
              <div className="flex justify-between items-center mb-4">
                 <span className="font-bold text-slate-700">Status</span>
                 <select name="status" value={formData.status} onChange={handleChange} className={`text-sm font-bold px-2 py-1 rounded border-none outline-none cursor-pointer ${formData.status === 'published' ? 'text-green-700 bg-green-100' : 'text-slate-600 bg-slate-100'}`}>
                    <option value="draft">Entwurf</option>
                    <option value="review">In Review</option>
                    <option value="published">Veröffentlicht</option>
                 </select>
              </div>
              
              <div className="space-y-2 text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">
                 <div className="flex justify-between"><span>Sichtbarkeit:</span> <span className="font-medium text-slate-900">Öffentlich</span></div>
              </div>

              <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-slate-800 transition mb-3">
                 {isEditMode ? 'Aktualisieren' : 'Veröffentlichen'}
              </button>
              
              {!isEditMode && <button type="button" className="w-full bg-slate-100 text-slate-600 font-bold py-2 rounded-xl hover:bg-slate-200 transition">Als Entwurf speichern</button>}
           </div>

           {/* Box: SEO Score */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                 SEO Analyse
                 <span className={`px-2 py-1 rounded text-sm font-bold ${seoScore.score >= 80 ? 'bg-green-100 text-green-700' : seoScore.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {seoScore.score}/100
                 </span>
              </h3>
              <div className="space-y-3">
                 {seoScore.checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                       <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${check.status === 'green' ? 'bg-green-500' : check.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                       <span className="text-slate-600 leading-snug">{check.label}</span>
                    </div>
                 ))}
                 {seoScore.checks.length === 0 && <div className="text-slate-400 text-xs italic">Gib ein Keyword ein, um die Analyse zu starten.</div>}
              </div>
           </div>

        </div>

      </form>
    </div>
  );
}