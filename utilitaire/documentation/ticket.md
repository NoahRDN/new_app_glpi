# Champs d’un ticket GLPI

## Champs principaux à gauche

### Titre

C’est le résumé court du ticket.

Exemples :

- Ticket Test
- Problème d’autocomplétion
- Imprimante ne fonctionne pas

### Description

C’est le détail du problème ou de la demande.  
C’est obligatoire s’il y a une étoile rouge `*`.

Exemple :

> Quand j’écris dans le champ de recherche, l’autocomplétion ne propose plus de résultats.

### Fichier(s)

Pièces jointes liées au ticket : capture d’écran, PDF, log, image, etc.

Exemples :

- `screenshot.png`
- `error.log`
- `facture.pdf`

## Champs de classification à droite

### Date d’ouverture

Date de création/ouverture du ticket.  
Si tu la laisses vide, GLPI peut souvent utiliser la date actuelle automatiquement.

### Type

Le type de ticket.

Dans la capture :

- Incident

Les deux types classiques sont :

- **Incident** : quelque chose ne marche pas
- **Demande** : quelqu’un demande quelque chose

Exemples :

- Incident : “Mon ordinateur ne démarre plus”
- Demande : “Je veux installer VS Code”

### Catégorie

La catégorie métier du ticket.

Exemples :

- Matériel
- Logiciel
- Réseau
- Compte utilisateur
- Imprimante

Elle sert à classer les tickets et à faire des statistiques.  
Tu peux la laisser vide au début si tu n’as pas encore créé de catégories.

### Statut

L’état actuel du ticket.

Dans la capture :

- Nouveau

États fréquents :

- Nouveau
- En cours
- En attente
- Résolu
- Clos

Pour une création, `Nouveau` est normal.

### Source de la demande

Indique par quel canal le ticket est arrivé.

Dans la capture :

- Helpdesk

Exemples :

- Helpdesk
- Email
- Téléphone
- Direct
- API

### Urgence

À quel point le problème est urgent du point de vue demandeur.

Exemples :

- Basse
- Moyenne
- Haute
- Très haute

### Impact

À quel point le problème affecte le service ou l’organisation.

Exemples :

- Faible : touche une personne
- Moyen : touche une équipe
- Haut : bloque beaucoup d’utilisateurs

### Priorité

Souvent calculée à partir de l’urgence + impact.

Exemple :

> Urgence moyenne + impact moyen = priorité moyenne

Dans GLPI, la priorité peut être manuelle ou calculée selon la configuration.

### Lieu

Lieu concerné par le ticket.

Exemples :

- Bureau 101
- Salle informatique
- Central

### Durée totale

Temps estimé ou planifié pour traiter le ticket.  
Tu peux ignorer ce champ au début.

### ID externe

Référence externe si le ticket vient d’un autre système.

Exemples :

- `JIRA-123`
- `MAIL-456`
- `CLIENT-789`

Tu peux laisser vide au début.

## Acteurs

Cette section indique qui participe au ticket.

### Demandeur

La personne qui demande de l’aide.  
Dans la capture, c’est `glpi`.

Exemple :

- Demandeur : Alice

C’est la personne qui a le problème ou qui fait la demande.

### Observateur

Personne qui suit le ticket, mais qui n’est pas forcément responsable du traitement.

Exemple :

- Observateur : manager d’Alice

### Attribué à

Personne ou groupe chargé de traiter le ticket.

Exemples :

- Attribué à : Technicien Noah
- Attribué à : Groupe Support IT

C’est le champ important pour l’assignation.

## Éléments

Cette section permet de lier le ticket à un asset GLPI.

Exemple :

- Ticket : “PC ne démarre plus”
- Élément lié : `PC-TEST-001`

C’est très utile, car ça permet de voir l’historique des tickets d’un ordinateur, d’une imprimante, d’un téléphone, etc.

Dans la capture, il y a `0`, donc aucun élément n’est encore lié.

### Mes éléments

Peut afficher les équipements associés à l’utilisateur demandeur.

### Recherche complète

Permet de rechercher un asset dans tout le parc.

### Général

Probablement un filtre de périmètre ou un type de recherche.

## Niveaux de services

Ça concerne les SLA/OLA : délais de prise en charge, délais de résolution, engagements de service.

Exemple :

> Ce ticket doit être résolu en 4 heures.

Tu peux ignorer cette section au début.

## Liaisons

Permet de lier ce ticket à d’autres objets ou tickets.

Exemples :

- ticket parent
- ticket enfant
- ticket lié
- problème lié
- changement lié

Tu peux ignorer cette section au début.

# Compléments sur la création d’un ticket GLPI

## Catégorie ITIL

Quand tu cliques sur `+` à côté de **Catégorie**, tu crées une catégorie de ticket.

