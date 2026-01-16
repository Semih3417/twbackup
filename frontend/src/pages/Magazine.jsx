import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Magazine() {
  const articles = [
    {
      id: 1,
      category: "Ratgeber",
      title: "5 Tipps für den sicheren Autotausch",
      excerpt: "Worauf du beim Tauschvertrag und der Fahrzeugübergabe unbedingt achten solltest.",
      image: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "12. Jan 2026"
    },
    {
      id: 2,
      category: "Marktanalyse",
      title: "Warum Gebrauchtwagenpreise sinken",
      excerpt: "Der Markt entspannt sich. Was das für den Tauschwert deines Fahrzeugs bedeutet.",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "08. Jan 2026"
    },
    {
      id: 3,
      category: "Stories",
      title: "Vom Kleinwagen zum Camper",
      excerpt: "Wie Julia ihren Smart gegen einen VW Bus tauschte und jetzt durch Europa reist.",
      image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "02. Jan 2026"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <div className="bg-slate-900 py-20 px-6 text-center">
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Das Tauschwagen Magazin</h1>
           <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             News, Ratgeber und inspirierende Tauschgeschichten aus der Community.
           </p>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map(article => (
                <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group cursor-pointer border border-slate-100">
                   <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                   </div>
                   <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-xs font-bold text-brand-primary uppercase tracking-wider bg-brand-accent/20 px-2 py-1 rounded">
                           {article.category}
                         </span>
                         <span className="text-xs text-slate-400">{article.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-brand-primary transition">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                      <span className="text-brand-primary font-bold text-sm hover:underline">
                        Weiterlesen &rarr;
                      </span>
                   </div>
                </div>
              ))}
           </div>

           {/* Newsletter Signup */}
           <div className="mt-20 bg-brand-primary rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent rounded-full blur-[100px] opacity-20"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4">Nichts mehr verpassen?</h2>
                <p className="text-slate-300 mb-6">Melde dich für unseren Newsletter an und erhalte die besten Tauschangebote der Woche.</p>
                <div className="flex max-w-md mx-auto gap-2">
                   <input type="email" placeholder="Deine E-Mail Adresse" className="flex-grow px-4 py-3 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-brand-accent" />
                   <button className="bg-brand-accent text-brand-primary font-bold px-6 py-3 rounded-xl hover:bg-white transition">Anmelden</button>
                </div>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}