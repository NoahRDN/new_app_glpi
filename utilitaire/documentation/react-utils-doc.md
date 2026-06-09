| Balise JSX   | Type React spécialisé                         | Type DOM natif         |
| ------------ | --------------------------------------------- | ---------------------- |
| `<button>`   | `ButtonHTMLAttributes<HTMLButtonElement>`     | `HTMLButtonElement`    |
| `<input>`    | `InputHTMLAttributes<HTMLInputElement>`       | `HTMLInputElement`     |
| `<form>`     | `FormHTMLAttributes<HTMLFormElement>`         | `HTMLFormElement`      |
| `<textarea>` | `TextareaHTMLAttributes<HTMLTextAreaElement>` | `HTMLTextAreaElement`  |
| `<select>`   | `SelectHTMLAttributes<HTMLSelectElement>`     | `HTMLSelectElement`    |
| `<option>`   | `OptionHTMLAttributes<HTMLOptionElement>`     | `HTMLOptionElement`    |
| `<a>`        | `AnchorHTMLAttributes<HTMLAnchorElement>`     | `HTMLAnchorElement`    |
| `<img>`      | `ImgHTMLAttributes<HTMLImageElement>`         | `HTMLImageElement`     |
| `<label>`    | `LabelHTMLAttributes<HTMLLabelElement>`       | `HTMLLabelElement`     |
| `<div>`      | `HTMLAttributes<HTMLDivElement>`              | `HTMLDivElement`       |
| `<span>`     | `HTMLAttributes<HTMLSpanElement>`             | `HTMLSpanElement`      |
| `<section>`  | `HTMLAttributes<HTMLElement>`                 | `HTMLElement`          |
| `<table>`    | `TableHTMLAttributes<HTMLTableElement>`       | `HTMLTableElement`     |
| `<tr>`       | `HTMLAttributes<HTMLTableRowElement>`         | `HTMLTableRowElement`  |
| `<td>`       | `TdHTMLAttributes<HTMLTableCellElement>`      | `HTMLTableCellElement` |
| `<th>`       | `ThHTMLAttributes<HTMLTableCellElement>`      | `HTMLTableCellElement` |


Différence entre localStorage, sessionStorage, cookies, state
| Stockage         |                           Durée de vie |                        Accessible JS ? | Cas d’utilisation                            |
| ---------------- | -------------------------------------: | -------------------------------------: | -------------------------------------------- |
| `useState`       |              tant que le composant vit |                                    oui | état d’interface immédiat                    |
| Context/Zustand  |             tant que l’app est ouverte |                                    oui | état partagé React                           |
| `localStorage`   |    persiste après fermeture navigateur |                                    oui | panier local, préférences, thème             |
| `sessionStorage` | disparaît quand l’onglet/session ferme |                                    oui | données temporaires d’une session            |
| Cookie           |                       selon expiration | parfois oui, parfois non si `HttpOnly` | session serveur, auth, tracking, préférences |
| IndexedDB        |                persistant, gros volume |                                    oui | données volumineuses côté client             |


Une fonction qui appelle useState/useEffect/useMemo/useCallback/etc.
→ doit être un hook
→ son nom commence par use
→ elle va dans hooks

Si c’est un objet métier réutilisable partout → entities
Si c’est lié à un scénario utilisateur précis → features
Si c’est commun à tout le projet → shared

Le format ISO courant pour une date est :
YYYY-MM-DD

components → JSX
hooks → fonctions qui utilisent useState/useEffect/useMemo/etc.
lib → logique pure sans React
model → types/config métier
api → appels API

React peut relancer ce composant quand :

- un state change
- une prop change
- le parent re-render
- React StrictMode teste ton composant en développement

en React, le corps du composant doit surtout “décrire l’affichage”; les effets comme API, storage, listeners, doivent être déclenchés par useEffect ou par un événement utilisateur.

entities/cart
→ API basique du panier, types Cart, config Cart, fonctions proches de l’objet Cart

features/cart
→ logique utilisateur autour du panier : session panier, workflow login/logout, panier actif

shared/ui
→ petits composants réutilisables, sans logique métier forte
ex: Button, Input, Modal, PrestashopImage

entities
→ objets métier de base
ex: Product, Cart, Customer, Order, Country

features
→ actions ou cas d’usage utilisateur
ex: login, add-to-cart, checkout, import-data, change-order-status

widgets
→ gros blocs d’interface qui assemblent plusieurs features/entities
ex: FrontofficeNavBar, ProductFiltersPanel, CartSummary, BackofficeSidebar

Règle simple

Un fichier lib doit idéalement répondre à une phrase courte :

cartSession.ts
→ gérer la session panier

checkoutStorage.ts
→ gérer le stockage local du checkout

resolveCheckoutCountryId.ts
→ résoudre le pays à utiliser pour le checkout

productPrice.ts
→ calculer ou préparer les prix produit

orderStatus.ts
→ convertir/valider les états de commande

Si tu ne peux pas résumer le fichier en une phrase claire, il est peut-être trop gros ou mal nommé.

