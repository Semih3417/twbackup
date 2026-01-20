import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client'; // <--- Pfad ist hier '../'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/magazine/read/${slug}`)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading || !article) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Lade...</div>;

  // JSON-LD Schema generieren
  const schemaData = {
    "@context": "https://schema.org",
    "@type": article.schema_type || "Article",
    "headline": article.meta_title || article.title,
    "image": [article.image_url],
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "author": [{
      "@type": "Person",
      "name": `${article.first_name} ${article.last_name}`,
    }]
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* 1. SEO & META TAGS */}
      <Helmet>
        <title>{article.meta_title || article.title} | Tauschwagen</title>
        <meta name="description" content={article.meta_description || article.teaser} />
        {!article.robots_index && <meta name="robots" content="noindex, nofollow" />}
        {article.canonical_url && <link rel="canonical" href={article.canonical_url} />}
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.og_title || article.meta_title || article.title} />
        <meta property="og:description" content={article.og_description || article.meta_description} />
        <meta property="og:image" content={article.image_url} />
        
        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <Navbar />

      <main className="flex-grow">
        
        {/* 2. Breadcrumbs */}
        <div className="bg-slate-50 border-b border-slate-100 py-3 px-6">
           <div className="max-w-4xl mx-auto text-xs text-slate-500 flex gap-2">
              <Link to="/" className="hover:text-brand-primary">Startseite</Link> ›
              <Link to="/magazine" className="hover:text-brand-primary">Magazin</Link> ›
              <span className="text-slate-800 truncate">{article.title}</span>
           </div>
        </div>

        {/* 3. Hero Header */}
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
           <span className="inline-block bg-brand-primary/10 text-brand-primary font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-4">
             {article.category}
           </span>
           <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
             {article.title}
           </h1>
           <div className="flex justify-center items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xs">
                    {article.first_name[0]}
                 </div>
                 <span>{article.first_name} {article.last_name}</span>
              </div>
              <span>•</span>
              <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>⏱️ {article.reading_time_minutes} Min. Lesezeit</span>
           </div>
        </div>

        {/* 4. Featured Image */}
        {article.image_url && (
          <div className="max-w-5xl mx-auto px-6 mb-12">
             <img src={article.image_url} alt={article.title} className="w-full h-auto rounded-2xl shadow-lg" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* 5. Content Area */}
           <article className="lg:col-span-8 lg:col-start-3">
              
              {/* Teaser (Lead) */}
              {article.teaser && (
                <p className="text-xl leading-relaxed text-slate-600 font-serif mb-10 border-l-4 border-brand-primary pl-6">
                  {article.teaser}
                </p>
              )}

              {/* Automatisches TOC */}
              {article.show_toc && (
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-10">
                    <h3 className="font-bold text-slate-900 mb-3">Inhaltsverzeichnis</h3>
                    <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                       {/* Hier könnte man später echtes TOC generieren */}
                       <li><a href="#" className="hover:text-brand-primary hover:underline">Zum Artikel</a></li>
                    </ul>
                 </div>
              )}

              {/* Main Content (HTML rendern) */}
              <div 
                className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-primary"
                dangerouslySetInnerHTML={{ __html: article.content }} 
              />

              {/* Social Sharing */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                 <p className="font-bold text-slate-900 mb-4">Diesen Artikel teilen:</p>
                 <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">WhatsApp</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">LinkedIn</button>
                 </div>
              </div>

           </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}