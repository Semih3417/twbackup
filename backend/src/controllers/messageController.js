const pool = require('../config/db');

// 1. Nachricht senden
exports.sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiver_id, content, vehicle_id } = req.body;

  if (!receiver_id || !content) {
    return res.status(400).json({ message: 'Empfänger und Inhalt fehlen.' });
  }

  try {
    // Nachricht speichern
    await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, vehicle_id, content) VALUES (?, ?, ?, ?)',
      [senderId, receiver_id, vehicle_id || null, content]
    );
    res.json({ message: 'Nachricht gesendet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Chatverlauf mit einer bestimmten Person laden
exports.getChatHistory = async (req, res) => {
  const myId = req.user.id;
  const otherUserId = req.params.userId;

  try {
    const [messages] = await pool.query(`
      SELECT 
        m.*,
        CASE WHEN m.sender_id = ? THEN 'me' ELSE 'other' END as type
      FROM messages m
      WHERE 
        (m.sender_id = ? AND m.receiver_id = ?) 
        OR 
        (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `, [myId, myId, otherUserId, otherUserId, myId]);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Liste aller Konversationen (Linke Spalte)
exports.getConversations = async (req, res) => {
  const myId = req.user.id;

  try {
    // Komplexer Query: Finde alle User, mit denen ich geschrieben habe, und hole die letzte Nachricht
    // Wir nutzen GROUP BY Trick oder Subqueries. Hier ein vereinfachter Ansatz:
    
    const [rows] = await pool.query(`
      SELECT 
        u.user_id, 
        u.first_name, 
        u.last_name, 
        MAX(m.created_at) as last_message_time
      FROM users u
      JOIN messages m ON (u.user_id = m.sender_id OR u.user_id = m.receiver_id)
      WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.user_id != ?
      GROUP BY u.user_id
      ORDER BY last_message_time DESC
    `, [myId, myId, myId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};