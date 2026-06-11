# GLPI Legacy REST API — Catalogue pratique des endpoints

> Ce document concerne l'API legacy de GLPI, généralement accessible via `apirest.php`.
>
> Exemple local :
>
> ```txt
> http://glpi.localhost/apirest.php
> ```
>
> Dans ton projet front, cela correspond probablement au proxy :
>
> ```txt
> /glpi-legacy-api
> ```

---

## 1. Principe général de l'API legacy

L'API legacy GLPI fonctionne principalement avec la notion d'**itemtype**.

Un `itemtype` correspond souvent directement à une classe PHP GLPI présente dans le dossier `src/`.

Exemples :

| Fichier GLPI | Itemtype | Endpoint legacy |
|---|---:|---|
| `src/Ticket.php` | `Ticket` | `/apirest.php/Ticket` |
| `src/User.php` | `User` | `/apirest.php/User` |
| `src/Computer.php` | `Computer` | `/apirest.php/Computer` |
| `src/Document.php` | `Document` | `/apirest.php/Document` |
| `src/Document_Item.php` | `Document_Item` | `/apirest.php/Document_Item` |
| `src/Ticket_User.php` | `Ticket_User` | `/apirest.php/Ticket_User` |
| `src/Group_Ticket.php` | `Group_Ticket` | `/apirest.php/Group_Ticket` |

La règle pratique est donc :

```txt
src/NomClasse.php
→ NomClasse
→ /apirest.php/NomClasse
```

Attention : toutes les classes PHP ne sont pas forcément utiles comme ressources API. Certaines classes sont techniques (`Toolbox`, `Session`, `Html`, etc.).

---

## 2. Headers nécessaires

La plupart des appels legacy nécessitent des headers.

```http
App-Token: <APP_TOKEN>
Session-Token: <SESSION_TOKEN>
Content-Type: application/json
```

Selon ta configuration GLPI, `App-Token` peut être obligatoire ou non.

---

## 3. Endpoints de session legacy

### 3.1 Initialiser une session

```http
GET /apirest.php/initSession
```

Rôle : obtenir un `session_token` utilisable pour les autres appels.

Exemple de réponse :

```json
{
  "session_token": "xxxxxxxxxxxxxxxx"
}
```

### 3.2 Fermer une session

```http
GET /apirest.php/killSession
```

Rôle : fermer la session API courante.

### 3.3 Obtenir la session complète

```http
GET /apirest.php/getFullSession
```

Rôle : récupérer les informations complètes de la session GLPI courante.

---

## 4. Endpoints de profil et entité

### 4.1 Lister les profils de l'utilisateur connecté

```http
GET /apirest.php/getMyProfiles
```

### 4.2 Obtenir le profil actif

```http
GET /apirest.php/getActiveProfile
```

### 4.3 Changer le profil actif

```http
POST /apirest.php/changeActiveProfile
```

Payload :

```json
{
  "profiles_id": 4
}
```

### 4.4 Lister les entités accessibles

```http
GET /apirest.php/getMyEntities
```

### 4.5 Obtenir les entités actives

```http
GET /apirest.php/getActiveEntities
```

### 4.6 Changer l'entité active

```http
POST /apirest.php/changeActiveEntities
```

Payload :

```json
{
  "entities_id": 0,
  "is_recursive": true
}
```

---

## 5. Endpoints génériques pour tous les itemtypes

Ces endpoints fonctionnent avec beaucoup d'itemtypes GLPI.

Dans les exemples ci-dessous, remplace `{itemtype}` par `Ticket`, `Computer`, `User`, `Document_Item`, etc.

---

### 5.1 Récupérer un élément par ID

```http
GET /apirest.php/{itemtype}/{id}
```

Exemples :

```http
GET /apirest.php/Ticket/252
GET /apirest.php/Computer/12
GET /apirest.php/User/2
```

---

### 5.2 Récupérer tous les éléments d'un itemtype

```http
GET /apirest.php/{itemtype}
```