Exemples de catégories :

* Matériel
* Logiciel
* Réseau
* Compte utilisateur
* Imprimante
* Accès
* Base de données

Ça sert à classer le ticket.

Exemple :

* Titre : Problème d’autocomplétion
* Catégorie : Logiciel
* Type : Incident

La catégorie permet ensuite de faire des statistiques :

* Combien de tickets réseau ?
* Combien de tickets logiciel ?
* Combien de tickets matériel ?

Elle peut aussi servir à orienter automatiquement les tickets vers un technicien ou un groupe.

## Comme enfant de

Ce champ sert à créer une hiérarchie de catégories.

Exemple :

* Logiciel

  * Installation
  * Bug
  * Autocomplétion
* Matériel

  * Ordinateur
  * Imprimante
  * Écran

Donc si tu veux créer une catégorie **Autocomplétion**, tu peux la mettre comme enfant de **Logiciel**.

Pour ton premier test :

* Nom : Logiciel
* Comme enfant de : vide

Puis plus tard :

* Nom : Autocomplétion
* Comme enfant de : Logiciel

## Technicien responsable / Groupe responsable

Dans une catégorie ITIL, tu peux définir qui est responsable par défaut.

Exemple :

* Catégorie : Réseau
* Technicien responsable : Noah
* Groupe responsable : Équipe réseau

Quand un ticket est créé avec cette catégorie, GLPI peut proposer ou affecter automatiquement le bon technicien ou le bon groupe selon la configuration.

Ce n’est pas obligatoire au début. Tu peux laisser vide.

## Visible pour un incident / Visible pour une demande

Un ticket peut être de type :

* **Incident** : quelque chose est cassé
* **Demande** : quelqu’un demande quelque chose

La catégorie peut être visible pour l’un, l’autre, ou les deux.

Exemple :

* Catégorie : Panne imprimante
* Visible pour un incident : Oui
* Visible pour une demande : Non

Autre exemple :

* Catégorie : Installation logiciel
* Visible pour un incident : Non
* Visible pour une demande : Oui

Pour commencer, laisse :

* Visible pour un incident : Oui
* Visible pour une demande : Oui

## Gabarit pour une demande / incident / problème / changement

Un gabarit est un modèle prérempli.

Exemple : si quelqu’un choisit la catégorie **Problème réseau**, GLPI peut préremplir :

* Titre
* Description
* Urgence
* Impact
* Groupe attribué

Pour ton test, ignore les gabarits. Laisse vide.

## Suivi par mail

Le suivi par mail indique si un acteur reçoit des notifications email pour le ticket.

Exemple :

* Demandeur : glpi
* Suivi par mail : Oui

GLPI peut envoyer un email quand :

* le ticket est créé
* un technicien répond
* le statut change
* le ticket est résolu

Si GLPI dit que les notifications sont désactivées, c’est peut-être parce que :

* l’utilisateur n’a pas d’adresse email
* les notifications sont désactivées dans ses préférences
* les notifications sont désactivées sur l’entité

Pour l’instant, tu peux ignorer ça.

## Éléments liés

La section **Éléments** sert à lier un ticket à un asset du parc.

Exemple :

* Ticket : Mon PC ne démarre plus
* Élément lié : PC-TEST-001

Si tu vois :

* Éléments : 0

ça veut dire qu’aucun ordinateur, imprimante, logiciel, etc. n’est lié au ticket.

Ce n’est pas bloquant. Tu peux créer un ticket sans élément lié.

Pour lier un élément :

1. Créer d’abord l’asset dans le parc.
2. Exemple : Parc → Ordinateurs → créer `PC-TEST-001`
3. Dans le ticket : Éléments → Ajouter
4. Rechercher `PC-TEST-001`

Si tu ne trouves rien, causes possibles :

* aucun ordinateur n’existe encore
* l’ordinateur est dans une autre entité
* le statut de l’ordinateur n’est pas visible dans l’assistance
* ton profil n’a pas le droit de voir ce type d’élément
* tu recherches dans le mauvais type d’élément

## Gabarit de validation et validations

Un **gabarit de validation** est un modèle pour demander une validation avant qu’un ticket avance.

Exemple métier :

* Demande : Je veux acheter un nouveau PC
* Il faut que le responsable valide avant traitement

Le gabarit peut définir :

* qui doit valider
* quel contenu/message envoyer
* quelles étapes de validation suivre
* quel seuil de validation est nécessaire

L’onglet **Validations** montre les demandes de validation liées au ticket.

Exemple :

* Demandeur de la validation : glpi
* Validateur demandé : glpi
* État : En attente de validation
* Commentaire : Voici un gabarit de test

Cela veut dire que le ticket attend une réponse de validation.

## Seuil de validation

