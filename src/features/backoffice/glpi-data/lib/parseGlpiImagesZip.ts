import JSZip from "jszip";
import type {
  GlpiImageZipEntryPreview,
  GlpiImageZipEntryUpload,
} from "../model/glpiImportProfile.types";
import { normalizeImageFile } from "./imageFileNormalizer";

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
      const rawBlob = await entry.async("blob");
      const normalizedImage = await normalizeImageFile({
        file: rawBlob,
        fileName,
      });

      return {
        detectedType: normalizedImage.detectedType,
        file: normalizedImage.file,
        fileName: normalizedImage.fileName,
        originalFileName: normalizedImage.originalFileName,
        reference: extractReferenceFromFileName(fileName),
        wasRenamed: normalizedImage.wasRenamed,
      };
    }),
  );
}