Comment choisir le nom d’un fichier lib ?

Le nom doit dire ce que le fichier fait, pas juste contenir un mot vague.

Évite :

utils.ts
helpers.ts
functions.ts
common.ts
service.ts

Préférer :

cartSession.ts
customerStorage.ts
checkoutStorage.ts
resolveCheckoutCountryId.ts
orderStatusMapper.ts
productCombinationPrice.ts
csvImportValidation.ts
stockQuantity.ts

Le nom doit être orienté métier ou action.

Différence claire entre hooks et lib
Dans hooks

Tu mets les fonctions qui utilisent React :

useState
useEffect
useMemo
useCallback
useContext

Exemple :

useFrontofficeSession.ts
useCheckoutCountryId.ts
useStudents.ts
useCart.ts
Dans lib

Tu mets la logique sans React :

localStorage.getItem(...)
JSON.parse(...)
calcul métier
validation
transformation de données
mapping
formatage métier

L’objet imbriqué est plus lourd parce qu’il contient plus de données :

- plus de mémoire
- plus de parsing JSON
- plus de transformation
- plus de données à passer dans les composants

Mais le plus coûteux reste généralement :

1. le nombre de requêtes HTTP
2. la taille de la réponse API
3. le parsing XML/JSON
4. les images
5. les re-renders React inutiles

La règle métier/pro à retenir

Pour PrestaShop API :

Ne récupère pas tout “au cas où”.
Récupère ce que l’écran a besoin d’afficher.

Donc :

Page liste produits
→ display=[id,name,price,reference,id_default_image...]

Page détail produit
→ getProductById(id) plus complet

Backoffice import/statistiques
→ requêtes plus complètes possibles, mais paginées

Gros volume
→ limit + pagination

Quand tu fais beaucoup de logs :

System.out.println(...)

ou :

console.log(...)

le programme doit :

- convertir les valeurs en texte
- écrire dans la console
- parfois afficher/mettre à jour l’interface de debug
- garder les objets inspectables en mémoire

Dans une boucle avec beaucoup d’éléments, ça peut ralentir énormément.

Les formats possibles avec DOMParser
| MIME type                 | Utilisation     | Résultat général |
| ------------------------- | --------------- | ---------------- |
| `"text/html"`             | Parser du HTML  | `HTMLDocument`   |
| `"text/xml"`              | Parser du XML   | `XMLDocument`    |
| `"application/xml"`       | Parser du XML   | `XMLDocument`    |
| `"application/xhtml+xml"` | Parser du XHTML | `XMLDocument`    |
| `"image/svg+xml"`         | Parser du SVG   | `XMLDocument`    |

Les méthodes importantes des tableaux
map

Transforme chaque élément et retourne un nouveau tableau.

const numbers = [1, 2, 3];

const doubled = numbers.map((number) => number * 2);

console.log(doubled); // [2, 4, 6]

Cas d’utilisation React :

students.map((student) => (
  <li key={student.id}>{student.name}</li>
))
filter

Garde seulement certains éléments.

const numbers = [1, 2, 3, 4];

const evenNumbers = numbers.filter((number) => number % 2 === 0);

console.log(evenNumbers); // [2, 4]

Cas d’utilisation :

const activeCustomers = customers.filter((customer) => customer.active);
find

Retourne le premier élément qui correspond.

const students = [
  { id: 1, name: "Noah" },
  { id: 2, name: "Jean" },
];

const student = students.find((student) => student.id === 2);

console.log(student); // { id: 2, name: "Jean" }

Si rien n’est trouvé :

undefined
some

Retourne true si au moins un élément correspond.

const hasAdult = users.some((user) => user.age >= 18);

Cas d’utilisation :

const productExists = products.some((product) => product.id === productId);
every

Retourne true si tous les éléments correspondent.

const allProductsInStock = products.every((product) => product.stock > 0);
reduce

Accumule une valeur à partir d’un tableau.

Exemple somme :

const numbers = [10, 20, 30];

const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);

console.log(total); // 60

Cas panier :

const totalQuantity = cartRows.reduce((total, row) => {
  return total + row.quantity;
}, 0);
sort

Trie un tableau.

Attention : sort modifie le tableau original.

const numbers = [3, 1, 2];

numbers.sort((a, b) => a - b);

console.log(numbers); // [1, 2, 3]

Pour éviter de modifier l’original :

const sortedNumbers = [...numbers].sort((a, b) => a - b);

Cas clients :

const sortedCustomers = [...customers].sort((a, b) =>
  a.lastname.localeCompare(b.lastname)
);


