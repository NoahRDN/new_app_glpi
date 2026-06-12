Les statuts standards sont fixes dans GLPI : 1 = Nouveau, 2 = En cours attribué, 3 = En cours planifié, 4 = En attente, 5 = Résolu, 6 = Clos, 10 = Validation. Ils viennent des constantes système GLPI. GLPI affiche ensuite ces statuts comme New, Approval, Processing assigned, Processing planned, Pending, Solved, Closed.

## workflow basique a suivre
Nouveau
→ En cours attribué
→ En attente, si besoin
→ Résolu
→ Clos

### illustation workflow basique en tableau

| Status            | Valeur API | Rôle                                                                                                 |
| ----------------- | ---------: | ---------------------------------------------------------------------------------------------------- |
| Nouveau           |        `1` | Ticket créé, pas encore réellement traité.                                                           |
| Validation        |       `10` | Le ticket attend une approbation. Utile pour achat, accès sensible, demande spéciale.                |
| En cours attribué |        `2` | Quelqu’un ou un groupe prend le ticket en charge.                                                    |
| En cours planifié |        `3` | Une intervention est prévue à une date/heure.                                                        |
| En attente        |        `4` | Le traitement est bloqué temporairement : attente utilisateur, fournisseur, pièce, information, etc. |
| Résolu            |        `5` | Le technicien propose une solution.                                                                  |
| Clos              |        `6` | Le ticket est terminé définitivement.                                                                |


## donné qui pourrait être nécessaire à chaque state

### 1. Nouveau

Pour créer un ticket, le minimum logique est :

{
  "name": "Titre du ticket",
  "content": "Description du problème ou de la demande",
  "type": 1,
  "status": 1
}

Tu peux ajouter aussi :

{
  "urgency": 3,
  "impact": 3,
  "priority": 3
}

À ce stade, tu n’es pas obligé d’avoir un technicien, un groupe, un élément lié ou une solution.

### 2. En cours attribué

Métierement, ce statut veut dire : le ticket est pris en charge.

Avant de passer à ce statut, il est préférable d’avoir au moins :

un technicien assigné
ou un groupe assigné

Mais techniquement, GLPI peut parfois accepter le statut sans assignation selon la configuration et les droits. Pour ton NewApp, je te conseille cette règle simple :

Si status = En cours attribué,
alors il faut choisir un technicien ou un groupe.

### 3. En cours planifié

Ce statut veut dire : une intervention est prévue.

Il est logique d’avoir :

une tâche planifiée
une date de début
une date de fin
un technicien ou groupe responsable

Pour ton application, ne commence pas directement avec ce statut. On le traitera quand on étudiera les tâches.

### 4. En attente

Ce statut veut dire : le support ne peut pas avancer pour l’instant.

Exemples :

on attend une réponse de l’utilisateur
on attend une pièce
on attend un fournisseur
on attend une validation

Il n’y a pas forcément un champ obligatoire, mais métierement il faut ajouter un suivi pour expliquer pourquoi :

"En attente du retour de l’utilisateur concernant le test."

Donc dans NewApp, règle simple :

Si status = En attente,
demander un commentaire / suivi.

### 5. Résolu

Ce statut veut dire : une solution a été proposée.

Métierement, avant de passer à Résolu, il faut avoir :

une solution
ou au minimum un commentaire de résolution

Exemple :

"Pilote imprimante réinstallé, test d’impression réussi."

Même si l’API accepte parfois de mettre status: 5 directement, ce n’est pas propre. Pour ton NewApp :

Si status = Résolu,
il faut saisir une solution.

#### Solution officielle du ticket & Commentaire / suivi de résolution

##### 1. Où se trouve “Solution” dans GLPI ?

Dans l’interface GLPI, ouvre un ticket, puis regarde dans les onglets à gauche :

Ticket
Statistiques
Validations
Base de connaissances
Éléments
Coûts
Historique
Tous

La solution peut apparaître dans la timeline ou dans la partie “Tous”. Selon l’affichage GLPI, tu peux ajouter une solution depuis le bas du ticket, dans la zone où tu peux choisir le type d’élément à ajouter : suivi, tâche, solution, etc.

Dans l’API, l’objet s’appelle :

ITILSolution

Dans le code de l’API v2, GLPI expose un schéma Solution lié à ITILSolution, avec notamment itemtype, items_id, type, content, user, approver, status, date_creation, date_mod, date_approval.

Donc pour un ticket :

