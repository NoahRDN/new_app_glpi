Oui, je te remets tout dans l’ordre. Tu as **2 utilisations différentes** :

1. **Le CSV Feuille 6** sert à lancer les scénarios dans ton application.
2. **L’Excel de vérification** sert à contrôler si les résultats créés dans `super_cost_1` sont corrects.

Voici le fichier Excel à utiliser : [verification_scenarios_super_cost_feuille6.xlsx](sandbox:/mnt/data/verification_scenarios_super_cost_feuille6.xlsx)

---

## 1. Ce que représente ton CSV Feuille 6

Ton CSV contient ça :

```csv
Num_Ticket,mvt,valeur,mode_reouverture
1,"close",50,0
2,"close",150,0
1,"open",5,1
1,"close",46,0
1,"open",10,4
2,"open","10",3
2,"close","300",0
1,"close",0,0
1,"open",10,3
2,"open","7,5",4
2,"close","0",0
2,"open","10",3
```

C’est bien le fichier `public/import-eval/juin-2026/Import-data-juin-26 - Feuille 6.csv` dans ton commit.

Chaque ligne signifie :

```txt
Num_Ticket = référence du ticket
mvt = mouvement à appliquer
valeur = valeur du scénario
mode_reouverture = mode utilisé seulement pour open
```

---

## 2. Comment lire chaque type de mouvement

### `close`

Exemple :

```csv
1,"close",50,0
```

Ça veut dire :

> Fermer le ticket numéro 1 avec un coût saisi de 50.

Dans ton code, `close` appelle `closeChoice({ ticket, cout: coutCSV })`.

Puis `closeChoice` crée des lignes dans `super_cost_1` avec :

```ts
type_cout: "cout_saisi"
```

et le coût inséré est :

```txt
cout_saisi_final = valeur / nombre de catégories distinctes liées au ticket
```

Cette règle vient de ton code : `cout_saisi_final = cout / nombreCategoryTicketAssetLinks`.

Donc si le ticket 1 a 1 catégorie distincte :

```txt
valeur CSV = 50
nombre catégories = 1
cout_saisi créé = 50 / 1 = 50
```

Si le ticket a 2 catégories distinctes :

```txt
valeur CSV = 50
nombre catégories = 2
cout_saisi créé = 50 / 2 = 25 par item
```

---

### `open`

Exemple :

```csv
1,"open",5,1
```

Ça veut dire :

> Réouvrir le ticket 1 avec une augmentation de 5%, en utilisant le mode 1.

Dans ton code, `open` appelle :

```ts
reouverturChoice({
  ticket,
  cout: coutCSV,
  modeReouveture: modeReouveture
})
```

Puis `reouverturChoice` crée des lignes dans `super_cost_1` avec :

```ts
type_cout: "reouverture"
```

Le calcul est :

```txt
cout_reouverture = valeur_csv × base_du_mode / 100
```

La formule vient directement de cette ligne :

```ts
cout_saisi_final = cout * cout_saisi_final / 100
```

---

## 3. Les modes de réouverture dans ton code

Dans ton code, les modes sont comme ça :

```txt
mode 1 = dernier groupe de cout_saisi
mode 2 = premier groupe de cout_saisi
mode 3 = moyenne des cout_saisi
mode 4 = somme des cout_saisi
```

Plus précisément :

* mode `1` utilise `getSuperCost1ByIdTicket`, donc le dernier groupe `cout_saisi` ;
* mode `2` utilise `getSuperCost1ByIdTicketMin`, donc le premier groupe `cout_saisi` ;
* mode `3` utilise `getSuperCost1ByIdTicketMoyenne`, donc la moyenne ;
* mode `4` utilise `getSuperCost1ByIdTicketSomme`, donc la somme.

---

## 4. Comment utiliser l’Excel concrètement

Ouvre le fichier : [verification_scenarios_super_cost_feuille6.xlsx](sandbox:/mnt/data/verification_scenarios_super_cost_feuille6.xlsx)

Ensuite fais ça dans cet ordre.

### Étape 1 — Va dans `Scenarios_CSV`

Cette feuille contient déjà les 12 lignes de ton CSV Feuille 6.

Tu n’as normalement rien à modifier ici, sauf si tu changes le CSV.

---

### Étape 2 — Va dans `Tickets_Config`

C’est la feuille la plus importante.

Tu dois remplir les vraies informations de tes tickets.

