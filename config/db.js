const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Use test database when NODE_ENV is 'test'
const isTestEnvironment = process.env.NODE_ENV === 'test';
const dbFile = isTestEnvironment 
  ? path.join(__dirname, 'anime_test.db')
  : path.join(__dirname, 'anime.db');

// Create or open the database
const db = new Database(dbFile);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
function initDatabase() {
  try {
    // Create anime table
    db.exec(`
      CREATE TABLE IF NOT EXISTS anime (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create characters table
    db.exec(`
      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        anime_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
      )
    `);

    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create ratings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        anime_id INTEGER NOT NULL,
        rating INTEGER CHECK (rating BETWEEN 1 AND 10),
        review TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
        UNIQUE (user_id, anime_id)
      )
    `);

    // Create favorites table
    db.exec(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        anime_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
        UNIQUE (user_id, anime_id)
      )
    `);

    // Create trigger for anime updated_at
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS anime_updated_at 
      AFTER UPDATE ON anime
      BEGIN
        UPDATE anime SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);

    // Create trigger for characters updated_at
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS characters_updated_at 
      AFTER UPDATE ON characters
      BEGIN
        UPDATE characters SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);

    // Create trigger for users updated_at
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS users_updated_at 
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);

    // Create trigger for ratings updated_at
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS ratings_updated_at 
      AFTER UPDATE ON ratings
      BEGIN
        UPDATE ratings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);

    console.log(`✅ Connected to SQLite database: ${dbFile}`);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
}

// Initialize on load
initDatabase();

// Create a MySQL-like query interface for compatibility
const queryInterface = {
  // SELECT queries
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const stmt = db.prepare(sql);
          const rows = params.length > 0 ? stmt.all(params) : stmt.all();
          resolve([rows]); // MySQL returns [rows, fields]
        } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
          const stmt = db.prepare(sql);
          const info = params.length > 0 ? stmt.run(params) : stmt.run();
          resolve([{ insertId: info.lastInsertRowid, affectedRows: info.changes }]);
        } else if (sql.trim().toUpperCase().startsWith('UPDATE') || 
                   sql.trim().toUpperCase().startsWith('DELETE')) {
          const stmt = db.prepare(sql);
          const info = params.length > 0 ? stmt.run(params) : stmt.run();
          resolve([{ affectedRows: info.changes }]);
        } else if (sql.trim().toUpperCase().startsWith('ALTER')) {
          // Ignore ALTER TABLE for AUTO_INCREMENT reset in tests
          resolve([{ affectedRows: 0 }]);
        } else {
          db.exec(sql);
          resolve([{ affectedRows: 0 }]);
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  // For getting a connection (compatibility)
  getConnection: async () => {
    return {
      query: queryInterface.query,
      release: () => {}
    };
  },

  // Close database
  end: () => {
    return new Promise((resolve) => {
      db.close();
      resolve();
    });
  }
};

module.exports = queryInterface;
