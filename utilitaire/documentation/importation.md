# PAPA-PARSE 
## choisir un delimiter

delimiter: ";"

exemple:
```
 Papa.parse<CsvRawRow>(file, {
  header: true,
  skipEmptyLines: true,
  delimiter: ";",
  transformHeader: (header) => header.trim(),
  complete: ...
});
```

# importation 

Différence entre les fichiers d’import

Tu as plusieurs fichiers qui se ressemblent, mais ils n’ont pas le même rôle.

## parseCsvRaw.ts

Rôle :

Lire le CSV brut.

Il retourne :

fileName
headers
rows

Il ne sait pas encore si c’est un import ticket, user, asset ou scenario.

## detectGlpiImportProfile.ts

Rôle :

Regarder les headers du CSV
et trouver quels profils d’import sont compatibles.

Il ne lit pas les lignes en détail. Il regarde surtout les colonnes.

## parseCsvWithGlpiProfile.ts

Rôle :

Lire le CSV avec un profil précis
puis transformer les lignes selon ce profil.

Il revérifie que le profil correspond au fichier, puis appelle applyGlpiImportProfile.

## applyGlpiImportProfile.ts

Rôle :

Transformer les colonnes CSV en champs internes.

Exemple :

Num_Ticket → ticketRef
valeur → valeur avec transform number

C’est là que les valeurs sont récupérées par header, transformées et validées.

## parseGlpiCsv.ts

Celui-ci semble être un ancien parseur ou un parseur plus manuel. Il lit le contenu avec file.text(), détecte le séparateur ; ou ,, parse les lignes lui-même, puis construit les payloads.

Il est différent de parseCsvRaw, qui utilise PapaParse.

Donc globalement :

parseCsvRaw.ts
→ lecture générique avec PapaParse

detectGlpiImportProfile.ts
→ trouver le bon profil

parseCsvWithGlpiProfile.ts
→ lire + appliquer un profil

applyGlpiImportProfile.ts
→ transformer chaque ligne selon le profil

parseGlpiCsv.ts
→ ancien parseur / parseur manuel orienté ressource

## Rôle de InvalidGlpiImportRow

Type :

export type InvalidGlpiImportRow = {
  parsedRow: ParsedGlpiProfileRow;
  rawRow: CsvRawRow;
  reasons: string[];
  rowIndex: number;
};

Il sert à représenter une ligne CSV invalide.

Exemple :

{
  rowIndex: 3,
  rawRow: {
    Num_Ticket: "",
    mvt: "open",
    valeur: "16,5",
  },
  parsedRow: {},
  reasons: ["tickets.ticketRef manquant"]
}

Utilité :

Afficher à l’utilisateur quelle ligne est invalide et pourquoi.
## Rôle de RecognizedGlpiParsedFile

Type :

export type RecognizedGlpiParsedFile = {
  fileName: string;
  headers: string[];
  invalidRows: InvalidGlpiImportRow[];
  profile: GlpiImportProfile;
  rawRows: CsvRawRow[];
  rows: ParsedGlpiProfileRow[];
  status: "recognized";
};

Il représente un fichier CSV reconnu par un profil.

Exemple :

{
  fileName: "scenario.csv",
  headers: ["Num_Ticket", "mvt", "valeur"],
  profile: scenarioTicketProfile,
  rawRows: [...],
  rows: [...],
  invalidRows: [],
  status: "recognized"
}

Utilité :

Dire : ce fichier est valide et prêt à être importé.

## Rôle de ParsedGlpiImportFile

Type :

export type ParsedGlpiImportFile = RecognizedGlpiParsedFile | UnknownGlpiParsedFile;

Ça veut dire :

Un fichier parsé peut être soit reconnu, soit inconnu.

C’est encore une union type.

Tu peux l’utiliser comme ça :

function afficherFichier(file: ParsedGlpiImportFile) {
  if (file.status === "recognized") {
    console.log("Profil :", file.profile.label);
    console.log("Lignes valides :", file.rows);
  }

  if (file.status === "unknown") {
    console.log("Raison :", file.reason);
  }
}

TypeScript comprend automatiquement que :

si status === "recognized", alors file est RecognizedGlpiParsedFile
si status === "unknown", alors file est UnknownGlpiParsedFile

## Rôle des states dans ce bloc

```
if (!file) {
  setSelectedFilesBySlot((current) => {
    const next = { ...current };
    delete next[slotId];
    return next;
  });

  if (isCsvSlotId(slotId)) {
    setSelectedProfileIdsBySlot((current) => {
      const next = { ...current };
      delete next[slotId];
      return next;
    });

    setCompatibleProfilesBySlot((current) => {
      const next = { ...current };
      delete next[slotId];
      return next;
    });
  }

  setParsedFilesBySlot((current) => {
    const next = { ...current };
    delete next[slotId];
    return next;
  });

  setParseErrorsBySlot((current) => {
    const next = { ...current };
    delete next[slotId];
    return next;
  });

  return;
}
```

