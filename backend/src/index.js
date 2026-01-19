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
const magazineController = require('./controllers/magazineController'); // NEU hinzugefügt
const requireAdmin = require('./middleware/adminMiddleware'); 

// --- MIDDLEWARE IMPORTS ---
const authenticateToken = require('./middleware/authMiddleware');
const upload = require('./middleware/uploadMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// === GLOBAL MIDDLEWARE ===
app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 

// Uploads Ordner öffentlich verfügbar machen
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
app.get('/api/form-data', vehicleController.getFormData); 
app.get('/api/models/:id', vehicleController.getModelsByManufacturer); 
app.get('/api/vehicles', vehicleController.getVehicles); 
app.get('/api/vehicles/:id', vehicleController.getVehicleById); 
app.get('/api/vehicles/:id/related', vehicleController.getRelatedVehicles); 

app.post('/api/vehicles', authenticateToken, upload.array('gallery', 5), vehicleController.createVehicle); 
app.put('/api/vehicles/:id', authenticateToken, upload.array('gallery', 5), vehicleController.updateVehicle);
app.delete('/api/vehicles/:id/images/:imageId', authenticateToken, vehicleController.deleteVehicleImage);
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


// --- MAGAZIN (ÖFFENTLICH) ---
// Diese Routen sind für alle Besucher zugänglich
app.get('/api/magazine', magazineController.getArticles);
app.get('/api/magazine/read/:slug', magazineController.getArticleBySlug);


// --- ADMIN BEREICH ---
// Alle Routen hier sind durch authenticateToken UND requireAdmin doppelt gesichert

// User & Statistik Management
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, adminController.getDashboardStats);
app.get('/api/admin/users', authenticateToken, requireAdmin, adminController.getAllUsers);
app.put('/api/admin/users/:id', authenticateToken, requireAdmin, adminController.updateUser);

// Magazin Management (CRUD für Admin)
app.post('/api/admin/articles', authenticateToken, requireAdmin, magazineController.createArticle);
app.get('/api/admin/articles/:id', authenticateToken, requireAdmin, magazineController.getArticleById);
app.put('/api/admin/articles/:id', authenticateToken, requireAdmin, magazineController.updateArticle);
app.delete('/api/admin/articles/:id', authenticateToken, requireAdmin, magazineController.deleteArticle);


// === SERVER START ===
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});