# Implémentation d’une exportation CSV / PDF dans `MontantLocalGlpi1`

## 1. Objectif

Dans la page :

```txt
src/pages/frontoffice/MontantLocalGlpi1.tsx
```

on affiche actuellement deux tableaux :

1. un tableau résumé par catégorie ;
2. un tableau détail pour une catégorie sélectionnée.

L’objectif est d’ajouter une fonctionnalité d’exportation pour permettre de télécharger les données en :

```txt
CSV
PDF
```

Le plus simple est de commencer par :

```txt
CSV côté frontend
PDF via impression navigateur avec window.print()
```

Cela évite de modifier le backend au début.

---

## 2. Données actuellement disponibles dans la page

Dans `MontantLocalGlpi1.tsx`, la page récupère déjà plusieurs données :

```ts
const {
  data: superCost1GroupByCategorieTypeCout
} = useSuperCost1GroupByCategorieTypeCout();

const {
  data: superCost1GroupByCategorieTypeCoutLastMax
} = useSuperCost1GroupByCategorieTypeCoutLastMax();

const {
  data: superCostsData
} = useSuperCost1();
```

Le premier hook sert au résumé global par catégorie et type de coût.

Le deuxième hook sert surtout à récupérer les coûts GLPI en prenant le dernier groupe.

Le troisième hook récupère les lignes détaillées de `super_cost_1`.

---

## 3. Pourquoi faire l’export côté frontend ?

Comme les données sont déjà chargées dans la page React, on peut générer un fichier CSV directement dans le navigateur.

Avantages :

```txt
- pas besoin de modifier Spring Boot ;
- plus rapide à mettre en place ;
- utile pour Excel ou LibreOffice ;
- facile à tester.
```

Limite :

```txt
Si les données deviennent très nombreuses, il sera plus propre de faire l’export côté backend.
```

---

## 4. Créer un utilitaire CSV

Créer ce fichier :

```txt
src/shared/export/csv.ts
```

Contenu :

```ts
type CsvValue = string | number | boolean | null | undefined;

function escapeCsvValue(value: CsvValue) {
  const stringValue = value === null || value === undefined ? "" : String(value);

  const escapedValue = stringValue.replaceAll('"', '""');

  return `"${escapedValue}"`;
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: CsvValue[][],
) {
  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");

  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
```

### Rôle de cette fonction

Cette fonction :

```txt
1. reçoit un nom de fichier ;
2. reçoit les en-têtes du CSV ;
3. reçoit les lignes de données ;
4. transforme tout en texte CSV ;
5. crée un fichier temporaire ;
6. déclenche le téléchargement.
```

Le préfixe :

```ts
"\uFEFF"
```

sert à aider Excel ou LibreOffice à mieux lire les accents.

---

## 5. Modifier l’import dans `MontantLocalGlpi1.tsx`

Actuellement, tu as probablement :

```ts
import { useState } from "react";
```

Remplace par :

```ts
import { useMemo, useState } from "react";
```

Puis ajoute :

```ts
import { downloadCsv } from "../../shared/export/csv";
```

---

## 6. Préparer les lignes du résumé avec `useMemo`

Avant le `return`, ajouter :

```ts
const summaryRows = useMemo(() => {
  if (
    !superCost1GroupByCategorieTypeCout ||
    !superCost1GroupByCategorieTypeCoutLastMax
  ) {
    return [];
  }

  const categories = Array.from(
    new Set(superCost1GroupByCategorieTypeCout.map((item) => item.category)),
  );

  return categories.map((category) => {
    let glpi = 0;
    let cout_saisi = 0;
    let reouverture = 0;

    superCost1GroupByCategorieTypeCoutLastMax.forEach((superCost1) => {
      if (superCost1.category === category && superCost1.type_cout === "glpi") {
        glpi += Number(superCost1.cout);
      }
    });

    superCost1GroupByCategorieTypeCout.forEach((superCost1) => {
      if (superCost1.category !== category) {
        return;
      }

      if (superCost1.type_cout === "cout_saisi") {
        cout_saisi += Number(superCost1.cout);
      }

      if (superCost1.type_cout === "reouverture") {
        reouverture += Number(superCost1.cout);
      }
    });

    const total = glpi + cout_saisi + reouverture;

    return {
      category,
      glpi,
      cout_saisi,
      reouverture,
      total,
    };
  });
}, [
  superCost1GroupByCategorieTypeCout,
  superCost1GroupByCategorieTypeCoutLastMax,
]);
```

