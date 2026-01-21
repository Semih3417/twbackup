import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Impressum() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Helmet>
        <title>Impressum | Tauschwagen</title>
        <meta name="robots" content="noindex, follow" /> {/* Impressum muss nicht zwingend bei Google ranken */}
      </Helmet>
      <Navbar />
      
      <main className="grow max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8">Impressum</h1>
        
        <div className="prose prose-slate max-w-none">
          <h3>Angaben gemäß § 5 TMG</h3>
          <p>
            Tauschwagen GmbH (Musterfirma)<br />
            Musterstraße 123<br />
            12345 Musterstadt
          </p>

          <h3>Vertreten durch:</h3>
          <p>Max Mustermann</p>

          <h3>Kontakt:</h3>
          <p>
            Telefon: +49 (0) 123 44 55 66<br />
            E-Mail: info@tauschwagen.de
          </p>

          <h3>Registereintrag:</h3>
          <p>
            Eintragung im Handelsregister.<br />
            Registergericht: Amtsgericht Musterstadt<br />
            Registernummer: HRB 12345
          </p>

          <h3>Umsatzsteuer-ID:</h3>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
            DE 123456789
          </p>

          <h3>Streitschlichtung</h3>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"> https://ec.europa.eu/consumers/odr</a>.<br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}