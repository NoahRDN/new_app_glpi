import {
  glpiDelete,
  glpiGet,
  glpiGetPaginated,
  glpiPatch,
  glpiPost,
} from "../../../shared/api/glpiClient";
import { buildComputerFilter } from "../lib/computer.filter";

import type {
  Computer,
  ComputerFilters,
  CreateComputer,
  GlpiComputer,
  UpdateComputer,
} from "../model/computer.types";



export async function getComputers(): Promise<Computer[]> {
  return glpiGet<GlpiComputer[]>("/Assets/Computer");
}

export async function getComputersPage(
  page: number,
  limit: number,
  filters: ComputerFilters,
) {
  const start = page * limit;

  const params = new URLSearchParams({
    start: String(start),
    limit: String(limit),
  });

  const filter = buildComputerFilter(filters);

  if (filter) {
    params.set("filter", filter);
  }

  return glpiGetPaginated<GlpiComputer>(
    `/Assets/Computer?${params.toString()}`,
  );
}

export async function getComputer(computerId: number | string): Promise<Computer> {
  return glpiGet<GlpiComputer>(`/Assets/Computer/${computerId}`);
}

export async function createComputer(createComputerPayload: CreateComputer): Promise<Computer> {
  return glpiPost<GlpiComputer>("/Assets/Computer", createComputerPayload);
}

export async function updateComputer(updateComputerPayload: UpdateComputer): Promise<Computer> {
  const { id, ...payload } = updateComputerPayload;
  return glpiPatch<GlpiComputer>(`/Assets/Computer/${id}`, payload);
}

export async function deleteComputer(computerId: number | string) {
  await glpiDelete(`/Assets/Computer/${computerId}`);
}