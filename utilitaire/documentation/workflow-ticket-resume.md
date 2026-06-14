# Workflow Kanban de changement de statut des tickets

* il y a d'abord trois grands states pour savoir si le ticket est dans nouveau, en cours ou clos

  * `pendingStatusChange`
  * `pendingTransition`
  * `pendingResolvedReview`

* il y a aussi une fonction `handleTicketDrop` qui est utilisée quand le bouton ticket est relâché dans la zone qu’on voulait

  * cela est possible grâce à `onTicketDrop`

    * `onTicketDrop` est une props de `SectionKanban`
    * cette fonction est ensuite utilisée dans `onDrop`

* `onDrop`

  * c’est un événement de drag and drop
  * il permet de dire quoi faire après le dépôt de l’élément dans la zone voulue

* cette fonction prend en paramètre :

  * l’id du ticket qui est dans la balise `SectionKanban`

    * cet id est récupéré lors du drop de cette manière :

      * on stocke l’id du ticket qu’on a déplacé dans `event.dataTransfer`

      * cela se fait grâce à :

        ```ts
        event.dataTransfer.setData("ticketId", String(groupTicket.id));
        ```

      * cela se fait durant `onDragStart`

      * puis on le récupère dans `onDrop` grâce à :

        ```ts
        const ticketId = Number(event.dataTransfer.getData("ticketId"));
        ```

  * le nom de la clé en string constante du kanban de destination

    * `new`
    * `in_progress`
    * `done`

  * l’`id_status` actuel du ticket

* le rôle de cette fonction est de configurer le passage de statut A vers statut B

* concernant le passage de statut A vers statut B, il y a différentes variables avec le préfixe `should`

  * elles permettent de dire :

    * quel est le statut actuel du ticket
    * vers quel statut le ticket veut aller

  * `shouldCloseNewTicket`

    * Nouveau → Terminé

  * `shouldResolveNewTicket`

    * Nouveau → Résolu

  * `requiresAssignmentStep`

    * Nouveau → En cours

  * `shouldResolveTicket`

    * En cours → Résolu

  * `shouldCloseInProgressTicket`

    * En cours → Terminé

  * `shouldApproveResolvedTicket`

    * Résolu → Terminé / Clos

  * `shouldRefuseResolvedTicket`

    * Résolu → En cours

  * `shouldReopenClosedTicket`

    * Clos → En cours

  * `shouldReturnClosedTicketToNew`

    * Clos → Nouveau

* c’est grâce à ces variables avec préfixe qu’on peut faire une condition

  * pour savoir dans quel statut se trouve actuellement le ticket
  * pour savoir vers où est sa destination

* après cela, on peut faire un changement de state parmi ces states :

  * `pendingStatusChange`
  * `pendingTransition`
  * `pendingResolvedReview`

* ces states correspondent à la configuration du passage :

  * statut A → statut B

* chaque state possède ses paramètres

* `pendingStatusChange`

  * `nextModeAfterSuccess?`

    * constante string de type `TicketStatusTransitionMode`

    * permet de dire quel est le prochain statut après succès de la mise en place du statut actuel

    * autrement dit :

      * statut de destination future après succès de la mise en place du statut de destination actuelle

    * valeurs possibles :

      * `resolve`

        * demander une solution

      * `approve`

        * approuver la solution

      * `refuse`

        * refuser la solution

      * `reopen`

        * demander une raison de réouverture

  * `statusId`

    * stocke l’id du statut de destination qu’on va appliquer maintenant

  * `ticket`

    * variable de type `Ticket`
    * permet d’identifier le ticket dont on veut manipuler le statut

* `pendingTransition`

  * `mode`

    * type : `TicketStatusTransitionMode`

  * `nextModeAfterSuccess?`

    * similaire à l’explication précédente
    * pour celui-ci, c’est directement de type string
    * valeur par défaut :

      * `review`
    * valeur possible :

      * `review`
      * `null`
    * cela veut dire qu’on peut utiliser cet attribut avec la valeur `review`
    * ou ne pas utiliser cet attribut

  * `review`

    * permet de faire une comparaison après avoir passé le ticket à résolu
    * le passage à résolu se fait grâce à la création d’une solution
    * le but est ensuite de passer :

      * statut Résolu → statut Clos

  * `targetStatusId?`

    * similaire à l’explication précédente

  * `ticket`

    * similaire à l’explication précédente

* `pendingResolvedReview`

  * `refuseStatusId`

    * id du statut de rollback si la solution est refusée
    * cela veut dire que le ticket revient à cet id de statut si le choix de la solution est refusé

  * `solutionId?`

    * id de la solution à valider

  * `ticket`

    * similaire à l’explication précédente

