# Filtres avec WHERE dans SQLite

La clause `WHERE` sert à filtrer les lignes retournées par une requête.

## Filtrer par égalité

```sql
SELECT *
FROM users
WHERE is_deleted = 0;
```

Cela retourne seulement les utilisateurs non supprimés.

## Filtrer avec différent de

```sql
SELECT *
FROM users
WHERE is_deleted != 1;
```

Ou :

```sql
SELECT *
FROM users
WHERE is_deleted <> 1;
```

## Filtrer avec plusieurs conditions

```sql
SELECT *
FROM users
WHERE is_deleted = 0
  AND username = 'Noah';
```

Ici, les deux conditions doivent être vraies.

## Filtrer avec OR

```sql
SELECT *
FROM users
WHERE username = 'Noah'
   OR username = 'Miarintsoa';
```

Ici, au moins une condition doit être vraie.

## Filtrer avec IN

`IN` permet de vérifier si une valeur fait partie d’une liste.

```sql
SELECT *
FROM users
WHERE id IN (1, 2, 3);
```

Exemple avec du texte :

```sql
SELECT *
FROM tickets
WHERE status IN ('new', 'processing', 'closed');
```

## Filtrer avec NOT IN

```sql
SELECT *
FROM tickets
WHERE status NOT IN ('closed', 'deleted');
```

## Filtrer avec LIKE

`LIKE` sert à faire une recherche approximative dans du texte.

```sql
SELECT *
FROM users
WHERE username LIKE '%no%';
```

Cela cherche les usernames qui contiennent `no`.

Exemples :

```sql
-- Commence par "no"
SELECT *
FROM users
WHERE username LIKE 'no%';

-- Termine par "ah"
SELECT *
FROM users
WHERE username LIKE '%ah';

-- Contient "fitia"
SELECT *
FROM users
WHERE username LIKE '%fitia%';
```

Attention : avec `%` au début, par exemple `LIKE '%no%'`, SQLite utilise moins bien les index.

## Filtrer les valeurs NULL

Pour vérifier une valeur vide `NULL`, il ne faut pas utiliser `= NULL`.

Mauvais :

```sql
SELECT *
FROM users
WHERE email = NULL;
```

Correct :

```sql
SELECT *
FROM users
WHERE email IS NULL;
```

Et pour vérifier que ce n’est pas `NULL` :

```sql
SELECT *
FROM users
WHERE email IS NOT NULL;
```

## Filtrer avec BETWEEN

`BETWEEN` permet de filtrer entre deux valeurs.

```sql
SELECT *
FROM super_cost_1
WHERE cout BETWEEN 10000 AND 50000;
```

Cela veut dire :

```sql
cout >= 10000 AND cout <= 50000
```

Attention : `BETWEEN` inclut les deux limites.

# Filtrer par date dans SQLite

SQLite n’a pas un vrai type `DATE` strict comme PostgreSQL ou MySQL. Le plus simple est de stocker les dates en `TEXT` avec un format ISO :

```txt
YYYY-MM-DD
```

ou :

```txt
YYYY-MM-DD HH:MM:SS
```

Exemple :

```sql
created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
```

## Filtrer une date exacte

Si la colonne contient seulement une date comme `2026-06-14` :

```sql
SELECT *
FROM tickets
WHERE created_at = '2026-06-14';
```

## Filtrer les données après une date

```sql
SELECT *
FROM tickets
WHERE created_at >= '2026-06-01';
```

## Filtrer les données avant une date

```sql
SELECT *
FROM tickets
WHERE created_at < '2026-07-01';
```

## Filtrer entre deux dates

```sql
SELECT *
FROM tickets
WHERE created_at >= '2026-06-01'
  AND created_at < '2026-07-01';
```

Cette écriture est souvent meilleure que `BETWEEN` quand la colonne contient aussi l’heure.

## Filtrer une journée complète avec une colonne DATETIME

Si `created_at` contient une date + heure, par exemple :

```txt
2026-06-14 15:30:00
```

Alors il vaut mieux faire :

```sql
SELECT *
FROM tickets
WHERE created_at >= '2026-06-14 00:00:00'
  AND created_at < '2026-06-15 00:00:00';
```

Cela récupère toute la journée du 14 juin.

## Filtrer avec la date actuelle

```sql
SELECT *
FROM tickets
WHERE created_at >= date('now');
```

Pour les 7 derniers jours :

```sql
SELECT *
FROM tickets
WHERE created_at >= datetime('now', '-7 days');
```

Pour le mois actuel :

```sql
SELECT *
FROM tickets
WHERE created_at >= date('now', 'start of month');
```

## Filtrer par année

```sql
SELECT *
FROM tickets
WHERE strftime('%Y', created_at) = '2026';
```

## Filtrer par mois

```sql
SELECT *
FROM tickets
WHERE strftime('%Y-%m', created_at) = '2026-06';
```

Attention : utiliser `strftime()` sur une colonne peut empêcher SQLite d’utiliser correctement un index. Pour de meilleures performances, il vaut souvent mieux faire :

