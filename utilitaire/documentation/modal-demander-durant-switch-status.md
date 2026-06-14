# Les 3 états React importants

Dans ListTicketKanban, tu as 3 états qui contrôlent les demandes d’action.

## pendingStatusChange

Il sert quand le ticket doit d’abord être assigné avant de continuer.

const [pendingStatusChange, setPendingStatusChange] = useState<{
  nextModeAfterSuccess?: TicketStatusTransitionMode;
  statusId: number;
  ticket: Ticket;
} | null>(null);

Il veut dire :

Avant de changer le statut, il faut demander un technicien ou un groupe.

Exemple :

Nouveau → En cours
→ il faut assigner un technicien
## pendingTransition

Il sert quand il faut demander un commentaire, une solution, une raison de refus ou de réouverture.

const [pendingTransition, setPendingTransition] = useState<{
  mode: TicketStatusTransitionMode;
  nextModeAfterSuccess?: "review";
  targetStatusId?: number;
  ticket: Ticket;
} | null>(null);

Le champ important est mode.

Les modes possibles sont définis ici :

export type TicketStatusTransitionMode =
  | "resolve"
  | "approve"
  | "refuse"
  | "reopen";

Donc :

Mode	Signification
resolve	demander une solution
approve	approuver la solution
refuse	refuser la solution
reopen	demander une raison de réouverture
## pendingResolvedReview

Il sert quand le ticket est déjà Résolu et qu’il faut choisir :

Valider ou Refuser la solution
const [pendingResolvedReview, setPendingResolvedReview] = useState<{
  refuseStatusId: number;
  solutionId?: number;
  ticket: Ticket;
} | null>(null);

C’est ce state qui affiche le formulaire TicketResolvedReviewForm.

| Mode      | Signification                      |
| --------- | ---------------------------------- |
| `resolve` | demander une solution              |
| `approve` | approuver la solution              |
| `refuse`  | refuser la solution                |
| `reopen`  | demander une raison de réouverture |


# Logique des transitions de statuts des tickets dans la fonction handleTicketDrop où il y a "should...."

## `shouldCloseNewTicket`

```ts
const shouldCloseNewTicket =
  currentStatusId === TICKET_STATUS_IDS.NEW &&
  isDoneDestination;
```

### Signification

Transition :

```text
Nouveau → Terminé
```

Mais fonctionnellement, on ne peut pas fermer directement un ticket nouveau.

Le workflow est donc :

### Si le ticket n'est pas assigné

```text
Nouveau
  ↓
Assignation
  ↓
Solution
  ↓
Validation / Refus
```

### Si le ticket est déjà assigné

```text
Nouveau
  ↓
Solution
  ↓
Validation / Refus
```

Traitement :

```ts
if (shouldCloseNewTicket) {
  if (!alreadyHasAssignment) {
    setPendingStatusChange({
      nextModeAfterSuccess: "resolve",
      statusId: TICKET_STATUS_IDS.ASSIGNED,
      ticket: droppedTicket,
    });
    setIsStatusRequirementModalOpen(true);
    return;
  }

  setPendingTransition({
    mode: "resolve",
    nextModeAfterSuccess: "review",
    ticket: droppedTicket,
  });
  setIsStatusRequirementModalOpen(true);
  return;
}
```

---

## `shouldResolveNewTicket`

```ts
const shouldResolveNewTicket =
  currentStatusId === TICKET_STATUS_IDS.NEW &&
  statusId === TICKET_STATUS_IDS.SOLVED;
```

### Signification

Transition :

```text
Nouveau → Résolu
```

Même logique :

Si le ticket n'est pas assigné, il faut d'abord passer par l'étape d'assignation.

---

## `requiresAssignmentStep`

```ts
const requiresAssignmentStep =
  currentStatusId === TICKET_STATUS_IDS.NEW &&
  TICKET_IN_PROGRESS_STATUS_IDS.includes(statusId) &&
  !alreadyHasAssignment;
```

### Signification

Transition :

```text
Nouveau → En cours
```

Si aucun technicien ou groupe n'est assigné au ticket, le système ouvre la popup d'assignation.

Traitement :

```ts
if (requiresAssignmentStep) {
  setPendingStatusChange({
    statusId,
    ticket: droppedTicket,
  });
  setIsStatusRequirementModalOpen(true);
  return;
}
```

---

## `shouldResolveTicket`

```ts
const shouldResolveTicket =
  currentStatusId !== undefined &&
  TICKET_IN_PROGRESS_STATUS_IDS.includes(currentStatusId) &&
  statusId === TICKET_STATUS_IDS.SOLVED;
```

### Signification

Transition :

```text
En cours → Résolu
```

Action requise :

```text
Demander une solution
```

Traitement :

```ts
setPendingTransition({
  mode: "resolve",
  ticket: droppedTicket,
});
```

---

## `shouldCloseInProgressTicket`

```ts
const shouldCloseInProgressTicket =
  currentStatusId !== undefined &&
  TICKET_IN_PROGRESS_STATUS_IDS.includes(currentStatusId) &&
  isDoneDestination;
```

