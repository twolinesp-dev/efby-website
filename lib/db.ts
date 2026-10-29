import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database path resolution supporting local development & Vercel serverless functions
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL_ENV);
const dbDir = isServerless ? '/tmp' : path.join(process.cwd(), 'data');

try {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
} catch (e) {
  console.warn('Directory check/creation warning:', e);
}

const dbPath = path.join(dbDir, 'efby.db');

// In serverless environments, copy seed database from repository to writable /tmp
if (isServerless) {
  try {
    const seedDbPath = path.join(process.cwd(), 'data', 'efby.db');
    if (fs.existsSync(seedDbPath) && !fs.existsSync(dbPath)) {
      fs.copyFileSync(seedDbPath, dbPath);
    }
  } catch (e) {
    console.warn('Failed to copy seed db to /tmp, will initialize freshly:', e);
  }
}

// Initialize better-sqlite3
const sqlite = new Database(dbPath);
try {
  sqlite.pragma('journal_mode = WAL');
} catch (_) {
  try { sqlite.pragma('journal_mode = DELETE'); } catch (_) {}
}
try {
  sqlite.pragma('foreign_keys = ON');
} catch (_) {}

// Initialize Schema
export function initDatabase() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      cover_image TEXT,
      display_order INTEGER DEFAULT 0,
      is_hidden INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      article_number TEXT UNIQUE NOT NULL,
      model_name TEXT,
      slug TEXT UNIQUE NOT NULL,
      primary_collection_id TEXT,
      short_description TEXT,
      full_description TEXT,
      main_image TEXT NOT NULL,
      publication_status TEXT DEFAULT 'published', -- 'draft', 'published', 'archived'
      trending INTEGER DEFAULT 0,
      new_arrival INTEGER DEFAULT 0,
      launch_date TEXT,
      featured INTEGER DEFAULT 0,
      display_price INTEGER DEFAULT 0,
      price REAL,
      sale_price REAL,
      availability TEXT DEFAULT 'In Stock',
      materials TEXT,
      dimensions TEXT,
      capacity TEXT,
      weight TEXT,
      compartments TEXT,
      features TEXT,
      display_order INTEGER DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (primary_collection_id) REFERENCES collections(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_articles_article_number ON articles(article_number);
    CREATE INDEX IF NOT EXISTS idx_articles_collection ON articles(primary_collection_id);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_trending ON articles(trending);
    CREATE INDEX IF NOT EXISTS idx_articles_new_arrival ON articles(new_arrival);

    CREATE TABLE IF NOT EXISTS article_collection_memberships (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      collection_id TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(article_id, collection_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS article_images (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      caption TEXT,
      display_order INTEGER DEFAULT 0,
      colour_name TEXT,
      is_primary INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS article_colours (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      name TEXT NOT NULL,
      hex_code TEXT NOT NULL,
      secondary_hex TEXT,
      display_order INTEGER DEFAULT 0,
      is_available INTEGER DEFAULT 1,
      image_url TEXT,
      UNIQUE(article_id, name),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      article_id TEXT,
      article_number TEXT NOT NULL,
      model_name TEXT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      selected_colour TEXT,
      message TEXT,
      status TEXT DEFAULT 'new', -- 'new', 'contacted', 'in_discussion', 'resolved', 'archived'
      admin_notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      description TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS homepage_sections (
      id TEXT PRIMARY KEY,
      section_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      is_enabled INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      content_json TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Safe migration for existing SQLite databases
  try {
    sqlite.exec(`ALTER TABLE article_colours ADD COLUMN image_url TEXT;`);
  } catch (err) {
    // Column already exists, safe to ignore
  }

  try {
    sqlite.exec(`ALTER TABLE article_colours ADD COLUMN secondary_hex TEXT;`);
  } catch (err) {
    // Column already exists, safe to ignore
  }
}

// Auto-run schema initialization
try {
  initDatabase();
} catch (e) {
  console.warn('initDatabase notice:', e);
}

export default sqlite;
