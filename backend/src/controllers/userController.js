const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Eigene Profildaten laden
exports.getMe = async (req, res) => {
  try {
    // FIX: 'role' wurde hinzugefügt, damit das Frontend Admin-Rechte erkennen kann
    const [rows] = await pool.query(
      'SELECT user_id, email, first_name, last_name, phone_number, role, created_at FROM users WHERE user_id = ?', 
      [req.user.id]
    );
    
    if (rows.length === 0) return res.status(404).json({ message: "User nicht gefunden" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Profildaten aktualisieren (Name, Telefon)
exports.updateProfile = async (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  try {
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone_number = ? WHERE user_id = ?',
      [first_name, last_name, phone_number, req.user.id]
    );
    res.json({ message: 'Profil erfolgreich aktualisiert' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Passwort ändern
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Neues Passwort muss mind. 6 Zeichen haben.' });
  }

  try {
    const [users] = await pool.query('SELECT password_hash FROM users WHERE user_id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ message: "User nicht gefunden" });
    
    const user = users[0];
    const validPass = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPass) return res.status(401).json({ message: 'Das alte Passwort ist falsch.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, req.user.id]);
    
    res.json({ message: 'Passwort erfolgreich geändert.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};