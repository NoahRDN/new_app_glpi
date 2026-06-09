import {
  glpiDelete,
  glpiGet,
  glpiPatch,
  glpiPost,
} from "../../../shared/api/glpiClient";

export type MonitorReference = {
  id: number;
  name: string;
};

export type Monitor = {
  [key: string]: unknown;
  id: number;
  name: string;
};

export type CreateMonitor = Record<string, unknown> & {
  name: string;
};

export type UpdateMonitor = Partial<CreateMonitor> & {
  id: number;
};

export async function getMonitors(): Promise<Monitor[]> {
  return glpiGet<Monitor[]>("/Assets/Monitor");
}

export async function getMonitor(monitorId: number | string): Promise<Monitor> {
  return glpiGet<Monitor>(`/Assets/Monitor/${monitorId}`);
}

export async function createMonitor(payload: CreateMonitor): Promise<Monitor> {
  return glpiPost<Monitor>("/Assets/Monitor", payload);
}

export async function updateMonitor(payload: UpdateMonitor): Promise<Monitor> {
  const { id, ...body } = payload;
  return glpiPatch<Monitor>(`/Assets/Monitor/${id}`, body);
}

export async function deleteMonitor(monitorId: number | string) {
  await glpiDelete(`/Assets/Monitor/${monitorId}`);
}
