[English](./README.md)

# new_app_glpi

`new_app_glpi` est une application orientee GLPI separee en deux espaces :

- `Frontoffice` : portail utilisateur
- `Backoffice` : administration, imports, outils de reinitialisation, CRUD local SQLite et fonctions de dashboard

Le frontend est construit avec `React + TypeScript + Vite`, et le backend local est un petit service `Spring Boot + SQLite` utilise pour les donnees specifiques au projet comme certains parametres locaux et des CRUD locaux.

## Fonctionnalites principales

- Separation frontoffice / backoffice dans le routing
- Integration GLPI OAuth / API
- Liste des assets et kanban tickets
- Import CSV avec profils et logique de rollback
- Outils de reinitialisation GLPI
- Fonctionnalites locales basees sur SQLite comme les parametres du kanban et `user-test`
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
- Kanban tickets frontoffice : `/ticket-kanban`
- Racine backoffice : `/admin`
- Tickets backoffice : `/admin/tickets`
- Import backoffice : `/admin/import-data`
- Reinitialisation backoffice : `/admin/reset-data`
- Parametres kanban backoffice : `/admin/kanban-settings`
- Exemple de CRUD local backoffice : `/admin/user-test`

## Documentation

- Details d’architecture : [ARCHITECTURE.md](./ARCHITECTURE.md)
- Notes sur les filtres : [utilitaire/documentation/filtre.md](./utilitaire/documentation/filtre.md)
- Notes sur le backend SQLite : [utilitaire/documentation/init-sqlite-springboot.md](./utilitaire/documentation/init-sqlite-springboot.md)

## Notes

- Le backoffice reste protege par la logique d’auth locale.
- Le frontoffice est actuellement accessible sans connexion.
- Certaines fonctionnalites locales dependent du backend Spring.
