import { glpiDelete, glpiGet, glpiPost } from "../../../shared/api/glpiClient";
import type { GlpiDataResourceConfig } from "../model/glpiDataResource.config";

type GlpiListItem = {
  id?: number;
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
  const response = await glpiGet<unknown>(resource.endpoint);
  return extractListItems(response);
}

export async function createGlpiResourceItem(
  resource: GlpiDataResourceConfig,
  payload: Record<string, string | number | boolean>,
) {
  return glpiPost<unknown>(resource.endpoint, payload);
}

export async function deleteGlpiResourceItem(resource: GlpiDataResourceConfig, id: number | string) {
  return glpiDelete(`${resource.endpoint}/${id}`);
}
