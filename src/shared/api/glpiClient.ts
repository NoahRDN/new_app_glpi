import { env } from "../config/env";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

type TokenResponse = {
  access_token: string;
  expires_in?: number;
  token_type?: string;
};

let accessToken: string | null = null;
let accessTokenExpiresAt = 0;

function buildUrl(path: string) {
  return `${env.glpiApiBaseUrl}${path}`;
}

function isTokenValid() {
  return accessToken !== null && Date.now() < accessTokenExpiresAt - 30_000;
}

async function getAccessToken(): Promise<string> {
  if (isTokenValid() && accessToken !== null) {
    return accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "password",
    client_id: env.glpiOAuthClientId,
    client_secret: env.glpiOAuthClientSecret,
    username: env.glpiOAuthUsername,
    password: env.glpiOAuthPassword,
    scope: env.glpiOAuthScope,
  });

  const response = await fetch(env.glpiOAuthTokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GLPI OAuth token failed: ${response.status} ${response.statusText} ${errorText}`.trim(),
    );
  }

  const data = (await response.json()) as TokenResponse;

  accessToken = data.access_token;
  accessTokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  return accessToken;
}

async function request<T>(
  path: string,
  method: RequestMethod,
  body?: unknown,
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401) {
    accessToken = null;
    accessTokenExpiresAt = 0;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GLPI API ${method} ${path} failed: ${response.status} ${response.statusText} ${errorText}`.trim(),
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function glpiGet<T>(path: string) {
  return request<T>(path, "GET");
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