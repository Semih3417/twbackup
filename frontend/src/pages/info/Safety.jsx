import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Safety() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Helmet>
        <title>Sicherheitstipps | Tauschwagen</title>
        <meta name="description" content="So tauschst du sicher dein Auto. Unsere Tipps für einen reibungslosen Ablauf." />
      </Helmet>
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Sicher Auto tauschen</h1>
        
        <div className="space-y-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
             <h3 className="font-bold text-lg text-blue-900 mb-2">1. Der erste Kontakt</h3>
             <p className="text-blue-800">Nutze immer unseren integrierten Chat. Gib keine sensiblen Daten (wie Ausweiskopien) leichtfertig heraus, bevor du das Auto nicht gesehen hast.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
             <h3 className="font-bold text-lg mb-2">2. Das Treffen</h3>
             <p className="text-slate-600">Triff dich an einem öffentlichen, belebten Ort (z.B. Supermarkt-Parkplatz) bei Tageslicht. Nimm am besten eine Begleitperson mit.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
             <h3 className="font-bold text-lg mb-2">3. Die Probefahrt</h3>
             <p className="text-slate-600">Lass dir vor der Fahrt den Führerschein zeigen. Fahre immer mit. Vereinbare schriftlich, wer bei einem Unfall haftet.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
             <h3 className="font-bold text-lg mb-2">4. Der Vertrag</h3>
             <p className="text-slate-600">Tausche niemals ohne schriftlichen Vertrag. Nutze unser kostenloses Musterformular, um alle Mängel und Vereinbarungen festzuhalten.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}