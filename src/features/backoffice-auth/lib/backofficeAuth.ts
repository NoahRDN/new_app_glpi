const BACKOFFICE_AUTH_KEY = "glpi_backoffice_authenticated";

export function isBackofficeAuthenticated() {
  return window.localStorage.getItem(BACKOFFICE_AUTH_KEY) === "true";
}

export function signInBackoffice() {
  window.localStorage.setItem(BACKOFFICE_AUTH_KEY, "true");
}

export function signOutBackoffice() {
  window.localStorage.removeItem(BACKOFFICE_AUTH_KEY);
}
