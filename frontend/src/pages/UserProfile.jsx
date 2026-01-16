import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client'; // Direkt Client nutzen, da Register meist nicht im Context ist
import { useAuth } from '../context/AuthContext'; // Um direkt einzuloggen nach Register

export default function Register() {
  const { login } = useAuth(); // Wir nutzen die Login Funktion nach dem Register
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validierung Client-Side
    if (formData.password !== formData.confirmPassword) {
        return setError("Die Passwörter stimmen nicht überein.");
    }
    if (formData.password.length < 6) {
        return setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
    }

    setLoading(true);

    try {
      // 1. Registrieren
      await client.post('/auth/register', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      });

      // 2. Automatisch Einloggen (UX!)
      await login(formData.email, formData.password);
      
      // 3. Weiterleitung
      navigate('/my-garage');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrierung fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* === LINKE SEITE (Bild) === */}
      <div className="hidden lg:flex w-1/2 bg-brand-primary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Car Keys" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
        </div>
        <div className="relative z-10 p-12 text-white max-w-lg">
           <h1 className="text-4xl font-bold mb-6">Starte deinen Tausch.</h1>
           <ul className="space-y-4 text-lg text-slate-200">
               <li className="flex items-center gap-3">✓ Kostenlos Inserieren</li>
               <li className="flex items-center gap-3">✓ Verifizierte Nutzer</li>
               <li className="flex items-center gap-3">✓ Sicherer Chat</li>
           </ul>
        </div>
      </div>

      {/* === RECHTE SEITE (Formular) === */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
           
           <div className="mb-8">
             <Link to="/" className="text-2xl font-bold tracking-tighter block mb-2">
                <span className="text-slate-900">tausch</span><span className="text-brand-accent">wagen</span>
             </Link>
             <h2 className="text-3xl font-bold text-slate-800">Konto erstellen</h2>
             <p className="text-slate-500 mt-2">Dauert weniger als eine Minute.</p>
           </div>

           {error && (
             <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">
               ⚠️ {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-4">
             
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Vorname</label>
                    <input type="text" name="first_name" required className="auth-input" placeholder="Max" value={formData.first_name} onChange={handleChange} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nachname</label>
                    <input type="text" name="last_name" required className="auth-input" placeholder="Mustermann" value={formData.last_name} onChange={handleChange} />
                 </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">E-Mail Adresse</label>
               <input type="email" name="email" required className="auth-input" placeholder="deine@email.de" value={formData.email} onChange={handleChange} />
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Passwort</label>
               <input type="password" name="password" required className="auth-input" placeholder="Mind. 6 Zeichen" value={formData.password} onChange={handleChange} />
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Passwort wiederholen</label>
               <input type="password" name="confirmPassword" required className="auth-input" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
             </div>

             <div className="text-xs text-slate-500 pt-2">
                 Mit der Registrierung stimmst du unseren <a href="#" className="underline">AGB</a> und der <a href="#" className="underline">Datenschutzerklärung</a> zu.
             </div>

             <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-brand-primary/20 disabled:opacity-70 mt-2"
             >
                {loading ? "Laden..." : "Kostenlos registrieren"}
             </button>

           </form>

           <div className="mt-8 text-center text-sm text-slate-500">
              Du hast schon ein Konto?{' '}
              <Link to="/login" className="font-bold text-brand-primary hover:underline">
                Hier anmelden
              </Link>
           </div>
        </div>
      </div>

      <style>{`
        .auth-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; transition: all 0.2s; }
        .auth-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
      `}</style>
    </div>
  );
}