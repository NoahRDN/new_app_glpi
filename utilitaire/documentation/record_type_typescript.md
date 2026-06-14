# Type `Record` en TypeScript

## 1. Définition

`Record` est un type TypeScript qui représente un objet avec des clés et des valeurs typées.

Syntaxe :

```ts
Record<Clé, Valeur>
```

Exemple :

```ts
const TICKET_TYPE_LABELS: Record<number, string> = {
  1: "Incident",
  2: "Demande",
};
```

Cela veut dire :

```txt
Les clés sont des nombres.
Les valeurs sont des strings.
```

---

# 2. Pourquoi utiliser `Record` ?

`Record` est pratique quand tu veux créer un objet de correspondance.

Exemples :

- id de type ticket → label affiché ;
- statut ticket → couleur ;
- clé Kanban → liste de tickets ;
- itemtype GLPI → label ;
- code erreur → message utilisateur.

Exemple :

```ts
const TICKET_STATUS_LABELS: Record<number, string> = {
  1: "Nouveau",
  2: "Assigné",
  3: "Planifié",
  4: "En attente",
  5: "Résolu",
  6: "Fermé",
};
```

Utilisation :

```ts
const label = TICKET_STATUS_LABELS[2];

console.log(label); // "Assigné"
```

---

# 3. Différence entre tableau et Record

## Tableau

Un tableau est une liste.

```ts
const labels = ["Incident", "Demande"];
```

Il possède `.map()` directement :

```ts
labels.map((label) => console.log(label));
```

## Record

Un `Record` est un objet.

```ts
const labels = {
  1: "Incident",
  2: "Demande",
};
```

Tu ne peux pas faire :

```ts
labels.map(...); // Erreur
```

Pour parcourir un `Record`, il faut utiliser :

```ts
Object.entries(labels)
Object.keys(labels)
Object.values(labels)
```

---

# 4. `Object.entries()` — obtenir clé + valeur

Avec :

```ts
const TICKET_TYPE_LABELS: Record<number, string> = {
  1: "Incident",
  2: "Demande",
};
```

Tu peux faire :

```ts
Object.entries(TICKET_TYPE_LABELS);
```

Résultat :

```ts
[
  ["1", "Incident"],
  ["2", "Demande"],
]
```

Attention : les clés deviennent des strings en JavaScript.

---

## Exemple React avec `<select>`

```tsx
<Select
  value={form.type}
  onChange={(event) => {
    setForm({
      ...form,
      type: Number(event.target.value),
    });
  }}
>
  {Object.entries(TICKET_TYPE_LABELS).map(([type, label]) => (
    <option key={type} value={type}>
      {label}
    </option>
  ))}
</Select>
```

Ici :

```ts
[type, label]
```

veut dire :

```txt
type = la clé
label = la valeur
```

Premier tour :

```txt
type = "1"
label = "Incident"
```

Deuxième tour :

```txt
type = "2"
label = "Demande"
```

---

# 5. `Object.keys()` — obtenir seulement les clés

```ts
Object.keys(TICKET_TYPE_LABELS);
```

Résultat :

```ts
["1", "2"]
```

Si tu veux des nombres :

```ts
const ticketTypeIds = Object.keys(TICKET_TYPE_LABELS).map(Number);
```

Résultat :

```ts
[1, 2]
```

---

# 6. `Object.values()` — obtenir seulement les valeurs

```ts
Object.values(TICKET_TYPE_LABELS);
```

Résultat :

```ts
["Incident", "Demande"]
```

Exemple React :

```tsx
{Object.values(TICKET_TYPE_LABELS).map((label) => (
  <span key={label}>{label}</span>
))}
```

Mais pour un `<select>`, ce n’est pas suffisant, car tu as besoin de l’id pour `value`.

Pour un `<select>`, préfère `Object.entries()`.

---

# 7. Exemple avec des clés string

```ts
type TicketKanbanGroupKey = "new" | "in_progress" | "done";

const TICKET_KANBAN_LABELS: Record<TicketKanbanGroupKey, string> = {
  new: "Nouveau",
  in_progress: "In Progress",
  done: "Terminé",
};
```

Ici TypeScript oblige à fournir toutes les clés.

Si tu oublies `done`, TypeScript signale une erreur.

---

# 8. Exemple : grouper les tickets par colonne Kanban

