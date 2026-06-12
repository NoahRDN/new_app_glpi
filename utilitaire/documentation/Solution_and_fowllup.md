## Différence entre Solution et Followup
### Solution

C’est la réponse officielle de résolution.

Exemple :

Pilote imprimante réinstallé. Test d’impression effectué avec succès.

Dans l’API v2, le schéma Solution correspond bien à l’objet interne ITILSolution. Il contient notamment itemtype, items_id, type, content, user, approver, status, date_creation, date_mod.

Donc pour résoudre un ticket, c’est celui-là que tu dois utiliser.

### Followup

C’est un commentaire / suivi / discussion dans le ticket.

Exemple :

J’ai commencé le diagnostic.
J’attends le retour de l’utilisateur.
Le test a été effectué à 15h.

Dans l’API v2, le schéma Followup correspond à ITILFollowup, avec itemtype, items_id, content, is_private, user, request_type, date, etc.

Donc un Followup est utile, mais ce n’est pas la vraie résolution officielle.

## Quand le ticket est déjà Résolu

Tu peux afficher deux actions :

Approuver la solution
Refuser la solution

Si l’utilisateur approuve :

Solution.status = 3
puis éventuellement ticket status = 6 Clos

Si l’utilisateur refuse :

Solution.status = 4
puis ticket peut revenir en En cours attribué