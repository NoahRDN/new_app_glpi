# Tableaux en React / TypeScript

## 1. Définition

Un tableau est une liste d’éléments.

```ts
const tickets = [
  { id: 1, name: "Ticket imprimante" },
  { id: 2, name: "Ticket réseau" },
];
```

En React, les tableaux sont souvent utilisés pour afficher des listes.

```tsx
{tickets.map((ticket) => (
  <div key={ticket.id}>{ticket.name}</div>
))}
```

---

# 2. `.map()` — afficher ou transformer une liste

## Rôle

`.map()` parcourt un tableau et retourne un nouveau tableau.

En React, il sert souvent à transformer une liste de données en composants JSX.

```tsx
{tickets.map((ticket) => (
  <Button key={ticket.id}>{ticket.name}</Button>
))}
```

## Exemple simple

```ts
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => number * 2);

console.log(doubled); // [2, 4, 6]
```

## Exemple React

```tsx
const users = [
  { id: 1, username: "admin" },
  { id: 2, username: "tech" },
];

return (
  <div>
    {users.map((user) => (
      <p key={user.id}>{user.username}</p>
    ))}
  </div>
);
```

---

# 3. Le rôle de `key` dans React

Quand tu utilises `.map()` dans React, il faut mettre une `key`.

```tsx
{tickets.map((ticket) => (
  <Button key={ticket.id}>{ticket.name}</Button>
))}
```

La `key` aide React à identifier chaque élément.

Évite :

```tsx
{tickets.map((ticket, index) => (
  <Button key={index}>{ticket.name}</Button>
))}
```

Préférence :

```tsx
key={ticket.id}
```

Pourquoi ? Si tu ajoutes, supprimes ou déplaces des éléments, l’index peut changer. Avec un vrai id, React suit mieux chaque élément.

---

# 4. `.filter()` — garder certains éléments

## Rôle

`.filter()` retourne un nouveau tableau avec seulement les éléments qui respectent une condition.

```ts
const tickets = [
  { id: 1, status: "new" },
  { id: 2, status: "done" },
];

const newTickets = tickets.filter((ticket) => ticket.status === "new");

console.log(newTickets); // [{ id: 1, status: "new" }]
```

## Exemple GLPI

```ts
const activeUsers = users.filter((user) => !user.is_deleted);
```

## Exemple React

```tsx
{users
  .filter((user) => !user.is_deleted)
  .map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ))}
```

---

# 5. `.find()` — trouver un seul élément

## Rôle

`.find()` retourne le premier élément qui respecte une condition.

```ts
const ticket = tickets.find((ticket) => ticket.id === 10);
```

Si aucun élément n’est trouvé, le résultat est `undefined`.

Exemple dans ton Kanban :

```ts
const droppedTicket = ticketsAll.find((ticket) => ticket.id === ticketId);

if (!droppedTicket) {
  return;
}
```

---

# 6. `.some()` — vérifier s’il existe au moins un élément

## Rôle

`.some()` retourne `true` si au moins un élément respecte la condition.

```ts
const hasAssignedMember = ticket.team.some((teamMember) => {
  return teamMember.role === "assigned";
});
```

Exemple :

```ts
const numbers = [1, 2, 3];

console.log(numbers.some((number) => number > 2)); // true
console.log(numbers.some((number) => number > 5)); // false
```

Dans ton code :

```ts
function hasAssignedTechnicianOrGroup(ticket: Ticket) {
  return ticket.team.some((teamMember) => {
    const normalizedRole = teamMember.role.trim().toLowerCase();
    const normalizedType = teamMember.type.trim().toLowerCase();

    return (
      normalizedRole === "assigned" &&
      (normalizedType === "user" || normalizedType === "group")
    );
  });
}
```

Cela veut dire :

```txt
Est-ce qu’il existe au moins un membre d’équipe assigné de type User ou Group ?
```

---

# 7. `.every()` — vérifier si tous les éléments respectent une condition

## Rôle

`.every()` retourne `true` seulement si tous les éléments respectent la condition.

```ts
const allTicketsHaveName = tickets.every(
  (ticket) => ticket.name.trim().length > 0,
);
```

Exemple :

```ts
const numbers = [2, 4, 6];

console.log(numbers.every((number) => number % 2 === 0)); // true
```

---

# 8. `.reduce()` — accumuler ou grouper

## Rôle

`.reduce()` sert à transformer un tableau en autre chose :

- un nombre ;
- un objet ;
- un `Record` ;
- un groupement ;
- une statistique.

## Exemple total

```ts
const prices = [10, 20, 30];

const total = prices.reduce((sum, price) => {
  return sum + price;
}, 0);

console.log(total); // 60
```

## Exemple Kanban