Ce bloc est dans handleFileSlotChange.

### selectedFilesBySlot

Contient les fichiers choisis par slot.

Exemple :

{
  csv4: File("scenario.csv")
}

Si aucun fichier, on supprime :

delete next[slotId];

Donc si slotId = "csv4", on retire :

csv4: File(...)

### selectedProfileIdsBySlot

Contient les profils sélectionnés pour chaque slot CSV.

Exemple :

{
  csv4: ["scenario-ticket"]
}

Si le fichier disparaît, le profil sélectionné n’a plus de sens. Donc on supprime aussi.

### compatibleProfilesBySlot

Contient les profils compatibles détectés pour chaque slot.

Exemple :

{
  csv4: [
    { id: "scenario-ticket", label: "Scenario Ticket", ... }
  ]
}

Si le fichier disparaît, les profils compatibles disparaissent aussi.

### parsedFilesBySlot

Contient le résultat du parsing.

Exemple :

{
  csv4: [
    {
      fileName: "scenario.csv",
      status: "recognized",
      rows: [...]
    }
  ]
}

Si le fichier est retiré, on supprime le résultat de parsing.

### parseErrorsBySlot

Contient les erreurs de parsing par slot.

Exemple :

{
  csv4: {
    fileName: "scenario.csv",
    message: "Colonnes manquantes..."
  }
}

Si le fichier est retiré, l’erreur n’est plus utile.


## ordre de suppression dans handleFileSlotChange

1. Supprimer le fichier sélectionné.
2. Si c’est un slot CSV, supprimer les profils sélectionnés.
3. Si c’est un slot CSV, supprimer les profils compatibles.
4. Supprimer les résultats parsés.
5. Supprimer les erreurs.

## C’est quoi .test(...) ici

Tu as :

const SUPPORTED_IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif)$/i;

puis :

function isSupportedImageFile(path: string) {
  return SUPPORTED_IMAGE_EXTENSIONS.test(path);
}

SUPPORTED_IMAGE_EXTENSIONS est une regex, c’est-à-dire une expression régulière.

.test(path) veut dire :

Est-ce que cette chaîne correspond à la regex ?

Exemple :

SUPPORTED_IMAGE_EXTENSIONS.test("PC001.png") // true
SUPPORTED_IMAGE_EXTENSIONS.test("photo.jpg") // true
SUPPORTED_IMAGE_EXTENSIONS.test("image.jpeg") // true
SUPPORTED_IMAGE_EXTENSIONS.test("doc.pdf") // false

La regex :
```
/\.(png|jpe?g|webp|gif)$/i
```
veut dire :

```
\.       → cherche un vrai point .
png      → png
jpe?g    → jpg ou jpeg
webp     → webp
gif      → gif
$        → à la fin du texte
i        → insensible à la casse
```

## C’est quoi .filter(Boolean).pop()

Prenons :

path.split("/").filter(Boolean).pop()

Étape par étape.

Si :

path = "assets/computers/PC001.png"

alors :

path.split("/")

donne :

["assets", "computers", "PC001.png"]

Ensuite :

.filter(Boolean)

supprime les valeurs vides.

Exemple :

"/assets/computers/PC001.png".split("/")

donne :

["", "assets", "computers", "PC001.png"]

Après :

.filter(Boolean)

ça devient :

["assets", "computers", "PC001.png"]

Puis :

.pop()

prend le dernier élément du tableau :

"PC001.png"

Donc :

path.split("/").filter(Boolean).pop()

veut dire :

Prends seulement le nom du fichier à la fin du chemin.


## Explication de la regex /\.[^.]+$/

Dans :
```
fileName.replace(/\.[^.]+$/, "")
```
La regex est :
```
/\.[^.]+$/
```
Elle veut dire :
```
\.      → trouve un point .
[^.]    → trouve un caractère qui n’est pas un point
+       → une ou plusieurs fois
$       → à la fin du texte
```
Donc elle cible :

la dernière extension du fichier

Exemple :

PC001.png

La partie trouvée est :

.png

Elle est remplacée par :

""

Donc :

PC001.png → PC001

Exemple plus intéressant :

photo.final.png

La regex prend seulement :

.png

Donc :

photo.final.png → photo.final

Elle ne supprime pas tout après le premier point. Elle supprime seulement la dernière extension.

## Explication du case "date"