Par exemple :

```txt
ticket 1 :
nombre de catégories distinctes = ?
nombre d’items = ?
cout_saisi initial = ?
cout_glpi initial = ?

ticket 2 :
nombre de catégories distinctes = ?
nombre d’items = ?
cout_saisi initial = ?
cout_glpi initial = ?
```

Si tu ne remplis pas correctement cette feuille, l’Excel calcule quand même, mais la vérification ne sera pas exacte.

---

### Étape 3 — Lance l’import dans ton application

Dans ton application, il faut importer les fichiers dans le bon ordre.

L’ordre conseillé :

```txt
1. Feuille 1 Assets
2. Feuille 2 Tickets
3. Feuille 3 Coûts GLPI
4. Feuille 6 Scénarios
```

Pourquoi ? Parce que la Feuille 6 dépend déjà des tickets existants. Ton code cherche le ticket avec :

```ts
getAllTickets({ name: "", external_id: idReferenceTicketStringCSV })
```

Donc `Num_Ticket = 1` doit correspondre à un ticket déjà créé avec cette référence externe.

---

### Étape 4 — Après import, exporte ou récupère la table `super_cost_1`

Après avoir lancé l’import Feuille 6, tu dois regarder le résultat réel dans ta table `super_cost_1`.

Tu peux récupérer les données via ton endpoint :

```txt
GET /api/user-cost-1
```

Ton backend retourne les colonnes :

```txt
id
id_ticket
type_cout
cout
id_item
category
group_super_cost_1
created_at
```

car ton contrôleur fait un `SELECT` sur ces champs.

---

### Étape 5 — Colle le résultat réel dans `SuperCost_Reel_Export`

Dans l’Excel, va dans la feuille :

```txt
SuperCost_Reel_Export
```

Puis colle les lignes réelles de ta table `super_cost_1`.

Cette feuille sert à comparer :

```txt
ce que ton code aurait dû créer
VS
ce que ton application a vraiment créé
```

---

### Étape 6 — Va dans `Simulation_Code`

Cette feuille simule ligne par ligne ce que ton CSV devrait produire.

Tu vas voir les mouvements :

```txt
ligne 1 : close ticket 1
ligne 2 : close ticket 2
ligne 3 : open ticket 1 mode 1
ligne 4 : close ticket 1
...
```

C’est cette feuille qui t’aide à comprendre l’évolution du coût après chaque scénario.

---

### Étape 7 — Va dans `Verification`

C’est là que tu regardes si tout est bon.

Tu dois comparer :

```txt
cout attendu
cout réel importé
écart
statut
```

Si le statut est :

```txt
OK
```

la ligne est correcte.

Si le statut est :

```txt
À vérifier
```

ça veut dire qu’il y a une différence entre le calcul attendu et ce qui est réellement dans `super_cost_1`.

---

## 5. Exemple avec tes premières lignes

### Ligne 1

```csv
1,"close",50,0
```

Ça crée du `cout_saisi`.

Si ticket 1 a 1 catégorie :

```txt
cout_saisi = 50 / 1 = 50
```

---

### Ligne 3

```csv
1,"open",5,1
```

Mode 1 = dernier `cout_saisi`.

Si le dernier `cout_saisi` du ticket 1 est 50 :

```txt
reouverture = 5 × 50 / 100 = 2,5
```

Donc l’application devrait créer une ligne :

```txt
type_cout = reouverture
cout = 2,5
```

---

### Ligne 5

```csv
1,"open",10,4
```

Mode 4 = somme des `cout_saisi`.

Si le ticket 1 a déjà des `cout_saisi` de :

```txt
50
46
```

alors :

```txt
somme = 96
reouverture = 10 × 96 / 100 = 9,6
```

---

## 6. Ce que tu dois faire maintenant, exactement

Fais seulement ça :

```txt
1. Télécharge l’Excel
2. Ouvre la feuille Tickets_Config
3. Mets les vraies infos des tickets 1 et 2
4. Lance l’import dans ton application
5. Récupère la table super_cost_1 après import
6. Colle le résultat dans SuperCost_Reel_Export
7. Regarde Verification et Synthese
```

Le point où tu es probablement bloqué, c’est **Tickets_Config**. C’est normal : l’Excel ne peut pas deviner automatiquement combien d’items/catégories sont liés à chaque ticket. Il faut que tu renseignes ces bases pour que les formules soient justes.
