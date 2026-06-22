Oui. Comme ton projet utilise surtout **SQLite**, je te donne les fonctions SQL les plus utiles pour ton cas : `super_cost_1`, dates, regroupements, vérification de valeurs, etc.

---

# 1. Fonctions d’agrégation

Tu connais déjà sûrement :

```sql
AVG(cout)
SUM(cout)
MIN(cout)
MAX(cout)
COUNT(*)
```

Mais voici les usages pratiques.

## `SUM()` — somme

```sql
SELECT SUM(cout) AS total_cout
FROM super_cost_1
WHERE type_cout = 'cout_saisi';
```

Utile pour calculer le total des coûts saisis.

---

## `AVG()` — moyenne

```sql
SELECT AVG(cout) AS moyenne_cout
FROM super_cost_1
WHERE type_cout = 'cout_saisi';
```

Utile pour ton mode de réouverture `mode_reouverture = 3`.

---

## `MIN()` — minimum

```sql
SELECT MIN(cout) AS cout_min
FROM super_cost_1
WHERE type_cout = 'cout_saisi';
```

Utile si tu veux prendre le plus petit coût.

---

## `MAX()` — maximum

```sql
SELECT MAX(group_super_cost_1) AS dernier_groupe
FROM super_cost_1
WHERE id_ticket = 751
AND type_cout = 'cout_saisi';
```

Utile pour récupérer le dernier groupe d’import.

---

## `COUNT()` — compter les lignes

```sql
SELECT COUNT(*) AS nombre_lignes
FROM super_cost_1;
```

---

## `COUNT(DISTINCT ...)` — compter sans doublons

```sql
SELECT COUNT(DISTINCT id_item) AS nombre_items
FROM super_cost_1
WHERE id_ticket = 751;
```

Très utile pour savoir combien d’items différents sont liés à un ticket.

---

# 2. Fonctions pour gérer les valeurs nulles

## `COALESCE()`

`COALESCE` prend la première valeur non nulle.

```sql
SELECT 
    id,
    COALESCE(cout, 0) AS cout_corrige
FROM super_cost_1;
```

Si `cout` vaut `NULL`, alors SQLite retourne `0`.

Très utile dans les calculs :

```sql
SELECT 
    COALESCE(SUM(cout), 0) AS total
FROM super_cost_1
WHERE type_cout = 'reouverture';
```

Sans `COALESCE`, si aucune ligne n’existe, `SUM(cout)` peut retourner `NULL`.

---

## `IFNULL()`

C’est similaire à `COALESCE`, mais avec seulement deux valeurs.

```sql
SELECT IFNULL(cout, 0) AS cout_corrige
FROM super_cost_1;
```

Personnellement, je te conseille plutôt `COALESCE`, car c’est plus standard.

---

## `NULLIF()`

`NULLIF(a, b)` retourne `NULL` si `a = b`.

Exemple :

```sql
SELECT NULLIF(cout, 0) AS cout_sans_zero
FROM super_cost_1;
```

Si `cout = 0`, ça retourne `NULL`.

Utile parfois pour éviter une division par zéro :

```sql
SELECT 
    total / NULLIF(nombre_item, 0) AS moyenne
FROM une_table;
```

---

# 3. Fonctions de calcul numérique

## `ROUND()`

Arrondir une valeur.

```sql
SELECT ROUND(cout, 2) AS cout_arrondi
FROM super_cost_1;
```

Exemple :

```txt
47.175 → 47.18
```

Très utile pour tes coûts.

---

## `ABS()`

Valeur absolue.

```sql
SELECT ABS(cout - 100) AS ecart
FROM super_cost_1;
```

Utile pour vérifier l’écart entre une valeur attendue et une valeur réelle.

Exemple :

```sql
SELECT 
    id,
    cout,
    96 AS cout_attendu,
    ABS(cout - 96) AS ecart
FROM super_cost_1;
```

---

## `CAST()`

Convertir un type.

```sql
SELECT CAST(cout AS INTEGER) AS cout_entier
FROM super_cost_1;
```

Ou :

```sql
SELECT CAST(id_ticket AS TEXT) AS ticket_texte
FROM super_cost_1;
```