Exemples :

```http
GET /apirest.php/Ticket
GET /apirest.php/Ticket_User
GET /apirest.php/Document_Item
```

Avec pagination large :

```http
GET /apirest.php/{itemtype}?range=0-9999
```

Exemple :

```http
GET /apirest.php/Ticket_User?range=0-9999
```

### Pourquoi `range=0-9999` ?

L'API legacy est paginée. Sans `range`, GLPI peut ne retourner qu'une partie des résultats.

```txt
range=0-9999
```

signifie :

```txt
retourner les lignes de l'index 0 à l'index 9999
```

Pour une base très grosse, il vaut mieux paginer proprement :

```http
GET /apirest.php/Ticket?range=0-99
GET /apirest.php/Ticket?range=100-199
GET /apirest.php/Ticket?range=200-299
```

---

### 5.3 Récupérer des sous-éléments

```http
GET /apirest.php/{itemtype}/{id}/{sub_itemtype}
```

Exemple théorique :

```http
GET /apirest.php/Ticket/252/Ticket_User
```

Rôle : récupérer les éléments liés à un item principal lorsque le sub-itemtype est supporté.

---

### 5.4 Récupérer les searchOptions

```http
GET /apirest.php/listSearchOptions/{itemtype}
```

Exemple :

```http
GET /apirest.php/listSearchOptions/Ticket
```

Rôle : connaître les champs utilisables dans l'ancien système de recherche legacy.

---

### 5.5 Rechercher des éléments

```http
GET /apirest.php/search/{itemtype}
```

Exemple :

```http
GET /apirest.php/search/Ticket
```

Rôle : effectuer une recherche legacy à partir des `searchOptions`.

Remarque : ceci est différent du filtre RSQL de l'API v2 `/api.php`.

---

### 5.6 Créer un élément

```http
POST /apirest.php/{itemtype}
```

Payload standard legacy :

```json
{
  "input": {
    "name": "Nom de l'élément"
  }
}
```

Exemple :

```http
POST /apirest.php/Ticket
```

```json
{
  "input": {
    "name": "Poste très lent",
    "content": "Le poste met beaucoup de temps à démarrer.",
    "type": 1,
    "urgency": 3,
    "impact": 3,
    "priority": 3
  }
}
```

---

### 5.7 Mettre à jour un élément

```http
PUT /apirest.php/{itemtype}/{id}
```

ou selon les cas :

```http
PATCH /apirest.php/{itemtype}/{id}
```

Payload standard :

```json
{
  "input": {
    "id": 252,
    "name": "Nouveau titre"
  }
}
```

---

### 5.8 Supprimer un élément

```http
DELETE /apirest.php/{itemtype}/{id}
```

Exemple :

```http
DELETE /apirest.php/Ticket/252
```

---

## 6. Endpoints spéciaux legacy

### 6.1 Upload d'un document

```http
POST /apirest.php/Document
```

Type : `multipart/form-data`

Champs utilisés généralement :

```txt
uploadManifest
filename[0]
```

Exemple de `uploadManifest` :

```json
{
  "input": {
    "name": "PC-ADM-001",
    "comment": "Import image zip",
    "_only_if_upload_succeed": true
  }
}
```

Rôle : importer un fichier réel dans GLPI.

---

### 6.2 Télécharger un document

```http
GET /apirest.php/Document/{id}?alt=media
```

Exemple :

```http
GET /apirest.php/Document/13?alt=media
```

Rôle : récupérer le contenu binaire du document.

---

### 6.3 Récupérer la photo d'un utilisateur

```http
GET /apirest.php/User/{id}/Picture
```

Selon la version/configuration, l'endpoint exact peut varier.

---

## 7. Catalogue pratique des itemtypes legacy les plus utiles

> Ce tableau n'est pas une garantie absolue que chaque itemtype est activé dans toutes les installations GLPI. Il représente les itemtypes courants et utiles dans ton projet.

---

