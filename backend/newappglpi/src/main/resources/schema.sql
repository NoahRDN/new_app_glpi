CREATE TABLE IF NOT EXISTS local_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  glpi_user_id INTEGER NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE IF NOT EXISTS kanban_settings (
  column_key TEXT PRIMARY KEY,
  label_mg TEXT NOT NULL,
  background_color TEXT NOT NULL,
  display_order INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS super_cost (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_ticket INTEGER NOT NULL,
  cout_saisi REAL NOT NULL,
  cout_glpi REAL NOT NULL,
  id_item INTEGER,
  category TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE IF NOT EXISTS super_cost_1 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_ticket INTEGER NOT NULL,
  type_cout TEXT NOT NULL CHECK(type_cout IN ("cout_saisi", "reouverture", "glpi")),
  cout REAL NOT NULL,
  id_item INTEGER,
  category TEXT,
  group_super_cost_1 TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE IF NOT EXISTS user_test (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL CHECK(length(nom) <= 100),
  prenom TEXT NOT NULL CHECK(length(prenom) <= 100),
  date_de_naissance TEXT NOT NULL,
  favorite_number INT NOT NULL,
  date_add TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_update TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_deleted INTEGER NOT NULL DEFAULT 0 CHECK(is_deleted IN (0, 1))
) STRICT;

INSERT OR IGNORE INTO kanban_settings (column_key, label_mg, background_color, display_order)
VALUES
  ('new', 'Vaovao', '#cdd4f8', 1),
  ('in_progress', 'Efa manao', '#f8cddc', 2),
  ('done', 'Vita', '#cdf8d6', 3);