Code :

case "date": {
  const match = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return trimmedValue;
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
}

Cette partie transforme une date française :

16/06/2026

en date format ISO :

2026-06-16

La regex :

/^(\d{2})\/(\d{2})\/(\d{4})$/

veut dire :

^        début du texte
(\d{2})  deux chiffres → jour
\/       slash /
(\d{2})  deux chiffres → mois
\/       slash /
(\d{4})  quatre chiffres → année
$        fin du texte

Si :

trimmedValue = "16/06/2026"

alors :

match[1] = "16"
match[2] = "06"
match[3] = "2026"

Donc :

return `${match[3]}-${match[2]}-${match[1]}`;

retourne :

2026-06-16

Si la date ne correspond pas au format JJ/MM/AAAA, alors :

if (!match) {
  return trimmedValue;
}

retourne la valeur telle quelle. Cette logique est dans applyTransform.

## pour les nombres avec séparateur de milliers

il faut améliorer le case "number".

Actuellement, tu as :

case "number":
  return Number(trimmedValue.replace(",", "."));

Ça gère :

16,5 → 16.5
16.5 → 16.5

Mais ça ne gère pas bien :

1 500,50
1.500,50
1,500.50

Tu peux créer une fonction séparée :

function parseLocalizedNumber(value: string) {
  const normalized = value.trim().replace(/\s/g, "");

  if (normalized.includes(",") && normalized.includes(".")) {
    const lastCommaIndex = normalized.lastIndexOf(",");
    const lastDotIndex = normalized.lastIndexOf(".");

    if (lastCommaIndex > lastDotIndex) {
      return Number(normalized.replace(/\./g, "").replace(",", "."));
    }

    return Number(normalized.replace(/,/g, ""));
  }

  if (normalized.includes(",")) {
    return Number(normalized.replace(",", "."));
  }

  return Number(normalized);
}

Puis :

case "number":
  return parseLocalizedNumber(trimmedValue);

Exemples :

"1500,50"   → 1500.5
"1 500,50"  → 1500.5
"1.500,50"  → 1500.5
"1,500.50"  → 1500.5
"1500.50"   → 1500.5

Attention : ce genre de parsing peut devenir ambigu.

Exemple :

1,500

Ça peut vouloir dire :

mille cinq cents en format anglais
ou
un virgule cinq en format français

Donc dans un projet sérieux, le mieux est d’imposer un format clair dans le CSV.

## C’est quoi Object.assign(parsedRow, { [resource]: parsedResource }) ?

Code :

Object.assign(parsedRow, {
  [resource]: parsedResource,
});

Ça ajoute une propriété dynamique à parsedRow.

Exemple :

resource = "tickets";

parsedResource = {
  ticketRef: "1",
  mvt: "open",
  valeur: 16.5,
};

Alors :

Object.assign(parsedRow, {
  [resource]: parsedResource,
});

équivaut à :

parsedRow["tickets"] = {
  ticketRef: "1",
  mvt: "open",
  valeur: 16.5,
};

Résultat :

parsedRow = {
  tickets: {
    ticketRef: "1",
    mvt: "open",
    valeur: 16.5,
  },
};

La syntaxe :

[resource]

veut dire :

utilise la valeur de la variable resource comme nom de propriété.

## Boolean(parsedFile)

Donc on filtre avec :

Boolean(parsedFile)

Pour retirer :

null
undefined
false
0
""

Dans ce cas précis, ça retire surtout null.

## Explication de parsedFiles


  () =>
    Object.values(parsedFilesBySlot).flatMap((slotFiles) =>
      (slotFiles ?? []).filter((parsedFile): parsedFile is ParsedGlpiImportAsset => Boolean(parsedFile)),
    ),
  [parsedFilesBySlot],
);
Rôle général

Cette variable transforme ceci :

parsedFilesBySlot = {
  csv1: [fileA],
  csv4: [fileB, fileC],
  imagesZip: [fileD],
}

en ceci :

parsedFiles = [fileA, fileB, fileC, fileD]

Donc elle enlève l’organisation par slot et crée un seul tableau.

### useMemo(...)
const parsedFiles = useMemo(
  () => ...,
  [parsedFilesBySlot],
);

useMemo dit à React :

Recalcule parsedFiles seulement quand parsedFilesBySlot change.

Sans useMemo, tu pourrais aussi écrire directement :

const parsedFiles = Object.values(parsedFilesBySlot).flatMap(...);

Mais avec useMemo, React évite de refaire le calcul à chaque rendu si parsedFilesBySlot n’a pas changé.

### Object.values(parsedFilesBySlot)

Exemple :