### Pourquoi utiliser `useMemo` ici ?

`useMemo` permet de calculer `summaryRows` seulement quand les données sources changent.

Donc si la page re-render à cause d’un autre state, le résumé n’est pas recalculé inutilement.

---

## 7. Préparer les lignes du détail avec `useMemo`

Toujours avant le `return`, ajouter :

```ts
const detailRows = useMemo(() => {
  return superCostsDetailUnique.map((superCostDetail) => {
    const coutGlpi = superCostsDetail.find((superCost) => {
      return (
        superCost.id_item === superCostDetail.id_item &&
        superCost.type_cout === "glpi" &&
        superCost.category === superCostDetail.category &&
        superCost.id_ticket === superCostDetail.id_ticket &&
        superCost.group_super_cost_1 === superCostDetail.group_super_cost_1
      );
    })?.cout ?? 0;

    const coutReouverture = superCostsDetail.find((superCost) => {
      return (
        superCost.id_item === superCostDetail.id_item &&
        superCost.type_cout === "reouverture" &&
        superCost.category === superCostDetail.category &&
        superCost.id_ticket === superCostDetail.id_ticket &&
        superCost.group_super_cost_1 === superCostDetail.group_super_cost_1
      );
    })?.cout ?? 0;

    const coutSuperCost = superCostsDetail.find((superCost) => {
      return (
        superCost.id_item === superCostDetail.id_item &&
        superCost.type_cout === "cout_saisi" &&
        superCost.category === superCostDetail.category &&
        superCost.id_ticket === superCostDetail.id_ticket &&
        superCost.group_super_cost_1 === superCostDetail.group_super_cost_1
      );
    })?.cout ?? 0;

    return {
      id: superCostDetail.id,
      category: superCostDetail.category,
      idItem: superCostDetail.id_item,
      coutGlpi,
      coutReouverture,
      coutSuperCost,
      idTicket: superCostDetail.id_ticket,
      groupSuperCost1: superCostDetail.group_super_cost_1,
    };
  });
}, [superCostsDetail, superCostsDetailUnique]);
```

Cette variable `detailRows` permet d’utiliser les mêmes données pour :

```txt
- afficher le tableau détail ;
- exporter le tableau détail en CSV.
```

---

## 8. Ajouter les boutons d’export

Au début du `return`, avant le premier `DataTable`, ajouter :

```tsx
<div className="mb-4 flex gap-3">
  <Button
    type="button"
    onClick={() => {
      downloadCsv(
        "montant-local-glpi-resume.csv",
        [
          "categorie item",
          "Total GLPI",
          "Total Super Cout",
          "Total Reouverture",
          "Total",
        ],
        summaryRows.map((row) => [
          row.category,
          row.glpi,
          row.cout_saisi,
          row.reouverture,
          row.total,
        ]),
      );
    }}
  >
    Exporter résumé CSV
  </Button>

  <Button
    type="button"
    disabled={detailRows.length === 0}
    onClick={() => {
      downloadCsv(
        `montant-local-glpi-detail-${categorieItemDetail || "aucune-categorie"}.csv`,
        [
          "id",
          "categorie item",
          "Id Item",
          "Cout GLPI",
          "Cout Reouverture",
          "Cout Super Cost",
          "id ticket",
          "group_super_cost_1",
        ],
        detailRows.map((row) => [
          row.id,
          row.category,
          row.idItem,
          row.coutGlpi,
          row.coutReouverture,
          row.coutSuperCost,
          row.idTicket,
          row.groupSuperCost1,
        ]),
      );
    }}
  >
    Exporter détail CSV
  </Button>

  <Button
    type="button"
    onClick={() => {
      window.print();
    }}
  >
    Exporter PDF
  </Button>
</div>
```

---

## 9. Rôle de chaque bouton

### `Exporter résumé CSV`

Ce bouton exporte le tableau résumé :

```txt
categorie item
Total GLPI
Total Super Cout
Total Reouverture
Total
```

Le fichier téléchargé sera :

```txt
montant-local-glpi-resume.csv
```

