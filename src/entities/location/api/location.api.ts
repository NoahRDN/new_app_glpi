import {
  glpiDelete,
  glpiGet,
  glpiGetPaginated,
  glpiPatch,
  glpiPost,
} from "../../../shared/api/glpiClient";
import type { Location } from "../model/location.types";

export type CreateLocation = Record<string, unknown> & {
  name: string;
};

export type UpdateLocation = Partial<CreateLocation> & {
  id: number;
};

export async function getLocations(): Promise<Location[]> {
  return glpiGet<Location[]>("/Dropdowns/Location");
}

export async function getLocation(locationId: number | string): Promise<Location> {
  return glpiGet<Location>(`/Dropdowns/Location/${locationId}`);
}

export async function findLocationByName(name: string): Promise<Location | undefined> {
  const params = new URLSearchParams({
    start: "0",
    limit: "10",
  });

  params.set("filter", `name==${name}`);

  const page = await glpiGetPaginated<Location>(
    `/Dropdowns/Location?${params.toString()}`,
  );

  return page.data.find(
    (location) => location.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
}

export async function createLocation(payload: CreateLocation): Promise<Location> {
  return glpiPost<Location>("/Dropdowns/Location", payload);
}

export async function updateLocation(payload: UpdateLocation): Promise<Location> {
  const { id, ...body } = payload;
  return glpiPatch<Location>(`/Dropdowns/Location/${id}`, body);
}

export async function deleteLocation(locationId: number | string) {
  await glpiDelete(`/Dropdowns/Location/${locationId}`);
}
