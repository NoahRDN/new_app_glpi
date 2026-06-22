Oui. Le fichier Excel sert à faire une **vérification après import**. Il ne remplace pas ton application et il ne remplace pas SQLite. Il sert surtout à répondre à cette question :

```txt
Après avoir importé Feuille 6, est-ce que les valeurs cout_saisi, reouverture et cout_glpi affichées par l’application sont correctes ?
```

Le fichier à utiliser est celui-ci : [verification_scenarios_super_cost_feuille6_resultats_app.xlsx](sandbox:/mnt/data/verification_scenarios_super_cost_feuille6_resultats_app.xlsx)

---

## 1. Fonctionnement général de l’Excel

L’Excel est organisé comme un test en 3 parties :

```txt
1. Entrée du test
   → Scenarios_CSV

2. Simulation / résultat attendu
   → Simulation_Code
   → Resultat_App_Apres
   → Detail_App_Apres

3. Comparaison avec ton application
   → Capture_App_Reel
   → Controle_App_Apres
```

Donc tu dois voir l’Excel comme un **outil de contrôle**, pas comme un fichier à importer.

---

# 2. Feuille `Scenarios_CSV`

Cette feuille contient les lignes de ton fichier :

```csv
Num_Ticket,mvt,valeur,mode_reouverture
1,"close",50,0
2,"close",150,0
1,"open",5,1
...
```

Elle représente les scénarios à appliquer.

Chaque ligne veut dire :

```txt
close → créer un cout_saisi
open  → créer une reouverture
cancel → supprimer le dernier cout_saisi
```

Dans ton code, `traitementImportScenarioTicket` appelle `closeChoice` si `mvt = close`, `deleteSuperCost1CoutSaisi` si `mvt = cancel`, et `reouverturChoice` si `mvt = open`.

Tu ne modifies cette feuille que si tu modifies le CSV Feuille 6.

---

# 3. Feuille `Tickets_Config`

C’est une feuille de configuration.

Elle sert à dire à Excel :

```txt
Pour chaque ticket, combien de catégories ?
Combien d’items ?
Y avait-il déjà des cout_saisi avant Feuille 6 ?
Quel est le cout_glpi attendu ?
```

Par exemple, pour le ticket `1`, tu as des colonnes comme :

```txt
Num_Ticket
id_ticket_GLPI
nb_categories_distinctes
nb_items_liés
initial_first_cout_saisi
initial_latest_cout_saisi
initial_sum_cout_saisi
initial_count_cout_saisi
cout_glpi_total_ticket
cout_glpi_par_item_attendu
```

Cette feuille est importante parce que dans ton code, pour `close`, le coût est divisé par le nombre de catégories distinctes :

```txt
cout_saisi_final = valeur / nombre de catégories distinctes
```

Cette règle vient de ton `closeChoice`.

Donc si la configuration est fausse, la simulation peut être fausse.

---

# 4. Feuille `Simulation_Code`

C’est la feuille qui simule les 12 lignes du CSV.

Elle calcule ligne par ligne :

```txt
latest_avant
first_avant
sum_avant
count_avant
avg_avant
base_retenue
cout_saisi_attendu
reouverture_attendue
cout_attendu
type_cout_attendu
statut_ticket_attendu
```

Exemple simple :

```txt
Ligne 1 : ticket 1 close 50
→ cout_saisi_attendu = 50 / nb_categories
```

Puis :

```txt
Ligne 3 : ticket 1 open 5 mode 1
→ mode 1 = dernier cout_saisi
→ reouverture = 5 × dernier_cout_saisi / 100
```

Dans ton code, `reouverturChoice` prend une base selon le mode, puis calcule :

```ts
cout_saisi_final = cout * cout_saisi_final / 100
```

Ensuite il insère une ligne avec :

```ts
type_cout: "reouverture"
```

Dans cette feuille, les colonnes vers la droite servent à garder l’état interne des tickets après chaque scénario :

```txt
T1_latest_après
T1_first_après
T1_sum_après
T1_count_après

T2_latest_après
T2_first_après
T2_sum_après
T2_count_après
```

Donc Excel “se souvient” des coûts précédents pour pouvoir calculer les prochaines réouvertures.

---

# 5. Feuille `Resultat_App_Apres`

Cette feuille donne le résumé final attendu par catégorie.

Par exemple :

```txt
Computer
- Total GLPI
- Total Super Cout
- Total Réouverture
- Total final

Monitor
- Total GLPI
- Total Super Cout
- Total Réouverture
- Total final
```

C’est fait pour comparer avec ton tableau dans l’application.

Dans la version actuelle, cette feuille reprend les valeurs visibles dans tes captures :

```txt
Computer : total = 528.625
Monitor  : total = 256.875
```

---

# 6. Feuille `Detail_App_Apres`

Cette feuille donne le détail par ligne, comme dans ton tableau détaillé de l’application.

Exemple :

```txt
Computer | ticket 752 | item 2000 | GLPI 0 | Super Cost 225 | Reouverture 31.875 | Total 256.875
Computer | ticket 751 | item 2000 | GLPI 160.45 | Super Cost 96 | Reouverture 15.3 | Total 271.75
Monitor  | ticket 752 | item 221  | GLPI 0 | Super Cost 225 | Reouverture 31.875 | Total 256.875
```

Cette feuille est utile si le résumé global est correct mais qu’une ligne précise ne correspond pas.

---

# 7. Feuille `Capture_App_Reel`

C’est ici que tu copies les valeurs réelles affichées par ton application.

Si ton application affiche les mêmes valeurs que dans mes captures, tu ne touches rien.

