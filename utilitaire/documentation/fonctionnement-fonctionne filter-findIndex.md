# Filtrer seulement la catégorie sélectionnée

Tu fais d’abord :

```ts
let superCostsDetail: SuperCost1[] = [];

if (superCostsData) {
  superCostsDetail = superCostsData.filter((superCostData) => {
    if (superCostData.category === categorieItemDetail) {
      return superCostData;
    }
  });
}
```

Ça veut dire :

> Garde uniquement les lignes dont la catégorie correspond à celle choisie.

Exemple : si tu cliques sur `Computer`, alors :

```ts
categorieItemDetail = "Computer";
```

Donc `superCostsDetail` contiendra seulement les lignes où :

```ts
category = "Computer";
```

Il va ignorer les lignes `Monitor`, `Printer`, etc.

Une version plus propre serait :

```ts
const superCostsDetail = superCostsData?.filter(
  (superCostData) => superCostData.category === categorieItemDetail
) ?? [];
```

Mais ta logique actuelle fait bien le filtrage.

---

## 1. Le rôle de `superCostsDetailUnique`

Voici le code :

```ts
const superCostsDetailUnique = superCostsDetail.filter(
  (superCostDetail, index, array) => {
    return index === array.findIndex((item) =>
      item.category === superCostDetail.category &&
      item.id_item === superCostDetail.id_item &&
      item.id_ticket === superCostDetail.id_ticket &&
      item.group_super_cost_1 === superCostDetail.group_super_cost_1
    );
  }
);
```

Cette partie supprime les doublons selon une combinaison de champs.

La combinaison utilisée est :

* `category`
* `id_item`
* `id_ticket`
* `group_super_cost_1`

Donc deux lignes sont considérées comme **le même détail** si elles ont :

* la même catégorie ;
* le même item ;
* le même ticket ;
* le même groupe de super cost.

---

## 2. Pourquoi il faut supprimer les doublons ?

Dans ta table `super_cost_1`, tu peux avoir ça :

| id  | category | id_item | id_ticket | type_cout   | cout | group |
| --- | -------- | ------- | --------- | ----------- | ---- | ----- |
| 461 | Computer | 1078    | 570       | cout_saisi  | 75   | G1    |
| 463 | Computer | 1078    | 570       | glpi        | 0    | G1    |
| 465 | Computer | 1078    | 570       | reouverture | 7.5  | G1    |

Ces 3 lignes concernent le même détail métier :

```txt
Computer 1078 du ticket 570 dans le groupe G1
```

Mais elles ont 3 types de coût différents.

Dans ton tableau détail, tu veux une seule ligne :

| category | id_item | id_ticket | Cout GLPI | Cout Reouverture | Cout Super Cost | group |
| -------- | ------- | --------- | --------- | ---------------- | --------------- | ----- |
| Computer | 1078    | 570       | 0         | 7.5              | 75              | G1    |

Donc `superCostsDetailUnique` sert à produire une ligne de base unique par item, ticket et groupe.

---

## 3. Comment fonctionne `filter` + `findIndex` ?

Prenons ce tableau :

```ts
[
  {
    category: "Computer",
    id_item: 1078,
    id_ticket: 570,
    type_cout: "cout_saisi",
    group: "G1",
  },
  {
    category: "Computer",
    id_item: 1078,
    id_ticket: 570,
    type_cout: "glpi",
    group: "G1",
  },
  {
    category: "Computer",
    id_item: 1078,
    id_ticket: 570,
    type_cout: "reouverture",
    group: "G1",
  },
]
```

Le `filter` parcourt chaque ligne.

Pour chaque ligne, il cherche avec `findIndex` :

```ts
array.findIndex((item) =>
  item.category === superCostDetail.category &&
  item.id_item === superCostDetail.id_item &&
  item.id_ticket === superCostDetail.id_ticket &&
  item.group_super_cost_1 === superCostDetail.group_super_cost_1
);
```

Ça retourne l’index de la première ligne qui a la même combinaison.

Donc :

| ligne actuelle | index actuel | findIndex trouvé | gardé ? |
| -------------- | ------------ | ---------------- | ------- |
| cout_saisi     | 0            | 0                | oui     |
| glpi           | 1            | 0                | non     |
| reouverture    | 2            | 0                | non     |

La condition :

```ts
index === array.findIndex(...)
```

veut dire :

> Garde seulement la première ligne de chaque groupe identique.

Donc au final, les 3 lignes deviennent 1 seule ligne.

---

## 4. Ensuite, comment les montants du détail sont retrouvés ?

