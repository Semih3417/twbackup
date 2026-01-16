const mysql = require('mysql2/promise');
require('dotenv').config(); // Lädt Variablen aus der .env Datei

// Erstelle den Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tauschwagen_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste die Verbindung beim Start
pool.getConnection()
  .then(conn => {
    console.log('✅ Datenbank-Verbindung erfolgreich hergestellt!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Fehler bei der Datenbank-Verbindung:', err.message);
  });

module.exports = pool;