# Init SQLite avec Spring Boot

Ce guide sert à tester rapidement SQLite avec Spring Boot dans le projet **NewApp GLPI**, sans toucher au CRUD GLPI déjà existant.

L’idée est de commencer avec une table locale simple, par exemple `local_notes`, au lieu de migrer directement les utilisateurs GLPI.

GLPI reste la source officielle pour les données GLPI. SQLite sert à stocker des données locales propres à NewApp.

---

## 1. Créer le dossier `data`

À la racine du projet :

```bash
mkdir -p data
```

Ajoute dans `.gitignore` :

```gitignore
data/*.sqlite
data/*.db
```

La base locale SQLite ne doit pas être commitée.

---

## 2. Configurer Spring Boot avec SQLite

Dans `src/main/resources/application.properties` :

```properties
server.port=8080

spring.datasource.url=jdbc:sqlite:./data/new_app_glpi.sqlite
spring.datasource.driver-class-name=org.sqlite.JDBC

spring.sql.init.mode=always
```

> Si ton projet Spring Boot est dans un sous-dossier, par exemple `backend/newappglpi`, et que le dossier `data` est dans `backend/data`, utilise plutôt :
>
> ```properties
> spring.datasource.url=jdbc:sqlite:../data/new_app_glpi.sqlite
> ```

La ligne importante est :

```properties
spring.sql.init.mode=always
```

Elle force Spring Boot à exécuter `schema.sql` au démarrage.

Pour commencer, `JdbcTemplate` est plus simple que JPA/Hibernate avec SQLite.

---

## 3. Créer `schema.sql`

Dans Spring Boot :

```txt
src/main/resources/schema.sql
```

Mets :

```sql
CREATE TABLE IF NOT EXISTS local_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  glpi_user_id INTEGER NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Cette table permet de stocker une note locale liée à un utilisateur GLPI.

Exemple :

```txt
glpi_user_id = 12
note = "Utilisateur important pour le stock"
```

---

## 4. Créer un endpoint Spring Boot simple

Exemple :

```java
package edu.itu.newappglpi.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/local-notes")
public class LocalNoteController {

    private final JdbcTemplate jdbcTemplate;

    public LocalNoteController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.queryForList("""
            SELECT id, glpi_user_id, note, created_at
            FROM local_notes
            ORDER BY id DESC
        """);
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        jdbcTemplate.update(
            "INSERT INTO local_notes (glpi_user_id, note) VALUES (?, ?)",
            body.get("glpiUserId"),
            body.get("note")
        );

        return Map.of("success", true);
    }
}
```

Ce contrôleur n’est pas encore parfait niveau typage Java, mais il est suffisant pour tester rapidement SQLite.

---

## 5. Tester Spring Boot seul

Lance Spring Boot, puis teste :

```bash
curl http://localhost:8080/api/local-notes
```

Résultat attendu :

```json
[]
```

Ensuite teste un insert :

```bash
curl -X POST http://localhost:8080/api/local-notes \
  -H "Content-Type: application/json" \
  -d '{"glpiUserId":1,"note":"Test SQLite depuis Spring Boot"}'
```

Puis relance :

```bash
curl http://localhost:8080/api/local-notes
```

Tu dois voir la note insérée.

---

## 6. Ajouter le proxy Vite vers Spring Boot

Dans `vite.config.ts`, garde le proxy GLPI existant et ajoute un proxy local :

```ts
server: {
  proxy: {
    "/glpi-api": {
      target: env.GLPI_PROXY_TARGET || "http://glpi.localhost",
      changeOrigin: true,
      rewrite: (path) =>
        path.replace(/^\/glpi-api/, env.GLPI_API_PATH || "/api.php/v2.3"),
    },

    "/local-api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/local-api/, "/api"),
    },
  },
},
```

Tu obtiens donc :

```txt
/glpi-api   -> GLPI
/local-api  -> Spring Boot + SQLite
```

---

## 7. Créer un client React local

Dans React :

```txt
src/shared/api/localClient.ts
```

```ts
type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  method: RequestMethod,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`/local-api${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Local API ${method} ${path} failed: ${response.status} ${errorText}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function localGet<T>(path: string) {
  return request<T>(path, "GET");
}

export function localPost<T>(path: string, body: unknown) {
  return request<T>(path, "POST", body);
}
```

---

## 8. Créer une API React pour les notes locales

Crée par exemple :

```txt
src/entities/local-note/api/localNote.api.ts
```

```ts
import { localGet, localPost } from "../../../shared/api/localClient";

export type LocalNote = {
  id: number;
  glpi_user_id: number;
  note: string;
  created_at: string;
};

export async function getLocalNotes(): Promise<LocalNote[]> {
  return localGet<LocalNote[]>("/local-notes");
}

export async function createLocalNote(payload: {
  glpiUserId: number;
  note: string;
}) {
  return localPost("/local-notes", payload);
}
```

---

## Ordre conseillé

Fais dans cet ordre :

1. Vérifier que Spring Boot démarre.
2. Configurer SQLite avec `data/new_app_glpi.sqlite`.
3. Créer `schema.sql` avec la table `local_notes`.
4. Tester `GET /api/local-notes` avec `curl`.
5. Tester `POST /api/local-notes` avec `curl`.
6. Ajouter le proxy `/local-api` dans Vite.
7. Tester `fetch("/local-api/local-notes")` depuis React.

---

## Note sur le nom du fichier SQLite

Les extensions suivantes fonctionnent toutes :

```txt
new_app_glpi.db
new_app_glpi.sqlite
```

SQLite ne dépend pas vraiment de l’extension. Le plus important est d’utiliser le même chemin partout.

Convention recommandée dans ce projet :

```txt
data/new_app_glpi.sqlite
```
