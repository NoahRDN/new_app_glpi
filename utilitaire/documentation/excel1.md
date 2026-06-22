Tu es perdue parce qu’il y a **2 choses différentes** :

```txt
1. Le CSV Feuille 6
   → sert à faire l’import dans ton application.

2. Le fichier Excel
   → sert seulement à vérifier si le résultat obtenu est correct.
```

Donc **tu n’utilises pas le CSV comme résultat final**. Le CSV est juste une liste d’actions à appliquer sur les tickets.

---

## 1. Ton CSV Feuille 6 sert à quoi ?

Ton fichier :

```csv
Num_Ticket,mvt,valeur,mode_reouverture
1,"close",50,0
2,"close",150,0
1,"open",5,1
...
```

sert à dire à ton application :

```txt
Ticket 1 → close avec valeur 50
Ticket 2 → close avec valeur 150
Ticket 1 → open avec 5%, mode 1
etc.
```

Ton profil d’import reconnaît ce fichier parce qu’il attend exactement les colonnes `Num_Ticket`, `mvt`, `valeur`, `mode_reouverture`. Ensuite, il transforme `valeur` et `mode_reouverture` en nombres.

---

## 2. Ordre exact à suivre dans ton application

Tu dois importer les fichiers dans cet ordre :

```txt
1. Feuille 1 Assets
2. Feuille 2 Tickets
3. Feuille 3 Coûts GLPI
4. Feuille 6 Scénarios
```

La **Feuille 6 doit venir après**, parce qu’elle cherche des tickets déjà créés avec `Num_Ticket`. Dans ton code, le scénario cherche le ticket avec `external_id`, puis applique `close`, `cancel` ou `open`.

---

## 3. Concrètement, dans ton app

Tu vas dans ta page d’import, puis tu sélectionnes :

```txt
Import-data-juin-26 - Feuille 6.csv
```

Ensuite tu lances l’import.

Ton application va lire chaque ligne :

```txt
close → crée du cout_saisi
open  → crée de la reouverture
cancel → supprime le dernier cout_saisi
```

Dans ton code, `close` crée des lignes `type_cout: "cout_saisi"`.
Et `open` crée des lignes `type_cout: "reouverture"` selon le mode 1, 2, 3 ou 4.

---

## 4. Le fichier Excel sert à quoi alors ?

Le fichier Excel ne sert pas à importer.

Il sert à répondre à cette question :

```txt
Après l’import, est-ce que les valeurs affichées par mon app sont correctes ?
```

Télécharge et utilise cette version : [verification_scenarios_super_cost_feuille6_resultats_app.xlsx](sandbox:/mnt/data/verification_scenarios_super_cost_feuille6_resultats_app.xlsx)

---

## 5. Comment utiliser l’Excel, étape par étape

### Étape A — Ouvre la feuille `Scenarios_CSV`

Cette feuille contient déjà ton CSV Feuille 6.

Tu ne touches pas à cette feuille sauf si tu modifies le CSV.

---

### Étape B — Ouvre la feuille `Tickets_Config`

C’est la feuille à remplir si les calculs ne correspondent pas.

Tu dois vérifier les infos comme :

```txt
Ticket 1 : nombre de catégories distinctes
Ticket 2 : nombre de catégories distinctes
Nombre d’items liés
Valeurs initiales éventuelles
```

Si tu ne connais pas encore ces valeurs, ce n’est pas grave : tu peux d’abord passer à l’étape suivante.

---

### Étape C — Importe ton CSV dans l’application

Dans ton application :

```txt
1. importe Feuille 1
2. importe Feuille 2
3. importe Feuille 3
4. importe Feuille 6
```

Après ça, tu vas voir les tableaux comme dans tes captures :

```txt
Computer : total GLPI, total super cost, total réouverture, total
Monitor  : total GLPI, total super cost, total réouverture, total
```

---

### Étape D — Va dans Excel, feuille `Capture_App_Reel`

Cette feuille sert à copier les résultats visibles dans ton application.

D’après tes captures, j’ai déjà mis :

```txt
Computer :
total GLPI = 160.45
total super cost = 321
total réouverture = 47.175
total = 528.625

Monitor :
total GLPI = 0
total super cost = 225
total réouverture = 31.875
total = 256.875
```

Donc si ton app affiche encore ces valeurs, tu n’as rien à changer.

---

### Étape E — Va dans `Controle_App_Apres`

C’est la feuille la plus importante.

Elle compare :

```txt
résultat attendu par Excel
VS
résultat réel affiché par ton app
```

Tu regardes la colonne `Statut`.

Si c’est :

```txt
OK
```

la valeur est bonne.

Si c’est :

```txt
À vérifier
```

ça veut dire que le résultat de ton app ne correspond pas au calcul attendu.

---

## 6. Résumé ultra simple

Fais exactement ça :

```txt
1. Dans ton application, importe les fichiers dans l’ordre :
   Feuille 1 → Feuille 2 → Feuille 3 → Feuille 6

2. Regarde les résultats dans la page Cost Local & GLPI 1

3. Ouvre l’Excel

4. Va dans Capture_App_Reel

5. Vérifie que les valeurs sont les mêmes que dans ton app

6. Va dans Controle_App_Apres

7. Regarde si c’est OK ou À vérifier
```

Le CSV est donc **l’entrée du test**.
L’Excel est **le contrôleur du test**.
