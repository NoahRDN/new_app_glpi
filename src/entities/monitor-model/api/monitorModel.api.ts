import {
  glpiDelete,
  glpiGet,
  glpiGetPaginated,
  glpiPatch,
  glpiPost,
} from "../../../shared/api/glpiClient";
import type { Model } from "../../model/model/model.types";

export type CreateMonitorModel = Record<string, unknown> & {
  name: string;
};

export type UpdateMonitorModel = Partial<CreateMonitorModel> & {
  id: number;
};

export async function getMonitorModels(): Promise<Model[]> {
  return glpiGet<Model[]>("/Dropdowns/MonitorModel");
}

export async function getMonitorModel(monitorModelId: number | string): Promise<Model> {
  return glpiGet<Model>(`/Dropdowns/MonitorModel/${monitorModelId}`);
}

export async function findMonitorModelByName(name: string): Promise<Model | undefined> {
  const params = new URLSearchParams({
    start: "0",
    limit: "10",
  });

  params.set("filter", `name==${name}`);

  const page = await glpiGetPaginated<Model>(
    `/Dropdowns/MonitorModel?${params.toString()}`,
  );

  return page.data.find(
    (model) => model.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
}

export async function createMonitorModel(payload: CreateMonitorModel): Promise<Model> {
  return glpiPost<Model>("/Dropdowns/MonitorModel", payload);
}

export async function updateMonitorModel(payload: UpdateMonitorModel): Promise<Model> {
  const { id, ...body } = payload;
  return glpiPatch<Model>(`/Dropdowns/MonitorModel/${id}`, body);
}

export async function deleteMonitorModel(monitorModelId: number | string) {
  await glpiDelete(`/Dropdowns/MonitorModel/${monitorModelId}`);
}
