export const env = {
  glpiApiBaseUrl: import.meta.env.VITE_GLPI_API_BASE_URL ?? "/api.php",
  glpiAuthorizeUrl:
    import.meta.env.VITE_GLPI_OAUTH_AUTHORIZE_URL ?? "/front/oauth2/authorize.php",
  glpiTokenUrl: import.meta.env.VITE_GLPI_OAUTH_TOKEN_URL ?? "/api.php/token",
  glpiClientId: import.meta.env.VITE_GLPI_OAUTH_CLIENT_ID ?? "",
  glpiRedirectUri: import.meta.env.VITE_GLPI_OAUTH_REDIRECT_URI ?? "",
  glpiOAuthScope: import.meta.env.VITE_GLPI_OAUTH_SCOPE ?? "api inventory status user email",
};