```ts
type TicketKanbanGroupKey = "new" | "in_progress" | "done";

type TicketKanban = Record<TicketKanbanGroupKey, Ticket[]>;

const kanban: TicketKanban = {
  new: [],
  in_progress: [],
  done: [],
};
```

Cela veut dire :

```txt
new contient un tableau de tickets
in_progress contient un tableau de tickets
done contient un tableau de tickets
```

Utilisation :

```ts
kanban.new.push(ticket);
```

ou :

```tsx
{kanban.in_progress.map((ticket) => (
  <Button key={ticket.id}>{ticket.name}</Button>
))}
```

---

# 9. Exemple : couleurs par statut

```ts
const STATUS_COLORS: Record<number, string> = {
  1: "blue",
  2: "orange",
  3: "purple",
  4: "yellow",
  5: "green",
  6: "gray",
};

const color = STATUS_COLORS[ticket.status.id];
```

---

# 10. Exemple : labels GLPI par itemtype

```ts
type AssetItemType =
  | "Computer"
  | "Monitor"
  | "Printer"
  | "NetworkEquipment"
  | "Phone";

const ASSET_TYPE_LABELS: Record<AssetItemType, string> = {
  Computer: "Ordinateur",
  Monitor: "Moniteur",
  Printer: "Imprimante",
  NetworkEquipment: "Matériel réseau",
  Phone: "Téléphone",
};
```

Utilisation :

```ts
const label = ASSET_TYPE_LABELS["Computer"];

console.log(label); // "Ordinateur"
```

---

# 11. Attention avec `Record<number, string>`

Même si tu écris :

```ts
const labels: Record<number, string> = {
  1: "Incident",
  2: "Demande",
};
```

à l’exécution, les clés d’un objet JavaScript deviennent des chaînes.

Donc :

```ts
Object.entries(labels);
```

donne :

```ts
[
  ["1", "Incident"],
  ["2", "Demande"],
]
```

et non :

```ts
[
  [1, "Incident"],
  [2, "Demande"],
]
```

Dans un `onChange`, il faut souvent faire :

```ts
Number(event.target.value)
```

---

# 12. Accéder à une valeur avec une clé

```ts
const label = TICKET_TYPE_LABELS[1];
```

Résultat :

```ts
"Incident"
```

Si la clé n’existe pas :

```ts
const label = TICKET_TYPE_LABELS[99];
```

Résultat possible :

```ts
undefined
```

Pour être prudent :

```ts
const label = TICKET_TYPE_LABELS[typeId] ?? "Type inconnu";
```

---

# 13. Ajouter ou modifier une valeur

```ts
const labels: Record<number, string> = {
  1: "Incident",
  2: "Demande",
};

labels[3] = "Autre";
labels[2] = "Demande de service";
```

Mais pour les constantes de configuration, il vaut mieux ne pas modifier après création.

---

# 14. `as const` avec un Record ou un objet de configuration

```ts
export const TICKET_STATUS_IDS = {
  NEW: 1,
  ASSIGNED: 2,
  PLANNED: 3,
  PENDING: 4,
  SOLVED: 5,
  CLOSED: 6,
} as const;
```

`as const` dit à TypeScript :

```txt
Ces valeurs sont fixes.
NEW vaut exactement 1, pas juste number.
```

---

# 15. Record ou Array ?

## Utilise un Record quand tu veux accéder directement par clé

```ts
TICKET_TYPE_LABELS[1]
```

C’est rapide et clair.

## Utilise un tableau quand tu veux surtout lister

```ts
const ticketTypes = [
  { id: 1, label: "Incident" },
  { id: 2, label: "Demande" },
];
```

Puis :

```tsx
{ticketTypes.map((type) => (
  <option key={type.id} value={type.id}>
    {type.label}
  </option>
))}
```

Pour un `<select>`, les deux solutions sont possibles.

---

# 16. Résumé rapide

| Besoin | Solution |
|---|---|
| Associer id → label | `Record<number, string>` |
| Associer clé texte → tableau | `Record<string, Ticket[]>` |
| Parcourir clé + valeur | `Object.entries(record)` |
| Parcourir seulement les clés | `Object.keys(record)` |
| Parcourir seulement les valeurs | `Object.values(record)` |
| Utiliser dans un select | `Object.entries(...).map(...)` |
| Récupérer un label | `record[id]` |

## Règle à retenir

```txt
Record = structure clé → valeur
Array = liste d’éléments
```

Donc :

```txt
Array → .map()
Record → Object.entries(record).map()
```
