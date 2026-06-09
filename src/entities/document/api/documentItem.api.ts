import {
  glpiLegacyDelete,
  glpiLegacyGet,
  glpiLegacyPost,
  glpiLegacyPut,
} from "../../../shared/api/glpiLegacyClient";

export type DocumentItem = {
  [key: string]: unknown;
  id: number;
};

export type CreateDocumentItem = Record<string, unknown>;

export type UpdateDocumentItem = Record<string, unknown> & {
  id: number;
};

export async function getDocumentItems(): Promise<DocumentItem[]> {
  return glpiLegacyGet<DocumentItem[]>("/Document_Item");
}

export async function getDocumentItem(documentItemId: number | string): Promise<DocumentItem> {
  return glpiLegacyGet<DocumentItem>(`/Document_Item/${documentItemId}`);
}

export async function createDocumentItem(payload: CreateDocumentItem): Promise<DocumentItem> {
  return glpiLegacyPost<DocumentItem>("/Document_Item", payload);
}

export async function updateDocumentItem(payload: UpdateDocumentItem): Promise<DocumentItem> {
  const { id, ...body } = payload;
  return glpiLegacyPut<DocumentItem>(`/Document_Item/${id}`, body);
}

export async function deleteDocumentItem(documentItemId: number | string) {
  await glpiLegacyDelete(`/Document_Item/${documentItemId}`);
}