Très utile si tu compares un nombre avec du texte.

---

# 4. Fonctions de texte

## `LOWER()`

Mettre en minuscule.

```sql
SELECT LOWER(type_cout)
FROM super_cost_1;
```

Utile pour éviter les problèmes entre :

```txt
GLPI
glpi
Glpi
```

---

## `UPPER()`

Mettre en majuscule.

```sql
SELECT UPPER(category)
FROM super_cost_1;
```

---

## `TRIM()`

Supprimer les espaces au début et à la fin.

```sql
SELECT TRIM(category)
FROM super_cost_1;
```

Très utile si tu as des valeurs comme :

```txt
" Computer "
```

---

## `LENGTH()`

Longueur d’un texte.

```sql
SELECT LENGTH(category) AS longueur
FROM super_cost_1;
```

---

## `REPLACE()`

Remplacer du texte.

```sql
SELECT REPLACE(category, 'Computer', 'Ordinateur') AS categorie_fr
FROM super_cost_1;
```

---

## `SUBSTR()`

Extraire une partie d’un texte.

```sql
SELECT SUBSTR(created_at, 1, 10) AS date_seule
FROM super_cost_1;
```

Si `created_at` vaut :

```txt
2026-06-22 03:17:01
```

alors ça retourne :

```txt
2026-06-22
```

---

# 5. Fonctions de date très utiles en SQLite

Dans SQLite, les dates sont souvent stockées en `TEXT`, comme dans ton cas :

```txt
2026-06-22 03:17:01
```

ou :

```txt
2026-06-22T03:17:01.716Z
```

## `date()`

Récupérer seulement la date.

```sql
SELECT date(created_at) AS date_creation
FROM super_cost_1;
```

Résultat :

```txt
2026-06-22
```

---

## Filtrer une date précise

```sql
SELECT *
FROM super_cost_1
WHERE date(created_at) = '2026-06-22';
```

Ça récupère toutes les lignes créées le 22 juin 2026.

---

## `datetime()`

Manipuler une date complète avec heure.

```sql
SELECT datetime(created_at) AS date_complete
FROM super_cost_1;
```

---

## Entre deux dates avec `BETWEEN`

```sql
SELECT *
FROM super_cost_1
WHERE created_at BETWEEN '2026-06-01 00:00:00'
                     AND '2026-06-30 23:59:59';
```

Ça récupère les lignes créées entre le 1er et le 30 juin.

---

## Méthode plus propre pour une période

Je préfère souvent cette version :

```sql
SELECT *
FROM super_cost_1
WHERE created_at >= '2026-06-01 00:00:00'
AND created_at < '2026-07-01 00:00:00';
```

Pourquoi c’est mieux ? Parce que tu n’as pas besoin d’écrire `23:59:59`.

---

## `strftime()`

Extraire une partie d’une date.

### Année

```sql
SELECT strftime('%Y', created_at) AS annee
FROM super_cost_1;
```

Résultat :

```txt
2026
```

### Mois

```sql
SELECT strftime('%m', created_at) AS mois
FROM super_cost_1;
```

Résultat :

```txt
06
```

### Année-mois

```sql
SELECT strftime('%Y-%m', created_at) AS mois
FROM super_cost_1;
```

Résultat :

```txt
2026-06
```

Très utile pour faire des statistiques par mois :

```sql
SELECT 
    strftime('%Y-%m', created_at) AS mois,
    SUM(cout) AS total
FROM super_cost_1
GROUP BY strftime('%Y-%m', created_at);
```

---

## `julianday()`

Calculer une différence entre deux dates.

```sql
SELECT 
    id,
    julianday('now') - julianday(created_at) AS age_en_jours
FROM super_cost_1;
```

Ça te donne le nombre de jours entre `created_at` et aujourd’hui.

Exemple entre deux colonnes :

```sql
SELECT 
    julianday(date_fin) - julianday(date_debut) AS duree_jours
FROM une_table;
```

---

## `datetime('now')`

Date et heure actuelles.

```sql
SELECT datetime('now');
```

Attention : souvent, c’est en UTC.

---

