const pool = require('../config/db');

// 1. Toggle: Hinzufügen oder Entfernen
exports.toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const vehicleId = req.params.id;

  try {
    const [exists] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND vehicle_id = ?', 
      [userId, vehicleId]
    );

    if (exists.length > 0) {
      await pool.query('DELETE FROM favorites WHERE user_id = ? AND vehicle_id = ?', [userId, vehicleId]);
      return res.json({ isFavorite: false, message: 'Von Merkliste entfernt' });
    } else {
      await pool.query('INSERT INTO favorites (user_id, vehicle_id) VALUES (?, ?)', [userId, vehicleId]);
      return res.json({ isFavorite: true, message: 'Zur Merkliste hinzugefügt' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Status prüfen (beim Laden der Seite)
exports.checkFavorite = async (req, res) => {
  const userId = req.user.id;
  const vehicleId = req.params.id;
  
  try {
    const [rows] = await pool.query('SELECT 1 FROM favorites WHERE user_id = ? AND vehicle_id = ?', [userId, vehicleId]);
    res.json({ isFavorite: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Alle Favoriten laden (für /favorites Seite)
exports.getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(`
      SELECT v.* FROM favorites f
      JOIN view_vehicle_details v ON f.vehicle_id = v.vehicle_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};