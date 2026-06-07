import { env } from "../config/env";
import { AppError } from "../errors/AppError";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

type TokenResponse = {
  access_token: string;
  expires_in?: number;
  token_type?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  start: number;
  end: number;
};

let accessToken: string | null = null;
let accessTokenExpiresAt = 0;

function buildUrl(path: string) {
  return `${env.glpiApiBaseUrl}${path}`;
}

function isTokenValid() {
  return accessToken !== null && Date.now() < accessTokenExpiresAt - 30_000;
}

function parseContentRange(value: string | null) {
  if (!value) {
    return {
      start: 0,
      end: 0,
      total: 0,
    };
  }

  const match = value.match(/^(\d+)-(\d+)\/(\d+)$/);

  if (!match) {
    return {
      start: 0,
      end: 0,
      total: 0,
    };
  }

  return {
    start: Number(match[1]),
    end: Number(match[2]),
    total: Number(match[3]),
  };
}

async function getAccessToken(): Promise<string> {
  if (isTokenValid() && accessToken !== null) {
    return accessToken;
  }

  // URLSearchParams transforme un objet JavaScript en format :
  // clé=valeur&clé=valeur&clé=valeur
  // un body de type : application/x-www-form-urlencoded
  const body = new URLSearchParams({
    grant_type: "password",
    client_id: env.glpiOAuthClientId,
    client_secret: env.glpiOAuthClientSecret,
    username: env.glpiOAuthUsername,
    password: env.glpiOAuthPassword,
    scope: env.glpiOAuthScope,
  });

  let response: Response;

  try {
    response = await fetch(env.glpiOAuthTokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
  } catch {
    throw new AppError({
      message: "Network error while getting GLPI OAuth token",
      userMessage: "Impossible de contacter le serveur GLPI.",
      code: "NETWORK_ERROR",
    });
  }

  if (!response.ok) {
    const errorText = await response.text();

    throw new AppError({
      message: `GLPI OAuth token failed: ${response.status} ${response.statusText}`,
      userMessage: "Impossible d’ouvrir une session GLPI.",
      code: "OAUTH_ERROR",
      status: response.status,
      details: errorText,
    });
  }

  const data = (await response.json()) as TokenResponse;

  accessToken = data.access_token;
  accessTokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  return accessToken;
}

function createApiError(params: {
  method: RequestMethod;
  path: string;
  status: number;
  statusText: string;
  details: string;
}) {
  if (params.status === 401) {
    return new AppError({
      message: `GLPI API ${params.method} ${params.path} unauthorized`,
      userMessage: "Votre session GLPI a expiré. Veuillez vous reconnecter.",
      code: "UNAUTHORIZED",
      status: params.status,
      details: params.details,
    });
  }

  if (params.status === 403) {
    return new AppError({
      message: `GLPI API ${params.method} ${params.path} forbidden`,
      userMessage: "Vous n’avez pas les droits nécessaires pour cette action.",
      code: "FORBIDDEN",
      status: params.status,
      details: params.details,
    });
  }

  if (params.status === 404) {
    return new AppError({
      message: `GLPI API ${params.method} ${params.path} not found`,
      userMessage: "La ressource demandée est introuvable.",
      code: "NOT_FOUND",
      status: params.status,
      details: params.details,
    });
  }

  if (params.status === 400 || params.status === 422) {
    return new AppError({
      message: `GLPI API ${params.method} ${params.path} validation error`,
      userMessage: "Certaines informations envoyées sont invalides.",
      code: "VALIDATION_ERROR",
      status: params.status,
      details: params.details,
    });
  }

  return new AppError({
    message: `GLPI API ${params.method} ${params.path} failed: ${params.status} ${params.statusText}`,
    userMessage: "Une erreur est survenue pendant l’appel à GLPI.",
    code: "GLPI_API_ERROR",
    status: params.status,
    details: params.details,
  });
}

async function request<T>(
  path: string,
  method: RequestMethod,
  body?: unknown,
): Promise<T> {
  const token = await getAccessToken();

  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": "fr_FR",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new AppError({
      message: `Network error while calling GLPI API ${method} ${path}`,
      userMessage: "Impossible de contacter le serveur GLPI.",
      code: "NETWORK_ERROR",
    });
  }

  if (response.status === 401) {
    accessToken = null;
    accessTokenExpiresAt = 0;
  }

  if (!response.ok) {
    const errorText = await response.text();

    throw createApiError({
      method,
      path,
      status: response.status,
      statusText: response.statusText,
      details: errorText,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function requestPaginated<T>(
  path: string,
  method: "GET",
): Promise<PaginatedResult<T>> {
  const token = await getAccessToken();

  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": "fr_FR",
      },
    });
  } catch {
    throw new AppError({
      message: `Network error while calling GLPI API ${method} ${path}`,
      userMessage: "Impossible de contacter le serveur GLPI.",
      code: "NETWORK_ERROR",
    });
  }

  if (response.status === 401) {
    accessToken = null;
    accessTokenExpiresAt = 0;
  }

  if (!response.ok) {
    const errorText = await response.text();

    throw createApiError({
      method,
      path,
      status: response.status,
      statusText: response.statusText,
      details: errorText,
    });
  }

  const data = (await response.json()) as T[];
  const range = parseContentRange(response.headers.get("content-range"));

  return {
    data,
    total: range.total,
    start: range.start,
    end: range.end,
  };
}

export function glpiGet<T>(path: string) {
  return request<T>(path, "GET");
}

export function glpiGetPaginated<T>(path: string) {
  return requestPaginated<T>(path, "GET");
}

export function glpiPost<T>(path: string, body: unknown) {
  return request<T>(path, "POST", body);
}

export function glpiPatch<T>(path: string, body: unknown) {
  return request<T>(path, "PATCH", body);
}

export function glpiDelete(path: string) {
  return request<void>(path, "DELETE");
}