const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_dev_key';

// --- REGISTER FUNKTION ---
exports.register = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  
  try {
    // 1. Check ob User existiert
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email bereits vergeben' });

    // 2. Passwort hashen
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. User anlegen
    await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, first_name, last_name]
    );

    res.status(201).json({ message: 'User erfolgreich erstellt' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- LOGIN FUNKTION (AKTUALISIERT) ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. User suchen
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Ungültige Zugangsdaten' });

    const user = users[0];

    // 2. Passwort prüfen
    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(400).json({ message: 'E-Mail oder Passwort falsch.' });

    // 3. UPDATE: Token erstellen - JETZT MIT ROLE & 24h Laufzeit
    const token = jwt.sign(
      { 
        id: user.user_id, 
        email: user.email, 
        role: user.role // <--- Rolle im Token gespeichert
      },
      SECRET_KEY, 
      { expiresIn: '24h' }
    );

    // 4. Response mit Token und erweiterten User-Infos
    res.json({ 
      token, 
      user: { 
        id: user.user_id, 
        first_name: user.first_name, 
        last_name: user.last_name,
        email: user.email,
        role: user.role // <--- Rolle im JSON zurückgegeben
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};