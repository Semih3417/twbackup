import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function HowItWorks() {
  // Lokale SVG Icons als Komponenten, um Import-Fehler zu vermeiden
  const IconDocument = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );

  const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );

  const IconSwap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );

  const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500 mr-2 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );

  const steps = [
    {
      title: "1. Fahrzeug kostenlos inserieren",
      desc: "Erstelle in wenigen Minuten ein aussagekräftiges Profil für dein Auto.",
      details: [
        "Hochwertige Fotos & Details hochladen",
        "Zustand ehrlich beschreiben",
        "Tausch-Präferenzen festlegen",
        "Inserat ist 100% kostenlos"
      ],
      icon: <IconDocument />
    },
    {
      title: "2. Passende Matches finden",
      desc: "Unser System findet automatisch Fahrzeuge, die zu deinen Wünschen passen.",
      details: [
        "Intelligente Filterfunktion",
        "Umkreissuche in deiner Nähe",
        "Merkliste für Favoriten",
        "Echtzeit-Benachrichtigungen"
      ],
      icon: <IconSearch />
    },
    {
      title: "3. Sicher kontaktieren & tauschen",
      desc: "Chatte anonym mit Tauschpartnern und vereinbare Besichtigungen.",
      details: [
        "Sicherer interner Chat",
        "Muster-Tauschverträge inklusive",
        "Checklisten für die Übergabe",
        "Bewertete Tausch-Community"
      ],
      icon: <IconSwap />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Helmet>
        <title>Autotausch Anleitung: In 3 Schritten zum neuen Wagen | Tauschwagen</title>
        <meta name="description" content="Erfahre, wie der Fahrzeugtausch auf Tauschwagen funktioniert. Sicher, stressfrei und ohne Wertverlust durch Händlermargen." />
      </Helmet>

      <Navbar />
      
      <main className="grow">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              So einfach funktioniert der Autotausch
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Vergiss den komplizierten Verkaufsprozess. Wir bringen Menschen zusammen, die ihre Fahrzeuge direkt miteinander tauschen wollen.
            </p>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition shadow-lg inline-block">
              Jetzt Inserat erstellen
            </Link>
          </div>
        </section>

        {/* Steps Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{step.desc}</p>
                <ul className="space-y-3 pt-6 border-t border-slate-200">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm font-medium text-slate-700">
                      <IconCheck />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Info Block */}
        <section className="bg-blue-50 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Warum Auto tauschen statt verkaufen?</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Beim klassischen <strong>Gebrauchtwagenverkauf</strong> an einen Händler verlierst du oft viel Geld durch die Gewinnmarge des Zwischenhändlers. Auf unserer <strong>Tauschbörse für Autos</strong> handelst du direkt mit Privatpersonen.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Das bedeutet für dich: <strong>Maximaler Wert</strong> für dein altes Fahrzeug und ein fairer Deal für dein neues Traumauto. Zudem bleibst du lückenlos mobil!
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Bereit für deinen ersten Tausch?</h2>
          <Link to="/register" className="bg-slate-900 text-white font-bold py-4 px-12 rounded-xl hover:bg-slate-800 transition shadow-xl inline-block">
            Kostenlos anmelden
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}