propriétés/méthodes d'un Element DOM
| Fonction / attribut          |              Retourne | Utilité                                            | Exemple                                                              |
| ---------------------------- | --------------------: | -------------------------------------------------- | -------------------------------------------------------------------- |
| `textContent`                |      `string \| null` | Lire le texte contenu dans l’élément               | `node.querySelector("firstname")?.textContent`                       |
| `querySelector(selector)`    |     `Element \| null` | Trouver le premier enfant correspondant            | `customer.querySelector("id")`                                       |
| `querySelectorAll(selector)` | `NodeListOf<Element>` | Trouver tous les enfants correspondants            | `xmlDoc.querySelectorAll("customers > customer")`                    |
| `tagName`                    |              `string` | Nom de la balise                                   | `customer.tagName` donne `"customer"` ou `"CUSTOMER"` selon contexte |
| `localName`                  |              `string` | Nom local de la balise, souvent plus fiable en XML | `customer.localName` donne `"customer"`                              |
| `children`                   |      `HTMLCollection` | Liste des enfants éléments                         | `customer.children`                                                  |
| `parentElement`              |     `Element \| null` | Élément parent                                     | `customer.parentElement`                                             |
| `getAttribute(name)`         |      `string \| null` | Lire un attribut                                   | `node.getAttribute("id")`                                            |
| `setAttribute(name, value)`  |                `void` | Modifier ou ajouter un attribut                    | `node.setAttribute("active", "true")`                                |
| `hasAttribute(name)`         |             `boolean` | Vérifier si un attribut existe                     | `node.hasAttribute("id")`                                            |
| `removeAttribute(name)`      |                `void` | Supprimer un attribut                              | `node.removeAttribute("active")`                                     |
| `innerHTML`                  |              `string` | Lire le contenu XML/HTML interne                   | `customer.innerHTML`                                                 |
| `outerHTML`                  |              `string` | Lire l’élément complet en string                   | `customer.outerHTML`                                                 |

Navigation dans l’arbre DOM
| Propriété                | Utilité                         | Exemple                           |
| ------------------------ | ------------------------------- | --------------------------------- |
| `parentElement`          | Remonter vers le parent élément | `customer.parentElement`          |
| `children`               | Obtenir les enfants éléments    | `customer.children`               |
| `childElementCount`      | Nombre d’enfants éléments       | `customer.childElementCount`      |
| `firstElementChild`      | Premier enfant élément          | `customer.firstElementChild`      |
| `lastElementChild`       | Dernier enfant élément          | `customer.lastElementChild`       |
| `nextElementSibling`     | Élément frère suivant           | `customer.nextElementSibling`     |
| `previousElementSibling` | Élément frère précédent         | `customer.previousElementSibling` |

Différence entre children et childNodes
| Propriété    | Contient quoi ?                            | Exemple                                |
| ------------ | ------------------------------------------ | -------------------------------------- |
| `children`   | Seulement les éléments                     | `<id>`, `<firstname>`, `<lastname>`    |
| `childNodes` | Éléments + textes + espaces + commentaires | texte `"\n  "`, `<id>`, texte `"\n  "` |

Tableau utile Element DOM
| Méthode / propriété             | Utilité                      | Exemple                            |
| ------------------------------- | ---------------------------- | ---------------------------------- |
| `getAttribute("name")`          | Lire un attribut             | `node.getAttribute("id")`          |
| `setAttribute("name", "value")` | Ajouter/modifier un attribut | `node.setAttribute("active", "1")` |
| `removeAttribute("name")`       | Supprimer un attribut        | `node.removeAttribute("active")`   |
| `hasAttribute("name")`          | Tester l’existence           | `node.hasAttribute("id")`          |
| `attributes`                    | Liste des attributs          | `node.attributes`                  |

Lecture contenu Element DOM
| Propriété     | Utilité                                       | Exemple            |
| ------------- | --------------------------------------------- | ------------------ |
| `textContent` | Texte brut à l’intérieur                      | `node.textContent` |
| `innerHTML`   | Contenu interne sous forme de string XML/HTML | `node.innerHTML`   |
| `outerHTML`   | Élément complet sous forme de string          | `node.outerHTML`   |

Sélection et test CSS Element DOM
| Méthode                        | Utilité                                       | Exemple                               |
| ------------------------------ | --------------------------------------------- | ------------------------------------- |
| `querySelector("selector")`    | Premier élément correspondant                 | `customer.querySelector("firstname")` |
| `querySelectorAll("selector")` | Tous les éléments correspondants              | `xmlDoc.querySelectorAll("customer")` |
| `matches("selector")`          | Vérifier si l’élément correspond au sélecteur | `node.matches("customer")`            |
| `closest("selector")`          | Remonter vers le parent correspondant         | `node.closest("customers")`           |

Modification du DOM
| Méthode                | Utilité                    | Exemple                          |
| ---------------------- | -------------------------- | -------------------------------- |
| `append(...)`          | Ajouter à la fin           | `node.append(child)`             |
| `prepend(...)`         | Ajouter au début           | `node.prepend(child)`            |
| `remove()`             | Supprimer l’élément        | `node.remove()`                  |
| `replaceChildren(...)` | Remplacer tous les enfants | `node.replaceChildren(newChild)` |
| `before(...)`          | Ajouter avant l’élément    | `node.before(otherNode)`         |
| `after(...)`           | Ajouter après l’élément    | `node.after(otherNode)`          |
| `cloneNode(true)`      | Copier un élément          | `node.cloneNode(true)`           |

