## Comment lire filter

Dans Swagger, le champ filter attend une requête RSQL.

Ça veut dire :

champ opérateur valeur

Exemples :

name==*PC*
serial==*123*
otherserial==*INV*
date_creation>=2026-01-01T00:00:00Z

Donc si tu veux chercher dans le nom, tu dois écrire dans Swagger :

name==*O*

sans guillemets.

Pas :

"O"

Pas :

"0"

Pas seulement :

O

## Que faire si GLPI n’accepte pas certains champs ?

Tu as 4 solutions.

Solution A — Filtrer côté GLPI seulement les champs acceptés

Par exemple :

name
serial
otherserial
date_creation

Et tu gardes les autres filtres pour plus tard.

Solution B — Pour les objets liés, filtrer par ID

Au lieu de :

manufacturer.name==*Dell*

tu peux tester :

manufacturer.id==4

ou selon GLPI peut-être :

manufacturer==4

Il faut tester dans Swagger.

Solution C — Filtrer côté frontend sur la page actuelle

Tu récupères une page de 20 lignes, puis tu filtres manufacturer.name, status.name, location.name côté React.

Limite : ça filtre seulement la page actuelle.

Solution D — Faire un backend NewApp qui filtre

C’est la solution propre si GLPI ne permet pas ce que tu veux.

Architecture :

React
→ Backend NewApp
→ GLPI
→ Backend filtre / complète / cache
→ React reçoit une vraie page filtrée

Avec ton projet, c’est cohérent parce que tu dois aussi utiliser SQLite plus tard. Tu pourrais synchroniser certaines données GLPI dans SQLite et faire des filtres avancés côté NewApp.

## Rôle des paramètres Swagger

### filter

C’est le filtre RSQL.

Exemples :

id==1
name==PC-TEST-01
serial==ABC123
date_creation>=2026-01-01T00:00:00Z

À tester selon ce que GLPI accepte.

### start

C’est l’index du premier élément à retourner.

Exemple avec limit=20 :

start=0   → éléments 0 à 19
start=20  → éléments 20 à 39
start=40  → éléments 40 à 59

Dans ton code :

const start = page * limit;

Donc :

page 0, limit 20 → start 0
page 1, limit 20 → start 20
page 2, limit 20 → start 40
### limit

C’est le nombre maximum d’éléments à retourner.

Exemples :

limit=5
limit=20
limit=100

Si tu fais :

start=0&limit=20

GLPI retourne au maximum 20 ordinateurs.

### sort

C’est le tri.

Exemples possibles :

name:asc
name:desc
date_creation:desc

Pour plusieurs tris :

status.name:asc,name:asc

Mais, comme pour filter, il faut tester quels champs GLPI accepte réellement.

### GLPI-Entity

C’est l’entité GLPI à utiliser.

Exemple :

GLPI-Entity: 0

Si tu ne le mets pas, GLPI utilise l’entité par défaut de l’utilisateur connecté.

### GLPI-Profile

C’est le profil GLPI à utiliser.

Si l’utilisateur a plusieurs profils, ce header peut préciser lequel utiliser.

### GLPI-Entity-Recursive

Permet d’inclure les sous-entités.

Exemple :

### GLPI-Entity-Recursive: true

Ça veut dire :

Cherche aussi dans les entités enfants.
Accept-Language

### Langue de réponse.

Exemple :

Accept-Language: fr_FR

ou :

Accept-Language: en_GB

Ça peut changer certains libellés ou messages d’erreur.

## Que faire si GLPI ne supporte pas name==*O*

Tu as plusieurs options.

### La première est de faire une recherche exacte côté GLPI :

name==PC-TEST-01

C’est limité, mais fiable si GLPI l’accepte.

### La deuxième est de filtrer côté GLPI sur les champs qui marchent vraiment, par exemple :

id==1
status.id==2
manufacturer.id==4
date_creation>=2026-01-01T00:00:00Z

à condition que ces champs soient acceptés par GLPI.

### La troisième est de garder une recherche frontend sur la page actuelle pour les champs que GLPI ne sait pas filtrer.

### La quatrième, plus propre pour ton projet final, est de passer par ton backend NewApp avec SQLite :

React → Backend NewApp → SQLite / GLPI

Là, tu pourras faire des filtres avancés comme :

nom contient
fabricant contient
date entre deux valeurs
statut
utilisateur

sans dépendre entièrement des limites du filtre GLPI.

## Si je veux faire “contient” avec un nombre ?

Pour un champ numérique comme :

id

tu ne peux normalement pas faire :

id==*1*

Parce que id est un nombre, pas du texte.

Pour les nombres, tu utilises plutôt :

id==1
id>10
id>=10
id<100
id<=100

ou parfois une liste : (celui ci fonctionne dont ça a été déja tester)

id=in=(1,10,21)

si GLPI accepte cette syntaxe.