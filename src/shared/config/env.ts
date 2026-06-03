type Env = {
  glpiApiBaseUrl: string;
  glpiOAuthTokenUrl: string;
  glpiOAuthClientId: string;
  glpiOAuthClientSecret: string;
  glpiOAuthUsername: string;
  glpiOAuthPassword: string;
  glpiOAuthScope: string;
};

export const env: Env = {
  glpiApiBaseUrl: import.meta.env.VITE_GLPI_API_BASE_URL ?? "/glpi-api",
  glpiOAuthTokenUrl: import.meta.env.VITE_GLPI_OAUTH_TOKEN_URL ?? "/glpi-api/token",
  glpiOAuthClientId: import.meta.env.VITE_GLPI_OAUTH_CLIENT_ID ?? "",
  glpiOAuthClientSecret: import.meta.env.VITE_GLPI_OAUTH_CLIENT_SECRET ?? "",
  glpiOAuthUsername: import.meta.env.VITE_GLPI_OAUTH_USERNAME ?? "",
  glpiOAuthPassword: import.meta.env.VITE_GLPI_OAUTH_PASSWORD ?? "",
  glpiOAuthScope: import.meta.env.VITE_GLPI_OAUTH_SCOPE ?? "",
};