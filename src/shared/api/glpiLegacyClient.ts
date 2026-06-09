import { env } from "../config/env";
import { AppError } from "../errors/AppError";

type LegacyRequestMethod = "GET" | "POST" | "PUT" | "DELETE";

type InitSessionResponse = {
  session_token: string;
};

let sessionToken: string | null = null;

function buildLegacyUrl(path: string) {
  return `${env.glpiLegacyApiBaseUrl}${path}`;
}

function getBaseHeaders() {
  return {
    Accept: "application/json",
    "Accept-Language": "fr_FR",
    ...(env.glpiLegacyAppToken
      ? { "App-Token": env.glpiLegacyAppToken }
      : {}),
  };
}

async function initLegacySession(): Promise<string> {
  if (sessionToken !== null) {
    return sessionToken;
  }

  let response: Response;

  try {
    response = await fetch(buildLegacyUrl("/initSession"), {
      method: "GET",
      headers: {
        ...getBaseHeaders(),
        Authorization: `user_token ${env.glpiLegacyUserToken}`,
      },
    });
  } catch {
    throw new AppError({
      message: "Network error while opening GLPI legacy session",
      userMessage: "Impossible de contacter l’API legacy GLPI.",
      code: "NETWORK_ERROR",
    });
  }

  if (!response.ok) {
    const details = await response.text();

    throw new AppError({
      message: `GLPI legacy initSession failed: ${response.status} ${response.statusText}`,
      userMessage: "Impossible d’ouvrir une session legacy GLPI.",
      code: "LEGACY_SESSION_ERROR",
      status: response.status,
      details,
    });
  }

  const data = (await response.json()) as InitSessionResponse;
  sessionToken = data.session_token;

  return sessionToken;
}

function isSessionInvalid(status: number, details: string) {
  return (
    status === 401 ||
    details.includes("ERROR_SESSION_TOKEN_INVALID") ||
    details.includes("ERROR_SESSION_TOKEN_MISSING")
  );
}

async function request<T>(
  path: string,
  method: LegacyRequestMethod,
  body?: unknown,
  retry = true,
): Promise<T> {
  const token = await initLegacySession();

  let response: Response;

  try {
    response = await fetch(buildLegacyUrl(path), {
      method,
      headers: {
        ...getBaseHeaders(),
        "Session-Token": token,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new AppError({
      message: `Network error while calling GLPI legacy API ${method} ${path}`,
      userMessage: "Impossible de contacter l’API legacy GLPI.",
      code: "NETWORK_ERROR",
    });
  }

  if (!response.ok) {
    const details = await response.text();

    if (retry && isSessionInvalid(response.status, details)) {
      sessionToken = null;
      return request<T>(path, method, body, false);
    }

    throw new AppError({
      message: `GLPI legacy API ${method} ${path} failed: ${response.status} ${response.statusText}`,
      userMessage: "Une erreur est survenue pendant l’appel à l’API legacy GLPI.",
      code: "GLPI_LEGACY_API_ERROR",
      status: response.status,
      details,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function requestFormData<T>(
  path: string,
  method: Exclude<LegacyRequestMethod, "GET">,
  formData: FormData,
  retry = true,
): Promise<T> {
  const token = await initLegacySession();

  let response: Response;

  try {
    response = await fetch(buildLegacyUrl(path), {
      method,
      headers: {
        ...getBaseHeaders(),
        "Session-Token": token,
      },
      body: formData,
    });
  } catch {
    throw new AppError({
      message: `Network error while calling GLPI legacy API ${method} ${path}`,
      userMessage: "Impossible de contacter l’API legacy GLPI.",
      code: "NETWORK_ERROR",
    });
  }

  if (!response.ok) {
    const details = await response.text();

    if (retry && isSessionInvalid(response.status, details)) {
      sessionToken = null;
      return requestFormData<T>(path, method, formData, false);
    }

    throw new AppError({
      message: `GLPI legacy API ${method} ${path} failed: ${response.status} ${response.statusText}`,
      userMessage: "Une erreur est survenue pendant l’envoi du fichier vers l’API legacy GLPI.",
      code: "GLPI_LEGACY_API_ERROR",
      status: response.status,
      details,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function glpiLegacyGet<T>(path: string) {
  return request<T>(path, "GET");
}

export function glpiLegacyPost<T>(path: string, body: unknown) {
  return request<T>(path, "POST", body);
}

export function glpiLegacyPostFormData<T>(path: string, formData: FormData) {
  return requestFormData<T>(path, "POST", formData);
}

export function glpiLegacyPut<T>(path: string, body: unknown) {
  return request<T>(path, "PUT", body);
}

export function glpiLegacyDelete(path: string) {
  return request<void>(path, "DELETE");
}

export function clearGlpiLegacySession() {
  sessionToken = null;
}
