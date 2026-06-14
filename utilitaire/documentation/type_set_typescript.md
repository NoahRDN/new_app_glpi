# Type `Set` en TypeScript / JavaScript

## 1. Définition

Un `Set` est une collection de valeurs **uniques**. Contrairement à un tableau, il ne garde pas les doublons.

```ts
const ids = new Set<number>();

ids.add(1);
ids.add(2);
ids.add(1);

console.log([...ids]); // [1, 2]
```

Même si `1` est ajouté deux fois, il n’existe qu’une seule fois.

---

## 2. Quand utiliser `Set` ?

Utilise `Set` quand tu veux :

- éviter les doublons ;
- vérifier rapidement si une valeur existe déjà ;
- stocker des ids uniques ;
- comparer deux listes ;
- construire une liste unique depuis un tableau.

Exemples dans ton projet GLPI :

```txt
- éviter d’ajouter deux fois le même asset à un ticket
- garder une liste unique de ticketId
- savoir si un ticket a déjà été traité
- regrouper des ids de tickets assignés
```

---

## 3. Créer un `Set`

### Set vide

```ts
const ids = new Set<number>();
```

### Set avec des valeurs initiales

```ts
const ids = new Set<number>([1, 2, 3]);
```

### Supprimer les doublons d’un tableau

```ts
const values = [1, 2, 2, 3, 3, 3];
const uniqueValues = [...new Set(values)];

console.log(uniqueValues); // [1, 2, 3]
```

---

# 4. Les actions importantes

## `add()` — ajouter une valeur

```ts
const ids = new Set<number>();

ids.add(10);
ids.add(20);
ids.add(10);

console.log([...ids]); // [10, 20]
```

---

## `has()` — vérifier si une valeur existe

```ts
const ids = new Set<number>([10, 20, 30]);

console.log(ids.has(20)); // true
console.log(ids.has(99)); // false
```

Exemple GLPI :

```ts
const assignedTicketIds = new Set<number>([12, 15, 18]);

if (assignedTicketIds.has(ticket.id)) {
  console.log("Ce ticket est déjà assigné");
}
```

---

## `delete()` — supprimer une valeur

```ts
const ids = new Set<number>([1, 2, 3]);

ids.delete(2);

console.log([...ids]); // [1, 3]
```

---

## `clear()` — vider le Set

```ts
const ids = new Set<number>([1, 2, 3]);

ids.clear();

console.log(ids.size); // 0
```

---

## `size` — nombre d’éléments

```ts
const ids = new Set<number>([1, 2, 3]);

console.log(ids.size); // 3
```

Attention : `size` n’est pas une fonction.

Correct :

```ts
ids.size
```

Incorrect :

```ts
ids.size()
```

---

## `forEach()` — parcourir un Set

```ts
const ids = new Set<number>([1, 2, 3]);

ids.forEach((id) => {
  console.log(id);
});
```

---

# 5. Convertir un `Set` en tableau

Un `Set` n’a pas directement `.map()`.

Incorrect :

```ts
const ids = new Set<number>([1, 2, 3]);

ids.map(...); // Erreur
```

Correct :

```ts
const ids = new Set<number>([1, 2, 3]);

[...ids].map((id) => {
  console.log(id);
});
```

Ou :

```ts
Array.from(ids).map((id) => {
  console.log(id);
});
```

---

# 6. Exemple React : afficher des ids depuis un Set

```tsx
const selectedIds = new Set<number>([1, 2, 3]);

return (
  <div>
    {[...selectedIds].map((id) => (
      <p key={id}>Ticket {id}</p>
    ))}
  </div>
);
```

---

# 7. Exemple : éviter les doublons d’assets sélectionnés

Tu peux créer une clé unique avec `itemtype` + `items_id`.

```ts
function getElementKey(element: SelectedTicketElement) {
  return `${element.itemtype}-${element.items_id}`;
}
```

Puis :

```ts
const selectedKeys = new Set(
  selectedElements.map((element) => getElementKey(element)),
);

if (selectedKeys.has(getElementKey(newElement))) {
  console.log("Élément déjà sélectionné");
}
```

---

# 8. Exemple : tickets assignés avec `Set`

```ts
const assignedTicketIds = new Set<number>();

ticketUsers.forEach((ticketUser) => {
  if (ticketUser.type === 2) {
    assignedTicketIds.add(Number(ticketUser.tickets_id));
  }
});

groupTickets.forEach((groupTicket) => {
  if (groupTicket.type === 2) {
    assignedTicketIds.add(Number(groupTicket.tickets_id));
  }
});

const assignedTickets = tickets.filter((ticket) =>
  assignedTicketIds.has(ticket.id),
);
```

Même si un ticket est assigné à un utilisateur et à un groupe, son id reste unique.

---

# 9. Opérations utiles avec deux Sets

## Union — fusionner deux Sets

```ts
const a = new Set([1, 2]);
const b = new Set([2, 3]);

const union = new Set([...a, ...b]);

console.log([...union]); // [1, 2, 3]
```

## Intersection — garder ce qui existe dans les deux

```ts
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

const intersection = new Set([...a].filter((value) => b.has(value)));

console.log([...intersection]); // [2, 3]
```

## Différence — enlever les valeurs d’un autre Set

```ts
const a = new Set([1, 2, 3]);
const b = new Set([2]);

const difference = new Set([...a].filter((value) => !b.has(value)));

console.log([...difference]); // [1, 3]
```

---

# 10. Attention avec React State

Il ne faut pas modifier directement un `Set` stocké dans un `useState`.

Mauvais :

```ts
const [selectedIds, setSelectedIds] = useState(new Set<number>());

selectedIds.add(5);
setSelectedIds(selectedIds);
```

Bon :

```ts
setSelectedIds((current) => {
  const next = new Set(current);
  next.add(5);
  return next;
});
```

Pour supprimer :

```ts
setSelectedIds((current) => {
  const next = new Set(current);
  next.delete(5);
  return next;
});
```

Pour vider :

```ts
setSelectedIds(new Set());
```

---

# 11. Résumé rapide

| Besoin | Code |
|---|---|
| Créer | `new Set<number>()` |
| Ajouter | `set.add(value)` |
| Vérifier | `set.has(value)` |
| Supprimer | `set.delete(value)` |
| Vider | `set.clear()` |
| Taille | `set.size` |
| Convertir en tableau | `[...set]` |
| Supprimer les doublons | `[...new Set(array)]` |

## Règle à retenir

```txt
Set = liste de valeurs uniques
Array = liste normale qui peut contenir des doublons
```