### 7.1 Assistance / ITIL

| Itemtype | Endpoint legacy | Rôle | Modèle principal |
|---|---|---|---|
| `Ticket` | `/apirest.php/Ticket` | Tickets d'assistance | `id`, `name`, `content`, `status`, `urgency`, `impact`, `priority`, `type`, `date`, `users_id_recipient` |
| `Ticket_User` | `/apirest.php/Ticket_User` | Relation Ticket ↔ Utilisateur | `id`, `tickets_id`, `users_id`, `type`, `use_notification` |
| `Group_Ticket` | `/apirest.php/Group_Ticket` | Relation Ticket ↔ Groupe | `id`, `tickets_id`, `groups_id`, `type` |
| `ITILFollowup` | `/apirest.php/ITILFollowup` | Suivis / commentaires ITIL | `id`, `itemtype`, `items_id`, `content`, `users_id` |
| `TicketTask` | `/apirest.php/TicketTask` | Tâches de ticket | `id`, `tickets_id`, `content`, `users_id`, `state`, `begin`, `end` |
| `TicketValidation` | `/apirest.php/TicketValidation` | Validations de ticket | `id`, `tickets_id`, `users_id`, `status`, `comment_submission` |
| `TicketCost` | `/apirest.php/TicketCost` | Coûts liés à un ticket | `id`, `tickets_id`, `cost_time`, `cost_fixed`, `cost_material` |
| `Problem` | `/apirest.php/Problem` | Problèmes ITIL | `id`, `name`, `content`, `status`, `impact`, `urgency`, `priority` |
| `Change` | `/apirest.php/Change` | Changements ITIL | `id`, `name`, `content`, `status`, `impact`, `urgency`, `priority` |

#### Modèle `Ticket`

```json
{
  "id": 252,
  "name": "Poste très lent",
  "content": "Le poste met beaucoup de temps à démarrer.",
  "status": 2,
  "urgency": 3,
  "impact": 3,
  "priority": 3,
  "type": 1,
  "users_id_recipient": 2,
  "is_deleted": 0,
  "date": "2026-06-11 01:42:55"
}
```

#### Modèle `Ticket_User`

```json
{
  "id": 1,
  "tickets_id": 252,
  "users_id": 5,
  "type": 2,
  "use_notification": 1
}
```

Types d'acteurs ITIL courants :

```txt
1 = Demandeur
2 = Assigné / technicien
3 = Observateur
```

#### Modèle `Group_Ticket`

```json
{
  "id": 1,
  "tickets_id": 252,
  "groups_id": 4,
  "type": 2
}
```

---

### 7.2 Parc / Assets

| Itemtype | Endpoint legacy | Rôle | Modèle principal |
|---|---|---|---|
| `Computer` | `/apirest.php/Computer` | Ordinateurs | `id`, `name`, `serial`, `otherserial`, `states_id`, `users_id`, `manufacturers_id`, `locations_id` |
| `Monitor` | `/apirest.php/Monitor` | Moniteurs | `id`, `name`, `serial`, `otherserial`, `states_id`, `users_id`, `manufacturers_id` |
| `Printer` | `/apirest.php/Printer` | Imprimantes | `id`, `name`, `serial`, `otherserial`, `states_id`, `users_id`, `manufacturers_id` |
| `Phone` | `/apirest.php/Phone` | Téléphones | `id`, `name`, `serial`, `otherserial`, `states_id`, `users_id` |
| `Peripheral` | `/apirest.php/Peripheral` | Périphériques | `id`, `name`, `serial`, `otherserial`, `states_id`, `users_id` |
| `NetworkEquipment` | `/apirest.php/NetworkEquipment` | Matériel réseau | `id`, `name`, `serial`, `otherserial`, `states_id`, `manufacturers_id` |
| `Software` | `/apirest.php/Software` | Logiciels | `id`, `name`, `manufacturers_id`, `comment` |
| `SoftwareLicense` | `/apirest.php/SoftwareLicense` | Licences logicielles | `id`, `name`, `softwares_id`, `serial`, `number` |
| `Appliance` | `/apirest.php/Appliance` | Applicatifs / appliances | `id`, `name`, `comment` |
| `Certificate` | `/apirest.php/Certificate` | Certificats | `id`, `name`, `date_expiration`, `comment` |

