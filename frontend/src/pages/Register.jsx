import { useState } from 'react';
import client from '../api/client'; // Direkter API Zugriff
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API Call an unser Backend
      await client.post('/auth/register', formData);
      alert('Registrierung erfolgreich! Bitte einloggen.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrierung fehlgeschlagen');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">Konto erstellen</h2>
        
        {error && <div className="mb-4 text-center text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              placeholder="Vorname"
              required
              className="rounded-lg border border-slate-300 p-2.5"
              onChange={handleChange}
            />
            <input
              name="last_name"
              placeholder="Nachname"
              required
              className="rounded-lg border border-slate-300 p-2.5"
              onChange={handleChange}
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="E-Mail Adresse"
            required
            className="w-full rounded-lg border border-slate-300 p-2.5"
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Passwort wählen"
            required
            className="w-full rounded-lg border border-slate-300 p-2.5"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Registrieren
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Bereits registriert? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}