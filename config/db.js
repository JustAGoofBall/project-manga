/**
 * Database setup.
 *
 * WHAT DATABASE IS THIS?
 * SQLite, via better-sqlite3. The whole database is a single file on disk,
 * so there is no server to install or start - handy for a project like this.
 *
 * WHY DOES THE CODE AT THE BOTTOM LOOK LIKE MySQL?
 * The models were originally written against the mysql2 library, which is
 * async and returns results as `[rows, fields]`. better-sqlite3 is neither:
 * it is synchronous and returns rows directly. Rather than rewrite every
 * model, the `queryInterface` at the bottom of this file makes SQLite LOOK
 * like mysql2, so `const [rows] = await db.query(...)` keeps working.
 *
 * That shim is the one genuinely tricky part of this project. If you ever
 * move to a real MySQL server, you delete the shim and export the mysql2
 * pool instead - the models do not have to change.
 */

const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Tests get their own database file so running them never touches real data.
// Jest sets NODE_ENV to 'test' automatically.
const isTestEnvironment = process.env.NODE_ENV === 'test';
const dbFile = isTestEnvironment
  ? path.join(__dirname, 'anime_test.db')
  : path.join(__dirname, 'anime.db');

// Creates the file if it does not exist yet.
const db = new Database(dbFile);

// SQLite ignores foreign keys unless you ask for them. Without this,
// ON DELETE CASCADE below would silently do nothing.
db.pragma('foreign_keys = ON');

/**
 * Create every table and trigger, if they are not already there.
 *
 * This runs on every startup. `IF NOT EXISTS` makes that safe to repeat -
 * it means you never have to run a separate setup step by hand.
 */
function initDatabase() {
  try {
    // ---- anime: the top-level thing everything else hangs off ----
    db.exec(`
      CREATE TABLE IF NOT EXISTS anime (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ---- characters: each one belongs to exactly one anime ----
    // ON DELETE CASCADE: deleting an anime deletes its characters too.
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

    // ---- users ----
    // Only the bcrypt hash is stored, never the password itself.
    // is_admin is 1 or 0, because SQLite has no boolean type.
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Mini-migration for databases created before is_admin existed.
    // CREATE TABLE IF NOT EXISTS above will not add a column to a table
    // that is already there, so older files need this one-off patch.
    // It throws "duplicate column" on every later startup, which is expected.
    try {
      db.exec('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0');
    } catch (error) {
      // Column already exists - nothing to do.
    }

    // ---- ratings: one score per user per anime ----
    // The UNIQUE at the end is what stops someone rating the same anime twice.
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

    // ---- favorites: just a link between a user and an anime ----
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

    // ---- keep updated_at honest ----
    // SQLite will not refresh updated_at on its own, so one trigger per
    // table does it whenever a row changes.
    for (const table of ['anime', 'characters', 'users', 'ratings']) {
      db.exec(`
        CREATE TRIGGER IF NOT EXISTS ${table}_updated_at
        AFTER UPDATE ON ${table}
        BEGIN
          UPDATE ${table} SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
      `);
    }

    console.log(`Connected to SQLite database: ${dbFile}`);
  } catch (error) {
    console.error('Database initialization failed:', error.message);
  }
}

initDatabase();

/**
 * The mysql2-shaped wrapper described at the top of this file.
 *
 * Models call `const [rows] = await db.query(sql, params)`.
 * The first word of the SQL decides what shape to hand back, matching
 * what mysql2 would have returned:
 *
 *   SELECT  -> [rows]
 *   INSERT  -> [{ insertId, affectedRows }]
 *   UPDATE  -> [{ affectedRows }]
 *   DELETE  -> [{ affectedRows }]
 */
const queryInterface = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        const command = sql.trim().toUpperCase();
        const statement = db.prepare(sql);

        if (command.startsWith('SELECT')) {
          // mysql2 resolves to [rows, fields]; only rows is ever used.
          resolve([params.length > 0 ? statement.all(params) : statement.all()]);
          return;
        }

        if (command.startsWith('INSERT')) {
          const info = params.length > 0 ? statement.run(params) : statement.run();
          resolve([{ insertId: info.lastInsertRowid, affectedRows: info.changes }]);
          return;
        }

        if (command.startsWith('UPDATE') || command.startsWith('DELETE')) {
          const info = params.length > 0 ? statement.run(params) : statement.run();
          resolve([{ affectedRows: info.changes }]);
          return;
        }

        // ALTER TABLE ... AUTO_INCREMENT is MySQL-only syntax that some test
        // helpers still send. SQLite has no equivalent, so ignore it.
        if (command.startsWith('ALTER')) {
          resolve([{ affectedRows: 0 }]);
          return;
        }

        // Anything else (CREATE, PRAGMA, ...) just runs.
        db.exec(sql);
        resolve([{ affectedRows: 0 }]);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Kept so code written for a mysql2 connection pool still works.
  getConnection: async () => ({
    query: queryInterface.query,
    release: () => {}
  }),

  // Called by the tests in afterAll() to release the database file.
  end: () => {
    return new Promise((resolve) => {
      db.close();
      resolve();
    });
  }
};

module.exports = queryInterface;