itemtype = "Ticket"
items_id = id du ticket
content = texte de la solution

##### Où se trouve “commentaire de résolution” ?

Un commentaire normal dans un ticket est un :

ITILFollowup

Dans l’API v2, GLPI expose un schéma Followup, avec itemtype, items_id, content, is_private, user, request_type, date, etc.

Donc :

Solution = réponse finale officielle
Followup = commentaire / discussion / note de suivi

Exemple :

Followup :
"J’ai commencé à vérifier le poste."

Solution :
"Pilote imprimante réinstallé, test d’impression réussi."

Pour ton NewApp, si on passe à Résolu, utilise plutôt Solution.

##### API à utiliser pour créer une solution
###### Option legacy simple

Tu peux utiliser la legacy API :

POST /glpi-legacy-api/ITILSolution

Body :

{
  "input": {
    "itemtype": "Ticket",
    "items_id": 287,
    "content": "<p>Pilote imprimante réinstallé, test d’impression réussi.</p>"
  }
}

S’il y a un type de solution :

{
  "input": {
    "itemtype": "Ticket",
    "items_id": 287,
    "solutiontypes_id": 1,
    "content": "<p>Pilote imprimante réinstallé, test d’impression réussi.</p>"
  }
}

Tu peux aussi tester l’endpoint lié directement au ticket :

POST /glpi-legacy-api/Ticket/287/ITILSolution/

Mais pour éviter les ambiguïtés, le plus clair est souvent :

POST /glpi-legacy-api/ITILSolution

avec itemtype et items_id.

###### Option v2

Dans ton Swagger v2, cherche dans la partie Assistance les routes autour de :

Solution
Followup
TicketValidation
TicketTask

Si tu vois une route du style :

POST /Assistance/Ticket/{ticket_id}/Solution

ou proche de ça, tu peux l’utiliser. Mais si tu ne la trouves pas rapidement, utilise legacy pour ITILSolution, comme tu l’as déjà fait pour Item_Ticket et TicketValidation.

##### API pour créer un commentaire de résolution

Si tu veux juste ajouter un commentaire/suivi :

POST /glpi-legacy-api/ITILFollowup

Body :

{
  "input": {
    "itemtype": "Ticket",
    "items_id": 287,
    "content": "<p>Le problème semble corrigé après réinstallation du pilote.</p>",
    "is_private": 0
  }
}

Mais attention : ça ne veut pas forcément dire que le ticket est résolu. C’est seulement un commentaire.

Donc pour ton workflow :

Résolution officielle
→ ITILSolution

Commentaire explicatif
→ ITILFollowup

#### workflow
ITILSolution
→ solution officielle du ticket
→ à créer avant de passer en Résolu

ITILFollowup
→ commentaire / suivi
→ utile pour expliquer, mais pas suffisant comme vraie résolution

Ticket.status = 5
→ ticket résolu
→ remplit la date de résolution et impacte les statistiques

#### Remarque
Obligatoire pour passer à Résolu :
→ une Solution officielle

Optionnel :
→ un Followup / suivi de résolution si tu veux ajouter une note de discussion

### 6. Clos

C’est le statut final.

Un ticket clos est considéré terminé. Après ça, certaines modifications peuvent être refusées ou devenir anormales. C’est exactement pour ça qu’il ne faut pas créer directement un ticket Closed puis ajouter des assets après.

#### Workflow

Le ticket est resolu donc une autre popup d'assiche pour dire que ce ticket resolut est valide ou pas: 
Si l’utilisateur approuve :

Solution.status = 3
puis éventuellement ticket status = 6 Clos

Si l’utilisateur refuse :

Solution.status = 4
puis ticket peut revenir en En cours attribué

Règle très importante :

Ne pas mettre un ticket en Clos tant que toutes les informations ne sont pas ajoutées.

Ordre correct :

1. Créer le ticket en Nouveau.
2. Ajouter demandeur / éléments / assignation / suivis / solution.
3. Passer en Résolu.
4. Puis passer en Clos.

## Ce qui est impacté quand le statut change

Quand tu changes le statut, tu n’impactes pas seulement le champ status.

### Nouveau → En cours attribué

Impact métier :

Le ticket est pris en charge.

Éléments concernés :

status
date_mod
historique
assignation technicien/groupe si tu l’ajoutes
indicateurs TTO, selon configuration
notifications éventuelles

Dans ton NewApp, il faudrait éviter de passer en En cours attribué sans technicien ou groupe.

