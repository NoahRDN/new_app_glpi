import {
  glpiDelete,
  glpiGet,
  glpiGetPaginated,
  glpiPatch,
  glpiPost,
} from "../../../shared/api/glpiClient";
import type { Manufacturer } from "../model/manufacturer.types";

export type CreateManufacturer = Record<string, unknown> & {
  name: string;
};

export type UpdateManufacturer = Partial<CreateManufacturer> & {
  id: number;
};

export async function getManufacturers(): Promise<Manufacturer[]> {
  return glpiGet<Manufacturer[]>("/Dropdowns/Manufacturer");
}

export async function getManufacturer(manufacturerId: number | string): Promise<Manufacturer> {
  return glpiGet<Manufacturer>(`/Dropdowns/Manufacturer/${manufacturerId}`);
}

export async function findManufacturerByName(name: string): Promise<Manufacturer | undefined> {
  const params = new URLSearchParams({
    start: "0",
    limit: "10",
  });

  params.set("filter", `name==${name}`);

  const page = await glpiGetPaginated<Manufacturer>(
    `/Dropdowns/Manufacturer?${params.toString()}`,
  );

  return page.data.find(
    (manufacturer) =>
      manufacturer.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
}

export async function createManufacturer(payload: CreateManufacturer): Promise<Manufacturer> {
  return glpiPost<Manufacturer>("/Dropdowns/Manufacturer", payload);
}

export async function updateManufacturer(payload: UpdateManufacturer): Promise<Manufacturer> {
  const { id, ...body } = payload;
  return glpiPatch<Manufacturer>(`/Dropdowns/Manufacturer/${id}`, body);
}

export async function deleteManufacturer(manufacturerId: number | string) {
  await glpiDelete(`/Dropdowns/Manufacturer/${manufacturerId}`);
}
