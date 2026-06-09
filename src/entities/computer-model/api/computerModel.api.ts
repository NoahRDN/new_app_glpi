import { glpiDelete, glpiGet, glpiPatch, glpiPost } from "../../../shared/api/glpiClient";
import type { Model } from "../../model/model/model.types";

export type CreateComputerModel = Record<string, unknown> & {
  name: string;
};

export type UpdateComputerModel = Partial<CreateComputerModel> & {
  id: number;
};

export async function getComputerModels(): Promise<Model[]> {
  return glpiGet<Model[]>("/Dropdowns/ComputerModel");
}

export async function getComputerModel(computerModelId: number | string): Promise<Model> {
  return glpiGet<Model>(`/Dropdowns/ComputerModel/${computerModelId}`);
}

export async function createComputerModel(payload: CreateComputerModel): Promise<Model> {
  return glpiPost<Model>("/Dropdowns/ComputerModel", payload);
}

export async function updateComputerModel(payload: UpdateComputerModel): Promise<Model> {
  const { id, ...body } = payload;
  return glpiPatch<Model>(`/Dropdowns/ComputerModel/${id}`, body);
}

export async function deleteComputerModel(computerModelId: number | string) {
  await glpiDelete(`/Dropdowns/ComputerModel/${computerModelId}`);
}