Classes et id
| Propriété / méthode       | Utilité                 | Exemple                                |
| ------------------------- | ----------------------- | -------------------------------------- |
| `id`                      | Lire/modifier l’id HTML | `element.id`                           |
| `className`               | Lire/modifier la classe | `element.className`                    |
| `classList.add(...)`      | Ajouter une classe      | `element.classList.add("active")`      |
| `classList.remove(...)`   | Supprimer une classe    | `element.classList.remove("active")`   |
| `classList.contains(...)` | Tester une classe       | `element.classList.contains("active")` |

Événements
| Méthode                    | Utilité                 | Exemple                                         |
| -------------------------- | ----------------------- | ----------------------------------------------- |
| `addEventListener(...)`    | Écouter un événement    | `button.addEventListener("click", callback)`    |
| `removeEventListener(...)` | Retirer l’écouteur      | `button.removeEventListener("click", callback)` |
| `dispatchEvent(...)`       | Déclencher un événement | `button.dispatchEvent(new Event("click"))`      |


| Propriété      | Utilité normale                    | Utile pour XML PrestaShop ? |
| -------------- | ---------------------------------- | --------------------------- |
| `clientWidth`  | Largeur affichée d’un élément HTML | Non                         |
| `clientHeight` | Hauteur affichée                   | Non                         |
| `scrollTop`    | Position de scroll                 | Non                         |
| `ariaLabel`    | Accessibilité HTML                 | Rarement                    |
| `role`         | Rôle accessibilité                 | Rarement                    |
| `style`        | Style CSS inline                   | Non pour XML API            |
| `classList`    | Classes CSS                        | Rarement                    |

les different fonctions acceessible pour un Array: 
| Méthode       |                        Retourne | Modifie le tableau original ? | Usage principal                                        |
| ------------- | ------------------------------: | ----------------------------: | ------------------------------------------------------ |
| `map`         |                 nouveau tableau |                           Non | transformer chaque élément                             |
| `filter`      |                 nouveau tableau |                           Non | garder seulement certains éléments                     |
| `find`        |       un élément ou `undefined` |                           Non | trouver le premier élément correspondant               |
| `findIndex`   |                        `number` |                           Non | trouver l’index du premier élément correspondant       |
| `some`        |                       `boolean` |                           Non | vérifier s’il existe au moins un élément correspondant |
| `every`       |                       `boolean` |                           Non | vérifier si tous les éléments respectent une condition |
| `reduce`      |               une valeur finale |                           Non | calculer, accumuler, grouper, transformer en objet     |
| `sort`        |                 le tableau trié |                       **Oui** | trier le tableau original                              |
| `toSorted`    |            nouveau tableau trié |                           Non | trier sans modifier l’original                         |
| `reverse`     |                 tableau inversé |                       **Oui** | inverser le tableau original                           |
| `toReversed`  |         nouveau tableau inversé |                           Non | inverser sans modifier l’original                      |
| `slice`       |                 nouveau tableau |                           Non | copier ou prendre une portion                          |
| `splice`      |              éléments supprimés |                       **Oui** | supprimer/insérer dans le tableau original             |
| `toSpliced`   |                 nouveau tableau |                           Non | supprimer/insérer sans modifier l’original             |
| `includes`    |                       `boolean` |                           Non | vérifier si une valeur exacte existe                   |
| `push`        |               nouvelle longueur |                       **Oui** | ajouter à la fin                                       |
| `pop`         | élément supprimé ou `undefined` |                       **Oui** | supprimer le dernier élément                           |
| `unshift`     |               nouvelle longueur |                       **Oui** | ajouter au début                                       |
| `shift`       | élément supprimé ou `undefined` |                       **Oui** | supprimer le premier élément                           |
| `flat`        |          nouveau tableau aplati |                           Non | aplatir un tableau de tableaux                         |
| `flatMap`     |          nouveau tableau aplati |                           Non | faire un `map` puis aplatir d’un niveau                |
| `forEach`     |                     `undefined` |                           Non | exécuter une action pour chaque élément                |
| `join`        |                        `string` |                           Non | transformer un tableau en texte                        |
| `concat`      |                 nouveau tableau |                           Non | fusionner plusieurs tableaux                           |
| `at`          |          élément ou `undefined` |                           Non | accéder à un élément, y compris avec index négatif     |
| `indexOf`     |                        `number` |                           Non | trouver l’index d’une valeur simple                    |
| `lastIndexOf` |                        `number` |                           Non | trouver le dernier index d’une valeur simple           |


sort trie un tableau, mais attention : il modifie le tableau original.

const numbers = [3, 1, 2];

numbers.sort((a, b) => a - b);

console.log(numbers); // [1, 2, 3]

Tri croissant :

numbers.sort((a, b) => a - b);

Tri décroissant :

numbers.sort((a, b) => b - a);

Tri texte :

const sortedCustomers = [...customers].sort((a, b) =>
  a.lastname.localeCompare(b.lastname)
);

Pourquoi [...] ?

