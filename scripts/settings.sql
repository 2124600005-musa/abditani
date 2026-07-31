-- Settings table for persistent storage
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert defaults if not exists
INSERT INTO settings (key, value) VALUES
  ('site_name', 'AbdiTani'),
  ('tagline', 'Teknologi untuk Petani, Masa Depan untuk Negeri'),
  ('email', ''),
  ('phone', ''),
  ('address', ''),
  ('facebook', ''),
  ('instagram', ''),
  ('twitter', ''),
  ('seo_title', 'AbdiTani - Solusi Digital Pertanian'),
  ('seo_description', 'Platform digital pertanian Indonesia'),
  ('seo_keywords', 'pertanian, digital, indonesia, abditani')
ON CONFLICT (key) DO NOTHING;
