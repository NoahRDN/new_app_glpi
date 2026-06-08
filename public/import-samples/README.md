# Donnees de test import GLPI

Ces fichiers permettent de tester la page `/import-data`.

Fichiers CSV disponibles :
- `glpi-users.csv`
- `glpi-tickets.csv`
- `glpi-computers.csv`
- `glpi-computers-pagination.csv`
- `glpi-printers-pagination.csv`
- `glpi-locations.csv`
- `glpi-groups.csv`

Archive images disponible :
- `glpi-images.zip`

Chaque fichier est detecte automatiquement par les profils dans `src/features/glpi-data/model/builtInGlpiImportProfiles.ts`.