Parce que sort modifie le tableau original. En React, il vaut mieux éviter de modifier directement un state.

Mauvais :

customers.sort((a, b) => a.lastname.localeCompare(b.lastname));
setCustomers(customers);

Bon :

setCustomers((previousCustomers) =>
  [...previousCustomers].sort((a, b) =>
    a.lastname.localeCompare(b.lastname)
  )
);

slice(start, end) prend de start jusqu’avant end.

À ne pas utiliser pour générer du JSX :

Mauvais :

{customers.forEach((customer) => (
  <li>{customer.firstname}</li>
))}

Parce que forEach retourne undefined.

Bon :

{customers.map((customer) => (
  <li key={customer.id}>{customer.firstname}</li>
))}

Utilise forEach pour des effets secondaires :

CART_STORAGE_KEYS_ARRAY.forEach((key) => {
  localStorage.removeItem(key);
});

const numbers = [10, 20, 30];

const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);

reduce prend principalement deux choses :

1. une fonction d’accumulation
2. une valeur initiale

Cas concret :

const carts = [
  {
    id: 1,
    rows: [
      { productId: 10, quantity: 2 },
      { productId: 11, quantity: 1 },
    ],
  },
  {
    id: 2,
    rows: [
      { productId: 12, quantity: 5 },
    ],
  },
];

Avec map :

const rows = carts.map((cart) => cart.rows);

Résultat :

[
  [
    { productId: 10, quantity: 2 },
    { productId: 11, quantity: 1 }
  ],
  [
    { productId: 12, quantity: 5 }
  ]
]

Type :

CartRow[][]

Avec flatMap :

const rows = carts.flatMap((cart) => cart.rows);

Résultat :

[
  { productId: 10, quantity: 2 },
  { productId: 11, quantity: 1 },
  { productId: 12, quantity: 5 }
]

Type :

CartRow[]

const result = numbers.reduce<number[]>((accumulator, number, index, array) => {
  if (number % 2 === 0 && index + 1 < array.length) {
    accumulator.push(array[index + 1]);
  }

  return accumulator;
}, []);

console.log(result);

Tu peux aussi faire :

const students: Student[] = Array.from({ length: 4 }, () => cloneStudent(model));

Explication :

Créer un tableau de 4 éléments.
Pour chaque position, appeler cloneStudent(model).

Donc chaque élément est une nouvelle copie.

Utilise Date si tu veux vraiment faire des calculs :

- comparer deux dates
- ajouter des jours
- trier précisément par date
- calculer une durée

| Outil                   | Usage                                   |
| ----------------------- | --------------------------------------- |
| `<NavLink to="...">`    | lien cliquable avec style actif         |
| `<Link to="...">`       | lien cliquable simple                   |
| `<Navigate to="..." />` | redirection automatique dans le JSX     |
| `useNavigate()`         | navigation déclenchée dans une fonction |


Différence entre value et checked
| Type d’input | Propriété importante |
| ------------ | -------------------- |
| `text`       | `value`              |
| `password`   | `value`              |
| `number`     | `value`              |
| `textarea`   | `value`              |
| `checkbox`   | `checked`            |
| `radio`      | `checked`            |
| `select`     | `value`              |

| Élément                 | State conseillé      | Prop contrôlée      | Dans `onChange`, on lit souvent                |
| ----------------------- | -------------------- | ------------------- | ---------------------------------------------- |
| `input type="text"`     | `string`             | `value`             | `event.currentTarget.value`                    |
| `input type="password"` | `string`             | `value`             | `event.currentTarget.value`                    |
| `input type="number"`   | `number` ou `string` | `value`             | `Number(event.currentTarget.value)` ou `value` |
| `input type="checkbox"` | `boolean`            | `checked`           | `event.currentTarget.checked`                  |
| `input type="radio"`    | `string`             | `checked` + `value` | `event.currentTarget.value`                    |
| `select`                | `string` ou `number` | `value`             | `event.currentTarget.value`                    |
| `textarea`              | `string`             | `value`             | `event.currentTarget.value`                    |

Radio

Un radio a aussi checked, mais on l’utilise souvent avec un value.

Exemple : choisir un mode de livraison.

const [deliveryMode, setDeliveryMode] = useState("home");

<label>
  <input
    type="radio"
    name="deliveryMode"
    value="home"
    checked={deliveryMode === "home"}
    onChange={(event) => setDeliveryMode(event.currentTarget.value)}
  />
  Livraison à domicile
</label>

<label>
  <input
    type="radio"
    name="deliveryMode"
    value="pickup"
    checked={deliveryMode === "pickup"}
    onChange={(event) => setDeliveryMode(event.currentTarget.value)}
  />
  Retrait magasin
</label>

Ici :

checked={deliveryMode === "home"}

sert à dire si ce bouton radio précis est sélectionné.

Mais dans onChange, on récupère souvent :

event.currentTarget.value

parce que ce qu’on veut stocker, c’est la valeur choisie :

"home"

ou :

"pickup"

Donc pour radio :

checked → savoir si cette option est sélectionnée
value   → valeur de cette option

