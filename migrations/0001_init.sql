CREATE TABLE pins (
  code TEXT PRIMARY KEY,        -- stored uppercase, format XXXX-XXXX
  created_at INTEGER NOT NULL,  -- unix ms
  used_at INTEGER,              -- null until redeemed
  note TEXT                     -- owner label, e.g. customer name
);

CREATE TABLE premium_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  images TEXT NOT NULL,         -- JSON array of R2 keys
  sizes TEXT,                   -- JSON array or null
  sold_out INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE attempts (
  ip TEXT NOT NULL,
  kind TEXT NOT NULL,           -- 'pin', 'admin', 'order'
  at INTEGER NOT NULL
);
CREATE INDEX idx_attempts ON attempts(ip, kind, at);
