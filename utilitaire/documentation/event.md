## Que contient event ?

event, c’est l’objet que React te donne automatiquement quand un événement se produit.

Exemples :

### Pour onChange
onChange={(event) => {
  console.log(event.target.value);
}}

event contient l’input qui a changé, donc tu peux lire :

### event.target.value
### Pour onClick
onClick={(event) => {
  console.log(event.currentTarget);
}}

event contient le bouton cliqué.

### Pour onDrop
onDrop={(event) => {
  console.log(event.dataTransfer);
}}

event contient les données du drag-and-drop.

### Pour onDragOver
onDragOver={(event) => {
  event.preventDefault();
}}

event contient l’information que quelque chose est actuellement au-dessus de cette zone.

Donc event dépend du type d’événement.

Dans ton cas, onDrop reçoit un événement de drag :

React.DragEvent<HTMLDivElement>

Il contient notamment :

event.target
event.currentTarget
event.dataTransfer
event.preventDefault()
event.stopPropagation()
event.clientX
event.clientY