| Cas                         | Type recommandé                                      |
| --------------------------- | ---------------------------------------------------- |
| `onSubmit` sur `<form>`     | `React.SyntheticEvent<HTMLFormElement, SubmitEvent>` |
| `onChange` sur `<input>`    | `React.ChangeEvent<HTMLInputElement>`                |
| `onChange` sur `<textarea>` | `React.ChangeEvent<HTMLTextAreaElement>`             |
| `onChange` sur `<select>`   | `React.ChangeEvent<HTMLSelectElement>`               |
| `onClick` sur `<button>`    | `React.MouseEvent<HTMLButtonElement>`                |
| `onClick` sur `<a>`         | `React.MouseEvent<HTMLAnchorElement>`                |
| `onKeyDown` sur input       | `React.KeyboardEvent<HTMLInputElement>`              |
| `onFocus` sur input         | `React.FocusEvent<HTMLInputElement>`                 |
| `onBlur` sur input          | `React.FocusEvent<HTMLInputElement>`                 |

map avec fonction normale
→ retourne T[]

map avec fonction async
→ retourne Promise<T>[]

Promise.all(...)
→ transforme Promise<T>[] en Promise<T[]>


nombre négatif → left vient avant right
nombre positif → right vient avant left
0              → les deux sont équivalents pour le tri


Les hooks importants à connaître
| Hook          | Sert à quoi ?                                                   |
| ------------- | --------------------------------------------------------------- |
| `useState`    | stocker un état React                                           |
| `useEffect`   | synchroniser avec extérieur : API, localStorage, event listener |
| `useMemo`     | mémoriser un calcul                                             |
| `useCallback` | mémoriser une fonction                                          |
| `useRef`      | garder une valeur ou accéder à un élément DOM sans re-render    |
| `useContext`  | lire une valeur globale React partagée                          |
| `useReducer`  | gérer un state complexe avec des actions                        |
| `useId`       | générer un id stable pour formulaire/accessibilité              |

Et côté React Router
| Hook              | Sert à quoi ?                                  |
| ----------------- | ---------------------------------------------- |
| `useNavigate`     | naviguer dans une fonction                     |
| `useLocation`     | lire l’URL actuelle et `location.state`        |
| `useParams`       | lire les paramètres d’URL comme `productId`    |
| `useSearchParams` | lire/modifier les query params comme `?page=2` |


Object.fromEntries(...)

Object.fromEntries transforme un tableau de paires [clé, valeur] en objet.

Exemple simple :

Object.fromEntries([
  ["name", "Noah"],
  ["age", 20],
]);

retourne :

{
  name: "Noah",
  age: 20,
}

useMemo  => calcule une valeur
useEffect => exécute une action après le rendu

Par exemple avec lucide-react, les icônes acceptent des props comme :

size
color
strokeWidth
absoluteStrokeWidth
className

#### utiliser pour que vscode lit le projet et signale en mettant directeemnt en rouge les fichier qui on des probleme au lieu de lire fichier par ficheir 
.vscode/settings.json
{
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "js/ts.tsserver.experimental.enableProjectDiagnostics": true
}

1. Différence entre alert et confirm

alert() affiche seulement un message avec un bouton “OK” :

alert("Voulez-vous réellement supprimer ?");

Résultat :

[ OK ]

confirm() affiche deux choix :

const isConfirmed = confirm("Voulez-vous réellement supprimer ?");

Résultat :

[ Annuler ] [ OK ]

En JavaScript :

OK       → true
Annuler  → false

============
@tanstack/react-query t’aide à gérer :

chargement
erreurs
cache
rafraîchissement automatique
mutation POST / PUT / DELETE
rechargement après ajout/suppression

Exemple concret dans ton projet GLPI :

const { data: users, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
});

Au lieu de gérer manuellement partout :

useState()
useEffect()
setIsLoading()
setError()
refreshUsers()

TanStack Query est justement fait pour gérer les données serveur dans React. Sa documentation le décrit comme un outil de gestion, cache et synchronisation des données asynchrones.

@tanstack/react-query
→ gérer les données API : GET, POST, DELETE, cache, loading, errors

react-router
→ créer les pages et routes dans React

react-router-dom
→ ancien package très utilisé pour le routage navigateur, encore vu dans beaucoup de tutos


=============
## query react
les différents options qui pourrait être utile dans dans l'objet pris par "useQuery":
retry

Par défaut, React Query peut réessayer une requête échouée. La documentation indique que retry peut être un booléen, un nombre, ou une fonction, et que côté client la valeur par défaut est 3.

Pour apprendre, je te conseille :

retry: 1

Comme ça, si l’API GLPI échoue, React Query réessaie une fois, mais pas trop.

enabled

Utile quand tu ne veux lancer la requête que sous condition.

Exemple plus tard :

useQuery({
  queryKey: ["assets", "computers", entityId],
  queryFn: () => getComputersByEntity(entityId),
  enabled: entityId !== null,
});

Ça veut dire :

Ne lance la requête que si entityId existe.
select

