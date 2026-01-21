import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function FAQ() {
  const faqs = [
    {
      q: "Ist das Inserieren wirklich kostenlos?",
      a: "Ja, die Erstellung eines Basis-Inserats ist komplett kostenlos. Wir finanzieren uns über Premium-Features."
    },
    {
      q: "Wie funktioniert der Wertausgleich?",
      a: "Wenn ein Auto mehr wert ist als das andere, könnt ihr im Tauschvertrag eine Zuzahlung vereinbaren. Das regelt ihr direkt untereinander."
    },
    {
      q: "Muss ich mein Auto abmelden?",
      a: "Ja, beim Tausch sollten beide Fahrzeuge abgemeldet oder direkt umgemeldet werden. Wir stellen Checklisten für die Bürokratie bereit."
    },
    {
      q: "Was passiert bei versteckten Mängeln?",
      a: "Ehrlichkeit währt am längsten. Wir empfehlen einen Gebrauchtwagencheck (z.B. ADAC/DEKRA) vor dem finalen Tausch."
    }
  ];

  // Schema.org FAQPage Struktur für Google Rich Snippets
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Helmet>
        <title>Häufige Fragen (FAQ) | Tauschwagen</title>
        <meta name="description" content="Antworten auf deine Fragen zum Autotausch. Kosten, Sicherheit, Abmeldung und mehr." />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>
      <Navbar />
      
      <main className="grow max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-12">
           <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">Support</span>
           <h1 className="text-4xl font-bold mt-2">Häufige Fragen</h1>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 open:shadow-md">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-slate-800 hover:text-brand-primary">
                <span>{faq.q}</span>
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}