Mais si tu relances l’import et que les valeurs changent, tu dois remplacer les valeurs dans cette feuille.

Par exemple, si ton application affiche maintenant :

```txt
Computer total GLPI = 170
Computer total Super Cost = 321
Computer total Réouverture = 47.175
```

tu modifies la ligne `Computer` dans `Capture_App_Reel`.

---

# 8. Feuille `Controle_App_Apres`

C’est la feuille la plus importante pour toi.

Elle compare :

```txt
Résultat attendu par Excel
VS
Résultat réel affiché par ton application
```

Elle donne un statut :

```txt
OK
```

ou :

```txt
À vérifier
```

Si tout est `OK`, cela veut dire :

```txt
Les valeurs attendues correspondent aux valeurs affichées dans l’application.
```

Si une ligne est `À vérifier`, tu dois regarder :

```txt
Capture_App_Reel
Detail_App_Apres
Simulation_Code
```

pour savoir d’où vient l’écart.

---

# 9. Comment utiliser l’Excel en pratique

Fais exactement ça :

```txt
1. Lance ton application.

2. Importe les fichiers dans l’ordre :
   Feuille 1 assets
   Feuille 2 tickets
   Feuille 3 coûts GLPI
   Feuille 6 scénarios

3. Va dans ton écran de résultats dans l’application.

4. Compare les valeurs affichées avec la feuille Capture_App_Reel.

5. Si les valeurs de l’application ont changé, remplace les valeurs dans Capture_App_Reel.

6. Va dans Controle_App_Apres.

7. Regarde si le statut est OK ou À vérifier.
```

---

# 10. Est-ce que l’Excel prend déjà en compte “le dernier GLPI inséré par ticket et item” ?

Actuellement : **pas automatiquement de manière dynamique depuis `SuperCost_Reel_Export`**.

Il faut distinguer deux choses.

## Oui, dans les valeurs finales que j’ai mises

Dans `Detail_App_Apres`, j’ai repris le résultat visible dans tes captures. Donc pour le ticket `751`, item `2000`, j’ai bien mis :

```txt
cout_glpi = 160.45
```

Et pour le ticket `752`, item `2000`, j’ai mis :

```txt
cout_glpi = 0
```

Donc dans le résultat attendu final, l’Excel tient compte des valeurs GLPI visibles dans ton application.

---

## Non, ce n’est pas encore calculé automatiquement depuis l’export SQL

La feuille `SuperCost_Reel_Export` est prévue pour coller l’export réel de ta table `super_cost_1`, mais la version actuelle ne sélectionne pas encore automatiquement :

```txt
le dernier glpi par id_ticket + id_item
```

Donc si tu colles toutes les lignes de `super_cost_1`, l’Excel actuel ne fait pas encore automatiquement l’équivalent de cette logique SQL :

```sql
SELECT 
    sc.id,
    sc.id_ticket,
    sc.type_cout,
    sc.cout,
    sc.id_item,
    sc.category,
    sc.group_super_cost_1,
    sc.created_at
FROM super_cost_1 sc
WHERE sc.type_cout = 'glpi'
AND sc.group_super_cost_1 = (
    SELECT MAX(sc2.group_super_cost_1)
    FROM super_cost_1 sc2
    WHERE sc2.type_cout = 'glpi'
    AND sc2.id_ticket = sc.id_ticket
    AND sc2.id_item = sc.id_item
);
```

Donc réponse claire :

```txt
L’Excel prend en compte les valeurs GLPI finales que j’ai mises depuis tes captures.
Mais il ne recalcule pas encore automatiquement le dernier GLPI depuis l’export SQL brut.
```

---

# 11. Ce que tu dois faire si tu veux vérifier le dernier GLPI proprement

Pour l’instant, le plus fiable est de lancer cette requête dans SQLite :

```sql
SELECT 
    sc.id,
    sc.id_ticket,
    sc.type_cout,
    sc.cout,
    sc.id_item,
    sc.category,
    sc.group_super_cost_1,
    sc.created_at
FROM super_cost_1 sc
WHERE sc.type_cout = 'glpi'
AND sc.group_super_cost_1 = (
    SELECT MAX(sc2.group_super_cost_1)
    FROM super_cost_1 sc2
    WHERE sc2.type_cout = 'glpi'
    AND sc2.id_ticket = sc.id_ticket
    AND sc2.id_item = sc.id_item
)
ORDER BY sc.id_ticket, sc.id_item;
```

Puis tu compares le résultat avec la feuille :

```txt
Verification_Cout_GLPI
```

ou avec :

```txt
Detail_App_Apres
```

---

## Résumé simple

Ton Excel fonctionne comme ça :

```txt
Scenarios_CSV
→ contient les mouvements du CSV

Tickets_Config
→ contient les paramètres nécessaires au calcul

Simulation_Code
→ simule les close/open selon ton code

Resultat_App_Apres
→ résumé attendu comme dans l’application

Detail_App_Apres
→ détail attendu ligne par ligne

Capture_App_Reel
→ valeurs réelles copiées depuis ton application

Controle_App_Apres
→ dit OK ou À vérifier
```

Et pour ta question sur le dernier GLPI :

```txt
Non, pas encore automatiquement depuis l’export SQL brut.
Oui, les valeurs finales visibles dans tes captures ont été reprises manuellement.
```

Donc pour une vérification 100% automatique, il faudrait ajouter une feuille supplémentaire du type :

```txt
Dernier_GLPI_Par_Ticket_Item
```

qui calcule automatiquement le dernier `glpi` à partir de `SuperCost_Reel_Export`.
