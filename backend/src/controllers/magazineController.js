const pool = require('../config/db');

// --- HELPER FUNKTIONEN ---

/**
 * Erstellt einen SEO-freundlichen Slug aus einem Titel.
 * Berücksichtigt deutsche Umlaute und entfernt gängige Stoppwörter.
 */
const createSlug = (text) => {
  const stopWords = ['und', 'oder', 'der', 'die', 'das', 'ein', 'eine', 'mit', 'fuer', 'von'];
  let slug = text.toString().toLowerCase().trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[\s\W-]+/g, '-'); // Alles, was kein Buchstabe/Zahl ist, wird zu Bindestrich

  // Stoppwörter entfernen
  stopWords.forEach(word => {
    slug = slug.replace(new RegExp(`-${word}-`, 'g'), '-');
  });

  return slug.replace(/^-+|-+$/g, ''); // Bindestriche am Anfang/Ende entfernen
};

/**
 * Berechnet die voraussichtliche Lesezeit basierend auf 200 Wörtern pro Minute.
 */
const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text ? text.split(/\s+/).length : 0;
  return Math.ceil(wordCount / wordsPerMinute);
};

// --- CONTROLLER FUNKTIONEN ---

// 1. Alle Artikel laden
exports.getArticles = async (req, res) => {
  try {
    // Admin-Check: Wenn req.user existiert und Rolle admin ist
    const isAdmin = req.user && req.user.role === 'admin';

    let sql = `
      SELECT a.*, u.first_name, u.last_name 
      FROM articles a
      JOIN users u ON a.author_id = u.user_id
    `;

    // Wenn NICHT Admin, zeige nur veröffentlichte Artikel
    if (!isAdmin) {
      sql += " WHERE a.status = 'published'";
    }

    sql += ' ORDER BY a.created_at DESC';

    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Artikel via Slug laden (für die Frontend-Detailseite)
exports.getArticleBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT a.*, u.first_name, u.last_name 
      FROM articles a
      JOIN users u ON a.author_id = u.user_id
      WHERE a.slug = ?
    `, [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Artikel nicht gefunden" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Artikel erstellen (Admin)
exports.createArticle = async (req, res) => {
  const { 
    title, content, excerpt, teaser, category, image_url, 
    status, meta_title, meta_description, focus_keyword, 
    canonical_url, schema_type, show_toc 
  } = req.body;
  
  const authorId = req.user.id;
  const slug = createSlug(title);
  const readingTime = calculateReadingTime(content);
  
  // Falls Status 'published', setzen wir das Veröffentlichungsdatum auf jetzt
  const publishedAt = status === 'published' ? new Date() : null;

  try {
    const [result] = await pool.query(`
      INSERT INTO articles (
        author_id, title, slug, content, excerpt, teaser, category, image_url, 
        status, published_at, reading_time_minutes,
        meta_title, meta_description, focus_keyword, canonical_url, schema_type, show_toc
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        authorId, title, slug, content, excerpt, teaser, category, image_url,
        status || 'draft', publishedAt, readingTime,
        meta_title, meta_description, focus_keyword, canonical_url, schema_type, show_toc ? 1 : 0
      ]
    );
    
    res.status(201).json({ 
      message: "Artikel erfolgreich erstellt", 
      id: result.insertId, 
      slug 
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Ein Artikel mit diesem Titel/Slug existiert bereits." });
    }
    res.status(500).json({ error: err.message });
  }
};

// 4. Artikel updaten (Admin)
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const readingTime = calculateReadingTime(data.content);

  try {
    // Hinweis: Den Slug ändern wir beim Update meistens nicht, 
    // um bestehende Backlinks nicht zu zerstören (SEO Best Practice).
    await pool.query(`
      UPDATE articles SET 
        title=?, teaser=?, content=?, excerpt=?, category=?, image_url=?, 
        status=?, meta_title=?, meta_description=?, focus_keyword=?, 
        canonical_url=?, schema_type=?, show_toc=?, reading_time_minutes=?
      WHERE article_id=?`,
      [
        data.title, data.teaser, data.content, data.excerpt, data.category, data.image_url,
        data.status, data.meta_title, data.meta_description, data.focus_keyword,
        data.canonical_url, data.schema_type, data.show_toc ? 1 : 0, readingTime,
        id
      ]
    );
    
    res.json({ message: "Artikel erfolgreich aktualisiert" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Artikel laden für Editor (nach ID)
exports.getArticleById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE article_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Artikel nicht gefunden" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Artikel löschen (Admin)
exports.deleteArticle = async (req, res) => {
  try {
    await pool.query('DELETE FROM articles WHERE article_id = ?', [req.params.id]);
    res.json({ message: "Artikel erfolgreich gelöscht" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};