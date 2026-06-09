# Mise en place de React Query pour GLPI — Ordinateurs

## Étape 1 — Ajouter `QueryClientProvider`

Dans `src/main.tsx`, mets :

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./shared/styles/global.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
```

Sans ça, `useQuery` ne marchera pas.

---

## Étape 2 — Créer le type `Computer`

Crée le fichier :

```txt
src/features/backoffice/assets/computers/types/computer.types.ts
```

Puis ajoute :

```ts
export type GlpiDropdown = {
  id: number;
  name: string;
};

export type Computer = {
  id: number;
  name: string;
  serial?: string | null;
  otherserial?: string | null;
  comment?: string | null;
  is_deleted?: boolean;
  date_creation?: string | null;
  date_mod?: string | null;

  entity?: GlpiDropdown | null;
  manufacturer?: GlpiDropdown | null;
  state?: GlpiDropdown | null;
  location?: GlpiDropdown | null;
  user?: GlpiDropdown | null;
  group?: GlpiDropdown | null;
};
```

Ne type pas tous les champs GLPI maintenant. Mets seulement ceux que tu veux afficher.

---

## Étape 3 — Créer `glpiClient.ts`

Crée le fichier :

```txt
src/shared/api/glpiClient.ts
```

Comme tu veux d’abord faire communiquer React directement avec GLPI, ajoute :

```ts
const GLPI_API_URL = import.meta.env.VITE_GLPI_API_URL;
const GLPI_ACCESS_TOKEN = import.meta.env.VITE_GLPI_ACCESS_TOKEN;

export async function glpiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GLPI_API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${GLPI_ACCESS_TOKEN}`,
      "Accept-Language": "fr_FR",
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur GLPI ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

Dans `.env.local` :

```env
VITE_GLPI_API_URL=http://glpi.localhost/api.php
VITE_GLPI_ACCESS_TOKEN=TON_ACCESS_TOKEN
```

> Remarque importante : pour apprendre, c’est acceptable.
> Pour une vraie application, le token GLPI ne doit pas être dans React, car les variables `VITE_` sont visibles dans le navigateur.

Plus tard, il faudra faire :

```txt
React → backend NewApp → GLPI
```

---

## Étape 4 — Créer l’API `Computer`

Crée le fichier :

```txt
src/features/backoffice/assets/computers/api/computerApi.ts
```

Puis ajoute :

```ts
import { glpiGet } from "../../../../../../shared/api/glpiClient";
import type { Computer } from "../types/computer.types";

export async function getComputers(): Promise<Computer[]> {
  return glpiGet<Computer[]>("/Asset/Computer");
}
```

Ici :

```txt
/Asset/Computer
```

correspond à l’endpoint GLPI des ordinateurs.

---

## Étape 5 — Créer le hook `useComputers`

Crée le fichier :

```txt
src/features/backoffice/assets/computers/hooks/useComputers.ts
```

Puis ajoute :

```ts
import { useQuery } from "@tanstack/react-query";
import { getComputers } from "../api/computerApi";

export const computersQueryKey = ["assets", "computers"] as const;

export function useComputers() {
  return useQuery({
    queryKey: computersQueryKey,
    queryFn: getComputers,
    staleTime: 60_000,
  });
}
```

À comprendre :

```txt
queryKey
→ le nom du cache React Query

queryFn
→ la fonction qui récupère les données

staleTime
→ pendant 60 secondes, les données sont considérées comme fraîches
```

---

## Étape 6 — Afficher la liste

Crée par exemple le fichier :

```txt
src/features/backoffice/assets/computers/components/ComputerList.tsx
```

Puis ajoute :

```tsx
import { useMemo, useState } from "react";
import { useComputers } from "../hooks/useComputers";

