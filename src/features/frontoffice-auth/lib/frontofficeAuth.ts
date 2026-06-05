const FRONTOFFICE_AUTH_KEY = "glpi_frontoffice_authenticated";

export function isFrontofficeAuthenticated() {
  return window.localStorage.getItem(FRONTOFFICE_AUTH_KEY) === "true";
}

export function signInFrontoffice() {
  window.localStorage.setItem(FRONTOFFICE_AUTH_KEY, "true");
}

export function signOutFrontoffice() {
  window.localStorage.removeItem(FRONTOFFICE_AUTH_KEY);
}
