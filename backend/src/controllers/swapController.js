const pool = require('../config/db');

exports.createSwapRequest = async (req, res) => {
  const { requested_vehicle_id, offered_vehicle_id, receiver_user_id } = req.body;
  const requester_user_id = req.user.id;

  // Sicherheits-Check: Tauscht man mit sich selbst?
  if (requester_user_id === receiver_user_id) {
    return res.status(400).json({ message: "Du kannst nicht mit dir selbst tauschen!" });
  }

  try {
    // Check: Gehört das angebotene Auto wirklich mir?
    const [ownershipCheck] = await pool.query(
      'SELECT vehicle_id FROM vehicles WHERE vehicle_id = ? AND user_id = ?',
      [offered_vehicle_id, requester_user_id]
    );

    if (ownershipCheck.length === 0) {
      return res.status(403).json({ message: "Dieses Fahrzeug gehört dir nicht!" });
    }

    // Tauschanfrage erstellen
    await pool.query(
      `INSERT INTO swap_requests 
      (requester_user_id, receiver_user_id, offered_vehicle_id, requested_vehicle_id, status) 
      VALUES (?, ?, ?, ?, 'PENDING')`,
      [requester_user_id, receiver_user_id, offered_vehicle_id, requested_vehicle_id]
    );

    res.status(201).json({ message: "Tauschanfrage erfolgreich gesendet!" });

  } catch (err) {
    // Falls Unique Constraint verletzt wird (doppelte Anfrage)
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "Anfrage existiert bereits." });
    }
    res.status(500).json({ error: err.message });
  }
};