Utile pour transformer les données avant de les donner au composant.

Exemple :

useQuery({
  queryKey: computersQueryKey,
  queryFn: getComputers,
  select: (computers) => computers.filter((computer) => !computer.is_deleted),
});

Ça permet de ne donner au composant que les ordinateurs non supprimés.
++++++++++++++++

2. Pourquoi ["assets", "computers"] ?

Cette ligne :

export const computersQueryKey = ["assets", "computers"] as const;

sert à nommer précisément le cache des ordinateurs.

Tu peux lire ça comme un chemin :

assets
└── computers

Donc :

["assets", "computers"]
= cache de la liste des ordinateurs du module assets/parc

Tu pourrais mettre seulement :

["computers"]

et ça marcherait aussi.

Mais ["assets", "computers"] est plus organisé, surtout si plus tard tu as :

["assets", "printers"]
["assets", "monitors"]
["assets", "phones"]
["users"]
["tickets"]

C’est utile aussi plus tard pour invalider plusieurs caches. Exemple :

queryClient.invalidateQueries({ queryKey: ["assets"] });

Ça peut vouloir dire :

Recharge toutes les données liées aux assets :
- computers
- printers
- monitors
- phones

Alors que :

queryClient.invalidateQueries({ queryKey: ["assets", "computers"] });

veut dire :

Recharge seulement les ordinateurs.

Le as const sert à dire à TypeScript :

Cette clé est fixe, garde les types exacts "assets" et "computers".
3. Quels paramètres useQuery prend ?

La documentation officielle indique que useQuery prend un objet d’options. Les deux plus importants sont queryKey et queryFn. queryKey est obligatoire, et queryFn est obligatoire sauf si tu as défini une fonction par défaut globale.

Pour toi, retiens d’abord seulement ceux-là :

useQuery({
  queryKey: ["assets", "computers"],
  queryFn: getComputers,
  staleTime: 60_000,
});
queryKey

Nom du cache.

queryKey: ["assets", "computers"]
queryFn

Fonction qui va chercher les données.

queryFn: getComputers

Important : getComputers doit retourner une Promise.

export async function getComputers(): Promise<Computer[]> {
  return glpiGet<Computer[]>("/Asset/Computer");
}
staleTime

Durée pendant laquelle React Query considère que les données sont encore bonnes.

staleTime: 60_000

60_000 millisecondes = 60 secondes.

4. “Données fraîches” ou “stale”, ça veut dire quoi ?

Imagine ça :

10:00:00 → tu ouvres /admin/parcs
10:00:00 → React Query charge les ordinateurs
10:00:10 → tu quittes la page
10:00:20 → tu reviens sur la page

Avec :

staleTime: 60_000

React Query se dit :

Les données ont été chargées il y a 20 secondes.
Elles sont encore fraîches.
Je peux les réutiliser.

Après 60 secondes, elles deviennent “stale”, c’est-à-dire “potentiellement anciennes”. Ça ne veut pas dire qu’elles sont supprimées. Ça veut juste dire que React Query peut décider de refaire une requête dans certaines situations. La documentation explique que les données sont marquées comme “stale” après le staleTime, et que la valeur par défaut est 0, donc immédiatement “stale”.

Pour GLPI, staleTime: 60_000 est raisonnable pour commencer.

=========
Mais attention : useMemo n’est pas obligatoire. La documentation React conseille de l’utiliser comme optimisation de performance, pas pour corriger une logique cassée.

useMemo sert à garder le résultat d’un calcul entre deux rendus React.

La documentation React dit que useMemo permet de mettre en cache le résultat d’un calcul entre les re-renders.

Sans useMemo :

const visibleComputers = computers.filter(...);

Ce filtre est recalculé à chaque render du composant.

Avec useMemo :

const visibleComputers = useMemo(() => {
  return computers.filter(...);
}, [computers, search]);

React se dit :

Si computers et search n’ont pas changé,
je réutilise l’ancien visibleComputers.

React compare les dépendances et ne relance le calcul que si elles changent.

===============
## Hooks React utiles à connaître
useState
→ stocker un état local : search, page, modal open

useEffect
→ lancer un effet quand quelque chose change, surtout en manuel

useMemo
→ mémoriser un calcul

useCallback
→ mémoriser une fonction

useRef
→ garder une valeur sans provoquer de re-render

useParams
→ lire les paramètres d’URL avec React Router

useNavigate
→ naviguer avec React Router

useQuery
→ GET serveur avec React Query

useMutation
→ POST/PATCH/DELETE avec React Query

useQueryClient
→ invalider ou modifier le cache React Query

## durée de vie composant: 
Quand ListComputer est monté → limit = 20
Quand tu changes limit → limit devient 5, 10, 50...
Quand tu quittes la page → le composant est détruit
Quand tu reviens → le composant est recréé → limit revient à 20

## Durée de vie d’un state

Quand tu écris :

const [limit, setLimit] = useState<number>(20);

React crée un état lié à l’instance actuelle du composant ListComputer.

Il faut distinguer trois situations.

