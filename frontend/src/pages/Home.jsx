import { useEffect, useState } from 'react';
import client from '../api/client';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Importiere die neue wiederverwendbare Komponente
import VehicleCard from '../components/VehicleCard';

// --- Icons ---
const Icons = {
  Swap: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Shield: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Money: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Car: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 19H5V8h14m-3-5v2.206l-1.6 2.4A1 1 0 0015.2 8h-6.4a1 1 0 00-.8.4L6.4 6H5V3h14z" /></svg>,
  Chat: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  ChevronDown: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
};

// --- FAQ Daten ---
const faqs = [
  { question: "Wie funktioniert der Wertausgleich?", answer: "Nicht jeder Tausch erfolgt 1:1. Wenn Ihr Fahrzeug einen höheren Marktwert hat als das Wunschfahrzeug, können Sie eine Zuzahlung vereinbaren..." },
  { question: "Ist der Tausch rechtlich bindend?", answer: "Tauschwagen.com vermittelt den Kontakt und stellt die Plattform. Der eigentliche Tauschvertrag wird zwischen den beiden Privatpersonen geschlossen..." },
  { question: "Kann ich auch Leasing- oder finanzierte Fahrzeuge tauschen?", answer: "Grundsätzlich können nur Fahrzeuge getauscht werden, die sich in Ihrem vollständigen Eigentum befinden..." },
  { question: "Welche Gebühren fallen an?", answer: "Die Basismitgliedschaft und das Inserieren von Fahrzeugen ist kostenlos..." }
];

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    client.get('/vehicles')
      .then(res => {
        setFeaturedVehicles(res.data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error("Fehler beim Laden:", err);
        setLoading(false);
      });
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-600">
      
      {/* Navbar (Transparent für Hero) */}
      <Navbar transparent={true} />

      {/* === HERO SECTION === */}
      <header className="relative bg-brand-primary pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-blue-600/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-brand-accent/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-slate-800/50 border border-slate-700 text-brand-accent text-sm font-semibold tracking-wide uppercase">
            Der neue Standard für Fahrzeughandel
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
            Tausche dein Auto.<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-accent to-emerald-200">
              Direkt & Transparent.
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Umgehe den Zwischenhändler. Tausche dein Fahrzeug direkt gegen deinen neuen Traumwagen – mit sicherem Wertausgleich und verifizierten Nutzern.
          </p>

          <HeroSearch />
        </div>
      </header>

      {/* === TRUST STATS === */}
      <div className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-3xl font-bold text-brand-primary mb-1">100%</div><div className="text-sm text-slate-500 font-medium">Verifizierte Nutzer</div></div>
            <div><div className="text-3xl font-bold text-brand-primary mb-1">0€</div><div className="text-sm text-slate-500 font-medium">Einstellgebühr</div></div>
            <div><div className="text-3xl font-bold text-brand-primary mb-1">24/7</div><div className="text-sm text-slate-500 font-medium">Support</div></div>
            <div><div className="text-3xl font-bold text-brand-primary mb-1">Sicher</div><div className="text-sm text-slate-500 font-medium">Datenschutz</div></div>
        </div>
      </div>

      {/* === PROCESS SECTION === */}
      <section id="process" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-6">Der Weg zum neuen Fahrzeug</h2>
              <p className="text-lg text-slate-500">Unser Prozess ist darauf ausgelegt, Tauschgeschäfte so einfach und sicher wie möglich zu gestalten.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Icons.Car /></div>
                <h3 className="text-xl font-bold text-brand-primary mb-3">1. Fahrzeug inserieren</h3>
                <p className="leading-relaxed">Erstellen Sie in wenigen Minuten ein detailliertes Profil Ihres Fahrzeugs.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10">
                <div className="w-14 h-14 bg-brand-accent/10 text-brand-accent rounded-xl flex items-center justify-center mb-6"><Icons.Chat /></div>
                <h3 className="text-xl font-bold text-brand-primary mb-3">2. Match & Chat</h3>
                <p className="leading-relaxed">Finden Sie passende Angebote. Nutzen Sie unseren sicheren Chat.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6"><Icons.Swap /></div>
                <h3 className="text-xl font-bold text-brand-primary mb-3">3. Tauschabschluss</h3>
                <p className="leading-relaxed">Einigen Sie sich per Handschlag oder Vertrag. Willkommen im neuen Auto!</p>
              </div>
            </div>
          </div>
      </section>

      {/* === VORTEILE SECTION === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-6">Warum Tauschen oft besser ist als Kaufen</h2>
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="shrink-0 mt-1 text-brand-accent"><Icons.Shield /></div>
                        <div><h4 className="text-lg font-bold text-brand-primary mb-1">Kein Wertverlust</h4><p className="text-slate-500">Händler zahlen oft unter Marktwert.</p></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="shrink-0 mt-1 text-brand-accent"><Icons.Money /></div>
                        <div><h4 className="text-lg font-bold text-brand-primary mb-1">Liquidität schonen</h4><p className="text-slate-500">Statt hoher Neupreise zahlen Sie oft nur eine geringe Differenzsumme.</p></div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-100 rounded-3xl h-100 w-full flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-brand-primary/10"></div>
                 <p className="text-slate-400 font-medium">Image Placeholder: Happy Car Handover</p>
            </div>
        </div>
      </section>

      {/* === LIVE LISTINGS === */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-brand-primary mb-2">Aktuelle Angebote</h2>
              <p className="text-slate-500">Frisch eingestellte Fahrzeuge.</p>
            </div>
            <Link to="/search" className="text-brand-primary font-bold hover:text-brand-accent transition flex items-center gap-2">
              Alle Fahrzeuge ansehen <Icons.Swap />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-20 text-slate-400">Lade Fahrzeuge...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map(v => (
                <VehicleCard key={v.vehicle_id} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === FAQ SECTION === */}
      <section id="faq" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-12 text-center">Häufig gestellte Fragen</h2>
              <div className="space-y-4">
                  {faqs.map((faq, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                          <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-6 bg-white hover:bg-slate-50 transition text-left focus:outline-none">
                              <span className="font-bold text-slate-800 text-lg">{faq.question}</span>
                              <span className={`transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-brand-accent' : 'text-slate-400'}`}><Icons.ChevronDown /></span>
                          </button>
                          <div className={`bg-slate-50 text-slate-600 transition-all duration-300 overflow-hidden ${openFaqIndex === index ? 'max-h-48 p-6 pt-0' : 'max-h-0'}`}>
                              <p className="leading-relaxed pt-4 border-t border-slate-200">{faq.answer}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <Footer />
      
    </div>
  );
}