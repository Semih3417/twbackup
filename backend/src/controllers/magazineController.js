const pool = require('../config/db');

// Helper: Text in URL umwandeln (z.B. "Hallo Welt" -> "hallo-welt")
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss') // Deutsche Umlaute
    .replace(/[\s\W-]+/g, '-') // Alles was kein Buchstabe ist wird Bindestrich
    .replace(/^-+|-+$/g, ''); // Bindestriche am Anfang/Ende weg
};

// 1. Alle Artikel laden (Admin sieht alle, Public sieht nur veröffentlichte)
exports.getArticles = async (req, res) => {
  try {
    // Prüfen ob Admin (wir schauen einfach ob User im Request ist und Rolle hat)
    // Achtung: Bei Public-Zugriff ist req.user undefined.
    const isAdmin = req.user && req.user.role === 'admin';
    
    let sql = `
      SELECT a.*, u.first_name, u.last_name 
      FROM articles a
      JOIN users u ON a.author_id = u.user_id
    `;
    
    // Wenn NICHT Admin, zeige nur veröffentlichte Artikel
    if (!isAdmin) {
      sql += ' WHERE a.is_published = TRUE';
    }
    
    sql += ' ORDER BY a.created_at DESC';
    
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Artikel für Detailseite laden (via Slug für SEO)
exports.getArticleBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT a.*, u.first_name, u.last_name 
      FROM articles a
      JOIN users u ON a.author_id = u.user_id
      WHERE a.slug = ?
    `, [slug]);

    if (rows.length === 0) return res.status(404).json({ message: "Artikel nicht gefunden" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Artikel erstellen (Nur Admin)
exports.createArticle = async (req, res) => {
  const { title, excerpt, content, category, image_url, is_published } = req.body;
  const authorId = req.user.id;
  
  // Automatisch SEO-URL generieren
  const slug = createSlug(title);

  try {
    const [result] = await pool.query(
      'INSERT INTO articles (author_id, title, slug, excerpt, content, image_url, category, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [authorId, title, slug, excerpt, content, image_url, category, is_published ? 1 : 0]
    );
    res.status(201).json({ message: "Artikel gespeichert", id: result.insertId, slug });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "Ein Artikel mit ähnlichem Titel existiert bereits." });
    }
    res.status(500).json({ error: err.message });
  }
};

// 4. Artikel löschen (Nur Admin)
exports.deleteArticle = async (req, res) => {
  try {
    await pool.query('DELETE FROM articles WHERE article_id = ?', [req.params.id]);
    res.json({ message: "Artikel gelöscht" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Artikel laden für Editor (nach ID)
exports.getArticleById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM articles WHERE article_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Nicht gefunden" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. Artikel updaten
exports.updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, excerpt, content, category, image_url, is_published } = req.body;
    // Slug aktualisieren wir hier NICHT automatisch, um kaputte Links zu vermeiden (SEO Best Practice)
    
    try {
        await pool.query(
            'UPDATE articles SET title=?, excerpt=?, content=?, image_url=?, category=?, is_published=? WHERE article_id=?',
            [title, excerpt, content, image_url, category, is_published ? 1 : 0, id]
        );
        res.json({ message: "Gespeichert" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};