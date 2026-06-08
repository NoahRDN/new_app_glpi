# Architecture du projet

## Vue d'ensemble

Le projet `new_app_glpi` est une application `React + TypeScript + Vite` organisée autour de deux espaces distincts :

- `Frontoffice` : portail utilisateur
- `Backoffice` : administration GLPI

La séparation suit le même principe que `prestashop-new-app` :

- routes distinctes
- layouts distincts
- auth distincte
- pages distinctes
- features métier séparées côté backoffice

---

## Structure principale

```text
.
  ARCHITECTURE.md
  package.json
  vite.config.ts
  tsconfig.json
  public/
    import-samples/

src/
  main.tsx
  App.tsx

  app/
    config/
      backOfficeNavigation.tsx
      frontOfficeNavigation.tsx
      officeNavigation.types.ts
    hooks/
      useThemeMode.ts
    router/
      AppRouter.tsx
      backOfficeRoutes.tsx
      frontOfficeRoutes.tsx
    layouts/
      OfficeLayoutShell.tsx
      BackOfficeLayout.tsx
      FrontOfficeLayout.tsx

  pages/
    backoffice/
      LoginPage.tsx
      DashboardPage.tsx
      TicketsPage.tsx
      AssetsPage.tsx
      KnowledgeBasePage.tsx
      UsersPage.tsx
      ImportDataPage.tsx
      ResetDataPage.tsx
    frontoffice/
      LoginPage.tsx
      HomePage.tsx
      PortalPage.tsx
      HelpCenterPage.tsx
      AccountPage.tsx

  features/
    backoffice-auth/
      components/
        BackofficeLoginForm.tsx
        ProtectedBackofficeRoute.tsx
      lib/
        backofficeAuth.ts
    frontoffice-auth/
      components/
        FrontofficeLoginForm.tsx
        ProtectedFrontofficeRoute.tsx
      lib/
        frontofficeAuth.ts
    backoffice/
      catalog/
        model/
      orders/
        model/
      overview/
        model/
      dashboard/
        components/
        model/
      glpi-data/
        api/
        hooks/
        lib/
        model/
      users/
        components/
        hooks/

  entities/
    asset/
      api/
      model/
    local-note/
      api/
      model/
    ticket/
      api/
      model/
    user/
      api/
      lib/
      model/

  assets/
    hero.png
    react.svg
    vite.svg

  shared/
    api/
      glpiClient.ts
      localClient.ts
    auth/
      oauth.ts
      tokenStorage.ts
    config/
      env.ts
    lib/
      formatDate.ts
    styles/
      global.css
    ui/
      Button.tsx
      Card.tsx
      DataTable.tsx
      Modal.tsx
      SectionPanel.tsx
```

Fichiers pivots à connaître en priorité :

- [src/main.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/main.tsx:1) : point d’entrée React
- [src/App.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/App.tsx:1) : export du composant applicatif principal
- [src/app/App.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/App.tsx:1) : branchement du router
- [src/app/router/AppRouter.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/router/AppRouter.tsx:1) : composition finale des routes
- [src/app/layouts/OfficeLayoutShell.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/layouts/OfficeLayoutShell.tsx:1) : shell visuel partagé front/back
- [src/shared/styles/global.css](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/shared/styles/global.css:1) : thème global light/dark
- [src/shared/api/glpiClient.ts](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/shared/api/glpiClient.ts:1) : client API GLPI
- [src/shared/config/env.ts](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/shared/config/env.ts:1) : variables d’environnement
- [package.json](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/package.json:1) : dépendances et scripts
- [vite.config.ts](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/vite.config.ts:1) : configuration Vite

---

## Routing

Le point d'entrée du routing est :

- [src/app/router/AppRouter.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/router/AppRouter.tsx:1)

Il assemble :

- les routes `frontoffice`
- les routes `backoffice`
- des redirections de compatibilité vers `/admin/...`

### Frontoffice

Fichier :

- [src/app/router/frontOfficeRoutes.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/router/frontOfficeRoutes.tsx:1)

Routes principales :

- `/connexion`
- `/`
- `/portal`
- `/help-center`
- `/account`

Le layout frontoffice est protégé par :

- [ProtectedFrontofficeRoute.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/features/frontoffice-auth/components/ProtectedFrontofficeRoute.tsx:1)

### Backoffice

Fichier :

- [src/app/router/backOfficeRoutes.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/router/backOfficeRoutes.tsx:1)

Routes principales :

- `/admin/connexion`
- `/admin`
- `/admin/tickets`
- `/admin/assets`
- `/admin/knowledge-base`
- `/admin/users`
- `/admin/import-data`
- `/admin/reset-data`

Le layout backoffice est protégé par :

- [ProtectedBackofficeRoute.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/features/backoffice-auth/components/ProtectedBackofficeRoute.tsx:1)

---

## Layouts

Le shell visuel commun est :

- [src/app/layouts/OfficeLayoutShell.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/layouts/OfficeLayoutShell.tsx:1)

Il fournit :

- la sidebar
- la topbar
- le switch light/dark
- le header de section
- la grille de contenu

Il est spécialisé par :

- [FrontOfficeLayout.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/layouts/FrontOfficeLayout.tsx:1)
- [BackOfficeLayout.tsx](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/layouts/BackOfficeLayout.tsx:1)

