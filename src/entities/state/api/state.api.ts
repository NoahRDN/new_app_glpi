import {
  glpiDelete,
  glpiGet,
  glpiGetPaginated,
  glpiPatch,
  glpiPost,
} from "../../../shared/api/glpiClient";

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

export async function findStateByName(name: string): Promise<State | undefined> {
  const params = new URLSearchParams({
    start: "0",
    limit: "10",
  });

  params.set("filter", `name==${name}`);

  const page = await glpiGetPaginated<State>(
    `/Dropdowns/State?${params.toString()}`,
  );

  return page.data.find(
    (state) => state.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
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