#### Modèle asset commun

```json
{
  "id": 10,
  "name": "PC-ADM-001",
  "serial": "SN123",
  "otherserial": "INV-001",
  "entities_id": 0,
  "locations_id": 1,
  "states_id": 2,
  "manufacturers_id": 3,
  "users_id": 5,
  "is_deleted": 0
}
```

---

### 7.3 Documents

| Itemtype | Endpoint legacy | Rôle | Modèle principal |
|---|---|---|---|
| `Document` | `/apirest.php/Document` | Fichiers GLPI | `id`, `name`, `filename`, `filepath`, `mime`, `sha1sum`, `comment` |
| `Document_Item` | `/apirest.php/Document_Item` | Liaison Document ↔ Objet | `id`, `documents_id`, `itemtype`, `items_id` |
| `DocumentType` | `/apirest.php/DocumentType` | Types de fichiers autorisés | `id`, `name`, `ext`, `mime`, `is_uploadable` |

#### Modèle `Document`

```json
{
  "id": 13,
  "name": "PC-ADM-001",
  "filename": "PC-ADM-001.jpg",
  "mime": "image/jpeg",
  "comment": "Import image zip"
}
```

#### Modèle `Document_Item`

```json
{
  "id": 1,
  "documents_id": 13,
  "itemtype": "Computer",
  "items_id": 10
}
```

---

### 7.4 Administration

| Itemtype | Endpoint legacy | Rôle | Modèle principal |
|---|---|---|---|
| `User` | `/apirest.php/User` | Utilisateurs GLPI | `id`, `name`, `realname`, `firstname`, `is_active`, `is_deleted` |
| `Group` | `/apirest.php/Group` | Groupes GLPI | `id`, `name`, `entities_id`, `is_recursive` |
| `Profile` | `/apirest.php/Profile` | Profils / rôles | `id`, `name`, `interface` |
| `Entity` | `/apirest.php/Entity` | Entités GLPI | `id`, `name`, `completename`, `entities_id` |
| `Rule` | `/apirest.php/Rule` | Règles GLPI | `id`, `name`, `is_active` |

#### Modèle `User`

```json
{
  "id": 5,
  "name": "rakoto.noah",
  "realname": "Rakoto",
  "firstname": "Noah",
  "is_active": 1,
  "is_deleted": 0
}
```

---

### 7.5 Dropdowns / Référentiels

| Itemtype | Endpoint legacy | Rôle | Modèle principal |
|---|---|---|---|
| `Location` | `/apirest.php/Location` | Lieux | `id`, `name`, `completename`, `locations_id` |
| `Manufacturer` | `/apirest.php/Manufacturer` | Fabricants | `id`, `name` |
| `State` | `/apirest.php/State` | États de matériel | `id`, `name` |
| `ITILCategory` | `/apirest.php/ITILCategory` | Catégories ITIL | `id`, `name`, `itilcategories_id` |
| `RequestType` | `/apirest.php/RequestType` | Types de demande | `id`, `name` |
| `ComputerType` | `/apirest.php/ComputerType` | Types d'ordinateurs | `id`, `name` |
| `ComputerModel` | `/apirest.php/ComputerModel` | Modèles d'ordinateurs | `id`, `name` |
| `MonitorType` | `/apirest.php/MonitorType` | Types de moniteurs | `id`, `name` |
| `MonitorModel` | `/apirest.php/MonitorModel` | Modèles de moniteurs | `id`, `name` |
| `PrinterType` | `/apirest.php/PrinterType` | Types d'imprimantes | `id`, `name` |
| `PrinterModel` | `/apirest.php/PrinterModel` | Modèles d'imprimantes | `id`, `name` |
| `NetworkEquipmentType` | `/apirest.php/NetworkEquipmentType` | Types de matériel réseau | `id`, `name` |
| `NetworkEquipmentModel` | `/apirest.php/NetworkEquipmentModel` | Modèles réseau | `id`, `name` |