export function ComputerList() {
  const [search, setSearch] = useState("");

  const {
    data: computers = [],
    isPending,
    isError,
    error,
    refetch,
  } = useComputers();

  const visibleComputers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return computers.filter((computer) => {
      if (computer.is_deleted) {
        return false;
      }

      if (query.length === 0) {
        return true;
      }

      return (
        computer.name?.toLowerCase().includes(query) ||
        computer.serial?.toLowerCase().includes(query) ||
        computer.otherserial?.toLowerCase().includes(query)
      );
    });
  }, [computers, search]);

  if (isPending) {
    return <div className="col-span-12">Chargement des ordinateurs...</div>;
  }

  if (isError) {
    return (
      <div className="col-span-12 text-red-500">
        {error instanceof Error
          ? error.message
          : "Impossible de charger les ordinateurs."}
      </div>
    );
  }

  return (
    <div className="col-span-12">
      <div className="mb-4 flex gap-3">
        <input
          className="rounded border px-3 py-2"
          placeholder="Rechercher un ordinateur..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button className="rounded border px-3 py-2" onClick={() => refetch()}>
          Rafraîchir
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>N° série</th>
            <th>Fabricant</th>
            <th>Statut</th>
            <th>Lieu</th>
            <th>Date création</th>
          </tr>
        </thead>

        <tbody>
          {visibleComputers.map((computer) => (
            <tr key={computer.id}>
              <td>{computer.id}</td>
              <td>{computer.name}</td>
              <td>{computer.serial ?? "-"}</td>
              <td>{computer.manufacturer?.name ?? "-"}</td>
              <td>{computer.state?.name ?? "-"}</td>
              <td>{computer.location?.name ?? "-"}</td>
              <td>{computer.date_creation ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Étape 7 — Utiliser `ComputerList` dans ta page

Dans ta page `AssetsPage.tsx`, mets temporairement :

```tsx
import { ComputerList } from "../../features/backoffice/assets/computers/components/ComputerList";

export function AssetsPage() {
  return <ComputerList />;
}
```

Le but pour l’instant est de valider React Query avec une liste simple, avant de remettre tout ton design.


## type de retoure hooks avec query react: 

```
const {
  data: computers = [],
  isPending: isComputersPending,
  isError: isComputersError,
  error: computersError,
  refetch: refetchComputers,
} = useComputers();
```

## staleTime, refetchOnMount, refetchOnWindowFocus

Si tu mets :

staleTime: 30_000

ça veut dire :

Pendant 30 secondes, React Query considère la donnée comme fraîche.

Après 30 secondes :

elle devient stale = potentiellement ancienne

Mais elle ne se recharge pas exactement à 30 secondes. Elle peut se recharger quand :

tu reviens sur la page
tu refocus la fenêtre
tu appelles refetch()
tu fais invalidateQueries()

Si tu veux vraiment être plus agressif et toujours vérifier :

useQuery({
  queryKey: ["assets", "computers", page, limit],
  queryFn: () => getComputersPage(page, limit),
  staleTime: 0,
  refetchOnMount: "always",
  refetchOnWindowFocus: "always",
});

Ça veut dire :

Dès que le composant remonte → refetch
Dès que tu reviens sur la fenêtre → refetch
Les données sont stale immédiatement

## certains concept
Au début, React Query ajoute plusieurs nouveaux concepts :

queryKey
queryFn
useQuery
useMutation
invalidateQueries
staleTime
cacheTime / gcTime

### a revoir plus tard

8. Pour ajouter, modifier, supprimer plus tard

Pour GET, on utilise :

useQuery()

Pour POST, PATCH, DELETE, on utilisera :

useMutation()

Exemple plus tard pour supprimer :

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsQueryKey } from "./useAssets";

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // appel DELETE vers GLPI
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assetsQueryKey,
      });
    },
  });
}

invalidateQueries veut dire :

Après suppression, considère la liste assets comme périmée et recharge-la.

C’est un gros avantage de React Query.

### Les options utiles à connaître maintenant

Tu n’as pas besoin de tout apprendre. Pour ton CRUD Computer, retiens ça :