Cas 1 — Re-render simple

Exemple : tu fais :

setSearch("pc");

ou :

setLimit(50);

Le composant est réexécuté, mais il n’est pas détruit.

Donc les states sont conservés :

search reste sa dernière valeur
page reste sa dernière valeur
limit reste sa dernière valeur

C’est un re-render, pas une destruction.

Cas 2 — Tu quittes la page

Exemple : tu vas de :

/admin/computers

vers :

/admin/users

Si ListComputer n’est plus affiché, React le démonte.

Donc ses states disparaissent :

search disparaît
page disparaît
limit disparaît

Quand tu reviens sur /admin/computers, React recrée un nouveau ListComputer, donc :

useState<number>(20)

repart à 20.

Cas 3 — Tu veux garder la valeur même après avoir quitté la page

Là, il faut stocker la valeur ailleurs que dans le composant :

localStorage
URL query params
Context global
Zustand/Redux
backend
React Query cache, mais plutôt pour données serveur

Pour limit, localStorage est correct.

Mais ne fais pas le debounce maintenant. Teste d’abord le filtre côté API.

## Pourquoi * dans name==*${query}* ?

Cette syntaxe veut dire :

contient

Exemple :

return `name==*hp*`;

veut dire :

Cherche les ordinateurs dont le name contient "hp"

Sans les * :

name==hp

ça veut dire plutôt :

name exactement égal à "hp"

Donc :

name==*hp*

peut trouver :

HP-ProBook-001
PC-HP-Test
ordinateur-hp

Les * servent donc de joker, comme un LIKE "%hp%" en SQL.

## utilisation fonction anonyme: 

Quand tu utilises {} après la flèche, tu dois écrire return.

Correct :

setSearch((currentSearch) => {
  return {
    ...currentSearch,
    name: event.target.value,
  };
});

Ou version courte :

setSearch((currentSearch) => ({
  ...currentSearch,
  name: event.target.value,
}));

Mais dans ton cas, tu as un autre problème : ton search peut être undefined.

## Avec un debounce de 400 ms :

tu tapes H
→ timer de 400 ms démarre

tu tapes P avant 400 ms
→ l’ancien timer est annulé
→ un nouveau timer de 400 ms démarre

tu tapes - avant 400 ms
→ l’ancien timer est annulé
→ un nouveau timer démarre

Donc tant que tu tapes vite, aucune requête n’est envoyée.

Mais si tu fais une pause de plus de 400 ms, là debouncedSearch change, donc React Query appelle GLPI.

## remarque button
Donc ton bouton “Annuler” peut déclencher le submit du formulaire.

Il faut mettre :

<Button
  type="button"
  className="w-full flex items-center flex-col"
  isWithBackground={false}
  onClick={onClose}
>
  Annuler
</Button>

## structuredClone : pourquoi “ne fonctionne pas avec tout” ?

structuredClone() fait une copie profonde.

Exemple simple :

const original = {
  entity: {
    id: 1,
    name: "Entité A",
  },
};

const copy = structuredClone(original);

copy.entity.name = "Entité B";

console.log(original.entity.name); // "Entité A"

Ici, entity est bien copié aussi. Donc copy.entity et original.entity ne sont pas la même référence.

Mais structuredClone() ne sait pas copier certains éléments comme :

const object = {
  name: "test",
  action: () => console.log("hello"),
};

const copy = structuredClone(object); // erreur

Pourquoi ? Parce qu’une fonction n’est pas juste une donnée simple. C’est du code exécutable.

Donc structuredClone() est bien pour des objets simples :

string
number
boolean
null
array
object simple
Date
Map
Set

Mais il faut faire attention avec :

fonctions
classes avec méthodes
objets complexes du DOM
certains objets spéciaux

Dans ton cas, ton generalViewAssetItemDefault contient seulement des strings, numbers, booleans et objets simples. Donc structuredClone(generalViewAssetItemDefault) peut marcher.

## recharger page

Avec React Router, tu peux utiliser useNavigate.

Dans ton composant :

import { useNavigate } from "react-router";

Puis :

const navigate = useNavigate();

Et sur ton bouton :

<Button className="mt-3" onClick={() => navigate(-1)}>
  Retour
</Button>

## Object.entries

Tu pars d’un objet comme ça :

const groupedAssetsByItemType = {
  Imprimante: [
    { id: 102, itemType: "Imprimante", name: "PRINTER-001" },
    { id: 103, itemType: "Imprimante", name: "PRINTER-002" },
  ],
  Ordinateur: [
    { id: 10, itemType: "Ordinateur", name: "PC-001" },
  ],
};

Cette ligne :

Object.entries(groupedAssetsByItemType)

transforme l’objet en tableau de paires :

[
  ["Imprimante", [
    { id: 102, itemType: "Imprimante", name: "PRINTER-001" },
    { id: 103, itemType: "Imprimante", name: "PRINTER-002" },
  ]],
  ["Ordinateur", [
    { id: 10, itemType: "Ordinateur", name: "PC-001" },
  ]]
]