```sql
SELECT *
FROM tickets
WHERE created_at >= '2026-06-01'
  AND created_at < '2026-07-01';
```

# Jointures avec JOIN

Une jointure sert à récupérer des données venant de plusieurs tables liées entre elles.

Exemple de tables :

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL
);

CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Ici, `tickets.user_id` fait référence à `users.id`.

## INNER JOIN

`INNER JOIN` retourne seulement les lignes qui ont une correspondance dans les deux tables.

```sql
SELECT
    tickets.id,
    tickets.title,
    users.username
FROM tickets
INNER JOIN users ON users.id = tickets.user_id;
```

Résultat possible :

```txt
id | title                  | username
1  | Problème imprimante     | Noah
2  | Problème réseau         | Miarintsoa
```

## JOIN simple

En SQLite, écrire `JOIN` revient généralement à faire un `INNER JOIN`.

```sql
SELECT
    tickets.id,
    tickets.title,
    users.username
FROM tickets
JOIN users ON users.id = tickets.user_id;
```

## Utiliser des alias

Les alias rendent la requête plus courte.

```sql
SELECT
    t.id,
    t.title,
    u.username
FROM tickets AS t
JOIN users AS u ON u.id = t.user_id;
```

On peut aussi écrire sans `AS` :

```sql
SELECT
    t.id,
    t.title,
    u.username
FROM tickets t
JOIN users u ON u.id = t.user_id;
```

## JOIN avec filtre

```sql
SELECT
    t.id,
    t.title,
    u.username,
    t.created_at
FROM tickets t
JOIN users u ON u.id = t.user_id
WHERE u.username = 'Noah';
```

## JOIN avec filtre de date

```sql
SELECT
    t.id,
    t.title,
    u.username,
    t.created_at
FROM tickets t
JOIN users u ON u.id = t.user_id
WHERE t.created_at >= '2026-06-01'
  AND t.created_at < '2026-07-01';
```

Cette requête retourne les tickets créés pendant le mois de juin 2026.

## LEFT JOIN

`LEFT JOIN` retourne toutes les lignes de la table de gauche, même s’il n’y a pas de correspondance dans la table de droite.

Exemple :

```sql
SELECT
    u.id,
    u.username,
    t.title
FROM users u
LEFT JOIN tickets t ON t.user_id = u.id;
```

Cette requête retourne tous les utilisateurs, même ceux qui n’ont aucun ticket.

Si un utilisateur n’a aucun ticket, les colonnes venant de `tickets` seront `NULL`.

## Trouver les utilisateurs qui n’ont aucun ticket

```sql
SELECT
    u.id,
    u.username
FROM users u
LEFT JOIN tickets t ON t.user_id = u.id
WHERE t.id IS NULL;
```

## Attention avec LEFT JOIN et WHERE

Cette requête peut transformer le `LEFT JOIN` en comportement proche d’un `INNER JOIN` :

```sql
SELECT
    u.id,
    u.username,
    t.title
FROM users u
LEFT JOIN tickets t ON t.user_id = u.id
WHERE t.status = 'open';
```

Pourquoi ? Parce que si un utilisateur n’a pas de ticket, `t.status` vaut `NULL`, donc la condition `t.status = 'open'` échoue.

Pour garder tous les utilisateurs, il vaut mieux mettre le filtre dans le `ON` :

```sql
SELECT
    u.id,
    u.username,
    t.title
FROM users u
LEFT JOIN tickets t
    ON t.user_id = u.id
   AND t.status = 'open';
```

# Jointure avec plusieurs tables

Exemple avec `users`, `tickets` et `super_cost_1`.

```sql
SELECT
    t.id AS ticket_id,
    t.title,
    u.username,
    sc.type_cout,
    sc.cout
FROM tickets t
JOIN users u ON u.id = t.user_id
LEFT JOIN super_cost_1 sc ON sc.id_ticket = t.id;
```

Cette requête retourne les tickets avec l’utilisateur associé et éventuellement les coûts liés.

# Jointure avec regroupement

## Compter le nombre de tickets par utilisateur

```sql
SELECT
    u.id,
    u.username,
    COUNT(t.id) AS total_tickets
FROM users u
LEFT JOIN tickets t ON t.user_id = u.id
GROUP BY u.id, u.username;
```

## Calculer le coût total par ticket

```sql
SELECT
    t.id AS ticket_id,
    t.title,
    SUM(sc.cout) AS total_cout
FROM tickets t
LEFT JOIN super_cost_1 sc ON sc.id_ticket = t.id
GROUP BY t.id, t.title;
```

## Calculer le coût total par utilisateur

```sql
SELECT
    u.id AS user_id,
    u.username,
    SUM(sc.cout) AS total_cout
FROM users u
JOIN tickets t ON t.user_id = u.id
LEFT JOIN super_cost_1 sc ON sc.id_ticket = t.id
GROUP BY u.id, u.username;
```

# Utiliser CASE WHEN

`CASE WHEN` fonctionne comme un `if / else` dans une requête SQL.

```sql
SELECT
    username,
    CASE
        WHEN is_deleted = 1 THEN 'Supprimé'
        ELSE 'Actif'
    END AS statut
FROM users;
```

