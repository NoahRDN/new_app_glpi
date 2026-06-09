import {
  glpiLegacyDelete,
  glpiLegacyGet,
  glpiLegacyGetBlob,
  glpiLegacyPost,
  glpiLegacyPostFormData,
  glpiLegacyPut,
} from "../../../shared/api/glpiLegacyClient";

export type Document = {
  [key: string]: unknown;
  id: number;
  name?: string;
};

export type CreateDocument = Record<string, unknown>;

export type CreateDocumentWithFilePayload = {
  comment?: string;
  file: Blob;
  fileName: string;
  items_id?: number;
  itemtype?: string;
  name: string;
};

export type UpdateDocument = Record<string, unknown> & {
  id: number;
};

export async function getDocuments(): Promise<Document[]> {
  return glpiLegacyGet<Document[]>("/Document");
}

export async function getDocument(documentId: number | string): Promise<Document> {
  return glpiLegacyGet<Document>(`/Document/${documentId}`);
}

export async function getDocumentFileBlob(documentId: number | string): Promise<Blob> {
  return glpiLegacyGetBlob(`/Document/${documentId}?alt=media`);
}

export async function createDocument(payload: CreateDocument): Promise<Document> {
  return glpiLegacyPost<Document>("/Document", payload);
}

export async function createDocumentWithFile(
  payload: CreateDocumentWithFilePayload,
): Promise<Document> {
  const formData = new FormData();

  formData.append(
    "uploadManifest",
    JSON.stringify({
      input: {
        comment: payload.comment,
        name: payload.name,
        items_id: payload.items_id,
        itemtype: payload.itemtype,
        _only_if_upload_succeed: true,
      },
    }),
  );
  formData.append("filename[0]", payload.file, payload.fileName);

  return glpiLegacyPostFormData<Document>("/Document", formData);
}

export async function updateDocument(payload: UpdateDocument): Promise<Document> {
  const { id, ...body } = payload;
  return glpiLegacyPut<Document>(`/Document/${id}`, body);
}

export async function deleteDocument(documentId: number | string) {
  await glpiLegacyDelete(`/Document/${documentId}`);
}
