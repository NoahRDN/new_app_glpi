import {
  glpiLegacyDelete,
  glpiLegacyGet,
  glpiLegacyPost,
  glpiLegacyPut,
} from "../../../shared/api/glpiLegacyClient";

export type Document = {
  [key: string]: unknown;
  id: number;
  name?: string;
};

export type CreateDocument = Record<string, unknown>;

export type UpdateDocument = Record<string, unknown> & {
  id: number;
};

export async function getDocuments(): Promise<Document[]> {
  return glpiLegacyGet<Document[]>("/Document");
}

export async function getDocument(documentId: number | string): Promise<Document> {
  return glpiLegacyGet<Document>(`/Document/${documentId}`);
}

export async function createDocument(payload: CreateDocument): Promise<Document> {
  return glpiLegacyPost<Document>("/Document", payload);
}

export async function updateDocument(payload: UpdateDocument): Promise<Document> {
  const { id, ...body } = payload;
  return glpiLegacyPut<Document>(`/Document/${id}`, body);
}

export async function deleteDocument(documentId: number | string) {
  await glpiLegacyDelete(`/Document/${documentId}`);
}