### En cours → En attente

Impact métier :

Le support attend quelque chose.

Exemples :

attente réponse utilisateur
attente fournisseur
attente pièce
attente validation

Éléments concernés :

status
historique
date_mod
SLA/TTR éventuellement suspendu ou impacté selon configuration

Dans ton NewApp, je te conseille d’obliger un commentaire :

Pourquoi le ticket est-il mis en attente ?
### En cours / En attente → Résolu

Impact métier :

Le technicien propose une solution.

Éléments concernés :

status
solution
date de résolution
historique
notifications
statistiques de résolution

Dans ton NewApp, ne passe pas à Résolu sans solution.

### Résolu → Clos

Impact métier :

Le ticket est définitivement terminé.

Éléments concernés :

status
date de clôture
historique
statistiques de clôture
modifiabilité du ticket

Après Clos, certaines actions peuvent être refusées. C’est exactement ce que tu as rencontré quand tu avais créé un ticket directement en Closed, puis essayé d’ajouter les éléments après.

### Clos → En cours attribué

Impact métier :

Le ticket est réouvert.

Éléments concernés :

status
historique
date_mod
statistiques
notifications
lecture métier de la résolution précédente

Le ticket n’est plus considéré comme terminé. Par contre, son ancienne solution, ses anciens suivis, ses anciennes dates et son historique restent utiles pour comprendre ce qui s’est passé.

## Règle propre pour NewApp

Création :
toujours status = 1 Nouveau

Prise en charge :
status = 2 En cours attribué
avec technicien ou groupe

Attente :
status = 4 En attente
avec commentaire obligatoire

Résolution :
status = 5 Résolu
avec solution obligatoire

Clôture :
status = 6 Clos
seulement après résolution

Réouverture :
status = 2 En cours attribué
avec commentaire obligatoire

## Rôle des champs impactés par les changements de statut

Ces champs se trouvent dans le ticket lui-même.

Tu peux les voir avec :

GET /glpi-api/Assistance/Ticket/{id}
### status

C’est l’état actuel du ticket :

1  = Nouveau
2  = En cours attribué
3  = En cours planifié
4  = En attente
5  = Résolu
6  = Clos
10 = Validation

Dans l’API v2, status est défini comme un objet avec id et name, et GLPI calcule le nom depuis le statut.

### date_mod

C’est la date de dernière modification.

Chaque fois que tu modifies le ticket :

statut
priorité
contenu
assignation
catégorie
etc.

### date_mod change.

Dans le schéma v2 du ticket, date_mod est bien exposé avec date_creation, date, date_solve, date_close.

### date_solve

C’est la date à laquelle le ticket est passé en résolution.

Dans GLPI, le vrai champ interne est :

solvedate

et l’API v2 l’expose comme :

date_solve

Quand tu passes un ticket à :

Résolu

ce champ peut être rempli.

### date_close

C’est la date de clôture définitive.

Dans GLPI, le vrai champ interne est :

closedate

et l’API v2 l’expose comme :

date_close

Quand tu passes un ticket à :

Clos

ce champ peut être rempli.

### begin_waiting_date

C’est le début de la période d’attente.

Quand tu mets un ticket en :

En attente

GLPI peut commencer à mesurer le temps passé en attente.

L’API v2 expose aussi :

waiting_duration

qui correspond à la durée totale d’attente en secondes.

### take_into_account_date

C’est la date de prise en compte.

Concrètement, c’est le moment où le support commence à prendre le ticket en charge. C’est lié au TTO :

TTO = Time To Own

Dans l’API v2, GLPI expose :

take_into_account_date
take_into_account_duration

Donc quand tu passes de :

Nouveau → En cours attribué

GLPI peut remplir ou influencer ces champs selon la configuration.

## “Objets ITIL”, ça veut dire quoi ?

ITIL est une méthode/organisation de gestion des services informatiques. Dans GLPI, les principaux objets ITIL sont :

Ticket
Problème
Changement

```
Ticket
→ incident ou demande individuelle.
Exemple : "Mon imprimante ne marche pas."

Problème
→ cause profonde derrière plusieurs tickets.
Exemple : "Le serveur d’impression est instable."

Changement
→ modification planifiée du système informatique.
Exemple : "Remplacer le serveur d’impression."
```

## status ticket: 

