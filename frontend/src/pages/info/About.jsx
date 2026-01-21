import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Helmet>
        <title>Über uns | Tauschwagen</title>
        <meta name="description" content="Unsere Mission: Den Fahrzeugmarkt revolutionieren. Tauschen statt Kaufen." />
      </Helmet>
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-white py-20 px-6">
           <div className="max-w-4xl mx-auto text-center">
              <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">Unsere Story</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-8 text-slate-900">Warum Autos kaufen, wenn man tauschen kann?</h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Jeden Tag werden tausende Autos verkauft, nur um direkt danach ein anderes zu kaufen. 
                Dazwischen verlieren Autofahrer Zeit, Nerven und Händler-Margen. 
                Wir haben uns gefragt: <strong>Warum nicht einfach direkt tauschen?</strong>
              </p>
           </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="font-bold text-xl mb-2">Die Idee</h3>
              <p className="text-slate-500">Ein direkter Marktplatz ohne Zwischenhändler. Von Privat zu Privat.</p>
           </div>
           <div className="text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="font-bold text-xl mb-2">Die Sicherheit</h3>
              <p className="text-slate-500">Verifizierte Nutzer und transparente Fahrzeughistorien schaffen Vertrauen.</p>
           </div>
           <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="font-bold text-xl mb-2">Die Nachhaltigkeit</h3>
              <p className="text-slate-500">Wir halten Fahrzeuge länger im Kreislauf und sparen Ressourcen.</p>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}