### Signification

Transition :

```text
En cours → Terminé
```

Comme la colonne **Terminé** correspond à l'état **CLOSED**, le workflow attendu est :

```text
En cours
  ↓
Saisie de la solution
  ↓
Résolu
  ↓
Validation / Refus
  ↓
Clos
```

Traitement :

```ts
setPendingTransition({
  mode: "resolve",
  nextModeAfterSuccess: "review",
  ticket: droppedTicket,
});
```

### Rôle de `nextModeAfterSuccess`

```ts
nextModeAfterSuccess: "review"
```

Cela signifie :

```text
Après l'enregistrement de la solution,
ouvrir automatiquement la popup
"Valider / Refuser".
```

---

## `shouldApproveResolvedTicket`

```ts
const shouldApproveResolvedTicket =
  currentStatusId === TICKET_STATUS_IDS.SOLVED &&
  isDoneDestination;
```

### Signification

Transition :

```text
Résolu → Terminé / Clos
```

Action requise :

```text
Valider ou refuser la solution
```

Traitement :

```ts
openResolvedReviewModal({
  refuseStatusId: TICKET_STATUS_IDS.ASSIGNED,
  ticket: droppedTicket,
});
```

---

## `shouldRefuseResolvedTicket`

```ts
const shouldRefuseResolvedTicket =
  currentStatusId === TICKET_STATUS_IDS.SOLVED &&
  TICKET_IN_PROGRESS_STATUS_IDS.includes(statusId);
```

### Signification

Transition :

```text
Résolu → En cours
```

Cette transition est interprétée comme un refus de la solution proposée.

Traitement :

```ts
setPendingTransition({
  mode: "refuse",
  ticket: droppedTicket,
});
```

---

## `shouldReopenClosedTicket`

```ts
const shouldReopenClosedTicket =
  currentStatusId === TICKET_STATUS_IDS.CLOSED &&
  TICKET_IN_PROGRESS_STATUS_IDS.includes(statusId);
```

### Signification

Transition :

```text
Clos → En cours
```

Cette transition correspond à une réouverture du ticket.

Le système demande alors un motif de réouverture.

Traitement :

```ts
setPendingTransition({
  mode: "reopen",
  targetStatusId: TICKET_STATUS_IDS.ASSIGNED,
  ticket: droppedTicket,
});
```

---

## `shouldReturnClosedTicketToNew`

```ts
const shouldReturnClosedTicketToNew =
  currentStatusId === TICKET_STATUS_IDS.CLOSED &&
  statusId === TICKET_STATUS_IDS.NEW;
```

### Signification

Transition :

```text
Clos → Nouveau
```

Cette transition est également considérée comme une réouverture, mais avec un retour à l'état **NEW**.

Traitement :

```ts
setPendingTransition({
  mode: "reopen",
  targetStatusId: TICKET_STATUS_IDS.NEW,
  ticket: droppedTicket,
});
```

---

## Cas par défaut

Si aucune règle métier spécifique n'est déclenchée, le système effectue simplement la mise à jour du statut.

```ts
await updateTicketStatusAsync({
  ticketId,
  statusId,
});
```
## tableau expication contenu closeStatusTransitionModal
| Élément | Rôle |
|---|---|
| `setIsStatusRequirementModalOpen(false)` | Ferme la modal liée à la transition de statut. |
| `setPendingStatusChange(null)` | Efface le changement de statut en attente, souvent utilisé quand il faut d’abord affecter un technicien/groupe. |
| `setPendingTransition(null)` | Efface l’action de transition en attente, comme résoudre, refuser ou rouvrir un ticket. |
| `setPendingResolvedReview(null)` | Efface la validation/refus en attente pour un ticket déjà résolu. |
| `setStatusTransitionError(null)` | Efface l’ancienne erreur affichée dans la modal. |
| `closeStatusTransitionModal()` | Fonction de reset complet : ferme la modal et nettoie tous les états temporaires. |

# Schéma global simple

```
Nouveau → En cours
si pas assigné :
  popup assignation
  puis status = ASSIGNED

Nouveau → Résolu
si pas assigné :
  popup assignation
  puis popup solution
sinon :
  popup solution
  puis status = SOLVED

Nouveau → Terminé
si pas assigné :
  popup assignation
  puis popup solution
  puis popup validation/refus
sinon :
  popup solution
  puis popup validation/refus

En cours → Résolu
popup solution
puis status = SOLVED

En cours → Terminé
popup solution
puis status = SOLVED
puis popup validation/refus
si validation :
  solution acceptée
  ticket CLOSED
  popup Super Cost
si refus :
  solution refusée
  followup raison
  ticket ASSIGNED

Résolu → Terminé
popup validation/refus
si validation :
  solution acceptée
  ticket CLOSED
si refus :
  solution refusée
  ticket ASSIGNED

Résolu → En cours
popup refus solution
solution refusée
followup raison
ticket ASSIGNED

Clos → En cours
popup réouverture
followup raison
ticket ASSIGNED

Clos → Nouveau
popup réouverture
followup raison
ticket ASSIGNED
puis ticket NEW

```