import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
const Icons = {
  Mail: () => <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>,
  Lock: () => <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Eye: () => <svg className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Wenn man von einer geschützten Seite kam (z.B. Favoriten), dahin zurück, sonst Home
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.message || 'Login fehlgeschlagen. Bitte Daten prüfen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* === LINKE SEITE (Bild) === */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        {/* Hintergrundbild */}
        <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Car Background" className="w-full h-full object-cover opacity-40" />
        </div>
        
        <div className="relative z-10 p-12 text-white max-w-lg">
           <h1 className="text-4xl font-bold mb-6">Willkommen zurück.</h1>
           <p className="text-lg text-slate-300 leading-relaxed mb-8">
             "Tauschwagen hat mir geholfen, meinen alten Kombi unkompliziert gegen ein Cabrio zu tauschen. Der sicherste Weg zum neuen Auto."
           </p>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold">M</div>
              <div>
                 <div className="font-bold">Michael S.</div>
                 <div className="text-sm text-slate-400">Nutzer aus München</div>
              </div>
           </div>
        </div>
      </div>

      {/* === RECHTE SEITE (Formular) === */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-md">
           
           {/* Logo / Header */}
           <div className="mb-10">
             <Link to="/" className="text-2xl font-bold tracking-tighter block mb-2">
                <span className="text-slate-900">tausch</span><span className="text-brand-accent">wagen</span>
             </Link>
             <h2 className="text-3xl font-bold text-slate-800">Login</h2>
             <p className="text-slate-500 mt-2">Schön, dass du wieder da bist.</p>
           </div>

           {error && (
             <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100 flex items-center gap-2">
               ⚠️ {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-5">
             
             {/* Email */}
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">E-Mail Adresse</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Mail />
                 </div>
                 <input 
                    type="email" 
                    name="email" 
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"
                    placeholder="deine@email.de"
                    value={formData.email}
                    onChange={handleChange}
                 />
               </div>
             </div>

             {/* Passwort */}
             <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-bold text-slate-700">Passwort</label>
                 <a href="#" className="text-xs font-bold text-brand-primary hover:underline" onClick={(e) => {e.preventDefault(); alert("Feature kommt bald!");}}>Passwort vergessen?</a>
               </div>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Lock />
                 </div>
                 <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    required
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                 />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                 </div>
               </div>
             </div>

             <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
             >
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : "Anmelden"}
             </button>

           </form>

           <div className="mt-8 text-center text-sm text-slate-500">
              Noch kein Konto?{' '}
              <Link to="/register" className="font-bold text-brand-primary hover:underline">
                Jetzt kostenlos registrieren
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}