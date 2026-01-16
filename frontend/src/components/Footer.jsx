import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Spalte 1: Brand */}
        <div>
          <Link to="/" className="block text-2xl font-bold tracking-tighter mb-6 hover:opacity-90 transition">
            <span className="text-white">tausch</span>
            <span className="text-brand-accent">wagen</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Die vertrauenswürdige Plattform für den direkten Fahrzeugtausch in Deutschland. Einfach, transparent und sicher.
          </p>
        </div>

        {/* Spalte 2: Marktplatz */}
        <div>
          <h4 className="text-white font-bold mb-6">Marktplatz</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/search" className="hover:text-brand-accent transition">Fahrzeuge suchen</Link></li>
            <li><Link to="/add-vehicle" className="hover:text-brand-accent transition">Auto inserieren</Link></li>
            <li><Link to="/favorites" className="hover:text-brand-accent transition">Favoriten</Link></li>
            <li><Link to="/magazine" className="hover:text-brand-accent transition">Magazin</Link></li>
          </ul>
        </div>

        {/* Spalte 3: Rechtliches */}
        <div>
          <h4 className="text-white font-bold mb-6">Rechtliches</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/imprint" className="hover:text-brand-accent transition">Impressum</Link></li>
            <li><Link to="/privacy" className="hover:text-brand-accent transition">Datenschutz</Link></li>
            <li><Link to="/terms" className="hover:text-brand-accent transition">AGB</Link></li>
          </ul>
        </div>

        {/* Spalte 4: Kontakt */}
        <div>
          <h4 className="text-white font-bold mb-6">Kontakt</h4>
          <p className="text-sm mb-2 text-white">support@tauschwagen.de</p>
          <p className="text-sm mb-6">Berlin, Deutschland</p>
          
          {/* Social Placeholder */}
          <div className="flex gap-4">
             {/* Hier könnten später Social Media Icons hin */}
             <div className="w-8 h-8 bg-slate-800 rounded-full hover:bg-brand-accent transition cursor-pointer"></div>
             <div className="w-8 h-8 bg-slate-800 rounded-full hover:bg-brand-accent transition cursor-pointer"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs">
        <p>&copy; {new Date().getFullYear()} Tauschwagen GmbH. Alle Rechte vorbehalten.</p>
        <p className="mt-2 md:mt-0 opacity-50">Made for Car Lovers</p>
      </div>
    </footer>
  );
}