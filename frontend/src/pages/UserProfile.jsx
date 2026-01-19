import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });
  
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Daten laden
  useEffect(() => {
    client.get('/users/me')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handler: Profil Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await client.put('/users/profile', profile);
      setMessage({ text: 'Daten erfolgreich gespeichert!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Fehler beim Speichern.', type: 'error' });
    }
  };

  // Handler: Passwort Update
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await client.put('/users/password', passwords);
      setMessage({ text: 'Passwort geändert!', type: 'success' });
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Fehler beim Ändern.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="grow max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-brand-primary mb-8">Mein Profil</h1>

        {message.text && (
          <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Linke Spalte: User Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="w-24 h-24 bg-brand-primary text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                {profile.first_name?.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{profile.first_name} {profile.last_name}</h2>
              <p className="text-slate-500 text-sm mb-6">{profile.email}</p>
              
              <button 
                onClick={logout}
                className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 rounded-lg transition"
              >
                Abmelden
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
               <Link to="/my-garage" className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-brand-primary font-bold py-2 rounded-lg transition mb-2">
                 Meine Garage verwalten
               </Link>
               <Link to="/favorites" className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-brand-primary font-bold py-2 rounded-lg transition">
                 Meine Merkliste
               </Link>
            </div>
          </div>

          {/* Rechte Spalte: Formulare */}
          <div className="md:col-span-2 space-y-8">
            
            {/* 1. Persönliche Daten */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-brand-primary mb-6">Persönliche Daten</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">Vorname</label>
                    <input 
                      className="w-full border p-2 rounded-lg"
                      value={profile.first_name || ''}
                      onChange={e => setProfile({...profile, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">Nachname</label>
                    <input 
                      className="w-full border p-2 rounded-lg"
                      value={profile.last_name || ''}
                      onChange={e => setProfile({...profile, last_name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">Telefonnummer</label>
                    <input 
                      className="w-full border p-2 rounded-lg"
                      value={profile.phone_number || ''}
                      placeholder="+49 123 45678"
                      onChange={e => setProfile({...profile, phone_number: e.target.value})}
                    />
                </div>
                
                <div className="pt-2 text-right">
                  <button type="submit" className="bg-brand-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-800 transition">
                    Speichern
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Sicherheit (Passwort) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-brand-primary mb-6">Sicherheit</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-500 mb-1">Aktuelles Passwort</label>
                   <input 
                     type="password"
                     className="w-full border p-2 rounded-lg"
                     value={passwords.oldPassword}
                     onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-500 mb-1">Neues Passwort</label>
                   <input 
                     type="password"
                     className="w-full border p-2 rounded-lg"
                     value={passwords.newPassword}
                     onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                   />
                </div>
                <div className="pt-2 text-right">
                  <button type="submit" className="border border-slate-300 text-slate-700 font-bold px-6 py-2 rounded-lg hover:bg-slate-50 transition">
                    Passwort ändern
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}