#### Modèle dropdown commun

```json
{
  "id": 1,
  "name": "Administration",
  "comment": "Option de référentiel",
  "is_active": 1
}
```

---

### 7.6 Gestion financière / contrats

| Itemtype | Endpoint legacy | Rôle | Modèle principal |
|---|---|---|---|
| `Supplier` | `/apirest.php/Supplier` | Fournisseurs | `id`, `name`, `comment` |
| `Contact` | `/apirest.php/Contact` | Contacts | `id`, `name`, `firstname`, `phone`, `email` |
| `Contract` | `/apirest.php/Contract` | Contrats | `id`, `name`, `num`, `begin_date`, `duration` |
| `Budget` | `/apirest.php/Budget` | Budgets | `id`, `name`, `value`, `begin_date`, `end_date` |
| `Infocom` | `/apirest.php/Infocom` | Informations financières d'un item | `id`, `itemtype`, `items_id`, `buy_date`, `value` |

---

### 7.7 Réseau

| Itemtype | Endpoint legacy | Rôle | Modèle principal |
|---|---|---|---|
| `NetworkPort` | `/apirest.php/NetworkPort` | Ports réseau | `id`, `itemtype`, `items_id`, `name`, `mac` |
| `IPAddress` | `/apirest.php/IPAddress` | Adresses IP | `id`, `name`, `binary_0`, `binary_1`, `binary_2`, `binary_3` |
| `NetworkName` | `/apirest.php/NetworkName` | Noms réseau | `id`, `name`, `fqdns_id` |
| `Vlan` | `/apirest.php/Vlan` | VLAN | `id`, `name`, `tag` |

---

### 7.8 Base de connaissances

| Itemtype | Endpoint legacy | Rôle | Modèle principal |
|---|---|---|---|
| `KnowbaseItem` | `/apirest.php/KnowbaseItem` | Articles de base de connaissances | `id`, `name`, `answer`, `is_faq` |
| `KnowbaseItemCategory` | `/apirest.php/KnowbaseItemCategory` | Catégories KB | `id`, `name`, `knowbaseitemcategories_id` |

---

## 8. Comment générer une liste plus exhaustive depuis le code source GLPI

Dans le dossier racine de GLPI :

```bash
find src -maxdepth 1 -name "*.php" -printf "%f\n" | sed 's/\.php$//' | sort
```

Cela donne une liste de classes PHP.

Pour transformer en endpoints legacy théoriques :

```bash
find src -maxdepth 1 -name "*.php" -printf "%f\n" \
  | sed 's/\.php$//' \
  | sort \
  | awk '{print "/apirest.php/" $0}'
```

Exemple de sortie :

```txt
/apirest.php/Computer
/apirest.php/Document
/apirest.php/Document_Item
/apirest.php/Group_Ticket
/apirest.php/Ticket
/apirest.php/Ticket_User
/apirest.php/User
```

Attention : cette méthode donne une liste théorique. Certains endpoints peuvent être techniques ou non pertinents comme ressource métier.

---

## 9. Comment tester rapidement un itemtype legacy

Avec ton client front :

```ts
const data = await glpiLegacyGet("/Ticket_User?range=0-10");
console.log(data);
```

Avec `curl` :

```bash
curl \
  -H "App-Token: <APP_TOKEN>" \
  -H "Session-Token: <SESSION_TOKEN>" \
  "http://glpi.localhost/apirest.php/Ticket_User?range=0-10"
```

Si tu reçois une réponse JSON, l'endpoint est exploitable.

---

## 10. Différence avec l'API v2 / HL

### Legacy API

