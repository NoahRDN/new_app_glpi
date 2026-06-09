import { glpiDelete, glpiGet, glpiPatch, glpiPost } from "../../../shared/api/glpiClient";

export type State = {
  [key: string]: unknown;
  id: number;
  name: string;
};

export type CreateState = Record<string, unknown> & {
  name: string;
};

export type UpdateState = Partial<CreateState> & {
  id: number;
};

export async function getStates(): Promise<State[]> {
  return glpiGet<State[]>("/Dropdowns/State");
}

export async function getState(stateId: number | string): Promise<State> {
  return glpiGet<State>(`/Dropdowns/State/${stateId}`);
}

export async function createState(payload: CreateState): Promise<State> {
  return glpiPost<State>("/Dropdowns/State", payload);
}

export async function updateState(payload: UpdateState): Promise<State> {
  const { id, ...body } = payload;
  return glpiPatch<State>(`/Dropdowns/State/${id}`, body);
}

export async function deleteState(stateId: number | string) {
  await glpiDelete(`/Dropdowns/State/${stateId}`);
}
