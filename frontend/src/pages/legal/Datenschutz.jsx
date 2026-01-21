import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Datenschutz() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Helmet>
        <title>Datenschutzerklärung | Tauschwagen</title>
        <meta name="description" content="Informationen zum Datenschutz bei Tauschwagen." />
      </Helmet>
      <Navbar />
      
      <main className="grow max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>
        
        <div className="prose prose-slate max-w-none">
          <h2>1. Datenschutz auf einen Blick</h2>
          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
            wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
          
          <h3>Datenerfassung auf dieser Website</h3>
          <p>
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>

          <h2>2. Hosting</h2>
          <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter...</p>

          {/* Hier müsste der vollständige Text vom DSGVO-Generator rein */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg my-6">
             <strong>Hinweis:</strong> Hier muss der vollständige juristische Text eingefügt werden (z.B. via eRecht24 Premium oder Anwalt).
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}