## Les lignes des 7 derniers jours

```sql
SELECT *
FROM super_cost_1
WHERE datetime(created_at) >= datetime('now', '-7 days');
```

---

## Les lignes du mois courant

```sql
SELECT *
FROM super_cost_1
WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now');
```

---

# 6. Conditions très utiles

## `BETWEEN`

Pour les nombres :

```sql
SELECT *
FROM super_cost_1
WHERE cout BETWEEN 50 AND 200;
```

Pour les dates :

```sql
SELECT *
FROM super_cost_1
WHERE created_at BETWEEN '2026-06-01' AND '2026-06-30';
```

---

## `IN`

Éviter plusieurs `OR`.

Au lieu de :

```sql
WHERE type_cout = 'glpi'
OR type_cout = 'cout_saisi'
OR type_cout = 'reouverture'
```

Tu peux faire :

```sql
WHERE type_cout IN ('glpi', 'cout_saisi', 'reouverture')
```

---

## `NOT IN`

Exclure certaines valeurs.

```sql
SELECT *
FROM super_cost_1
WHERE type_cout NOT IN ('glpi');
```

---

## `LIKE`

Recherche textuelle.

```sql
SELECT *
FROM super_cost_1
WHERE category LIKE '%Comp%';
```

Ça peut trouver :

```txt
Computer
```

---

## `IS NULL`

```sql
SELECT *
FROM super_cost_1
WHERE id_item IS NULL;
```

---

## `IS NOT NULL`

```sql
SELECT *
FROM super_cost_1
WHERE id_item IS NOT NULL;
```

---

# 7. `CASE WHEN` — très important

`CASE WHEN` permet de créer des conditions dans un `SELECT`.

Exemple :

```sql
SELECT 
    id,
    cout,
    CASE 
        WHEN cout = 0 THEN 'gratuit'
        WHEN cout < 100 THEN 'petit coût'
        ELSE 'gros coût'
    END AS categorie_cout
FROM super_cost_1;
```

---

## Très utile pour séparer les coûts

```sql
SELECT
    id_ticket,
    id_item,
    SUM(CASE WHEN type_cout = 'glpi' THEN cout ELSE 0 END) AS cout_glpi,
    SUM(CASE WHEN type_cout = 'cout_saisi' THEN cout ELSE 0 END) AS cout_saisi,
    SUM(CASE WHEN type_cout = 'reouverture' THEN cout ELSE 0 END) AS cout_reouverture
FROM super_cost_1
GROUP BY id_ticket, id_item;
```

Celle-ci est très utile pour ton projet.

Elle transforme ça :

```txt
id_ticket | id_item | type_cout    | cout
751       | 2000    | glpi         | 160.45
751       | 2000    | cout_saisi   | 96
751       | 2000    | reouverture  | 15.3
```

en ça :

```txt
id_ticket | id_item | cout_glpi | cout_saisi | cout_reouverture
751       | 2000    | 160.45    | 96         | 15.3
```

---

# 8. `GROUP_CONCAT()`

Très utile pour afficher plusieurs valeurs dans une seule colonne.

```sql
SELECT 
    id_ticket,
    GROUP_CONCAT(type_cout, ', ') AS types
FROM super_cost_1
GROUP BY id_ticket;
```

Résultat possible :

```txt
751 | glpi, cout_saisi, reouverture
752 | glpi, cout_saisi, reouverture
```

Tu peux aussi l’utiliser pour voir les items d’un ticket :

```sql
SELECT 
    id_ticket,
    GROUP_CONCAT(DISTINCT id_item) AS items
FROM super_cost_1
GROUP BY id_ticket;
```

---

# 9. `HAVING`

`WHERE` filtre les lignes avant regroupement.
`HAVING` filtre après `GROUP BY`.

Exemple :

```sql
SELECT 
    id_ticket,
    SUM(cout) AS total
FROM super_cost_1
GROUP BY id_ticket
HAVING SUM(cout) > 100;
```

Ça veut dire :

> Regroupe par ticket, calcule le total, puis garde seulement les tickets dont le total dépasse 100.

---

# 10. Fonctions de fenêtre : très utiles mais un peu avancées

