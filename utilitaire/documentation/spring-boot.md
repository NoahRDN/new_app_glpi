| Ligne                                                           | Rôle                                                                         |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `spring.application.name=newAppGlpi`                            | Nom logique de ton application Spring Boot                                   |
| `server.port=8081`                                              | Ton backend démarre sur `http://localhost:8081`                              |
| `spring.datasource.url=jdbc:sqlite:../data/new_app_glpi.sqlite` | Emplacement du fichier SQLite                                                |
| `spring.datasource.driver-class-name=org.sqlite.JDBC`           | Driver JDBC utilisé pour parler à SQLite                                     |
| `spring.jpa.database-platform=...SQLiteDialect`                 | Dit à Hibernate comment générer du SQL compatible SQLite                     |
| `spring.jpa.hibernate.ddl-auto=update`                          | Hibernate peut créer/modifier des tables liées à tes entités                 |
| `spring.jpa.show-sql=true`                                      | Affiche les requêtes SQL dans la console                                     |
| `spring.sql.init.mode=always`                                   | Spring exécute toujours les scripts SQL d’initialisation, comme `schema.sql` |