| Nom technique      | Valeur | Français          | Anglais             |
| ------------------ | -----: | ----------------- | ------------------- |
| `NEW` / `INCOMING` |    `1` | Nouveau           | New                 |
| `APPROVAL`         |   `10` | Validation        | Approval            |
| `ASSIGNED`         |    `2` | En cours attribué | Processing assigned |
| `PLANNED`          |    `3` | En cours planifié | Processing planned  |
| `WAITING`          |    `4` | En attente        | Pending             |
| `SOLVED`           |    `5` | Résolu            | Solved              |
| `CLOSED`           |    `6` | Clos              | Closed              |

## valeur en attente de validation

status = 10
global_validation = 2
→ le ticket attend une validation.

status = 10
global_validation = 3
→ validation acceptée, il peut passer en cours.

status = 10
global_validation = 4
→ validation refusée, le ticket ne devrait pas être traité.

1 = None / aucune validation
2 = Waiting / en attente
3 = Accepted / acceptée
4 = Refused / refusée

## savoir si un ticket a un technicien ou groupe assigné

Dans GLPI, les acteurs ITIL ont des rôles numériques :

1 = Demandeur
2 = Assigné
3 = Observateur

Ces constantes sont définies dans CommonITILActor.

Donc pour vérifier si le ticket est assigné, tu dois chercher un acteur avec :

type = 2

### Côté API v2

Regarde dans :
```
GET /glpi-api/Assistance/Ticket/{id}
```
Puis regarde la propriété :

team

Tu cherches un membre avec un rôle d’assignation.

### Côté legacy

Tu peux regarder :
```
GET /glpi-legacy-api/Ticket/{id}/Ticket_User/
GET /glpi-legacy-api/Ticket/{id}/Group_Ticket/
```
Et vérifier s’il existe une ligne avec :

type = 2

C’est-à-dire assigné.

## type de personne assigné pour l'assignation

Assignation valide =
utilisateur avec profil Technician/Admin/Super-Admin
ou groupe Support/Technicien

## API qui permet d’obtenir itils_validationsteps_id

### Niveau A — ValidationStep

C’est le modèle / nom d’étape de validation.

Exemple :

Validation
Validation responsable
Validation direction

À tester en legacy :
```
GET /glpi-legacy-api/ValidationStep
```

### Niveau B - ITIL_ValidationStep ( a revoir car c'est notfound apres test sur postman)


## type de personne lors de la creation de ticket

Attribué à
→ seulement techniciens / groupes support

Demandeur
→ utilisateur normal autorisé

Observateur
→ utilisateur concerné ou responsable

Validateur
→ responsable / manager / admin, pas forcément technicien

## approuver la solution puis clore le ticket

Legacy :

GET /glpi-legacy-api/Ticket/{ticketId}/ITILSolution/

Exemple :

GET /glpi-legacy-api/Ticket/287/ITILSolution/

Tu récupères une solution avec un id, par exemple :

{
  "id": 12,
  "itemtype": "Ticket",
  "items_id": 287,
  "content": "<p>Solution proposée...</p>",
  "status": 2
}

Le champ status de la solution signifie :

Valeur	Sens
1	None
2	Waiting / en attente d’approbation
3	Accepted / acceptée
4	Refused / refusée

Dans l’API v2, le schéma Solution expose bien status, approver, approval_followup et date_approval.

## Approuver la solution

Legacy :

PUT /glpi-legacy-api/ITILSolution/{solutionId}

Exemple :

PUT /glpi-legacy-api/ITILSolution/12

Body :

{
  "input": {
    "id": 12,
    "status": 3
  }
}

Ici :

status = 3
→ solution acceptée

Si tu veux ajouter un commentaire d’approbation, le plus simple côté NewApp est soit :

- utiliser le champ approval_followup si tu passes par la v2
- ou créer un ITILFollowup séparé en legacy

Exemple followup legacy optionnel :

POST /glpi-legacy-api/ITILFollowup
{
  "input": {
    "itemtype": "Ticket",
    "items_id": 287,
    "content": "<p>Solution approuvée après vérification.</p>",
    "is_private": 0
  }
}

## Clore le ticket
PI v2 :

PATCH /glpi-api/Assistance/Ticket/{ticketId}

Exemple :

PATCH /glpi-api/Assistance/Ticket/287

Body :

{
  "status": 6
}

Ici :

status = 6
→ ticket clos

## Donc l’ordre recommandé est
1. GET ITILSolution du ticket
2. PUT ITILSolution/{id} avec status = 3
3. PATCH Ticket/{id} avec status = 6