```ts
type Kanban = {
  new: Ticket[];
  in_progress: Ticket[];
  done: Ticket[];
};

const kanban = tickets.reduce<Kanban>(
  (groups, ticket) => {
    if (ticket.status.id === 1) {
      groups.new.push(ticket);
    }

    if ([2, 3, 4].includes(ticket.status.id)) {
      groups.in_progress.push(ticket);
    }

    if ([5, 6].includes(ticket.status.id)) {
      groups.done.push(ticket);
    }

    return groups;
  },
  {
    new: [],
    in_progress: [],
    done: [],
  },
);
```

---

# 9. `.includes()` — vérifier si une valeur existe

```
.includes() marche très bien pour les valeurs simples :
number, string, boolean

Mais pour les objets ou tableaux, .includes() compare la référence mémoire,
pas le contenu.
```

```ts
const inProgressStatuses = [2, 3, 4];

const isInProgress = inProgressStatuses.includes(ticket.status.id);
```

Dans ton code :

```ts
TICKET_IN_PROGRESS_STATUS_IDS.includes(statusId)
```

veut dire :

```txt
Est-ce que le statusId cible est un statut In Progress ?
```

---

# 10. `.sort()` — trier un tableau

Attention : `.sort()` modifie le tableau original.

À éviter directement sur un state React :

```ts
tickets.sort((a, b) => a.id - b.id);
```

Préférer :

```ts
const sortedTickets = [...tickets].sort((a, b) => a.id - b.id);
```

Trier par nom :

```ts
const sortedUsers = [...users].sort((a, b) =>
  a.username.localeCompare(b.username),
);
```

---

# 11. `.slice()` — copier une partie du tableau

```ts
const firstTenTickets = tickets.slice(0, 10);
```

`slice()` ne modifie pas le tableau original.

---

# 12. `.splice()` — attention, modifie le tableau original

```ts
tickets.splice(0, 1);
```

À éviter directement sur un state React.

Préférer `.filter()` pour supprimer :

```ts
setTickets((current) =>
  current.filter((ticket) => ticket.id !== ticketId),
);
```

---

# 13. Ajouter un élément dans un state React

Mauvais :

```ts
tickets.push(newTicket);
setTickets(tickets);
```

Bon :

```ts
setTickets((current) => [...current, newTicket]);
```

---

# 14. Supprimer un élément dans un state React

```ts
setTickets((current) =>
  current.filter((ticket) => ticket.id !== ticketId),
);
```

---

# 15. Modifier un élément dans un state React

```ts
setTickets((current) =>
  current.map((ticket) => {
    if (ticket.id !== ticketId) {
      return ticket;
    }

    return {
      ...ticket,
      status: {
        id: 2,
        name: "Assigné",
      },
    };
  }),
);
```

Logique :

```txt
si ce n’est pas le bon ticket → on le retourne tel quel
si c’est le bon ticket → on retourne une copie modifiée
```

---

# 16. Chaîner plusieurs méthodes

```tsx
{tickets
  .filter((ticket) => !ticket.is_deleted)
  .filter((ticket) => ticket.status.id === 1)
  .map((ticket) => (
    <Button key={ticket.id}>{ticket.name}</Button>
  ))}
```

Si ça devient trop long, prépare une variable :

```ts
const newTickets = tickets.filter(
  (ticket) => !ticket.is_deleted && ticket.status.id === 1,
);
```

Puis :

```tsx
{newTickets.map((ticket) => (
  <Button key={ticket.id}>{ticket.name}</Button>
))}
```

---

# 17. `useMemo()` avec les tableaux

```ts
const groupTickets = useMemo(() => {
  return groupTicketsByKanban(ticketsAll ?? []);
}, [ticketsAll]);
```

Cela veut dire :

```txt
Recalcule groupTickets seulement quand ticketsAll change.
```

---

# 18. Piège fréquent : `filter()` ne modifie pas le tableau original

Mauvais :

```ts
tickets.filter((ticket) => ticket.status.id === 1);
console.log(tickets);
```

Bon :

```ts
const newTickets = tickets.filter((ticket) => ticket.status.id === 1);
console.log(newTickets);
```

---

# 19. Piège fréquent : oublier `return` dans `.map()`

Mauvais :

```ts
const names = users.map((user) => {
  user.username;
});
```

Résultat :

```ts
[undefined, undefined]
```

Bon :

```ts
const names = users.map((user) => {
  return user.username;
});
```

Ou version courte :

```ts
const names = users.map((user) => user.username);
```

---

# 20. Résumé rapide

| Besoin | Méthode |
|---|---|
| Afficher / transformer | `.map()` |
| Garder certains éléments | `.filter()` |
| Trouver un élément | `.find()` |
| Vérifier au moins un | `.some()` |
| Vérifier tous | `.every()` |
| Accumuler / grouper | `.reduce()` |
| Vérifier une valeur | `.includes()` |
| Trier | `.sort()` |
| Copier une partie | `.slice()` |

## Règle React importante

Ne modifie pas directement un tableau venant d’un state.

Préférer :

```ts
setItems((current) => [...current, newItem]);
setItems((current) => current.filter(...));
setItems((current) => current.map(...));
```
