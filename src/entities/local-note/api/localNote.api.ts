import { localDelete, localGet, localPost } from "../../../shared/api/localClient";
import type { LocalNote } from "../model/localNote.types";

export async function getLocalNotes(): Promise<LocalNote[]> {
  return localGet<LocalNote[]>("/local-notes");
}

export async function createLocalNote(payload: {
  glpiUserId: number;
  note: string;
}) {
  return localPost("/local-notes", payload);
}

export async function deleteAllLocalNotes() {
  return localDelete("/local-notes");
}
