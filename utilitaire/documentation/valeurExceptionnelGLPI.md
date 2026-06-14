## "team" dans ticket

Dans l’API v2 GLPI, team n’est pas vraiment un champ simple de la table Ticket. C’est plutôt une propriété calculée/assemblée dans la réponse.

Exemple de réponse :

{
  id: 25,
  name: "Problème imprimante",
  status: { id: 1, name: "Nouveau" },
  team: [
    {
      role: "requester",
      type: "User",
      name: "Utilisateur A"
    }
  ]
}

Donc quand tu écris :

team=isnull=

ou :

team=empty=

tu penses dire :

Donne-moi les tickets dont team est vide.

Mais côté API GLPI, team n’est pas un vrai champ SQL simple comme :

name
status.id
is_deleted
date_creation

C’est une donnée liée/calculée à partir d’autres relations, comme les utilisateurs du ticket, groupes du ticket, fournisseurs, etc.

Résultat : le filtre RSQL ne peut pas correctement filtrer team.