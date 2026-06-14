# Les types supportés par SQLite

SQLite est un peu spécial : il utilise un typage dynamique. Cela veut dire que le type est surtout lié à la valeur stockée, pas strictement à la colonne. SQLite utilise principalement 5 classes de stockage : NULL, INTEGER, REAL, TEXT, BLOB. Il utilise aussi des affinités de colonnes : TEXT, NUMERIC, INTEGER, REAL, BLOB

| Type SQLite | Utilisation                             |
| ----------- | --------------------------------------- |
| `NULL`      | valeur vide                             |
| `INTEGER`   | nombre entier                           |
| `REAL`      | nombre décimal                          |
| `TEXT`      | texte                                   |
| `BLOB`      | données binaires : image, fichier, etc. |


## les types comme BOOLEAN, DATE, VARCHAR

SQLite les accepte souvent, mais il les transforme selon son système d’affinité.

| Type déclaré         | Comportement SQLite                                     |
| -------------------- | ------------------------------------------------------- |
| `BOOLEAN`            | souvent stocké comme `0` ou `1`                         |
| `DATE`, `DATETIME`   | souvent stocké comme `TEXT`, par exemple `"2026-06-14"` |
| `VARCHAR(100)`       | traité comme `TEXT`                                     |
| `DECIMAL`, `NUMERIC` | affinité `NUMERIC`                                      |
| `FLOAT`, `DOUBLE`    | affinité `REAL`                                         |

# Les opérations possibles avec SQLite
## 1. Créer une table

```
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    is_deleted INTEGER DEFAULT 0
);
```
## 2. Ajouter des données
```
INSERT INTO users (username, email, is_deleted)
VALUES ('Noah', 'noah@example.com', 0);
```

## 3. Lire des données
```
SELECT *
FROM users;
```

### Avec condition :
```
SELECT *
FROM users
WHERE is_deleted = 0;
```

### Avec recherche texte :
```
SELECT *
FROM users
WHERE username LIKE '%no%';
```

## 4. Modifier des données
```
UPDATE users
SET username = 'Miarintsoa'
WHERE id = 1;
```

### Exemple pour faire une suppression logique :
```
UPDATE users
SET is_deleted = 1
WHERE id = 1;
```
## 5. Supprimer des données
```
DELETE FROM users
WHERE id = 1;
```

## 6. Trier les résultats
```
SELECT *
FROM users
ORDER BY username ASC;
```

### Ou décroissant :
```
SELECT *
FROM users
ORDER BY id DESC;
```

## 7. Limiter le nombre de résultats
```
SELECT *
FROM users
LIMIT 10;
```

### Avec pagination :
```
SELECT *
FROM users
LIMIT 10 OFFSET 20;
```

## 8. Compter des lignes
```
SELECT COUNT(*)
FROM users;
```

## 9. Grouper des données
```
SELECT is_deleted, COUNT(*) AS total
FROM users
GROUP BY is_deleted;
```

## 10. Faire une jointure
```
SELECT users.username, orders.total
FROM users
JOIN orders ON orders.user_id = users.id;
```

## 11. Créer un index
Un index sert à accélérer les recherches.
```
CREATE INDEX idx_users_username
ON users(username);
```
Pour une recherche fréquente sur label_mg, tu peux faire :
```
CREATE INDEX idx_kanban_settings_label_mg
ON kanban_settings(label_mg);
```
Mais attention : un LIKE '%ov%' avec % au début utilise moins bien l’index.

## 12. Modifier une table
### Ajouter une colonne :
```
ALTER TABLE users
ADD COLUMN phone TEXT;
```
### Renommer une table :
```
ALTER TABLE users
RENAME TO app_users;
```

## 13. Supprimer une table
```
DROP TABLE users;
```

## 14. Utiliser une transaction
```
BEGIN TRANSACTION;

INSERT INTO users (username, email)
VALUES ('Test', 'test@example.com');

UPDATE users
SET is_deleted = 0
WHERE email = 'test@example.com';

COMMIT;
```
Si problème :
```
ROLLBACK;
```

## mettre valeur par defaut date
"DEFAULT CURRENT_TIMESTAMP"

## valeur avec ces classes de stockage et valeurs avec les affinité colonnes

### SQLite stocke réellement les valeurs avec ces classes de stockage :

NULL
INTEGER
REAL
TEXT
BLOB

### Les affinités de colonnes sont :

TEXT
NUMERIC
INTEGER
REAL
BLOB

### pour verifier le vrai type: 
Pour vérifier le vrai type stocké, tu peux utiliser typeof()
SELECT
    typeof(a),
    typeof(b),
    typeof(c),
    typeof(d)
FROM test;

## remarque 
comme SQLite les accepte en table normale, mais il les ramène à son système d’affinité, Par exemple, VARCHAR(255) devient en pratique une colonne à affinité TEXT, et SQLite n’impose pas automatiquement la limite de 255 caractères, c’est mieux d’utiliser les noms simples de SQLite :
```
INTEGER
REAL
TEXT
BLOB
```

Donc au lieu de :
```
name VARCHAR(100)
```
fais :
```
name TEXT CHECK(length(name) <= 100)
```

Au lieu de :
```
is_deleted BOOLEAN
```
fais :
```
is_deleted INTEGER DEFAULT 0 CHECK(is_deleted IN (0, 1))
```

Au lieu de :
```
created_at DATE
```
fais :
```
created_at TEXT
```

en gros, SQLite dit clairement que le type déclaré d’une colonne sert surtout à déterminer son affinité, et que le type réel est attaché à la valeur stockée, pas strictement à la colonne.

```
Dans une table STRICT, SQLite impose des règles plus strictes. Les types autorisés sont notamment INT, INTEGER, REAL, TEXT, BLOB et ANY.
```

## Requête SQLite pour supprimer une table
```
DROP TABLE IF EXISTS user_test;
``` 

## renommer une colonne
```
ALTER TABLE nom_table
RENAME COLUMN ancien_nom TO nouveau_nom;
```

# nommage de colonne
## Convention conseillée

Utilise le style snake_case