Le seuil de validation requis indique le pourcentage de validateurs qui doivent accepter.

Exemple avec 1 validateur :

* Seuil = 100 %
* Le validateur doit accepter

Exemple avec 2 validateurs :

* Seuil = 50 %
* Une validation sur deux peut suffire

Exemple avec 3 validateurs :

* Seuil = 100 %
* Les trois doivent accepter

La barre de progression montre l’avancement de la validation.

## Enfant d’un enfant

Oui, dans GLPI, un enfant peut avoir lui-même un enfant.

Exemple :

* Logiciel

  * Navigateur

    * Autocomplétion

C’est utile pour organiser les catégories sans avoir une grande liste plate.

## Incident, demande, problème et changement

Pour le champ **Type** du ticket, les deux grands types sont :

* Incident
* Demande

Mais GLPI possède aussi d’autres objets ITIL séparés :

* Ticket
* Problème
* Changement

Différence :

* **Incident** : quelque chose ne marche pas
* **Demande** : quelqu’un demande quelque chose
* **Problème** : cause profonde ou problème récurrent
* **Changement** : modification planifiée du système

Exemples :

* Incident : Internet ne marche plus
* Demande : Créer un compte utilisateur
* Problème : La connexion tombe tous les lundis
* Changement : Migration du routeur vendredi soir

Pour ton NewApp, commence seulement avec :

* Incident
* Demande

## Niveaux de services : TTO / TTR

Les niveaux de services concernent les SLA.

SLA signifie engagement de service.
En gros : en combien de temps le support doit réagir ou résoudre.

### TTO

TTO = Time To Own.

C’est le délai maximum pour prendre en charge le ticket.

Exemple :

* Ticket créé à 08:00
* TTO = 30 minutes
* Le support doit prendre en charge avant 08:30

Prendre en charge peut vouloir dire :

* assigner le ticket
* passer le ticket en cours
* montrer qu’un technicien l’a accepté

### TTR

TTR = Time To Resolve.

C’est le délai maximum pour résoudre le ticket.

Exemple :

* Ticket créé à 08:00
* TTR = 4 heures
* Le ticket doit être résolu avant 12:00

### TTO interne / TTR interne

Ce sont des délais internes à l’équipe support.

Exemple :

* TTO client = 1 heure
* TTO interne = 30 minutes

L’équipe peut avoir un objectif interne plus strict que l’engagement officiel.

### Si le délai est dépassé

GLPI peut considérer le ticket comme en retard.

Conséquences possibles :

* indicateur de retard
* statistiques SLA non respectées
* notification
* escalade
* reporting négatif

Mais GLPI ne va pas automatiquement supprimer ou fermer le ticket. Il marque surtout que l’engagement n’a pas été respecté.

Pour ton NewApp, tu peux ignorer TTO/TTR au début.

## Ce qu’il faut gérer pour créer un ticket simple

Ne reproduis pas tout GLPI maintenant.

Minimum conseillé :

* Titre
* Description
* Type : Incident / Demande
* Urgence
* Impact
* Priorité

Optionnel plus tard :

* Catégorie
* Demandeur
* Attribué à
* Élément lié
* Pièce jointe
* Lieu

Encore plus minimal pour tester l’API :

* Titre
* Description
* Type

GLPI mettra souvent automatiquement :

* Statut = Nouveau
* Date d’ouverture = maintenant
* Demandeur = utilisateur connecté
* Entité = Entité racine

## Résumé rapide

* Catégorie ITIL : sert à classer les tickets
* Comme enfant de : sert à créer une hiérarchie
* Technicien/Groupe responsable : responsable par défaut
* Gabarit : modèle prérempli
* Suivi par mail : notifications email
* Éléments 0 : aucun asset lié au ticket
* Gabarit de validation : modèle d’approbation
* Validations : demandes d’approbation du ticket
* Seuil de validation : pourcentage nécessaire pour valider
* TTO : délai de prise en charge
* TTR : délai de résolution
* Incident / Demande : types principaux de ticket
* Problème / Changement : objets ITIL plus avancés

## Dans l’API, c’est souvent un nombre

Dans GLPI, ce champ peut être représenté par un entier.

Généralement :

1 = Incident
2 = Demande

Donc dans un POST de création de ticket, tu peux avoir quelque chose comme :

{
  "name": "Imprimante ne fonctionne pas",
  "content": "L'imprimante ne répond plus.",
  "type": 1
}

Et pour une demande :

{
  "name": "Installer un logiciel",
  "content": "Je veux installer VS Code.",
  "type": 2
}
## Différence avec urgence / impact / priorité

Ne confonds pas :

type     → nature du ticket : Incident ou Demande
urgency  → niveau d’urgence : 1 à 5
impact   → niveau d’impact : 1 à 5
priority → priorité finale : 1 à 5