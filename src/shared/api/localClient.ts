type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  method: RequestMethod,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`/local-api${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Local API ${method} ${path} failed: ${response.status} ${errorText}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function localGet<T>(path: string) {
  return request<T>(path, "GET");
}

export function localPost<T>(path: string, body: unknown) {
  return request<T>(path, "POST", body);
}

export function localPatch<T>(path: string, body: unknown) {
  return request<T>(path, "PATCH", body);
}

export function localDelete(path: string) {
  return request<void>(path, "DELETE");
}