### `Exporter détail CSV`

Ce bouton exporte seulement le détail de la catégorie sélectionnée.

Si aucune catégorie n’est sélectionnée, le bouton est désactivé :

```tsx
disabled={detailRows.length === 0}
```

Le fichier téléchargé aura un nom comme :

```txt
montant-local-glpi-detail-Computer.csv
```

### `Exporter PDF`

Ce bouton lance :

```ts
window.print();
```

Cela ouvre l’interface d’impression du navigateur.

L’utilisateur peut ensuite choisir :

```txt
Enregistrer en PDF
```

C’est la solution la plus simple pour commencer.

---

## 10. Afficher le tableau résumé avec `summaryRows`

Au lieu de recalculer directement dans le JSX, utiliser :

```tsx
{summaryRows.map((row) => (
  <tr key={row.category}>
    <td className="border border-(--panel-border) px-4 py-4">
      {row.category}
    </td>
    <td className="border border-(--panel-border) px-4 py-4">
      {row.glpi}
    </td>
    <td className="border border-(--panel-border) px-4 py-4">
      {row.cout_saisi}
    </td>
    <td className="border border-(--panel-border) px-4 py-4">
      {row.reouverture}
    </td>
    <td className="border border-(--panel-border) px-4 py-4">
      {row.total}
    </td>
    <td className="border border-(--panel-border) px-4 py-4">
      <Button
        onClick={() => {
          setCategorieItemDetail(row.category);
        }}
      >
        Détail
      </Button>
    </td>
  </tr>
))}
```

---

## 11. Afficher le tableau détail avec `detailRows`

Au lieu de refaire les `find(...)` directement dans le JSX, utiliser :

```tsx
{detailRows.map((row) => (
  <tr key={`${row.category}-${row.idItem}-${row.idTicket}-${row.groupSuperCost1}`}>
    <td className="border border-(--panel-border) px-4 py-4">{row.id}</td>
    <td className="border border-(--panel-border) px-4 py-4">{row.category}</td>
    <td className="border border-(--panel-border) px-4 py-4">{row.idItem}</td>
    <td className="border border-(--panel-border) px-4 py-4">{row.coutGlpi}</td>
    <td className="border border-(--panel-border) px-4 py-4">{row.coutReouverture}</td>
    <td className="border border-(--panel-border) px-4 py-4">{row.coutSuperCost}</td>
    <td className="border border-(--panel-border) px-4 py-4">{row.idTicket}</td>
    <td className="border border-(--panel-border) px-4 py-4">{row.groupSuperCost1}</td>
  </tr>
))}
```

---

## 12. Version PDF simple avec `window.print()`

L’avantage de `window.print()` :

```txt
- très rapide à mettre en place ;
- pas besoin de librairie ;
- le navigateur gère la création PDF ;
- fonctionne avec le tableau déjà affiché.
```

Limite :

```txt
- l’utilisateur doit choisir lui-même "Enregistrer en PDF" ;
- la mise en page dépend du navigateur ;
- il faut parfois ajouter du CSS print pour un rendu propre.
```

---

## 13. Amélioration possible : CSS pour impression

Tu peux ajouter dans ton CSS global :

```css
@media print {
  button {
    display: none;
  }

  body {
    background: white;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
}
```

Cela évite que les boutons apparaissent dans le PDF imprimé.

---

## 14. Pour un vrai PDF automatique plus tard

Si tu veux générer un fichier PDF directement au clic, sans passer par l’impression navigateur, tu peux utiliser une librairie frontend comme :

```txt
jspdf
jspdf-autotable
```

Mais pour ton cas actuel, ce n’est pas encore nécessaire.

La priorité recommandée :

```txt
1. CSV côté frontend
2. PDF via window.print()
3. PDF automatique plus tard
```

---

## 15. Résumé global

L’implémentation recommandée est :

```txt
1. Créer src/shared/export/csv.ts
2. Préparer summaryRows avec useMemo
3. Préparer detailRows avec useMemo
4. Ajouter bouton Export résumé CSV
5. Ajouter bouton Export détail CSV
6. Ajouter bouton Export PDF avec window.print()
7. Réutiliser summaryRows et detailRows pour afficher les tableaux
```

Cette méthode est simple, rapide, et adaptée à ton code actuel.
