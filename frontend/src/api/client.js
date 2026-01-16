import axios from 'axios';

// Basis URLs
// Falls du .env nutzt, ist import.meta.env.VITE_API_URL bevorzugt. 
// Falls nicht, wird der Fallback http://localhost:3000/api genutzt.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Basis URL für statische Bilder (wichtig für die Anzeige im Frontend)
export const IMAGE_BASE_URL = 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor (optional, aber hilfreich): 
// Fügt automatisch den Token hinzu, falls er im LocalStorage existiert
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;

// --- API FUNKTIONEN ---

// Beispiel: Alle Fahrzeuge laden
export const getVehicles = (params) => client.get('/vehicles', { params });

// Beispiel: Fahrzeug nach ID laden
export const getVehicleById = (id) => client.get(`/vehicles/${id}`);

// Beispiel: Neues Fahrzeug erstellen (für Bildupload wichtig!)
export const createVehicle = (formData) => {
  return client.post('/vehicles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};