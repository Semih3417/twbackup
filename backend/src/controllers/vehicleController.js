const pool = require('../config/db');

// 1. Hilfsdaten für das Formular laden (Hersteller, Kraftstoffe, Features)
exports.getFormData = async (req, res) => {
  try {
    const [manufacturers] = await pool.query('SELECT * FROM manufacturers ORDER BY name');
    const [fuelTypes] = await pool.query('SELECT * FROM fuel_types');
    
    // WICHTIG: Features nach Kategorie sortieren, damit das Frontend sie gruppieren kann
    const [features] = await pool.query('SELECT * FROM features ORDER BY category, name');
    
    res.json({ manufacturers, fuelTypes, features });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Modelle basierend auf Hersteller laden
exports.getModelsByManufacturer = async (req, res) => {
  try {
    const { id } = req.params;
    const [models] = await pool.query('SELECT * FROM models WHERE manufacturer_id = ? ORDER BY name', [id]);
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Fahrzeuge suchen & filtern (Massiv erweitert)
exports.getVehicles = async (req, res) => {
  try {
    const { 
      // Basis Filter
      manufacturer_id, model_id, fuel_type_id, zip,
      // Zahlenbereiche
      min_year, max_year, 
      min_km, max_km, 
      min_hp, max_hp,     // NEU
      min_seats,          // NEU
      // Text / Auswahl Filter
      transmission,       // NEU (Automatik/Manuell)
      body_type,          // NEU (SUV, Kombi...)
      exterior_color,     // NEU
      sort 
    } = req.query;

    let sql = 'SELECT * FROM view_vehicle_details WHERE 1=1';
    const params = [];

    // --- ID & Text Filter ---
    if (manufacturer_id) { sql += ' AND manufacturer_id = ?'; params.push(manufacturer_id); }
    if (model_id) { sql += ' AND model_id = ?'; params.push(model_id); }
    if (fuel_type_id) { sql += ' AND fuel_type_id = ?'; params.push(fuel_type_id); }
    if (zip) { sql += ' AND zip_code LIKE ?'; params.push(`${zip}%`); }
    
    // --- Neue Auswahl-Filter ---
    if (transmission) { sql += ' AND transmission = ?'; params.push(transmission); }
    if (body_type) { sql += ' AND body_type = ?'; params.push(body_type); }
    if (exterior_color) { sql += ' AND exterior_color = ?'; params.push(exterior_color); }

    // --- Bereichs-Filter ---
    if (min_year) { sql += ' AND year_of_manufacture >= ?'; params.push(min_year); }
    if (max_year) { sql += ' AND year_of_manufacture <= ?'; params.push(max_year); }
    
    if (min_km) { sql += ' AND mileage_km >= ?'; params.push(min_km); }
    if (max_km) { sql += ' AND mileage_km <= ?'; params.push(max_km); }

    if (min_hp) { sql += ' AND power_hp >= ?'; params.push(min_hp); }
    if (max_hp) { sql += ' AND power_hp <= ?'; params.push(max_hp); }

    if (min_seats) { sql += ' AND seats >= ?'; params.push(min_seats); }

    // --- SORTIERUNG ---
    const sortMappings = {
      'newest': 'created_at DESC',
      'oldest': 'created_at ASC',
      'km_asc': 'mileage_km ASC',
      'km_desc': 'mileage_km DESC',
      'year_desc': 'year_of_manufacture DESC',
      'year_asc': 'year_of_manufacture ASC',
      'hp_desc': 'power_hp DESC' // NEU: Nach Leistung sortieren
    };
    const orderBy = sortMappings[sort] || 'created_at DESC';
    sql += ` ORDER BY ${orderBy}`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Einzelnes Fahrzeug laden
exports.getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const [vehicleRows] = await pool.query('SELECT * FROM view_vehicle_details WHERE vehicle_id = ?', [id]);
    
    if (vehicleRows.length === 0) {
      return res.status(404).json({ message: "Fahrzeug nicht gefunden" });
    }
    const vehicle = vehicleRows[0];

    const [images] = await pool.query('SELECT image_url, is_primary FROM vehicle_images WHERE vehicle_id = ? ORDER BY sort_order ASC', [id]);

    // Features mit Kategorie laden!
    const [features] = await pool.query(`
      SELECT f.name, f.category
      FROM vehicle_features vf
      JOIN features f ON vf.feature_id = f.feature_id
      WHERE vf.vehicle_id = ?
      ORDER BY f.category, f.name
    `, [id]);

    res.json({
      ...vehicle,
      images: images,
      // Wir senden das volle Feature-Objekt (Name + Kategorie), damit das Frontend gruppieren kann
      features: features 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Ähnliche Fahrzeuge
exports.getRelatedVehicles = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM view_vehicle_details WHERE vehicle_id != ? ORDER BY created_at DESC LIMIT 3', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Auto speichern (DAS GROSSE UPDATE)
exports.createVehicle = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const userId = req.user.id;

    // Alles aus req.body destrukturieren (Vorsicht: Multipart sendet alles als Strings!)
    const { 
      // Basis
      model_id, fuel_type_id, year_of_manufacture, mileage_km, description, swap_preference,
      body_type, doors, seats, has_sliding_door,
      // Technik
      transmission, power_hp, engine_displacement, cylinders, weight_kg, drive_type,
      // Umwelt
      fuel_consumption, tank_volume, emission_class, emission_sticker, hu_valid_until,
      // Farbe & Innen
      exterior_color, interior_color, interior_material, airbags, climate_control,
      // Features (Array oder String)
      feature_ids 
    } = req.body;

    // Helper: Leere Strings zu NULL konvertieren (wichtig für Zahlenfelder/Datumsfelder)
    const val = (v) => (v === '' || v === 'undefined' || v === 'null' ? null : v);
    // Helper: Checkbox Boolean konvertieren (kommt oft als String "true"/"false" oder "on")
    const boolVal = (v) => (v === 'true' || v === '1' || v === 'on' ? 1 : 0);

    const insertSql = `
      INSERT INTO vehicles (
        user_id, model_id, fuel_type_id, year_of_manufacture, mileage_km, description, swap_preference, condition_rating,
        body_type, doors, seats, has_sliding_door,
        transmission, power_hp, engine_displacement, cylinders, weight_kg, drive_type,
        fuel_consumption, tank_volume, emission_class, emission_sticker, hu_valid_until,
        exterior_color, interior_color, interior_material, airbags, climate_control
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertParams = [
      userId, val(model_id), val(fuel_type_id), val(year_of_manufacture), val(mileage_km), description, swap_preference, 3, // Condition Default 3
      val(body_type), val(doors), val(seats), boolVal(has_sliding_door),
      val(transmission), val(power_hp), val(engine_displacement), val(cylinders), val(weight_kg), val(drive_type),
      val(fuel_consumption), val(tank_volume), val(emission_class), val(emission_sticker), val(hu_valid_until),
      val(exterior_color), val(interior_color), val(interior_material), val(airbags), val(climate_control)
    ];

    const [result] = await connection.query(insertSql, insertParams);
    const newVehicleId = result.insertId;

    // Features Insert
    if (feature_ids) {
      let featuresArray = [];
      if (Array.isArray(feature_ids)) {
        featuresArray = feature_ids;
      } else if (typeof feature_ids === 'string') {
        featuresArray = feature_ids.split(',').filter(x => x); 
      }

      if (featuresArray.length > 0) {
        const featureValues = featuresArray.map(fid => [newVehicleId, fid]);
        await connection.query('INSERT INTO vehicle_features (vehicle_id, feature_id) VALUES ?', [featureValues]);
      }
    }

    // Images Insert
    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map((file, index) => [
        newVehicleId, 
        `/uploads/${file.filename}`,
        index === 0 ? 1 : 0,
        index
      ]);

      await connection.query(
        'INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, sort_order) VALUES ?',
        [imageValues]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Fahrzeug erfolgreich angelegt!', vehicleId: newVehicleId });

  } catch (err) {
    await connection.rollback();
    console.error("Fehler beim Fahrzeug anlegen:", err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// 7. Löschen (bleibt gleich)
exports.deleteVehicle = async (req, res) => {
  const vehicleId = req.params.id;
  const userId = req.user.id;
  try {
    const [check] = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = ? AND user_id = ?', [vehicleId, userId]);
    if (check.length === 0) return res.status(403).json({ message: "Nicht autorisiert" });

    await pool.query('DELETE FROM vehicles WHERE vehicle_id = ?', [vehicleId]);
    res.json({ message: "Fahrzeug entfernt." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Nur meine eigenen Autos laden (Verbessert: Nutzt jetzt die View für alle Details)
exports.getMyVehicles = async (req, res) => {
  try {
    const userId = req.user.id;
    // Wir nutzen die View, filtern aber nach user_id
    const [rows] = await pool.query(`
      SELECT * FROM view_vehicle_details 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 9. Fahrzeug aktualisieren
exports.updateVehicle = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const vehicleId = req.params.id;
    const userId = req.user.id;

    // 1. Prüfen ob Auto dem User gehört
    const [check] = await connection.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = ? AND user_id = ?', [vehicleId, userId]);
    if (check.length === 0) {
      await connection.rollback();
      return res.status(403).json({ message: "Nicht autorisiert" });
    }

    const { 
      // Basis
      model_id, fuel_type_id, year_of_manufacture, mileage_km, description, swap_preference,
      body_type, doors, seats, has_sliding_door,
      // Technik
      transmission, power_hp, engine_displacement, cylinders, weight_kg, drive_type,
      // Umwelt
      fuel_consumption, tank_volume, emission_class, emission_sticker, hu_valid_until,
      // Farbe & Innen
      exterior_color, interior_color, interior_material, airbags, climate_control,
      // Features
      feature_ids 
    } = req.body;

    const val = (v) => (v === '' || v === 'undefined' || v === 'null' ? null : v);
    const boolVal = (v) => (v === 'true' || v === '1' || v === 'on' ? 1 : 0);

    // 2. Hauptdaten Update
    const updateSql = `
      UPDATE vehicles SET 
        model_id=?, fuel_type_id=?, year_of_manufacture=?, mileage_km=?, description=?, swap_preference=?,
        body_type=?, doors=?, seats=?, has_sliding_door=?,
        transmission=?, power_hp=?, engine_displacement=?, cylinders=?, weight_kg=?, drive_type=?,
        fuel_consumption=?, tank_volume=?, emission_class=?, emission_sticker=?, hu_valid_until=?,
        exterior_color=?, interior_color=?, interior_material=?, airbags=?, climate_control=?
      WHERE vehicle_id=?
    `;

    const params = [
      val(model_id), val(fuel_type_id), val(year_of_manufacture), val(mileage_km), description, swap_preference,
      val(body_type), val(doors), val(seats), boolVal(has_sliding_door),
      val(transmission), val(power_hp), val(engine_displacement), val(cylinders), val(weight_kg), val(drive_type),
      val(fuel_consumption), val(tank_volume), val(emission_class), val(emission_sticker), val(hu_valid_until),
      val(exterior_color), val(interior_color), val(interior_material), val(airbags), val(climate_control),
      vehicleId
    ];

    await connection.query(updateSql, params);

    // 3. Features aktualisieren (Alte löschen -> Neue rein)
    // Nur machen, wenn feature_ids im Request gesendet wurde
    if (feature_ids !== undefined) {
      await connection.query('DELETE FROM vehicle_features WHERE vehicle_id = ?', [vehicleId]);
      
      let featuresArray = [];
      if (Array.isArray(feature_ids)) featuresArray = feature_ids;
      else if (typeof feature_ids === 'string') featuresArray = feature_ids.split(',').filter(x => x);

      if (featuresArray.length > 0) {
        const featureValues = featuresArray.map(fid => [vehicleId, fid]);
        await connection.query('INSERT INTO vehicle_features (vehicle_id, feature_id) VALUES ?', [featureValues]);
      }
    }

    // 4. Neue Bilder hinzufügen (optional)
    if (req.files && req.files.length > 0) {
      // Höchste sort_order herausfinden, damit neue Bilder hinten angehängt werden
      const [sortRows] = await connection.query('SELECT MAX(sort_order) as maxOrder FROM vehicle_images WHERE vehicle_id = ?', [vehicleId]);
      let nextOrder = (sortRows[0].maxOrder || 0) + 1;

      const imageValues = req.files.map((file, index) => [
        vehicleId, 
        `/uploads/${file.filename}`,
        0, // Nicht primary (das bleibt das alte Bild)
        nextOrder + index
      ]);

      await connection.query('INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, sort_order) VALUES ?', [imageValues]);
    }

    await connection.commit();
    res.json({ message: 'Fahrzeug erfolgreich aktualisiert!' });

  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// 10. Einzelnes Bild löschen (für Bearbeitungs-Modus)
exports.deleteVehicleImage = async (req, res) => {
  const { id, imageId } = req.params; // id = vehicle_id (wird nur für Auth-Check genutzt)
  const userId = req.user.id;

  try {
    // Check ownership via vehicle table joining image table would be cleaner, but two steps is safer for logic
    const [check] = await pool.query(`
      SELECT vi.image_url 
      FROM vehicle_images vi
      JOIN vehicles v ON vi.vehicle_id = v.vehicle_id
      WHERE vi.image_id = ? AND v.user_id = ?
    `, [imageId, userId]);

    if (check.length === 0) return res.status(403).json({ message: "Nicht erlaubt oder Bild existiert nicht." });

    // Aus DB löschen
    await pool.query('DELETE FROM vehicle_images WHERE image_id = ?', [imageId]);
    
    // Optional: Datei vom Server löschen (fs.unlink), lassen wir für MVP erstmal weg
    
    res.json({ message: "Bild entfernt" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};