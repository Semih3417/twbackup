import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function AGB() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Helmet>
        <title>Allgemeine Geschäftsbedingungen | Tauschwagen</title>
      </Helmet>
      <Navbar />
      
      <main className="grow max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <div className="prose prose-slate max-w-none">
          <h2>§ 1 Geltungsbereich</h2>
          <p>
            Für die Geschäftsbeziehung zwischen Tauschwagen (nachfolgend „Anbieter“) und dem Kunden (nachfolgend „Kunde“) 
            gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung.
          </p>

          <h2>§ 2 Leistungsbeschreibung</h2>
          <p>
            Tauschwagen stellt eine Plattform zur Verfügung, auf der Nutzer Fahrzeuge tauschen können. 
            Der Vertrag über den Tausch kommt ausschließlich zwischen den Nutzern zustande.
          </p>

          {/* Platzhalter für weitere Paragraphen */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
             <strong>Hinweis:</strong> AGBs für Marktplätze sind komplex. Bitte anwaltlich prüfen lassen.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}