[English](./README.md)

# new_app_glpi

`new_app_glpi` est une application orientee GLPI separee en deux espaces :

- `Frontoffice` : portail utilisateur
- `Backoffice` : administration, imports, outils de reinitialisation, CRUD local SQLite et fonctions de dashboard

Le frontend est construit avec `React + TypeScript + Vite`, et le backend local est un petit service `Spring Boot + SQLite` utilise pour les donnees specifiques au projet comme certains parametres locaux et des CRUD locaux.

## Fonctionnalites principales

- Separation frontoffice / backoffice dans le routing
- Integration GLPI OAuth / API
- Liste des assets, creation de tickets et workflows kanban tickets
- Import CSV avec profils et logique de rollback
- Outils de reinitialisation GLPI
- Personnalisation du kanban backoffice stockee en SQLite
- Fonctionnalites locales basees sur SQLite comme `user-test`, les jeux de donnees super-cost, les parametres de plafond et le support de notes / couts locaux
- Pages frontoffice pour le rapprochement de montant local / GLPI et l’analyse super-cost
- Themes clair et sombre

## Stack technique

- Frontend : `React`, `TypeScript`, `Vite`, `Tailwind CSS`, `TanStack React Query`
- Backend : `Spring Boot`, `JdbcTemplate`, `SQLite`
- Systeme externe : `GLPI API v2` et `GLPI legacy API`

## Structure du projet

Dossiers principaux :

- `src/app` : shell applicatif, routing, layouts, navigation
- `src/pages` : pages routees
- `src/features` : UI, hooks et logique metier par fonctionnalite
- `src/entities` : clients API, types et logique au niveau entite
- `src/shared` : UI reutilisable, helpers, clients API, config
- `backend/newappglpi` : backend local Spring Boot + SQLite
- `public/import-samples` : fichiers d’exemple pour tester les imports

Pour une vue plus detaillee du code, voir [ARCHITECTURE.md](./ARCHITECTURE.md).

## Demarrage

### 1. Installer les dependances frontend

```bash
npm install
```

### 2. Configurer les variables d’environnement

Utilise `.env` et `.env.example` pour configurer la connexion GLPI.

Valeurs typiques utilisees par le frontend :

- `GLPI_PROXY_TARGET`
- `GLPI_API_PATH`
- `GLPI_LEGACY_API_PATH`
- les identifiants OAuth client et utilisateur

### 3. Lancer le frontend

```bash
npm run dev
```

Par defaut, Vite tourne sur :

```text
http://localhost:5173
```

### 4. Lancer le backend local

Depuis le dossier backend :

```bash
cd backend/newappglpi
./mvnw spring-boot:run
```

Le backend local tourne sur :

```text
http://localhost:8081
```

Il est consomme via le proxy Vite avec `/local-api`.

## Donnees SQLite locales

Le backend Spring stocke des donnees locales specifiques au projet dans SQLite. Les tables actuellement presentes incluent :

- `kanban_settings`
- `local_notes`
- `super_cost`
- `super_cost_1`
- `plafond`
- `user_test`
- `tickets_test`

## Build

Build production du frontend :

```bash
npm run build
```

Compilation du backend :

```bash
cd backend/newappglpi
./mvnw -DskipTests compile
```

## Routes importantes

- Racine frontoffice : `/`
- Liste frontoffice des assets : `/asset-general-element`
- Creation de ticket frontoffice : `/create-ticket`
- Kanban tickets frontoffice : `/ticket-kanban`
- Page frontoffice de montant local : `/montant-local-glpi-1`
- Page frontoffice d'import super-cost : `/import-frontoffice-super-cost`
- Liste frontoffice de reouverture super-cost : `/list-supercost-reouverture`
- Racine backoffice : `/admin`
- Tickets backoffice : `/admin/tickets`
- Import backoffice : `/admin/import-data`
- Reinitialisation backoffice : `/admin/reset-data`
- Parametres kanban backoffice : `/admin/kanban-settings`
- Exemple de CRUD local backoffice : `/admin/user-test`
- Detail ticket backoffice : `/admin/tickets/:ticketId`

## Documentation

- Details d’architecture : [ARCHITECTURE.md](./ARCHITECTURE.md)
- Notes sur les filtres : [utilitaire/documentation/filtre.md](./utilitaire/documentation/filtre.md)
- Notes sur le backend SQLite : [utilitaire/documentation/init-sqlite-springboot.md](./utilitaire/documentation/init-sqlite-springboot.md)

## Notes

- Le backoffice reste protege par la logique d’auth locale.
- Le frontoffice est actuellement accessible sans connexion.
- Certaines fonctionnalites locales dependent du backend Spring.
- Ce README resume les fonctionnalites visibles ; pour la cartographie plus detaillee du code, voir [ARCHITECTURE.md](./ARCHITECTURE.md).
