import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Spalte 1: Brand */}
        <div>
          <Link to="/" className="block text-2xl font-bold tracking-tighter mb-4 hover:opacity-90 transition">
            <span className="text-white">tausch</span>
            <span className="text-brand-accent">wagen</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Der Marktplatz für den direkten Fahrzeugtausch. Einfach, transparent und sicher.
          </p>
        </div>

        {/* Spalte 2: Entdecken */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Entdecken</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search" className="hover:text-white transition">Fahrzeuge suchen</Link></li>
            <li><Link to="/magazine" className="hover:text-white transition">Magazin</Link></li>
            <li><Link to="/so-gehts" className="hover:text-white transition">So funktioniert's</Link></li>
            <li><Link to="/vertrag" className="hover:text-white transition text-brand-accent font-medium">Mustervertrag</Link></li>
          </ul>
        </div>

        {/* Spalte 3: Rechtliches */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Rechtliches</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/impressum" className="hover:text-white transition">Impressum</Link></li>
            <li><Link to="/datenschutz" className="hover:text-white transition">Datenschutz</Link></li>
            <li><Link to="/agb" className="hover:text-white transition">AGB</Link></li>
          </ul>
        </div>

        {/* Spalte 4: Hilfe & Über uns */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Tauschwagen</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/ueber-uns" className="hover:text-white transition">Über uns</Link></li>
            <li><Link to="/sicherheit" className="hover:text-white transition">Sicherheitstipps</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link to="/kontakt" className="hover:text-white transition">Kontakt</Link></li>
          </ul>
        </div>

      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>&copy; {new Date().getFullYear()} Tauschwagen. Alle Rechte vorbehalten.</p>
        <p className="mt-2 md:mt-0 opacity-50">Made for Car Lovers</p>
      </div>
    </footer>
  );
}