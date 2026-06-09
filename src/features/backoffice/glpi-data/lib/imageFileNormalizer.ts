type DetectedImageType = "gif" | "jpg" | "png" | "unknown" | "webp";

const MIME_BY_TYPE: Record<Exclude<DetectedImageType, "unknown">, string> = {
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

async function detectImageType(file: Blob): Promise<DetectedImageType> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }

  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }

  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "gif";
  }

  const asciiHeader = new TextDecoder().decode(bytes);

  if (asciiHeader.startsWith("RIFF") && asciiHeader.includes("WEBP")) {
    return "webp";
  }

  return "unknown";
}

function replaceExtension(fileName: string, extension: string) {
  if (fileName.includes(".")) {
    return fileName.replace(/\.[^.]+$/, `.${extension}`);
  }

  return `${fileName}.${extension}`;
}

export async function normalizeImageFile(params: {
  file: Blob;
  fileName: string;
}) {
  const detectedType = await detectImageType(params.file);

  if (detectedType === "unknown") {
    throw new Error(
      `Image invalide: ${params.fileName}. Le type réel du fichier n'est pas reconnu.`,
    );
  }

  const normalizedFileName = replaceExtension(params.fileName, detectedType);
  const normalizedMime = MIME_BY_TYPE[detectedType];

  return {
    detectedType,
    file: new File([params.file], normalizedFileName, {
      type: normalizedMime,
    }),
    fileName: normalizedFileName,
    mime: normalizedMime,
    originalFileName: params.fileName,
    wasRenamed: normalizedFileName !== params.fileName,
  };
}
