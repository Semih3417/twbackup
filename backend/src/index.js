const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Datenbank-Pool
const db = require('./config/db'); 

// --- CONTROLLER IMPORTS ---
const authController = require('./controllers/authController');
const vehicleController = require('./controllers/vehicleController');
const messageController = require('./controllers/messageController');
const favoriteController = require('./controllers/favoriteController');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const requireAdmin = require('./middleware/adminMiddleware'); // Unser neuer Türsteher

// --- MIDDLEWARE IMPORTS ---
const authenticateToken = require('./middleware/authMiddleware');
const upload = require('./middleware/uploadMiddleware'); // Neu hinzugefügt

const app = express();
const PORT = process.env.PORT || 3000;

// === GLOBAL MIDDLEWARE ===
app.use(cors()); // Erlaubt Zugriff vom Frontend
app.use(express.json()); // Erlaubt JSON-Body in Requests
app.use(morgan('dev')); // Logging in der Konsole

// WICHTIG: Den Uploads Ordner öffentlich verfügbar machen
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// === ROUTES ===

// 1. Health-Check
app.get('/', (req, res) => {
  res.send('Tauschwagen API läuft 🚗💨');
});

// --- AUTHENTIFIZIERUNG ---
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);


// --- FAHRZEUGE (VEHICLES) ---

// A. Hilfsdaten & Listen (Öffentlich)
app.get('/api/form-data', vehicleController.getFormData); 
app.get('/api/models/:id', vehicleController.getModelsByManufacturer); 

// B. Suche & Details (Öffentlich)
app.get('/api/vehicles', vehicleController.getVehicles); 
app.get('/api/vehicles/:id', vehicleController.getVehicleById); 
app.get('/api/vehicles/:id/related', vehicleController.getRelatedVehicles); 

// C. Verwaltung (Geschützt)
app.post('/api/vehicles', authenticateToken, upload.array('gallery', 5), vehicleController.createVehicle); 
// --- NEU: Update & Bild-Löschen Routen ---
app.put('/api/vehicles/:id', authenticateToken, upload.array('gallery', 5), vehicleController.updateVehicle);
app.delete('/api/vehicles/:id/images/:imageId', authenticateToken, vehicleController.deleteVehicleImage);
// -----------------------------------------
app.delete('/api/vehicles/:id', authenticateToken, vehicleController.deleteVehicle); 
app.get('/api/my-vehicles', authenticateToken, vehicleController.getMyVehicles); 


// --- NACHRICHTEN (MESSAGES / CHAT) ---
app.post('/api/messages', authenticateToken, messageController.sendMessage); 
app.get('/api/conversations', authenticateToken, messageController.getConversations); 
app.get('/api/messages/:userId', authenticateToken, messageController.getChatHistory); 


// --- FAVORITEN (MERKLISTE) ---
app.get('/api/favorites', authenticateToken, favoriteController.getFavorites); 
app.get('/api/vehicles/:id/favorite', authenticateToken, favoriteController.checkFavorite); 
app.post('/api/vehicles/:id/favorite', authenticateToken, favoriteController.toggleFavorite); 

// --- USER / PROFIL ---
app.get('/api/users/me', authenticateToken, userController.getMe);
app.put('/api/users/profile', authenticateToken, userController.updateProfile);
app.put('/api/users/password', authenticateToken, userController.changePassword);

// --- ADMIN BEREICH ---
// Doppelt gesichert: Erst Token prüfen (authenticateToken), dann Rolle prüfen (requireAdmin)
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, adminController.getDashboardStats);

// === SERVER START ===
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});