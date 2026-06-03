import { env } from "../config/env";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

function buildUrl(path: string) {
  return `${env.glpiApiBaseUrl}${path}`;
}

async function request<T>(
  path: string,
  method: RequestMethod,
  body?: unknown
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${env.glpiAccessToken}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

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