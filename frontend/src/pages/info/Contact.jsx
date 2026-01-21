import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Helmet>
        <title>Kontakt | Tauschwagen</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full">
           <h1 className="text-2xl font-bold mb-6">Kontakt aufnehmen</h1>
           <p className="text-slate-600 mb-6">Hast du Fragen oder Probleme? Schreib uns!</p>
           
           <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">E-Mail</label>
                <input type="email" className="w-full border border-slate-300 rounded-lg p-2" placeholder="deine@email.de" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Nachricht</label>
                <textarea rows="4" className="w-full border border-slate-300 rounded-lg p-2" placeholder="Wie können wir helfen?"></textarea>
              </div>
              <button className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition">Nachricht senden</button>
           </form>
           
           <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
              Oder direkt per Mail an: <a href="mailto:support@tauschwagen.de" className="text-brand-primary font-bold hover:underline">support@tauschwagen.de</a>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}