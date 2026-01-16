import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ transparent = false }) {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Basis-Klassen
  // Wichtig: Wenn transparent, dann Text weiß. Wenn weißer Hintergrund (Scroll oder Mobile), dann Text dunkel.
  const isTransparent = transparent && !isMobileMenuOpen;
  
  const baseClasses = "w-full z-50 transition-all duration-300";
  const layoutClasses = isTransparent 
    ? "absolute top-0 left-0 bg-transparent text-white" 
    : "relative bg-brand-primary text-white shadow-md";

  // Helper für aktive Links
  const linkClasses = (path) => {
    const isActive = location.pathname === path;
    if (isTransparent) {
        return isActive ? "text-brand-accent font-bold" : "text-white/90 hover:text-white";
    }
    return isActive ? "text-brand-accent font-bold" : "text-slate-300 hover:text-white";
  };

  return (
    <nav className={`${baseClasses} ${layoutClasses}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* === LOGO === */}
          <Link to="/" className="text-2xl font-bold tracking-tighter hover:opacity-90 transition z-50">
            <span className={isTransparent ? "text-white" : "text-white"}>tausch</span>
            <span className="text-brand-accent">wagen</span>
          </Link>

          {/* === DESKTOP MENU (Hidden on Mobile) === */}
          <div className="hidden md:flex gap-8 text-sm font-medium items-center">
            <Link to="/search" className={`${linkClasses('/search')} transition`}>Fahrzeuge</Link>
            <Link to="/magazine" className={`${linkClasses('/magazine')} transition`}>Magazin</Link>
            
            {user && (
               <Link to="/favorites" className={`${linkClasses('/favorites')} transition`}>Merkliste</Link>
            )}

            {location.pathname === '/' && (
              <>
                <a href="#process" className={`${linkClasses('#process')} transition`}>Ablauf</a>
                <a href="#faq" className={`${linkClasses('#faq')} transition`}>FAQ</a>
              </>
            )}
          </div>

          {/* === AUTH BUTTONS (Desktop) === */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link 
                to="/profile" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition backdrop-blur-sm ${
                  isTransparent
                    ? "bg-white/10 border-white/30 text-white hover:bg-white/20" 
                    : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center text-xs font-bold">
                  {user.first_name?.charAt(0)}
                </div>
                Profil
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary px-6 py-2 rounded-full font-bold transition shadow-lg shadow-brand-accent/20"
              >
                Login
              </Link>
            )}
          </div>

          {/* === MOBILE HAMBURGER BUTTON === */}
          <div className="md:hidden z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* === MOBILE MENU OVERLAY === */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-slate-900 z-40 flex flex-col items-center justify-center space-y-8 animate-fade-in-down">
           <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-brand-accent">Fahrzeuge finden</Link>
           <Link to="/magazine" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-brand-accent">Magazin</Link>
           
           {user && (
             <>
                <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-brand-accent">Merkliste</Link>
                <Link to="/my-garage" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-brand-accent">Meine Garage</Link>
             </>
           )}

           <div className="w-16 h-1 bg-slate-800 rounded-full"></div>

           {user ? (
             <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold text-xl">
               Mein Profil
             </Link>
           ) : (
             <div className="flex flex-col gap-4 w-full px-12">
               <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-800 text-white text-center py-3 rounded-xl font-bold border border-slate-700">
                 Login
               </Link>
               <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-accent text-brand-primary text-center py-3 rounded-xl font-bold">
                 Registrieren
               </Link>
             </div>
           )}
        </div>
      )}
    </nav>
  );
}