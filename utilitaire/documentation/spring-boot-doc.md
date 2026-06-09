### Pour initialiser un projet Spring Boot, la manière la plus simple est d’utiliser Spring Initializr.

Méthode recommandée

Va sur :

https://start.spring.io

Puis choisis :

Project : Maven
Language : Java
Spring Boot : version par défaut
Group : par exemple com.example
Artifact : par exemple newapp
Name : newapp
Packaging : Jar
Java : 17 ou 21

Ensuite ajoute les dépendances utiles, par exemple :

Spring Web : pour créer une API REST
Spring Data JPA : pour gérer la base de données
SQLite JDBC ou MySQL Driver, selon ta base
Lombok : pour réduire le code Java
Validation : pour valider les données envoyées par le front

Puis clique sur Generate.

## Lancer le projet

Dans le terminal, à la racine du projet :

./mvnw spring-boot:run

### Sur Windows :

mvnw.cmd spring-boot:run

### Ou avec Maven installé :

mvn spring-boot:run
## Structure typique
src/
 └── main/
     ├── java/
     │   └── com/example/newapp/
     │       ├── NewappApplication.java
     │       ├── controller/
     │       ├── service/
     │       ├── repository/
     │       └── entity/
     └── resources/
         └── application.properties

Pour ton projet GLPI/NewApp, tu peux commencer avec :

controller  -> API REST pour React
service     -> logique métier
repository  -> accès base de données
entity      -> tables Java
dto         -> objets envoyés/reçus par l’API

## extetnsion pour vsc
Extension Pack for Java
Spring Boot Extension Pack
Lombok Annotations Support for VS Code
ESLint
Prettier - Code formatter
Tailwind CSS IntelliSense
Thunder Client
GitLens
Error Lens
Material Icon Theme
Auto Rename Tag
DotENV

## Une seule fenêtre avec un workspace VS Code (projet fullstack spring boot + react)

Tu peux ouvrir les deux projets dans la même fenêtre avec un multi-root workspace.

Dans VS Code :

File > Add Folder to Workspace...

Ajoute :

backend/newAppGlpi

puis ajoute aussi :

frontend

Ensuite fais :

File > Save Workspace As...

Par exemple :

newapp.code-workspace

Comme ça, tu as une seule fenêtre VS Code, mais chaque projet garde sa vraie racine.

Structure dans VS Code :

WORKSPACE
 ├── newAppGlpi     ← Spring Boot avec pom.xml
 └── frontend       ← React avec package.json

C’est souvent la meilleure solution pour un projet full-stack.