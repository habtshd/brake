CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_details TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created_at
ON contact_messages(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_email
ON contact_messages(email);

CREATE TABLE IF NOT EXISTS contact_rate_limits (
  ip TEXT PRIMARY KEY,
  window_start TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1
);