```txt
/apirest.php/Ticket
/apirest.php/Ticket_User
/apirest.php/Document_Item
```

Caractéristiques :

```txt
- ancienne API REST GLPI
- fonctionne avec itemtypes
- documentation générique
- pagination avec range
- payload souvent sous forme { "input": {...} }
```

### API v2 / HL

```txt
/api.php/Assistance/Ticket
/api.php/Assets/Computer
/api.php/Administration/User
/api.php/Dropdowns/Location
```

Caractéristiques :

```txt
- API plus moderne
- endpoints organisés par domaines
- documentation Swagger/OpenAPI
- filtres RSQL avec filter=
- payloads plus structurés
```

---

## 11. Recommandation pour ton projet

Pour les ressources principales, privilégie l'API v2 quand elle existe :

```txt
/Assistance/Ticket
/Assets/Computer
/Administration/User
/Dropdowns/Location
```

Utilise la legacy API surtout pour les relations et cas spéciaux :

```txt
/Ticket_User
/Group_Ticket
/Document
/Document_Item
```

Cas typiques dans ton projet :

| Besoin | API conseillée |
|---|---|
| Lister les tickets | API v2 `/Assistance/Ticket` |
| Créer un ticket | API v2 `/Assistance/Ticket` |
| Changer le statut d'un ticket | API v2 `/Assistance/Ticket/{id}` |
| Voir les acteurs/équipes d'un ticket | Legacy `/Ticket_User` et `/Group_Ticket` |
| Importer une image/document | Legacy `/Document` multipart |
| Lier un document à un asset | Legacy `/Document_Item` |
| Télécharger une image/document | Legacy `/Document/{id}?alt=media` |

---

## 12. Modèles TypeScript utiles

### TicketUserLink

```ts
export type TicketUserLink = {
  id: number;
  tickets_id: number;
  users_id: number;
  type: number;
  use_notification?: number;
};
```

### GroupTicketLink

```ts
export type GroupTicketLink = {
  id: number;
  tickets_id: number;
  groups_id: number;
  type: number;
};
```

### DocumentItem

```ts
export type DocumentItem = {
  id: number;
  documents_id: number;
  itemtype: string;
  items_id: number;
};
```

### Document

```ts
export type LegacyDocument = {
  id: number;
  name: string;
  filename?: string;
  filepath?: string;
  mime?: string;
  sha1sum?: string;
  comment?: string;
};
```

---

## 13. Exemple : trouver les tickets assignés

```ts
const ASSIGNED_ACTOR_TYPE = 2;

const ticketUsers = await glpiLegacyGet<TicketUserLink[]>(
  "/Ticket_User?range=0-9999",
);

const groupTickets = await glpiLegacyGet<GroupTicketLink[]>(
  "/Group_Ticket?range=0-9999",
);

const assignedTicketIds = new Set<number>();

ticketUsers
  .filter((item) => item.type === ASSIGNED_ACTOR_TYPE)
  .forEach((item) => assignedTicketIds.add(Number(item.tickets_id)));

groupTickets
  .filter((item) => item.type === ASSIGNED_ACTOR_TYPE)
  .forEach((item) => assignedTicketIds.add(Number(item.tickets_id)));
```

---

## 14. Conclusion

La legacy API GLPI ne fonctionne pas comme un Swagger classique listant chaque endpoint métier. Elle fonctionne surtout avec des `itemtypes`.

La règle essentielle :

```txt
Classe PHP GLPI dans src/
→ itemtype
→ endpoint /apirest.php/{itemtype}
```

Pour ton projet, les endpoints legacy les plus importants sont :

```txt
Ticket_User
Group_Ticket
Document
Document_Item
User
Ticket
Computer
Monitor
Printer
NetworkEquipment
Phone
Peripheral
SoftwareLicense
Location
Manufacturer
State
ITILCategory
```

Pour le reste, utilise la commande d'inventaire sur le dossier `src/` et teste les itemtypes avec `?range=0-10`.