useQuery({
  queryKey: computersQueryKey,
  queryFn: getComputers,
  staleTime: 60_000,
  retry: 1,
});
#### retry

Par défaut, React Query peut réessayer une requête échouée. La documentation indique que retry peut être un booléen, un nombre, ou une fonction, et que côté client la valeur par défaut est 3.

Pour apprendre, je te conseille :

retry: 1

Comme ça, si l’API GLPI échoue, React Query réessaie une fois, mais pas trop.

#### enabled

Utile quand tu ne veux lancer la requête que sous condition.

Exemple plus tard :

useQuery({
  queryKey: ["assets", "computers", entityId],
  queryFn: () => getComputersByEntity(entityId),
  enabled: entityId !== null,
});

Ça veut dire :

Ne lance la requête que si entityId existe.
#### select

Utile pour transformer les données avant de les donner au composant.

Exemple :

useQuery({
  queryKey: computersQueryKey,
  queryFn: getComputers,
  select: (computers) => computers.filter((computer) => !computer.is_deleted),
});

Ça permet de ne donner au composant que les ordinateurs non supprimés.

## remarque avec queryKey:
Évite seulement de mettre dans queryKey :

fonctions
classes
objets complexes non sérialisables
Date directement si tu ne maîtrises pas

## créer/modifier/supprimer

En React Query, créer/modifier/supprimer se fait avec useMutation, pas avec useQuery. useMutation prend une mutationFn, puis expose notamment mutate, mutateAsync, isPending, isError, error, isSuccess, etc.

### Différence mentale entre useQuery et useMutation

useQuery
→ lire des données
→ GET
→ exemple : liste des computers

useMutation
→ changer des données
→ POST / PATCH / DELETE
→ exemple : créer un computer

## flux create
pour CREATE, le flux sera :

formulaire
→ createComputer(payload)
→ glpiPost("/Assets/Computer", payload)
→ onSuccess
→ invalidateQueries(["assets", "computers"])
→ la liste se recharge

## role des attribut de l'objet de useMutation: 

mutationFn
→ fonction qui fait le POST

onSuccess
→ action après succès

invalidateQueries
→ dit à React Query : les listes computers ne sont plus sûres, recharge-les

## options utiles useMutation

Pour ton niveau actuel, retiens surtout ces options :

useMutation({
  mutationFn,
  onSuccess,
  onError,
  onSettled,
  retry,
});
mutationFn

C’est la fonction qui fait l’action.

### mutationFn: createComputer

Donc quand tu appelles :

createComputerAsync(payload)

React Query appelle :

createComputer(payload)

La doc indique que mutationFn est la fonction asynchrone qui reçoit les variables passées à mutate ou mutateAsync.

onSuccess

Se lance si la création réussit.

onSuccess: async () => {
  await queryClient.invalidateQueries({
    queryKey: computersQueryKey,
  });
}

Tu l’utilises pour recharger la liste, fermer une modal, afficher un message, etc.

onError

Se lance si la création échoue.

onError: (error) => {
  console.error(error);
}

Tu peux l’utiliser pour debug ou notification.

onSettled

Se lance dans tous les cas : succès ou erreur.

onSettled: () => {
  console.log("Mutation terminée");
}

Pratique si tu veux arrêter un loader global, par exemple.

retry

Nombre de tentatives si la mutation échoue.

Pour une création, je conseille souvent :

retry: 0

Pourquoi ? Parce qu’un POST peut créer une donnée. Si tu réessaies automatiquement, tu peux parfois créer un doublon selon l’API.

Donc ton hook peut être :

export function useCreateComputer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComputer,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: computersQueryKey,
      });
    },
  });
}


## flux UPDATE / modifier

clic sur Modifier
→ ouvrir modal avec les anciennes valeurs
→ modifier le formulaire
→ submit
→ updateComputer(payload)
→ useUpdateComputer mutation
→ invalidateQueries(["assets", "computers"])
→ la liste se recharge
→ fermer la modal