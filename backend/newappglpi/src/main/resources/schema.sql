CREATE TABLE IF NOT EXISTS local_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  glpi_user_id INTEGER NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kanban_settings (
  column_key TEXT PRIMARY KEY,
  label_mg TEXT NOT NULL,
  background_color TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_cost (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  montant TEXT NOT NULL,
  id_ticket TEXT NOT NULL
);

INSERT OR IGNORE INTO kanban_settings (column_key, label_mg, background_color, display_order)
VALUES
  ('new', 'Vaovao', '#cdd4f8', 1),
  ('in_progress', 'Efa manao', '#f8cddc', 2),
  ('done', 'Vita', '#cdf8d6', 3);
