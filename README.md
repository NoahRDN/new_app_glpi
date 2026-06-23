[Francais](./README.fr.md)

# new_app_glpi

`new_app_glpi` is a GLPI-oriented application split into two areas:

- `Frontoffice`: user-facing portal
- `Backoffice`: administration, imports, reset tools, local SQLite CRUD, and dashboard features

The frontend is built with `React + TypeScript + Vite`, and the local backend is a small `Spring Boot + SQLite` service used for project-specific data such as local settings and local CRUD pages.

## Main features

- Frontoffice and backoffice routing separation
- GLPI OAuth / API integration
- Asset listing, ticket creation, and ticket kanban workflows
- CSV import with profiles and rollback logic
- GLPI reset tools
- Backoffice kanban customization stored in SQLite
- Local SQLite-backed features like `user-test`, super-cost datasets, plafond settings, and local note / cost support
- Frontoffice pages for local GLPI amount comparison and super-cost analysis
- Light and dark themes

## Tech stack

- Frontend: `React`, `TypeScript`, `Vite`, `Tailwind CSS`, `TanStack React Query`
- Backend: `Spring Boot`, `JdbcTemplate`, `SQLite`
- External system: `GLPI API v2` and `GLPI legacy API`

## Project structure

Key directories:

- `src/app`: app shell, routing, layouts, navigation
- `src/pages`: routed pages
- `src/features`: feature-level UI, hooks, and business logic
- `src/entities`: API clients, types, and entity-level logic
- `src/shared`: reusable UI, helpers, API clients, config
- `backend/newappglpi`: local Spring Boot + SQLite backend
- `public/import-samples`: sample files for import testing

For a more detailed codebase map, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Getting started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Configure environment variables

Use `.env` and `.env.example` to configure the GLPI connection.

Typical values used by the frontend include:

- `GLPI_PROXY_TARGET`
- `GLPI_API_PATH`
- `GLPI_LEGACY_API_PATH`
- OAuth client credentials and user credentials

### 3. Run the frontend

```bash
npm run dev
```

By default, Vite runs on:

```text
http://localhost:5173
```

### 4. Run the local backend

From the backend folder:

```bash
cd backend/newappglpi
./mvnw spring-boot:run
```

The local backend runs on:

```text
http://localhost:8081
```

It is used through the Vite proxy with `/local-api`.

## Local SQLite data

The Spring backend stores project-specific local data in SQLite. Current tables include:

- `kanban_settings`
- `local_notes`
- `super_cost`
- `super_cost_1`
- `plafond`
- `user_test`
- `tickets_test`

## Build

Frontend production build:

```bash
npm run build
```

Backend compile:

```bash
cd backend/newappglpi
./mvnw -DskipTests compile
```

## Notable routes

- Frontoffice root: `/`
- Frontoffice asset list: `/asset-general-element`
- Frontoffice ticket creation: `/create-ticket`
- Frontoffice ticket kanban: `/ticket-kanban`
- Frontoffice local amount page: `/montant-local-glpi-1`
- Frontoffice super-cost import page: `/import-frontoffice-super-cost`
- Frontoffice super-cost reopening list: `/list-supercost-reouverture`
- Backoffice root: `/admin`
- Backoffice tickets: `/admin/tickets`
- Backoffice import: `/admin/import-data`
- Backoffice reset: `/admin/reset-data`
- Backoffice kanban settings: `/admin/kanban-settings`
- Backoffice local CRUD example: `/admin/user-test`
- Backoffice ticket detail: `/admin/tickets/:ticketId`

## Documentation

- Architecture details: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Filter notes: [utilitaire/documentation/filtre.md](./utilitaire/documentation/filtre.md)
- SQLite backend setup notes: [utilitaire/documentation/init-sqlite-springboot.md](./utilitaire/documentation/init-sqlite-springboot.md)

## Notes

- The backoffice remains protected by local auth logic.
- The frontoffice is currently accessible without login.
- Some local features depend on the Spring backend being available.
- The README summarizes the current product surface; for the folder-level map, use [ARCHITECTURE.md](./ARCHITECTURE.md).
