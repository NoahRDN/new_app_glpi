bg-[var(--app-bg)]
text-[var(--text-primary)]
bg-[var(--accent-blue)]

Le format :

bg-[...]
text-[...]
rounded-[...]
tracking-[...]
grid-cols-[...]

s’appelle une valeur arbitraire Tailwind.

Exemple :

rounded-[20px]

veut dire :

border-radius: 20px;

Et :

tracking-[0.2em]

veut dire :

letter-spacing: 0.2em;

==============

Utilise flex pour :

- aligner une icône avec un texte
- aligner des boutons
- centrer un élément
- faire une navbar
- mettre des éléments en ligne
- mettre des éléments en colonne simple

Exemple :

<div className="flex items-center gap-2">
  <span>🔎</span>
  <input />
</div>

Utilise grid pour :

- faire une page avec sidebar + contenu
- faire plusieurs colonnes
- organiser des cartes de dashboard
- créer une structure globale
- faire un tableau visuel

Exemple :

<div className="grid grid-cols-12 gap-7">
  <div className="col-span-4">Carte 1</div>
  <div className="col-span-8">Carte 2</div>
</div>


==========

Dans Tailwind, par défaut :

sm = 640px
md = 768px
lg = 1024px
xl = 1280px
2xl = 1536px

Donc :

lg:grid

veut dire :

à partir de 1024px de largeur d’écran, applique grid

En dessous de 1024px, lg:grid ne s’applique pas.

===========

Tu as :

lg:grid-cols-[250px_minmax(0,1fr)]

Cela veut dire :

grid-template-columns: 250px minmax(0, 1fr);

Traduction :

colonne 1 : 250px
colonne 2 : minimum 0, maximum 1fr

1fr veut dire :

une fraction de l’espace disponible

Donc dans ton cas :

sidebar = 250px
main = tout l’espace restant


=============

Tailwind propose plusieurs classes.

transition

Anime plusieurs propriétés courantes.

transition-colors

Anime les couleurs seulement.

transition-opacity

Anime l’opacité.

Exemple :

<button className="opacity-70 transition-opacity hover:opacity-100">
transition-transform

Anime les transformations comme scale, rotate, translate.

Exemple :

<button className="transition-transform hover:scale-105">

Au survol, le bouton grossit légèrement.

transition-shadow

Anime l’ombre.

Exemple :

<div className="shadow-sm transition-shadow hover:shadow-lg">

Tu peux aussi utiliser :

transition-all

Mais il faut éviter de l’utiliser partout, parce que ça peut animer trop de choses et rendre le site moins performant.

==============

12. Exemple très visible pour comprendre transition

Essaie ce bouton :

<button className="rounded-xl bg-blue-600 px-4 py-2 text-white transition-transform duration-[2000ms] hover:scale-125">
  Test animation
</button>

Quand tu passes la souris dessus, il grossit lentement.

Essaie aussi :

<button className="rounded-xl bg-blue-600 px-4 py-2 text-white transition-colors duration-[2000ms] hover:bg-red-600">
  Test couleur
</button>

Quand tu passes la souris dessus, le fond passe lentement de bleu à rouge.

Là, tu verras clairement la différence entre :

transition-colors    → anime les couleurs
transition-transform → anime la taille / position / rotation

==========

Si tu veux verticalement, tu dois ajouter :

flex-col

Donc :

<form className="flex flex-col gap-3">

Résultat :

[ Username ]

[ First Name ]

[ Email ]