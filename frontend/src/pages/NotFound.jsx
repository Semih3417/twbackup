import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
      <Helmet><title>Seite nicht gefunden | Tauschwagen</title></Helmet>
      <div className="text-9xl mb-4">404</div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Ups, falsch abgebogen!</h1>
      <p className="text-slate-500 mb-8">Diese Seite existiert leider nicht (mehr).</p>
      <Link to="/" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition">
        Zurück zur Startseite
      </Link>
    </div>
  );
}