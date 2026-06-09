# initialisation projet react 

npm create vite@5.4.0 mon-projet

# React Router recommande maintenant npm i react-router pour une app React/Vite ; les anciens tutos utilisent souvent react-router-dom, mais react-router est la commande officielle actuelle.
# TanStack Query sert à gérer les appels API, le cache, les états loading/error, etc.
npm install @tanstack/react-query
npm install react-router
npm install react-router-dom

# commande preparation dossier et fichier propre
## Créer les dossiers
mkdir -p src/app/providers \
src/app/router \
src/pages \
src/features/products/components \
src/features/products/hooks \
src/entities/product/model \
src/entities/product/api \
src/entities/product/lib \
src/shared/api \
src/shared/config \
src/shared/utils \
src/shared/ui \
src/styles

## creer fichier 

touch src/app/App.tsx \
src/app/main.tsx \
src/app/providers/QueryProvider.tsx \
src/app/router/router.tsx \
src/pages/ProductsPage.tsx \
src/pages/ProductDetailsPage.tsx \
src/features/products/components/ProductCard.tsx \
src/features/products/components/ProductList.tsx \
src/features/products/hooks/useProducts.ts \
src/features/products/hooks/useProduct.ts \
src/entities/product/model/product.types.ts \
src/entities/product/api/product.api.ts \
src/entities/product/lib/product.mapper.ts \
src/shared/api/prestashopClient.ts \
src/shared/api/xml.ts \
src/shared/config/env.ts \
src/shared/utils/formatPrice.ts \
src/shared/ui/Loader.tsx \
src/styles/global.css

## Tu déplaces les fichiers dans src/app/

mv src/App.tsx src/app/App.tsx
mv src/main.tsx src/app/main.tsx
mv src/index.css src/styles/global.css

## faut modifier le fichier index.html.
<script type="module" src="/src/app/main.tsx"></script>

# effacer le cache de fichier enregistrer dasn .gitignore
git rm --cached .env

# parsage csv 
npm install papaparse
npm install -D @types/papaparse

#modifier la restriction dossier 
sudo chmod -R 777 /opt/lampp/htdocs/prestashop_edition_classic_version_8.2.6

#clear cache prestashop
cd /opt/lampp/htdocs/prestashop_edition_classic_version_8.2.6
sudo rm -rf var/cache/dev/*
sudo rm -rf var/cache/prod/*

#installation tailwind
npm install tailwindcss @tailwindcss/vite

#Dans vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});


### utiliser pour utiliser des icone dans react
npm install lucide-react

### Le meilleur outil est React Query Devtools. TanStack fournit des Devtools dédiés pour voir les queries, leur état, leur cache, les erreurs et les mutations.
npm i @tanstack/react-query-devtools