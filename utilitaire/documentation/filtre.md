## combiner GLPI + SQLite

C’est une très bonne idée.

Architecture recommandée :

React
→ Backend NewApp
→ SQLite pour les listes/recherches rapides
→ GLPI pour la donnée source et les actions officielles

Concrètement :

GLPI = source principale des données
SQLite = copie locale / index de recherche pour NewApp
React = interface utilisateur

Exemple de fonctionnement :

1. Ton backend récupère les computers depuis GLPI.
2. Il les stocke ou synchronise dans SQLite.
3. React demande la liste au backend NewApp.
4. Le backend filtre avec SQL.
5. Le backend renvoie une page propre à React.

Donc pour une recherche :

name contient "TEST"

ton backend peut faire :

SELECT *
FROM computers
WHERE LOWER(name) LIKE LOWER('%TEST%')
LIMIT 20 OFFSET 0;

Ça, GLPI V2 ne semble pas le faire avec name==*TEST*, mais SQLite le fera très bien.

## un système hybride 

Oui.

Tu peux faire :

GLPI pour les filtres exacts/officiels
SQLite pour les filtres avancés

Mais attention à un piège.

Mauvais hybride :

GLPI renvoie seulement page 1 avec 20 éléments
puis SQLite/frontend filtre ces 20 éléments

Ça ne fait pas une vraie recherche globale.

Meilleur hybride :

SQLite sert de moteur principal pour les listes filtrées
GLPI sert de source de vérité pour créer/modifier/supprimer

Donc pour l’affichage des listes dans React, je te conseille à terme :

React → Backend → SQLite

Et pour une action comme modifier un computer :

React → Backend → GLPI PATCH
                 → SQLite update ou resync

## Différence entre =like= et =ilike=

Dans ton GLPI, les deux font une recherche avec LIKE, mais pas exactement pareil.

### =like=
name=like=*o*

Recherche avec respect de la casse. Dans le code GLPI, =like= transforme * en %, puis utilise un LIKE avec un cast BINARY, ce qui rend la comparaison sensible à la casse.

Donc :

name=like=*o*

cherche un o minuscule.

Il peut trouver :

Ordinateur de Noah

car il y a un o minuscule dans Noah.

Mais il ne trouve pas forcément :

POSTE-001
POSTE-002
POSTE-003

parce que dans POSTE, le O est majuscule. Tes données montrent justement des noms POSTE-001, POSTE-002, etc., et aussi Ordinateur de Noah.

### =ilike=
name=ilike=*o*

Recherche sans vraiment tenir compte de la casse. Dans le code GLPI, =ilike= transforme aussi * en %, mais il n’utilise pas le cast BINARY.

Donc :

name=ilike=*o*

peut trouver :

Ordinateur de Noah
POSTE-001
POSTE-002
POSTE-003
...

car o minuscule peut correspondre à O majuscule.

Conclusion pratique

Pour une barre de recherche utilisateur, utilise plutôt :

name=ilike=*texte*

Donc dans ton code React :

return `name=ilike=*${query}*`;

ou mieux avec guillemets si le texte peut contenir des espaces :

return `name=ilike="*${query}*"`;
## Utilité des opérateurs GLPI/RSQL

Dans GLPI, les opérateurs sont définis dans src/Glpi/Api/HL/RSQL/Parser.php. Le parser transforme ensuite ces filtres en conditions SQL.

Dans GLPI, les opérateurs sont définis dans Parser.php. Par exemple :

==
!=
=in=
=out=
=lt=
=le=
=gt=
=ge=
=like=
=ilike=
=isnull=
=notnull=
=empty=
=notempty=
=notlike=
=notilike=

Voici les principaux.


### == égalité exacte
id==1
name==POSTE-001

Utilité : chercher une valeur exacte.

Exemples :

id==1

veut dire :

id = 1
name==POSTE-001

veut dire :

name = 'POSTE-001'

À utiliser pour :

id
nom exact
statut exact
valeur exacte

### != différent de
id!=1
name!=POSTE-001

Utilité : exclure une valeur.

Exemple :

id!=1

veut dire :

id <> 1

### =in= dans une liste
id=in=(1,2,3)

Utilité : chercher plusieurs valeurs possibles. GLPI transforme cet opérateur en condition de type IN (...).

Exemple :

id=in=(1,2)

veut dire :

id IN (1, 2)

Très utile pour les filtres avec cases cochées :

statut 1 OU statut 2 OU statut 3

### =out= pas dans une liste
id=out=(1,2,3)

Utilité : exclure plusieurs valeurs.

Exemple :

id=out=(1,2)

veut dire :

id NOT IN (1, 2)

### =lt= plus petit que
id=lt=10
date_creation=lt=2026-06-01T00:00:00Z

Utilité : inférieur à.

id=lt=10

veut dire :

id < 10

### =le= plus petit ou égal
id=le=10

veut dire :

id <= 10

### =gt= plus grand que
id=gt=10

veut dire :

id > 10

### =ge= plus grand ou égal
id=ge=10
date_creation=ge=2026-06-01T00:00:00Z

veut dire :

id >= 10

Pour les dates, tu peux faire par exemple :

date_creation=ge=2026-06-01T00:00:00Z

### =like= contient, sensible à la casse
name=like=*o*
serial=like=*GLPI*

Utilité : recherche partielle, mais sensible à la casse.

Exemples :

name=like=*POSTE*

trouve les noms qui contiennent exactement POSTE.

Mais :

name=like=*poste*

peut ne pas trouver POSTE-001, parce que poste est en minuscule.

### =ilike= contient, moins sensible à la casse
name=ilike=*poste*
serial=ilike=*glpi*

Utilité : recherche partielle plus adaptée à l’utilisateur.

Exemple :

name=ilike=*poste*

peut trouver :

POSTE-001
POSTE-002
POSTE-003

C’est celui que je te conseille pour la recherche texte.

### =isnull= valeur nulle
status=isnull=
manufacturer=isnull=

Utilité : trouver les champs qui valent null.

Exemple :

status=isnull=

veut dire :

status IS NULL

Cet opérateur n’attend pas de valeur après. Dans le code GLPI, =isnull= a value_expected => false.

### =notnull= valeur non nulle
status=notnull=
manufacturer=notnull=

Utilité : trouver les champs qui ne sont pas null.

Exemple :

manufacturer=notnull=

veut dire :

manufacturer IS NOT NULL

### =empty= vide ou nul
serial=empty=
comment=empty=

Utilité : trouver les champs qui sont soit :

chaîne vide ""
ou
null

Dans GLPI, =empty= cherche '' ou null.

Exemple :

serial=empty=

trouve les ordinateurs sans numéro de série.

### =notempty= pas vide
serial=notempty=
comment=notempty=

Utilité : trouver les champs renseignés.

Exemple :

serial=notempty=

trouve les ordinateurs qui ont un numéro de série.

### =notlike= ne contient pas, sensible à la casse
name=notlike=*TEST*

Utilité : exclure les textes qui contiennent une valeur précise, avec respect de la casse.

Exemple :

name=notlike=*TEST*

veut dire :

nom ne contient pas TEST

### =notilike= ne contient pas, moins sensible à la casse
name=notilike=*test*

Utilité : exclure une valeur sans se soucier de majuscule/minuscule.

Exemple :

name=notilike=*poste*

peut exclure :

POSTE-001
poste-test
Poste bureau