* la création des interfaces selon ces 3 grands states est créée grâce à :

  * composant `TicketsAdd`

    * utilisé avec `pendingStatusChange`

    * `isModal`

      * permet de réajuster les boutons du composant
      * permet d’afficher :

        * `annuler`
        * `créer`
      * au lieu d’afficher seulement `annuler` lors de la création de ticket

    * `isAssignmentStepOnly`

      * permet de choisir quoi afficher quand c’est seulement l’action d’assignation
      * cela concerne :

        * l’assignation d’un user technicien au ticket
        * l’assignation d’un groupe de techniciens au ticket

    * `onClose`

      * permet de passer la fonction `closeStatusTransitionModal`

      * cette fonction est appelée lors de la fermeture du modal

      * elle est appelée en cas de succès de toutes les opérations de changement de statut

      * `closeStatusTransitionModal`

        * cette fonction sert à fermer proprement la modal de changement de statut

        * elle sert aussi à réinitialiser tous les états temporaires liés au workflow

        * `setIsStatusRequirementModalOpen(false)`

          * ça ferme la modal

        * `setPendingStatusChange(null)`

          * ça annule l’étape d’assignation en attente
          * `pendingStatusChange` sert quand le ticket doit d’abord être assigné avant de changer de statut

        * `setPendingTransition(null)`

          * ça annule la transition spéciale en attente
          * `pendingTransition` sert pour les actions comme :

            * `resolve`

              * saisir une solution
            * `refuse`

              * refuser une solution
            * `reopen`

              * rouvrir un ticket
            * `approve`

              * approuver une solution

        * `setPendingResolvedReview(null)`

          * ça annule l’étape “Valider / Refuser la solution”
          * `pendingResolvedReview` sert quand le ticket est déjà Résolu
          * l’utilisateur doit choisir :

            * Valider la solution
            * Refuser la solution

        * `setStatusTransitionError(null)`

          * ça efface l’ancienne erreur

    * `onSubmitAssignmentStep`

      * permet de créer une fonction à utiliser dans le composant fille après

      * dans cette fonction, les différentes actions effectuées sont :

        * assignation de user technicien au ticket si le ticket n’est pas encore assigné
        * assignation de groupe technicien au ticket si le ticket n’est pas encore assigné
        * passage de Nouveau → En cours
        * si `pendingStatusChange.nextModeAfterSuccess` est égal à `resolve`

          * on fait passer vers le statut Résolu

  * composant `TicketStatusTransitionForm`

    * utilisé avec `pendingTransition`

    * `mode`

      * permet de configurer quel mode choisir parmi ceux listés dans `TicketStatusTransitionMode`

      * valeurs possibles :

        * `resolve`
        * `approve`
        * `refuse`
        * `reopen`

      * cela permet de configurer l’affichage à afficher dans `TicketStatusTransitionForm`

    * `isPending`

      * permet de mettre l’état du hook qui effectue le CRUD dans cette partie de `TicketStatusTransitionForm`
      * cela est utilisé dans la fonction `onSubmit`

    * `submitError`

      * permet de mettre l’erreur retournée par le hook qui effectue le CRUD
      * cela est utilisé dans la fonction `onSubmit`

    * `onClose`

      * similaire à l’explication précédente

    * `onSubmit`

      * similaire à l’explication précédente

      * si `pendingTransition.mode === "resolve"`

        * créer la solution
        * mettre à jour le ticket
        * si `pendingTransition.nextModeAfterSuccess === "review"`

          * passer de Résolu → Clos

      * si `pendingTransition.mode === "refuse"`

        * prendre la dernière solution insérée

        * si aucune solution n’a encore été insérée :

          * `redirectToMissingSolutionStep`

            * fonction qui permet de réassigner le statut du ticket à assigné/en cours
            * puis de le changer en état résolu
            * puis de le faire passer directement vers clos

        * mise à jour de la solution associée au ticket

        * création de `Followup`

          * un `Followup` est un suivi
          * c’est-à-dire un message ou commentaire ajouté dans la timeline du ticket

        * mise à jour du ticket

      * si `pendingTransition.mode === "approve"`

        * appel de la fonction `openResolvedReviewModal`
        * cette fonction ouvre la modal “Valider ou refuser la solution”
        * elle est utilisée pour un ticket déjà résolu

      * si `pendingTransition.mode === "reopen"`

        * créer la solution
        * mettre à jour le statut du ticket

  * composant `TicketResolvedReviewForm`

    * utilisé avec `pendingResolvedReview`

    * `isPending`

      * similaire à l’explication précédente

    * `submitError`

      * similaire à l’explication précédente

    * `onClose`

      * similaire à l’explication précédente

    * `onApprove`

      * similaire à l’explication précédente
      * prend la dernière solution du ticket
      * redirige vers la fonction `redirectToMissingSolutionStep` si aucune solution n’est associée au ticket
      * met à jour le statut de la solution à `ACCEPTED`
      * crée un `Followup` s’il y a un commentaire
      * met à jour le statut du ticket à `CLOSED`
      * appelle la fonction `closeStatusTransitionModal`

    * `onRefuse`

      * similaire à l’explication précédente
      * prend la dernière solution du ticket
      * redirige vers la fonction `redirectToMissingSolutionStep` si aucune solution n’est associée au ticket
      * met à jour le statut de la solution à `REFUSED`
      * crée un `Followup`
      * met à jour le statut du ticket vers `refuseStatusId`
        * statut de destination en cas de refus
      * appelle la fonction `closeStatusTransitionModal`

* remarque :

  * `isStatusRequirementModalOpen`

    * state qui sert à dire si la modal de changement de statut est ouverte ou fermée

    * cette modal affiche selon le cas :

      * formulaire d’assignation
      * formulaire de solution
      * formulaire de validation/refus
      * formulaire de réouverture

    * ce qui décide le contenu de la modal, ce sont surtout :

      * `pendingStatusChange`
      * `pendingTransition`
      * `pendingResolvedReview`

  * `draggingTicketId`

    * state qui sert à savoir quel ticket est actuellement en train d’être déplacé avec drag & drop