## CASE WHEN avec plusieurs conditions

```sql
SELECT
    id,
    cout,
    CASE
        WHEN cout >= 100000 THEN 'Cher'
        WHEN cout >= 50000 THEN 'Moyen'
        ELSE 'Faible'
    END AS niveau_cout
FROM super_cost_1;
```

## CASE WHEN avec COUNT ou SUM

Compter les utilisateurs actifs et supprimés :

```sql
SELECT
    COUNT(*) AS total_users,
    SUM(CASE WHEN is_deleted = 0 THEN 1 ELSE 0 END) AS users_actifs,
    SUM(CASE WHEN is_deleted = 1 THEN 1 ELSE 0 END) AS users_supprimes
FROM users;
```

# Filtres utiles avec GROUP BY

## HAVING

`WHERE` filtre les lignes avant le regroupement.
`HAVING` filtre après le `GROUP BY`.

Exemple : récupérer seulement les utilisateurs qui ont plus de 3 tickets.

```sql
SELECT
    u.id,
    u.username,
    COUNT(t.id) AS total_tickets
FROM users u
JOIN tickets t ON t.user_id = u.id
GROUP BY u.id, u.username
HAVING COUNT(t.id) > 3;
```

## Exemple avec coût total supérieur à 100000

```sql
SELECT
    t.id AS ticket_id,
    t.title,
    SUM(sc.cout) AS total_cout
FROM tickets t
JOIN super_cost_1 sc ON sc.id_ticket = t.id
GROUP BY t.id, t.title
HAVING SUM(sc.cout) > 100000;
```

# Ordre logique d’une requête SQL

Même si on écrit la requête comme ça :

```sql
SELECT
    colonne
FROM table
JOIN autre_table ON condition
WHERE condition
GROUP BY colonne
HAVING condition
ORDER BY colonne
LIMIT nombre;
```

SQLite l’interprète plutôt dans cet ordre logique :

```txt
FROM
JOIN
WHERE
GROUP BY
HAVING
SELECT
ORDER BY
LIMIT
```

Donc :

* `WHERE` filtre avant le regroupement
* `HAVING` filtre après le regroupement
* `ORDER BY` trie le résultat final
* `LIMIT` limite le nombre de lignes retournées

# Exemple complet avec JOIN, filtre, date, GROUP BY et ORDER BY

```sql
SELECT
    u.username,
    COUNT(t.id) AS total_tickets,
    SUM(sc.cout) AS total_cout
FROM users u
JOIN tickets t ON t.user_id = u.id
LEFT JOIN super_cost_1 sc ON sc.id_ticket = t.id
WHERE t.created_at >= '2026-06-01'
  AND t.created_at < '2026-07-01'
  AND u.is_deleted = 0
GROUP BY u.id, u.username
HAVING COUNT(t.id) > 0
ORDER BY total_cout DESC
LIMIT 10;
```

Cette requête veut dire :

```txt
Récupérer les utilisateurs actifs,
avec leurs tickets du mois de juin 2026,
calculer le nombre de tickets,
calculer le coût total,
garder seulement ceux qui ont au moins un ticket,
trier par coût total décroissant,
et afficher seulement les 10 premiers.
```

# Index utiles pour les filtres et jointures

Les index peuvent accélérer les recherches, les filtres et les jointures.

## Index sur une clé étrangère

Si `tickets.user_id` est souvent utilisé dans des jointures :

```sql
CREATE INDEX idx_tickets_user_id
ON tickets(user_id);
```

## Index sur une date

Si tu filtres souvent par date :

```sql
CREATE INDEX idx_tickets_created_at
ON tickets(created_at);
```

## Index sur une colonne de suppression logique

```sql
CREATE INDEX idx_users_is_deleted
ON users(is_deleted);
```

## Index sur une colonne utilisée dans JOIN

```sql
CREATE INDEX idx_super_cost_1_id_ticket
ON super_cost_1(id_ticket);
```

# Convention de nommage SQL

## Tables

Utilise le style `snake_case`.

Exemples :

```txt
users
tickets
super_cost_1
kanban_settings
```

## Colonnes

Utilise aussi `snake_case`.

Exemples :

```txt
id
user_id
ticket_id
created_at
updated_at
is_deleted
type_cout
group_super_cost_1
```

## Index

Convention conseillée :

```txt
idx_nom_table_nom_colonne
```

Exemples :

```sql
CREATE INDEX idx_users_username
ON users(username);

CREATE INDEX idx_tickets_created_at
ON tickets(created_at);

CREATE INDEX idx_super_cost_1_id_ticket
ON super_cost_1(id_ticket);
```

## Clés étrangères

Convention conseillée :

```txt
nom_table_referencee_id
```

Exemples :

```txt
user_id
ticket_id
category_id
item_id
```

Évite les noms ambigus comme :

```txt
id_user
id_ticket
id_item
```

Même si `id_ticket` fonctionne, en SQL moderne on préfère souvent :

```txt
ticket_id
user_id
item_id
```
