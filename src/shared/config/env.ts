type Env = {
  // Base URL utilisée par React pour appeler l’API GLPI.
  // Exemple : "/glpi-api"
  // Grâce au proxy Vite, cette URL sera redirigée vers GLPI.
  glpiApiBaseUrl: string;

  // URL utilisée pour demander un access_token OAuth.
  // Exemple : "/glpi-api/token"
  // Attention : vérifier si cela correspond bien à /api.php/token ou /api.php/v2.3/token côté GLPI.
  glpiOAuthTokenUrl: string;

  // Identifiant du client OAuth créé dans GLPI.
  // Il identifie l'application NewApp.
  glpiOAuthClientId: string;

  // Secret du client OAuth.
  // Il prouve que l’application est autorisée.
  // Ne pas le mettre dans React en production.
  glpiOAuthClientSecret: string;

  // Nom d’utilisateur GLPI utilisé pour obtenir un token avec grant_type=password.
  glpiOAuthUsername: string;

  // Mot de passe de l’utilisateur GLPI utilisé pour obtenir un token.
  // Ne pas le mettre dans React en production.
  glpiOAuthPassword: string;

  // Permissions demandées au moment de créer le token.
  // Exemple : "api user email status"
  glpiOAuthScope: string;

  modeDebug: boolean;

  glpiLegacyApiBaseUrl: string;
  glpiLegacyAppToken: string;
  glpiLegacyUserToken: string;
};

export const env: Env = {
  glpiApiBaseUrl: import.meta.env.VITE_GLPI_API_BASE_URL ?? "/glpi-api",
  glpiOAuthTokenUrl: import.meta.env.VITE_GLPI_OAUTH_TOKEN_URL ?? "/glpi-api/token",
  glpiOAuthClientId: import.meta.env.VITE_GLPI_OAUTH_CLIENT_ID ?? "",
  glpiOAuthClientSecret: import.meta.env.VITE_GLPI_OAUTH_CLIENT_SECRET ?? "",
  glpiOAuthUsername: import.meta.env.VITE_GLPI_OAUTH_USERNAME ?? "",
  glpiOAuthPassword: import.meta.env.VITE_GLPI_OAUTH_PASSWORD ?? "",
  glpiOAuthScope: import.meta.env.VITE_GLPI_OAUTH_SCOPE ?? "",
  modeDebug: import.meta.env.VITE_MODE_DEBUG ?? false,

  glpiLegacyApiBaseUrl:
    import.meta.env.VITE_GLPI_LEGACY_API_BASE_URL ?? "/glpi-legacy-api",
  glpiLegacyAppToken: import.meta.env.VITE_GLPI_LEGACY_APP_TOKEN ?? "",
  glpiLegacyUserToken: import.meta.env.VITE_GLPI_LEGACY_USER_TOKEN ?? "",
};