import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Artikel anhand des Slugs (URL) laden
    client.get(`/magazine/read/${slug}`)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Lade Artikel...</div>;
  if (error || !article) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Artikel nicht gefunden.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* SEO META TAGS: Das ist wichtig für Google! */}
      <Helmet>
        <title>{article.title} | Tauschwagen Magazin</title>
        <meta name="description" content={article.excerpt || article.title} />
        {/* OpenGraph für Facebook/WhatsApp Vorschau */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
      </Helmet>

      <Navbar />

      <main className="flex-grow">
        {/* Hero Image */}
        <div className="h-64 md:h-96 bg-slate-900 relative overflow-hidden">
           {article.image_url && (
             <>
               <img src={article.image_url} className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
             </>
           )}
           <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-4xl mx-auto">
              <Link to="/magazine" className="text-brand-accent hover:text-white font-bold text-sm uppercase mb-2 block">← Zurück zum Magazin</Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
              <div className="flex items-center gap-4 text-slate-300 text-sm">
                 <span className="bg-white/10 px-3 py-1 rounded backdrop-blur">{article.category}</span>
                 <span>{new Date(article.created_at).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                 <span>• von {article.first_name}</span>
              </div>
           </div>
        </div>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-6 py-12">
           {/* Lead Text (Excerpt) */}
           {article.excerpt && (
             <p className="text-xl md:text-2xl text-slate-600 font-serif leading-relaxed mb-10 border-l-4 border-brand-accent pl-6 italic">
               {article.excerpt}
             </p>
           )}

           {/* Hauptinhalt (HTML rendern) */}
           <div 
             className="prose prose-lg prose-slate max-w-none"
             // ACHTUNG: Hier wird das HTML aus dem Admin-Editor eingefügt.
             // CSS-Klasse "prose" kommt von Tailwind Typography und stylt das automatisch schön.
             dangerouslySetInnerHTML={{ __html: article.content }} 
           />
        </article>

        {/* Newsletter CTA */}
        <div className="bg-brand-primary text-white py-16 px-6 text-center mt-12">
           <div className="max-w-xl mx-auto">
             <h3 className="text-2xl font-bold mb-2">Hat dir der Artikel gefallen?</h3>
             <p className="text-slate-300 mb-6">Abonniere unseren Newsletter für mehr Tipps rund um den Autotausch.</p>
             <div className="flex gap-2">
                <input type="email" placeholder="Deine E-Mail" className="flex-grow px-4 py-3 rounded-xl text-slate-900 outline-none" />
                <button className="bg-brand-accent text-brand-primary font-bold px-6 py-3 rounded-xl">Anmelden</button>
             </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}