const pool = require('../config/db');

// Dashboard Statistiken laden
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {};

    // 1. Anzahl User
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    stats.totalUsers = users[0].count;

    // 2. Anzahl Fahrzeuge
    const [vehicles] = await pool.query('SELECT COUNT(*) as count FROM vehicles');
    stats.totalVehicles = vehicles[0].count;

    // 3. Neueste User (letzte 5)
    const [newUsers] = await pool.query('SELECT user_id, first_name, last_name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    stats.recentUsers = newUsers;

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Weitere Funktionen für User-Verwaltung etc. kommen später hier rein

// ... (getDashboardStats ist schon da)

// 2. Alle Nutzer laden (mit Suche)
exports.getAllUsers = async (req, res) => {
  const { search } = req.query;
  try {
let sql = 'SELECT user_id, first_name, last_name, email, role, phone_number, created_at FROM users';    const params = [];

    if (search) {
      sql += ' WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    sql += ' ORDER BY created_at DESC';

    const [users] = await pool.query(sql, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Nutzer-Rolle oder Status ändern
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // Wir erwarten z.B. { role: 'banned' } oder { role: 'moderator' }

  // Sicherheitscheck: Man darf sich nicht selbst die Admin-Rechte entziehen ;)
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: "Du kannst deinen eigenen Account nicht ändern." });
  }

  try {
    // Da wir in der DB 'role' als ENUM('user','admin','moderator') haben, 
    // müssen wir für "Banned" entweder eine Spalte is_active nutzen oder das ENUM erweitern.
    // Für jetzt ändern wir einfach die Rolle.
    
    await pool.query('UPDATE users SET role = ? WHERE user_id = ?', [role, id]);
    res.json({ message: `User-Status auf ${role} geändert.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};