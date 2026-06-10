import { glpiDelete, glpiGetPaginated, glpiPatch, glpiPost } from "../../../../shared/api/glpiClient";
import type { GlpiDataResourceConfig } from "../model/glpiDataResource.config";

export const DEFAULT_RESET_FORCE_DELETE = true;

type GlpiListItem = {
  id?: number;
  is_deleted?: boolean;
};

function extractListItems(response: unknown): GlpiListItem[] {
  if (Array.isArray(response)) {
    return response.filter((item): item is GlpiListItem => typeof item === "object" && item !== null);
  }

  if (typeof response === "object" && response !== null && "data" in response) {
    const data = (response as { data?: unknown }).data;
    if (Array.isArray(data)) {
      return data.filter((item): item is GlpiListItem => typeof item === "object" && item !== null);
    }
  }

  return [];
}

export async function getGlpiResourceItems(resource: GlpiDataResourceConfig) {
  const limit = 100;
  let start = 0;
  let total = Infinity;

  const allItems: unknown[] = [];

  while (start < total) {
    const params = new URLSearchParams({
      start: String(start),
      limit: String(limit),
    });

    const page = await glpiGetPaginated<unknown>(
      `${resource.endpoint}?${params.toString()}`
    );

    const items = extractListItems(page.data);

    allItems.push(...items);

    total = page.total;
    start += limit;

    if (items.length === 0) {
      break;
    }
  }
  return extractListItems(allItems);
}

export async function createGlpiResourceItem(
  resource: GlpiDataResourceConfig,
  payload: Record<string, string | number | boolean>,
) {
  return glpiPost<unknown>(resource.endpoint, payload);
}

export async function updateGlpiResourceItem(
  resource: GlpiDataResourceConfig,
  id: number | string,
  payload: Record<string, string | number | boolean>,
) {
  return glpiPatch<unknown>(`${resource.endpoint}/${id}`, payload);
}

export async function deleteGlpiResourceItem(
  resource: GlpiDataResourceConfig,
  id: number | string,
  options?: {
    forceDelete?: boolean;
  },
) {
  const forceQuery = options?.forceDelete ? "?force=true" : "";
  return glpiDelete(`${resource.endpoint}/${id}${forceQuery}`);
}
