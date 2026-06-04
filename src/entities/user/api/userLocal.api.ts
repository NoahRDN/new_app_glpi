import { localGet, localPost } from "../../../shared/api/localClient";

export type LocalUserNote = {
  id: number;
  glpiUserId: number;
  note: string;
};

export async function getUserNotes(): Promise<LocalUserNote[]> {
  return localGet<LocalUserNote[]>("/user-notes");
}

export async function createUserNote(payload: {
  glpiUserId: number;
  note: string;
}): Promise<LocalUserNote> {
  return localPost<LocalUserNote>("/user-notes", payload);
}