Après avoir obtenu une ligne unique, tu fais :

```ts
superCostsDetailUnique.map((superCostDetail) => {
```

Pour chaque ligne unique, tu recherches séparément les différents coûts.

---

### Le coût GLPI

```ts
const coutGlpi = superCostsDetail.find((superCost) => {
  return (
    superCost.id_item === superCostDetail.id_item &&
    superCost.type_cout === "glpi" &&
    superCost.category === superCostDetail.category &&
    superCost.id_ticket === superCostDetail.id_ticket &&
    superCost.group_super_cost_1 === superCostDetail.group_super_cost_1
  );
})?.cout ?? 0;
```

Ça veut dire :

> Pour cette ligne unique, cherche la ligne où `type_cout = "glpi"`.

Si elle existe, on prend son `cout`.

Sinon, on met `0`.

---

### Le coût de réouverture

```ts
const coutReouverture = superCostsDetail.find((superCost) => {
  return (
    superCost.id_item === superCostDetail.id_item &&
    superCost.type_cout === "reouverture" &&
    superCost.category === superCostDetail.category &&
    superCost.id_ticket === superCostDetail.id_ticket &&
    superCost.group_super_cost_1 === superCostDetail.group_super_cost_1
  );
})?.cout ?? 0;
```

Même logique, mais pour :

```ts
type_cout = "reouverture";
```

---

### Le coût saisi / Super Cost

```ts
const coutSuperCost = superCostsDetail.find((superCost) => {
  return (
    superCost.id_item === superCostDetail.id_item &&
    superCost.type_cout === "cout_saisi" &&
    superCost.category === superCostDetail.category &&
    superCost.id_ticket === superCostDetail.id_ticket &&
    superCost.group_super_cost_1 === superCostDetail.group_super_cost_1
  );
})?.cout ?? 0;
```

Même logique pour :

```ts
type_cout = "cout_saisi";
```

---

## 5. Comment la mise en place du détail fonctionne au complet ?

Le flux complet est :

1. La page affiche le tableau résumé par catégorie.
2. Chaque ligne a un bouton `Détail`.
3. Quand tu cliques sur `Détail`, tu fais :

```ts
setCategorieItemDetail(category);
```

4. React re-render la page.
5. `superCostsDetail` est recalculé avec seulement cette catégorie.
6. `superCostsDetailUnique` supprime les doublons item, ticket et groupe.
7. Le deuxième tableau s’affiche.
8. Pour chaque ligne unique, le code cherche :

   * le coût GLPI ;
   * le coût de réouverture ;
   * le coût saisi / Super Cost.
9. Le détail est affiché dans le tableau.

Le bouton détail est ici :

```tsx
<Button
  onClick={() => {
    setCategorieItemDetail(category);
  }}
>
  Détail
</Button>
```

Et le tableau détail s’affiche seulement si `superCostsDetailUnique.length > 0` :

```tsx
{superCostsDetailUnique.length > 0 && (
  <DataTable ...>
)}
```

---

## 6. Exemple concret

Imaginons que tu as ces données :

| id  | category | id_item | id_ticket | type_cout   | cout   | group |
| --- | -------- | ------- | --------- | ----------- | ------ | ----- |
| 461 | Computer | 1078    | 570       | cout_saisi  | 75     | G1    |
| 463 | Computer | 1078    | 570       | glpi        | 0      | G1    |
| 465 | Computer | 1078    | 570       | reouverture | 7.5    | G1    |
| 467 | Computer | 1078    | 569       | cout_saisi  | 100    | G2    |
| 468 | Computer | 1078    | 569       | glpi        | 160.45 | G2    |
| 469 | Computer | 1078    | 569       | reouverture | 5      | G2    |

Si tu cliques sur `Détail` pour `Computer`, alors :

```ts
categorieItemDetail = "Computer";
```

`superCostsDetail` contient les 6 lignes.

`superCostsDetailUnique` garde seulement :

| category | id_item | id_ticket | group |
| -------- | ------- | --------- | ----- |
| Computer | 1078    | 570       | G1    |
| Computer | 1078    | 569       | G2    |

Puis pour chaque ligne unique, le code retrouve les montants :

| category | id_item | id_ticket | Cout GLPI | Cout Reouverture | Cout Super Cost | group |
| -------- | ------- | --------- | --------- | ---------------- | --------------- | ----- |
| Computer | 1078    | 570       | 0         | 7.5              | 75              | G1    |
| Computer | 1078    | 569       | 160.45    | 5                | 100             | G2    |

C’est exactement le rôle du détail.
