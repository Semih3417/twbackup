import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Magazine() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lädt nur veröffentlichte Artikel (Backend filtert automatisch)
    client.get('/magazine')
      .then(res => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* SEO Tags für die Übersichtsseite */}
      <Helmet>
        <title>Magazin | Tauschwagen</title>
        <meta name="description" content="Ratgeber, News und Geschichten rund um den Autotausch. Erfahre, wie du sicher und einfach dein Fahrzeug wechselst." />
      </Helmet>

      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <div className="bg-slate-900 py-20 px-6 text-center">
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Das Tauschwagen Magazin</h1>
           <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             News, Ratgeber und inspirierende Tauschgeschichten.
           </p>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
           {loading ? (
             <div className="text-center py-20 text-slate-400">Lade Artikel...</div>
           ) : articles.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
               <h3 className="text-xl font-bold text-slate-700">Noch keine Artikel</h3>
               <p className="text-slate-500">Schaue später wieder vorbei!</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map(article => (
                  <Link to={`/magazine/${article.slug}`} key={article.article_id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group cursor-pointer border border-slate-100 flex flex-col h-full">
                     <div className="h-48 overflow-hidden bg-slate-200 relative">
                        {article.image_url ? (
                          <img 
                            src={article.image_url} 
                            alt={article.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                        )}
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-slate-800">
                           {article.category}
                        </span>
                     </div>
                     <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-xs text-slate-400">{new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-brand-primary transition">
                          {article.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="mt-auto text-brand-primary font-bold text-sm group-hover:underline">
                          Weiterlesen &rarr;
                        </div>
                     </div>
                  </Link>
                ))}
             </div>
           )}
        </div>
      </main>

      <Footer />
    </div>
  );
}