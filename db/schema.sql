-- D1 schema for bitcoinroatan.info (replaces the Lovable Cloud / Supabase tables)
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,               -- "<osm_type>-<osm_id>", e.g. node-10128670071
  name TEXT NOT NULL,
  category TEXT,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  opening_hours TEXT,
  payment_lightning INTEGER NOT NULL DEFAULT 0,
  payment_onchain INTEGER NOT NULL DEFAULT 0,
  osm_type TEXT,
  osm_id INTEGER,
  tags TEXT NOT NULL DEFAULT '{}',   -- JSON
  last_synced_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_places_category ON places (category);

CREATE TABLE IF NOT EXISTS email_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'bitcoinroatan.info',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- key/value state, e.g. btcmap_cursor (last BTCMap updated_at seen), btcmap_last_run
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
