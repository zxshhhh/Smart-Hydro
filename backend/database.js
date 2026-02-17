const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./smart_hydro.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      moisture REAL,
      temperature REAL,
      humidity REAL,
      waterUsage REAL DEFAULT 0,
      lastWatered TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS system_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      totalWaterUsage REAL DEFAULT 0,
      conservationScore REAL DEFAULT 100
    )
  `);
});

module.exports = db;