const parsedFilesBySlot = {
  csv1: [fileA],
  csv4: [fileB, fileC],
};

Alors :

Object.values(parsedFilesBySlot)

retourne :

[
  [fileA],
  [fileB, fileC],
]

Ça prend seulement les valeurs de l’objet, pas les clés.

Les clés csv1, csv4 disparaissent dans ce résultat, parce qu’à ce moment-là tu veux juste tous les fichiers parsés.

### .flatMap(...)
.flatMap((slotFiles) => ...)

flatMap fait deux choses :

1. Il applique une transformation à chaque élément.
2. Il aplatit le résultat d’un niveau.

Exemple simple :

const data = [
  [fileA],
  [fileB, fileC],
];

data.flatMap((slotFiles) => slotFiles);

Résultat :

[fileA, fileB, fileC]

Sans flatMap, avec seulement map, tu aurais gardé un tableau de tableaux :

[
  [fileA],
  [fileB, fileC],
]

Avec flatMap, tu obtiens un tableau simple :

[fileA, fileB, fileC]
(slotFiles ?? [])
(slotFiles ?? [])

Ça veut dire :

Si slotFiles existe, utilise slotFiles.
Sinon, utilise [].

Pourquoi ? Parce que parsedFilesBySlot est un Partial<Record<...>>.

Donc certains slots peuvent ne pas exister.

Exemple :

parsedFilesBySlot = {
  csv4: [fileB],
}

Si csv1 n’existe pas, sa valeur peut être undefined.

Donc on protège le code avec :

### slotFiles ?? []

pour éviter de faire .filter(...) sur undefined.

.filter((parsedFile): parsedFile is ParsedGlpiImportAsset => Boolean(parsedFile))

Cette partie :

.filter((parsedFile): parsedFile is ParsedGlpiImportAsset => Boolean(parsedFile))

sert à retirer les valeurs vides éventuelles.

Boolean(parsedFile) retourne :

true si parsedFile existe
false si parsedFile vaut null ou undefined

Exemple :

[fileA, null, fileB, undefined].filter(Boolean)

Résultat :

[fileA, fileB]

La partie spéciale :

parsedFile is ParsedGlpiImportAsset

est un type guard TypeScript.

Elle dit à TypeScript :

Après ce filter, parsedFile est bien un ParsedGlpiImportAsset.
Ce n’est pas null ou undefined.

# Fonctions JSZip utiles pour ton projet
zip.files

C’est ce que ton code utilise indirectement ici :

## Object.values(zip.files)

Dans la doc, files est un objet contenant les fichiers du ZIP avec le nom comme clé.

Exemple conceptuel :

zip.files = {
  "images/PC001.png": entry1,
  "images/Printer01.jpg": entry2,
  "document.pdf": entry3,
};

Donc :

clé = "images/PC001.png"
valeur = objet ZipObject du fichier

Dans ton code, tu transformes cet objet en tableau avec Object.values(zip.files) pour pouvoir faire .filter(...).

## zip.file("chemin")

Permet de récupérer un fichier précis dans le ZIP. La doc indique que file(name) retourne un ZipObject si le fichier existe, sinon null, et que les dossiers se notent avec /.

Exemple utile :

const image = zip.file("images/PC001.png");

if (image) {
  const blob = await image.async("blob");
}

Ça peut être utile si un jour tu veux récupérer une image précise par son chemin.

## zip.filter(...)

JSZip a déjà une méthode .filter(...) qui permet de filtrer les fichiers/dossiers du ZIP. Elle retourne un tableau de ZipObject correspondant au filtre.

Dans ton code actuel, tu fais plutôt :

Object.values(zip.files).filter(...)

Mais tu pourrais aussi faire avec JSZip :

const images = zip.filter((relativePath, file) => {
  return !file.dir && /\.(png|jpe?g|webp|gif)$/i.test(relativePath);
});
## zip.forEach(...)

Permet de parcourir les entrées du ZIP avec un callback. La doc précise que le callback reçoit relativePath et file.

Exemple :

zip.forEach((relativePath, file) => {
  console.log(relativePath, file.name, file.dir);
});

Utile pour debugger un ZIP et voir ce qu’il contient.

## entry.async("blob"), entry.async("text"), etc.

Dans ton code, tu utilises déjà :

const rawBlob = await entry.async("blob");

La doc indique que ZipObject#async(type) retourne une Promise du contenu dans le type demandé. Les types possibles incluent text/string, blob, arraybuffer, uint8array, base64, etc.

Exemples :

const text = await entry.async("text");        // pour lire un .txt, .csv, .json
const blob = await entry.async("blob");        // pour lire une image
const buffer = await entry.async("arraybuffer"); // pour binaire