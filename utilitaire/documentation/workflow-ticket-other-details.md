## Le plus important pour NewApp actuellement si on prend en compte les liaisons précédant

Item_Ticket
→ liaison ticket ↔ équipement

Ticket_User
→ demandeur / observateur / technicien assigné

Group_Ticket
→ groupe demandeur / groupe assigné

ITILFollowup
→ commentaires / suivis

ITILSolution
→ solution

## petite description et remarque

les name de de status et les listes des status utilise dans un ticket ne vient pas de d'un api mais est gérer statiquement dnas le code de GLPI. a part cela, le name qui s'affiche est en fonction du choix de langue de GLPI

## Récupérer les éléments actuellement liés au ticket

```
GET /glpi-legacy-api/Ticket/282/Item_Ticket/
```
ou :
```
GET /glpi-legacy-api/Item_Ticket
```
Puis tu filtres :
```
link.tickets_id === 282
```

## tableau de statut

| Valeur API | Libellé FR        | Libellé EN GLPI     | Sens métier                                                                  |
| ---------: | ----------------- | ------------------- | ---------------------------------------------------------------------------- |
|        `1` | Nouveau           | New                 | Ticket créé, pas encore traité.                                              |
|       `10` | Validation        | Approval            | Ticket en attente d’approbation/validation.                                  |
|        `2` | En cours (Attribué) | Processing assigned | Ticket pris en charge par un technicien/groupe.                              |
|        `3` | En cours planifié | Processing planned  | Intervention planifiée.                                                      |
|        `4` | En attente        | Pending             | Ticket bloqué temporairement : attente utilisateur, fournisseur, pièce, etc. |
|        `5` | Résolu            | Solved              | Solution proposée / problème résolu.                                         |
|        `6` | Clos              | Closed              | Ticket terminé définitivement.                                               |


## champ type lors de la création d’un ticket GLPI :

1 = Incident
2 = Demande / Request

## Règles simples à appliquer dans new app

Création ticket
→ toujours status = Nouveau

Nouveau → En cours attribué
→ autorisé
→ idéalement demander un technicien ou un groupe

En cours attribué → En attente
→ autorisé
→ demander un commentaire obligatoire

En attente → En cours attribué
→ autorisé
→ commentaire conseillé

En cours attribué → Résolu
→ autorisé
→ demander une solution obligatoire

Résolu → Clos
→ autorisé

Résolu → En cours attribué
→ réouverture avant clôture
→ commentaire obligatoire

Clos → En cours attribué
→ réouverture après clôture
→ commentaire obligatoire

Clos → Nouveau
→ à éviter

## étape de validation
itils_validationsteps_id (dans TicketValidation de api legacy)

## Signification de ton résultat TicketValidation
```
{
  "id": 4,
  "itils_validationsteps_id": 4,
  "entities_id": 0,
  "users_id": 2,
  "tickets_id": 287,
  "users_id_validate": 0,
  "itilvalidationtemplates_id": 0,
  "itemtype_target": "User",
  "items_id_target": 2,
  "comment_submission": "<p>demande de validation</p>",
  "comment_validation": null,
  "status": 2,
  "submission_date": "2026-06-11 21:06:35",
  "validation_date": null
}
```

| Champ                        | Signification                                                 |
| ---------------------------- | ------------------------------------------------------------- |
| `id`                         | ID de la demande de validation.                               |
| `itils_validationsteps_id`   | Étape de validation utilisée.                                 |
| `entities_id`                | Entité GLPI concernée.                                        |
| `users_id`                   | Utilisateur qui a envoyé la demande de validation.            |
| `tickets_id`                 | Ticket concerné.                                              |
| `users_id_validate`          | Utilisateur qui a répondu. `0` = personne n’a encore répondu. |
| `itilvalidationtemplates_id` | Gabarit utilisé. `0` = aucun gabarit.                         |
| `itemtype_target`            | Type de validateur ciblé : ici `User`.                        |
| `items_id_target`            | ID du validateur ciblé : ici utilisateur `2`.                 |
| `comment_submission`         | Message envoyé au validateur.                                 |
| `comment_validation`         | Réponse du validateur. `null` tant qu’il n’a pas répondu.     |
| `status`                     | Statut de cette validation.                                   |
| `submission_date`            | Date d’envoi de la demande.                                   |
| `validation_date`            | Date de réponse. `null` tant qu’il n’a pas répondu.           |
| `timeline_position`          | Position dans la timeline GLPI.                               |
| `last_reminder_date`         | Dernier rappel envoyé, si GLPI envoie des rappels.            |
