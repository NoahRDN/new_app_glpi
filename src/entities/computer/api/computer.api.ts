import { glpiDelete, glpiGet, glpiGetPaginated, glpiPatch, glpiPost } from "../../../shared/api/glpiClient";
import type {
  Computer,
  CreateComputer,
  GlpiComputer,
  UpdateComputer,
} from "../model/computer.types";

export async function getComputers(): Promise<Computer[]> {
  return glpiGet<GlpiComputer[]>("/Assets/Computer");
}

export async function getComputersPage(page: number, limit: number) {
  const start = page * limit;

  return glpiGetPaginated<GlpiComputer>(
    `/Assets/Computer?start=${start}&limit=${limit}`,
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
