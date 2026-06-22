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
  mode_reouverture INTEGER NOT NULL DEFAULT 0,
  pourcentage REAL NOT NULL DEFAULT 0,
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

CREATE TABLE tickets_test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_test(id)
);

INSERT OR IGNORE INTO kanban_settings (column_key, label_mg, background_color, display_order)
VALUES
  ('new', 'Vaovao', '#cdd4f8', 1),
  ('in_progress', 'Efa manao', '#f8cddc', 2),
  ('done', 'Vita', '#cdf8d6', 3);


INSERT INTO user_test (
  id,
  nom,
  prenom,
  date_de_naissance,
  favorite_number,
  date_add,
  date_update,
  is_deleted
) VALUES
(1, 'Rakoto', 'Noah', '2004-03-12', 7, '2026-06-15T10:21:26.199Z', '2026-06-15T10:21:26.199Z', 0),
(2, 'Rabe', 'Mialy', '2003-11-05', 14, '2026-06-15T10:25:10.100Z', '2026-06-15T10:25:10.100Z', 0),
(3, 'Andrianina', 'Fitia', '2002-07-22', 21, '2026-06-15T10:30:45.250Z', '2026-06-15T10:30:45.250Z', 0),
(4, 'Rasolonirina', 'Tiana', '2001-01-18', 3, '2026-06-16T08:12:30.000Z', '2026-06-16T08:12:30.000Z', 0),
(5, 'Randriamampianina', 'Hery', '2000-09-09', 10, '2026-06-16T09:40:12.500Z', '2026-06-16T09:40:12.500Z', 1),
(6, 'Ratsimbazafy', 'Sarah', '2005-05-30', 18, '2026-06-17T13:15:00.000Z', '2026-06-17T13:15:00.000Z', 0);

-- Données tickets
INSERT INTO tickets_test (
  id,
  title,
  user_id,
  created_at
) VALUES
(1, 'Problème de connexion au compte', 1, '2026-06-15T11:00:00.000Z'),
(2, 'Erreur lors de la création utilisateur', 1, '2026-06-15T11:20:15.300Z'),
(3, 'Demande de réinitialisation du mot de passe', 2, '2026-06-15T12:05:40.000Z'),
(4, 'Problème d’affichage du tableau de bord', 3, '2026-06-16T08:45:10.150Z'),
(5, 'Ticket supprimé par erreur', 5, '2026-06-16T10:30:00.000Z'),
(6, 'Ajout d’un nouveau champ dans le formulaire', 4, '2026-06-17T09:10:25.750Z'),
(7, 'Erreur serveur lors de la sauvegarde', 2, '2026-06-17T14:22:11.900Z'),
(8, 'Amélioration de la recherche utilisateur', 6, '2026-06-18T07:55:05.000Z'),
(9, 'Filtre par date non fonctionnel', 3, '2026-06-18T15:35:48.450Z'),
(10, 'Demande de test de jointure SQL', 1, '2026-06-19T10:00:00.000Z');
