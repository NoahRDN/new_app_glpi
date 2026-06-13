# SQLite - Guide pratique pour NewApp GLPI

## Installation de SQLite sous Ubuntu

```bash
sudo apt update
sudo apt install sqlite3
```

### Vérification

```bash
sqlite3 --version
```

## Ouvrir la base

```bash
sqlite3 backend/data/new_app_glpi.sqlite
```

ou

```bash
sqlite3 ../data/new_app_glpi.sqlite
```

## Commandes utiles

```sql
.tables
.schema
.schema kanban_settings
.headers on
.mode column
.quit
```

## Voir les données

```sql
SELECT * FROM kanban_settings;
SELECT * FROM local_notes;
```

## Modifier les paramètres Kanban

```sql
UPDATE kanban_settings
SET label_mg = 'Vaovao'
WHERE column_key = 'new';
```

```sql
UPDATE kanban_settings
SET background_color = '#ffcc00'
WHERE column_key = 'new';
```

## Recherche

```sql
SELECT *
FROM local_notes
WHERE note LIKE '%GLPI%';
```

## Comptage

```sql
SELECT COUNT(*) FROM kanban_settings;
SELECT COUNT(*) FROM local_notes;
```

## Pagination

```sql
SELECT * FROM local_notes LIMIT 10;
SELECT * FROM local_notes LIMIT 10 OFFSET 10;
```

## Sauvegarde

```bash
sqlite3 backend/data/new_app_glpi.sqlite ".backup backup.sqlite"
```

## Vérification intégrité

```sql
PRAGMA integrity_check;
```

Résultat attendu :

```text
ok
```

## Informations de table

```sql
PRAGMA table_info(kanban_settings);
PRAGMA foreign_key_list(kanban_settings);
.indexes
```

## Optimisation

```sql
VACUUM;
```

## Diagnostic rapide

```sql
.tables
.schema local_notes
SELECT COUNT(*) FROM local_notes;
SELECT * FROM local_notes ORDER BY id DESC LIMIT 5;
PRAGMA integrity_check;
.timer on
```

## Version SQLite

```sql
SELECT sqlite_version();
```
