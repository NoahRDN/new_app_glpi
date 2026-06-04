import JSZip from "jszip";
import type {
  GlpiImageZipEntryPreview,
  GlpiImageZipEntryUpload,
} from "../model/glpiImportProfile.types";

const SUPPORTED_IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif)$/i;

function getZipEntryFileName(path: string) {
  return path.split("/").filter(Boolean).pop() ?? path;
}

function isSupportedImageFile(path: string) {
  return SUPPORTED_IMAGE_EXTENSIONS.test(path);
}

function isIgnoredZipEntry(path: string) {
  return path.split("/").includes("__MACOSX");
}

function extractReferenceFromFileName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").trim();
}

function getMimeTypeFromFileName(fileName: string) {
  const normalizedFileName = fileName.toLowerCase();

  if (normalizedFileName.endsWith(".png")) {
    return "image/png";
  }

  if (normalizedFileName.endsWith(".jpg") || normalizedFileName.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (normalizedFileName.endsWith(".webp")) {
    return "image/webp";
  }

  if (normalizedFileName.endsWith(".gif")) {
    return "image/gif";
  }

  return "application/octet-stream";
}

async function loadZip(file: File) {
  return JSZip.loadAsync(await file.arrayBuffer());
}

function getImageZipEntries(zip: JSZip) {
  return Object.values(zip.files).filter(
    (entry) =>
      !entry.dir &&
      !isIgnoredZipEntry(entry.name) &&
      isSupportedImageFile(entry.name),
  );
}

export async function parseGlpiImagesZip(file: File): Promise<GlpiImageZipEntryPreview[]> {
  const zip = await loadZip(file);
  const imageEntries = getImageZipEntries(zip);

  return imageEntries.map((entry) => {
    const fileName = getZipEntryFileName(entry.name);

    return {
      fileName,
      reference: extractReferenceFromFileName(fileName),
    };
  });
}

export async function extractGlpiImageFilesFromZip(file: File): Promise<GlpiImageZipEntryUpload[]> {
  const zip = await loadZip(file);
  const imageEntries = getImageZipEntries(zip);

  return Promise.all(
    imageEntries.map(async (entry) => {
      const fileName = getZipEntryFileName(entry.name);
      const blob = await entry.async("blob");

      return {
        file: new File([blob], fileName, {
          type: getMimeTypeFromFileName(fileName),
        }),
        fileName,
        reference: extractReferenceFromFileName(fileName),
      };
    }),
  );
}
