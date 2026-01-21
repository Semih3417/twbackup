import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Contract() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Helmet>
        <title>Tauschvertrag Muster | Tauschwagen</title>
        <meta name="description" content="Kostenloses Muster für einen KFZ-Tauschvertrag. Jetzt herunterladen und sicher tauschen." />
      </Helmet>
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">📝</div>
        <h1 className="text-4xl font-bold mb-4">Der KFZ-Tauschvertrag</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Sicherheit geht vor. Nutze unsere kostenlose Vorlage, um deinen Fahrzeugtausch rechtlich sauber zu dokumentieren.
        </p>
        
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 inline-block text-left max-w-lg w-full">
           <h3 className="font-bold text-lg mb-4">Inhalt des Vertrags:</h3>
           <ul className="space-y-2 mb-8 text-slate-600">
             <li>✅ Daten beider Fahrzeuge</li>
             <li>✅ Daten beider Tauschpartner</li>
             <li>✅ Bekannte Mängel & Schäden</li>
             <li>✅ Ausschluss der Sachmängelhaftung (Privat)</li>
             <li>✅ Vereinbarung über Zuzahlung</li>
           </ul>
           
           {/* Placeholder Button - hier später PDF Link einfügen */}
           <button onClick={() => alert("Hier würde der PDF Download starten.")} className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
             <span>📥</span> PDF Muster herunterladen
           </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}