## `ROW_NUMBER()`

Attribuer un numéro à chaque ligne dans un groupe.

Exemple : récupérer la dernière ligne par ticket et item.

```sql
SELECT *
FROM (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY id_ticket, id_item, type_cout
            ORDER BY group_super_cost_1 DESC
        ) AS rn
    FROM super_cost_1
)
WHERE rn = 1;
```

Ça veut dire :

```txt
Pour chaque groupe id_ticket + id_item + type_cout,
classe les lignes de la plus récente à la plus ancienne,
puis garde seulement la première.
```

Très utile pour éviter certaines sous-requêtes avec `MAX()`.

---

## `LAG()`

Comparer une ligne avec la ligne précédente.

```sql
SELECT
    id,
    id_ticket,
    type_cout,
    cout,
    LAG(cout) OVER (
        PARTITION BY id_ticket, id_item, type_cout
        ORDER BY created_at
    ) AS cout_precedent
FROM super_cost_1;
```

Utile pour voir l’évolution d’un coût.

---

## `LEAD()`

Comparer avec la ligne suivante.

```sql
SELECT
    id,
    cout,
    LEAD(cout) OVER (
        PARTITION BY id_ticket, id_item
        ORDER BY created_at
    ) AS cout_suivant
FROM super_cost_1;
```

---

# 11. Requêtes très utiles pour ton projet

## Total par ticket et item

```sql
SELECT
    id_ticket,
    id_item,
    category,
    SUM(CASE WHEN type_cout = 'glpi' THEN cout ELSE 0 END) AS cout_glpi,
    SUM(CASE WHEN type_cout = 'cout_saisi' THEN cout ELSE 0 END) AS cout_saisi,
    SUM(CASE WHEN type_cout = 'reouverture' THEN cout ELSE 0 END) AS cout_reouverture,
    SUM(cout) AS total
FROM super_cost_1
GROUP BY id_ticket, id_item, category;
```

---

## Total par catégorie

```sql
SELECT
    category,
    COUNT(DISTINCT id_ticket) AS nombre_ticket,
    COUNT(DISTINCT id_item) AS nombre_item,
    SUM(CASE WHEN type_cout = 'glpi' THEN cout ELSE 0 END) AS total_glpi,
    SUM(CASE WHEN type_cout = 'cout_saisi' THEN cout ELSE 0 END) AS total_cout_saisi,
    SUM(CASE WHEN type_cout = 'reouverture' THEN cout ELSE 0 END) AS total_reouverture,
    SUM(cout) AS total
FROM super_cost_1
GROUP BY category;
```

---

## Dernière ligne de chaque type de coût par ticket et item

```sql
SELECT *
FROM (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY id_ticket, id_item, type_cout
            ORDER BY group_super_cost_1 DESC, id DESC
        ) AS rn
    FROM super_cost_1
)
WHERE rn = 1;
```

Très utile pour récupérer :

```txt
dernier glpi
dernier cout_saisi
dernier reouverture
```

pour chaque item.

---

## Vérifier les coûts créés aujourd’hui

```sql
SELECT *
FROM super_cost_1
WHERE date(created_at) = date('now');
```

---

## Vérifier les coûts entre deux dates

```sql
SELECT *
FROM super_cost_1
WHERE created_at >= '2026-06-01 00:00:00'
AND created_at < '2026-07-01 00:00:00';
```

---

# 12. Les fonctions que tu devrais vraiment retenir

Pour ton niveau actuel et ton projet, retiens surtout :

```sql
SUM()
AVG()
MIN()
MAX()
COUNT()
COUNT(DISTINCT ...)
COALESCE()
ROUND()
ABS()
CAST()
date()
datetime()
strftime()
julianday()
CASE WHEN
GROUP_CONCAT()
ROW_NUMBER()
LAG()
```

Et côté conditions :

```sql
BETWEEN
IN
NOT IN
LIKE
IS NULL
IS NOT NULL
HAVING
```

Si tu maîtrises déjà ça, tu peux faire beaucoup de requêtes propres pour vérifier ton import, tes coûts GLPI, tes réouvertures et tes scénarios.
