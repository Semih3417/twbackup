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