Le thème est géré par :

- [src/app/hooks/useThemeMode.ts](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/app/hooks/useThemeMode.ts:1)

---

## Pages

### Pages frontoffice

Dossier :

- [src/pages/frontoffice](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/pages/frontoffice)

Pages actuelles :

- `HomePage.tsx`
- `PortalPage.tsx`
- `HelpCenterPage.tsx`
- `LoginPage.tsx`
- `AccountPage.tsx`

Note :

- `GeneralViewItemPage.tsx` existe dans `src/pages/frontoffice`, mais n’est pas routée actuellement.

### Pages backoffice

Dossier :

- [src/pages/backoffice](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/pages/backoffice)

Pages actuelles :

- `LoginPage.tsx`
- `DashboardPage.tsx`
- `TicketsPage.tsx`
- `AssetsPage.tsx`
- `KnowledgeBasePage.tsx`
- `UsersPage.tsx`
- `ImportDataPage.tsx`
- `ResetDataPage.tsx`

---

## Features

### Auth frontoffice

Dossier :

- [src/features/frontoffice-auth](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/features/frontoffice-auth)

Responsabilités :

- login frontoffice
- garde de route frontoffice
- stockage de session frontoffice

### Auth backoffice

Dossier :

- [src/features/backoffice-auth](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/features/backoffice-auth)

Responsabilités :

- login backoffice
- garde de route backoffice
- stockage de session backoffice

### Features backoffice métier

Dossier :

- [src/features/backoffice](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/features/backoffice)

Sous-modules :

- `dashboard` : widgets et panneaux du dashboard
- `overview` : données mock de vue analytique
- `catalog` : données mock de parc / produits
- `orders` : données mock de commandes
- `users` : gestion utilisateur
- `glpi-data` : import CSV et reset multi-ressources GLPI

---

## Entities

Dossier :

- [src/entities](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/entities)

Rôle :

- définir les types métier
- centraliser les appels API d’entités
- isoler les mappers ou configs spécifiques

Entités visibles actuellement :

- `user`
- `ticket`
- `asset`
- `local-note`

Des dossiers plus anciens comme `local-user` existent encore, mais ne sont plus au centre du flux frontoffice/backoffice actuel.

---

## Shared

Dossier :

- [src/shared](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/shared)

Contenu :

- `api/` : clients HTTP et appels partagés
- `auth/` : stockage de token OAuth/GLPI
- `config/` : variables d’environnement
- `lib/` : utilitaires transverses
- `styles/` : style global et variables de thème
- `ui/` : composants UI réutilisables

Exemples de composants réutilisables :

- `Button`
- `Input`
- `Card`
- `DataTable`
- `SectionPanel`
- `StatCard`
- `MetricBadge`
- `Modal`

---

## Import et reset GLPI

Le module principal est :

- [src/features/backoffice/glpi-data](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/features/backoffice/glpi-data)

Il couvre :

- détection de profils CSV
- parsing CSV avec `PapaParse`
- parsing ZIP images
- prévisualisation des données
- import multi-fichiers
- reset multi-ressources GLPI

Fichiers clés :

- `model/builtInGlpiImportProfiles.ts`
- `lib/parseCsvWithDetectedGlpiProfile.ts`
- `lib/parseGlpiImagesZip.ts`
- `hooks/useImportGlpiCsv.ts`
- `hooks/useResetGlpiData.ts`

---

## Auth actuelle

L’auth actuelle est une auth locale de démonstration, stockée en `localStorage`.

Frontoffice :

- [frontofficeAuth.ts](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/features/frontoffice-auth/lib/frontofficeAuth.ts:1)

Backoffice :

- [backofficeAuth.ts](/home/noah/etude/itu/s6/eval/new_app_gli/new_app_glpi/src/features/backoffice-auth/lib/backofficeAuth.ts:1)

Ce n’est pas encore une vraie authentification GLPI/OAuth. C’est un socle structurel pour brancher une vraie auth plus tard.

---

## État architectural actuel

### Ce qui est proprement structuré

- séparation `frontoffice / backoffice`
- séparation des routes
- séparation des layouts
- séparation de l’auth
- dossier `shared` réutilisable
- dossier `features/backoffice` organisé par domaines

### Ce qui reste à nettoyer ou consolider

- certains dossiers historiques `features/*` existent encore hors du périmètre principal
- certains modules sont encore basés sur des mocks
- l’auth doit encore être branchée à GLPI réel
- quelques pages frontoffice sont encore des écrans de structure plus que des écrans métier finaux

---

## Résumé

L’architecture actuelle repose sur :

1. `app/` pour le shell, le routing et la configuration de navigation
2. `pages/frontoffice` et `pages/backoffice` pour les écrans
3. `features/frontoffice-auth` et `features/backoffice-auth` pour les accès
4. `features/backoffice/*` pour les modules métier GLPI
5. `entities/` pour les objets métier et les API d’entités
6. `shared/` pour tout le réutilisable transverse

Cette base est maintenant cohérente pour continuer soit :

- vers une vraie intégration GLPI/OAuth
- vers un nettoyage des anciens dossiers résiduels
- vers un enrichissement métier du frontoffice et du backoffice
