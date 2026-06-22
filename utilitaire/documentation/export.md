## 1. Crée un helper CSV

Crée ce fichier :

```txt
src/shared/lib/csv.ts
```

Mets ceci dedans :

```ts
type CsvColumn<T> = {
  header: string;
  getValue: (row: T, index: number) => unknown;
};

type DownloadCsvParams<T> = {
  filename: string;
  rows: T[];
  columns: CsvColumn<T>[];
  separator?: string;
};

function escapeCsvValue(value: unknown, separator: string) {
  const text = String(value ?? "");

  const mustBeQuoted =
    text.includes(separator) ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r");

  const escapedText = text.replaceAll('"', '""');

  return mustBeQuoted ? `"${escapedText}"` : escapedText;
}

export function downloadCsv<T>({
  filename,
  rows,
  columns,
  separator = ";",
}: DownloadCsvParams<T>) {
  const headers = columns.map((column) =>
    escapeCsvValue(column.header, separator),
  );

  const lines = rows.map((row, index) =>
    columns
      .map((column) => escapeCsvValue(column.getValue(row, index), separator))
      .join(separator),
  );

  const csvContent = ["\uFEFF" + headers.join(separator), ...lines].join("\r\n");

  const blob = new Blob([csvContent], {
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

Le `\uFEFF` sert à aider Excel à bien lire les accents comme `é`, `è`, `à`.

---

## 2. Dans `ListGeneralViewItem.tsx`, ajoute les imports

En haut du fichier, ajoute :

```ts
import { Download } from "lucide-react";
import { downloadCsv } from "../../../../shared/lib/csv";
import { getAllGeneralViewAssetItems } from "../api/generalViewAssetItems.api";
import type { GeneralViewAssetItems } from "../model/generalViewAssetItems.types";
```

Attention : tu importes déjà `GeneralViewAssetItemsFilters` depuis le même fichier types. Tu peux fusionner :

```ts
import type {
  GeneralViewAssetItems,
  GeneralViewAssetItemsFilters,
} from "../model/generalViewAssetItems.types";
```

---

## 3. Ajoute un state pour l’export

Dans ton composant `ListGeneralViewItem`, ajoute :

```ts
const [isExportingCsv, setIsExportingCsv] = useState(false);
const [exportCsvError, setExportCsvError] = useState<unknown>(null);
```

---

## 4. Ajoute les colonnes CSV

Dans le composant, avant le `return`, ajoute :

```ts
const csvColumns = [
  {
    header: "Numéro ligne",
    getValue: (_item: GeneralViewAssetItems, index: number) => index + 1,
  },
  {
    header: "Nom",
    getValue: (item: GeneralViewAssetItems) => item.name,
  },
  {
    header: "Type technique",
    getValue: (item: GeneralViewAssetItems) => item.itemType,
  },
  {
    header: "Type affiché",
    getValue: (item: GeneralViewAssetItems) => item.itemTypeLabel,
  },
  {
    header: "Date de création",
    getValue: (item: GeneralViewAssetItems) => item.dateCreation,
  },
  {
    header: "Date de modification",
    getValue: (item: GeneralViewAssetItems) => item.dateMod,
  },
  {
    header: "Entité",
    getValue: (item: GeneralViewAssetItems) => item.entity?.name,
  },
  {
    header: "Récursif",
    getValue: (item: GeneralViewAssetItems) => item.isRecursive ? "Oui" : "Non",
  },
  {
    header: "Fabricant",
    getValue: (item: GeneralViewAssetItems) => item.manufacturer?.name,
  },
  {
    header: "Statut",
    getValue: (item: GeneralViewAssetItems) => item.status?.name,
  },
  {
    header: "Utilisateur",
    getValue: (item: GeneralViewAssetItems) => item.user?.name,
  },
  {
    header: "Technicien",
    getValue: (item: GeneralViewAssetItems) => item.userTech?.name,
  },
];
```

---

## 5. Ajoute la fonction d’export CSV

Toujours dans `ListGeneralViewItem`, ajoute :

```ts
async function handleExportCsv() {
  try {
    setIsExportingCsv(true);
    setExportCsvError(null);

    const items = await getAllGeneralViewAssetItems(debouncedFilters);

    downloadCsv({
      filename: "inventaire-assets.csv",
      rows: items,
      columns: csvColumns,
    });
  } catch (error) {
    setExportCsvError(error);
  } finally {
    setIsExportingCsv(false);
  }
}
```

Ici, j’utilise `getAllGeneralViewAssetItems(debouncedFilters)` pour exporter **tous les éléments correspondant aux filtres actuels**, pas seulement la page affichée. Cette fonction existe déjà dans ton code et récupère toutes les pages.

---

## 6. Ajoute le bouton dans la toolbar

Dans ta toolbar, après le bouton `Actualiser`, ajoute :

```tsx
<Button
  type="button"
  disabled={isExportingCsv}
  onClick={handleExportCsv}
>
  <Download size={18} />
  {isExportingCsv ? "Export..." : "Exporter CSV"}
</Button>
```

Donc dans ton bloc actuel :

```tsx
<Button
  onClick={() => {
    refetchGeneralViewAssetItems()
    refetchAssets()
  }}
>
  <RefreshCcw size={18} />Actualiser
</Button>
```

tu ajoutes juste après :

```tsx
<Button
  type="button"
  disabled={isExportingCsv}
  onClick={handleExportCsv}
>
  <Download size={18} />
  {isExportingCsv ? "Export..." : "Exporter CSV"}
</Button>
```

---

## 7. Affiche l’erreur si l’export échoue

Dans le JSX, juste avant `<DataTable ...>`, tu peux mettre :

```tsx
{exportCsvError && (
  <MyError>
    {getUserErrorMessage(
      exportCsvError,
      "Erreur lors de l’export CSV.",
    )}
  </MyError>
)}
```

---

## Version alternative : exporter seulement la page affichée

Si tu veux exporter seulement les lignes visibles dans le tableau, c’est plus simple :

```ts
function handleExportCurrentPageCsv() {
  downloadCsv({
    filename: "inventaire-assets-page-actuelle.csv",
    rows: generalViewAssetItems,
    columns: csvColumns,
  });
}
```

Mais dans ton cas, je pense que le plus utile est :

```txt
Exporter tous les résultats filtrés
```

donc utiliser `getAllGeneralViewAssetItems(debouncedFilters)`.

---

## Résumé

Tu ajoutes :

```txt
src/shared/lib/csv.ts
```

Puis dans `ListGeneralViewItem.tsx` :

```txt
1. Importer downloadCsv
2. Créer csvColumns
3. Créer handleExportCsv()
4. Ajouter un bouton "Exporter CSV" dans toolbar
```

Le CSV exportera les mêmes colonnes principales que ton tableau : nom, type, dates, entité, récursif, fabricant, statut, utilisateur et technicien.
