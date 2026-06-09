import { useState } from "react";
import { createComputer } from "../../../../entities/computer/api/computer.api";
import { createComputerModel, getComputerModels } from "../../../../entities/computer-model/api/computerModel.api";
import { createDocument } from "../../../../entities/document/api/document.api";
import { createDocumentItem } from "../../../../entities/document/api/documentItem.api";
import { createLocation, getLocations } from "../../../../entities/location/api/location.api";
import { createManufacturer, getManufacturers } from "../../../../entities/manufacturer/api/manufacturer.api";
import { createMonitor } from "../../../../entities/monitor/api/monitor.api";
import { createMonitorModel, getMonitorModels } from "../../../../entities/monitor-model/api/monitorModel.api";
import { createState, getStates } from "../../../../entities/state/api/state.api";
import { createTicketCost } from "../../../../entities/ticket-cost/api/ticketCost.api";
import { createTicketItemLink } from "../../../../entities/ticket/api/ticketItem.api";
import { getUsers } from "../../../../entities/user/api/user.api";
import { createGlpiResourceItem } from "../api/glpiDataResource.api";
import { extractGlpiImageFilesFromZip } from "../lib/parseGlpiImagesZip";
import { getGlpiDataResource, type GlpiDataResourceId } from "../model/glpiDataResource.config";
import type {
  GlpiImageZipEntryUpload,
  ParsedGlpiImagesZipFile,
  ParsedGlpiProfileRow,
  RecognizedGlpiParsedFile,
} from "../model/glpiImportProfile.types";

type ImportFilesInput = {
  imageZipFiles?: File[];
  importImages: boolean;
  recognizedFiles: RecognizedGlpiParsedFile[];
};

type ImportError = {
  fileName: string;
  message: string;
};

type ImportResult = {
  errors: ImportError[];
  failedCount: number;
  importedCount: number;
  skippedCount: number;
};

type UseImportGlpiCsvResult = {
  error: string | null;
  importFiles: (input: ImportFilesInput) => Promise<void>;
  isImporting: boolean;
  result: ImportResult | null;
};

type ImportedAssetReference = {
  itemId: number;
  itemtype: string;
};

type EvalImportContext = {
  assetReferencesByKey: Map<string, ImportedAssetReference>;
  ticketIdsByRef: Map<string, number>;
};

const EVAL_ASSETS_PROFILE_ID = "glpi-eval-assets-juin-2026-v1";
const EVAL_TICKETS_PROFILE_ID = "glpi-eval-tickets-juin-2026-v1";
const EVAL_TICKET_COSTS_PROFILE_ID = "glpi-eval-ticket-costs-juin-2026-v1";

function getResourcePayloads(file: RecognizedGlpiParsedFile) {
  return file.rows.flatMap((row) =>
    Object.entries(file.profile.resourceMappings).flatMap(([resourceId]) => {
      const payload = row[resourceId as GlpiDataResourceId];

      if (!payload) {
        return [];
      }

      return [{
        payload: Object.fromEntries(
          Object.entries(payload).filter(([, value]) => value !== undefined),
        ) as Record<string, string | number | boolean>,
        resourceId: resourceId as GlpiDataResourceId,
      }];
    }),
  );
}

function normalizeKey(value: string | number | null | undefined) {
  return String(value ?? "").trim().toLowerCase();
}

function parseItemsList(value: string | number | boolean | undefined) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0);
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.replace(/[[\]"]/g, "").trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

function getRowBucket(
  row: ParsedGlpiProfileRow,
  resourceId: GlpiDataResourceId,
) {
  return row[resourceId] as Record<string, string | number | boolean | undefined> | undefined;
}

function getTicketTypeValue(value: string | number | boolean | undefined) {
  const normalizedValue = normalizeKey(typeof value === "string" ? value : "");

  if (normalizedValue === "incident") {
    return 1;
  }

  if (normalizedValue === "demande" || normalizedValue === "request") {
    return 2;
  }

  return 1;
}

function getTicketStatusValue(value: string | number | boolean | undefined) {
  const normalizedValue = normalizeKey(typeof value === "string" ? value : "");

  if (normalizedValue === "new" || normalizedValue === "nouveau") {
    return 1;
  }

  if (normalizedValue === "processing (assigned)" || normalizedValue === "assigné") {
    return 2;
  }

  if (normalizedValue === "processing (planned)" || normalizedValue === "planifié") {
    return 3;
  }

  if (normalizedValue === "pending" || normalizedValue === "en attente") {
    return 4;
  }

  if (normalizedValue === "solved" || normalizedValue === "résolu" || normalizedValue === "resolu") {
    return 5;
  }

  if (normalizedValue === "closed" || normalizedValue === "fermé" || normalizedValue === "ferme") {
    return 6;
  }

  return 1;
}

function getTicketPriorityValue(value: string | number | boolean | undefined) {
  const normalizedValue = normalizeKey(typeof value === "string" ? value : "");

  if (normalizedValue === "very low") {
    return 1;
  }

  if (normalizedValue === "low") {
    return 2;
  }

  if (normalizedValue === "medium" || normalizedValue === "normal") {
    return 3;
  }

  if (normalizedValue === "high") {
    return 4;
  }

  if (normalizedValue === "very high") {
    return 5;
  }

  if (normalizedValue === "major") {
    return 6;
  }

  return 3;
}

function buildFullName(firstname: string, realname: string) {
  return `${firstname} ${realname}`.trim().toLowerCase();
}

function buildUserLookup(users: Awaited<ReturnType<typeof getUsers>>) {
  const byName = new Map<string, number>();

  users.forEach((user) => {
    if (user.is_deleted) {
      return;
    }

    byName.set(normalizeKey(user.username), user.id);
    byName.set(buildFullName(user.firstname, user.realname), user.id);
    byName.set(buildFullName(user.realname, user.firstname), user.id);
    byName.set(normalizeKey(user.realname), user.id);
  });

  return byName;
}

function createNameResolver<T extends { id: number; name: string }>(params: {
  createItem: (payload: { name: string }) => Promise<T>;
  getItems: () => Promise<T[]>;
}) {
  let itemsPromise: Promise<T[]> | null = null;

  async function loadItems() {
    if (itemsPromise === null) {
      itemsPromise = params.getItems();
    }

    return itemsPromise;
  }

  return async function resolveIdByName(name: string | number | boolean | undefined) {
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (normalizedName.length === 0) {
      return undefined;
    }

    const items = await loadItems();
    const existingItem = items.find(
      (item) => normalizeKey(item.name) === normalizeKey(normalizedName),
    );

    if (existingItem) {
      return existingItem.id;
    }

    const createdItem = await params.createItem({ name: normalizedName });
    items.push(createdItem);
    return createdItem.id;
  };
}

function extractCreatedId(value: unknown) {
  if (typeof value === "object" && value !== null && "id" in value) {
    const id = (value as { id?: unknown }).id;

    if (typeof id === "number") {
      return id;
    }
  }

  return null;
}

async function importEvalAssetsFile(
  file: RecognizedGlpiParsedFile,
  context: EvalImportContext,
) {
  const resolveStateId = createNameResolver({
    createItem: createState,
    getItems: getStates,
  });
  const resolveLocationId = createNameResolver({
    createItem: createLocation,
    getItems: getLocations,
  });
  const resolveManufacturerId = createNameResolver({
    createItem: createManufacturer,
    getItems: getManufacturers,
  });
  const resolveComputerModelId = createNameResolver({
    createItem: createComputerModel,
    getItems: getComputerModels,
  });
  const resolveMonitorModelId = createNameResolver({
    createItem: createMonitorModel,
    getItems: getMonitorModels,
  });
  const users = await getUsers();
  const userLookup = buildUserLookup(users);

  let importedCount = 0;

  for (const row of file.rows) {
    const data = getRowBucket(row, "computers");

    if (!data) {
      continue;
    }

    const itemType = String(data.itemType ?? "").trim();
    const name = String(data.name ?? "").trim();
    const inventoryNumber = String(data.inventoryNumber ?? "").trim();

    if (name.length === 0) {
      continue;
    }

    const userId = userLookup.get(normalizeKey(data.userName as string));
    const commonPayload = {
      location_id: await resolveLocationId(data.locationName),
      manufacturer_id: await resolveManufacturerId(data.manufacturerName),
      otherserial: inventoryNumber || undefined,
      status_id: await resolveStateId(data.statusLabel),
      user_id: userId,
    };

    if (normalizeKey(itemType) === "monitor") {
      const createdMonitor = await createMonitor({
        ...commonPayload,
        model_id: await resolveMonitorModelId(data.modelName),
        name,
      });

      context.assetReferencesByKey.set(normalizeKey(name), {
        itemId: createdMonitor.id,
        itemtype: "Monitor",
      });

      if (inventoryNumber.length > 0) {
        context.assetReferencesByKey.set(normalizeKey(inventoryNumber), {
          itemId: createdMonitor.id,
          itemtype: "Monitor",
        });
      }

      importedCount += 1;
      continue;
    }

    const createdComputer = await createComputer({
      ...commonPayload,
      model_id: await resolveComputerModelId(data.modelName),
      name,
    });

    context.assetReferencesByKey.set(normalizeKey(name), {
      itemId: createdComputer.id,
      itemtype: "Computer",
    });

    if (inventoryNumber.length > 0) {
      context.assetReferencesByKey.set(normalizeKey(inventoryNumber), {
        itemId: createdComputer.id,
        itemtype: "Computer",
      });
    }

    importedCount += 1;
  }

  return importedCount;
}

async function importEvalTicketsFile(
  file: RecognizedGlpiParsedFile,
  context: EvalImportContext,
) {
  let importedCount = 0;

  for (const row of file.rows) {
    const data = getRowBucket(row, "tickets");

    if (!data) {
      continue;
    }

    const payload = {
      content: String(data.content ?? "").trim(),
      external_id: String(data.refTicket ?? "").trim() || undefined,
      name: String(data.name ?? "").trim(),
      priority: getTicketPriorityValue(data.priorityLabel),
      status: getTicketStatusValue(data.statusLabel),
      type: getTicketTypeValue(data.typeLabel),
    };

    const createdTicket = await createGlpiResourceItem(
      getGlpiDataResource("tickets"),
      payload as Record<string, string | number | boolean>,
    );

    const ticketId = extractCreatedId(createdTicket);
    const refTicket = String(data.refTicket ?? "").trim();

    if (ticketId !== null && refTicket.length > 0) {
      context.ticketIdsByRef.set(normalizeKey(refTicket), ticketId);
    }

    if (ticketId !== null) {
      const items = parseItemsList(data.itemsRaw);

      for (const itemReference of items) {
        const linkedAsset = context.assetReferencesByKey.get(normalizeKey(itemReference));

        if (!linkedAsset) {
          continue;
        }

        await createTicketItemLink({
          itemId: linkedAsset.itemId,
          itemtype: linkedAsset.itemtype,
          ticketId,
        });
      }
    }

    importedCount += 1;
  }

  return importedCount;
}

async function importEvalTicketCostsFile(
  file: RecognizedGlpiParsedFile,
  context: EvalImportContext,
) {
  let importedCount = 0;

  for (const row of file.rows) {
    const data = getRowBucket(row, "tickets");

    if (!data) {
      continue;
    }

    const ticketId = context.ticketIdsByRef.get(
      normalizeKey(String(data.ticketRef ?? "")),
    );

    if (!ticketId) {
      continue;
    }

    await createTicketCost({
      input: {
        actiontime: Number(data.durationSecond ?? 0),
        cost_fixed: Number(data.fixedCost ?? 0),
        cost_time: Number(data.timeCost ?? 0),
        tickets_id: ticketId,
      },
    });

    importedCount += 1;
  }

  return importedCount;
}

async function importImageZipFiles(
  imageZipFiles: File[],
  importImages: boolean,
  context: EvalImportContext,
) {
  let importedCount = 0;
  let skippedCount = 0;
  const errors: ImportError[] = [];

  if (!importImages) {
    return {
      errors,
      importedCount,
      skippedCount: imageZipFiles.length,
    };
  }

  for (const imageZipFile of imageZipFiles) {
    try {
      const imageEntries = await extractGlpiImageFilesFromZip(imageZipFile);

      for (const imageEntry of imageEntries) {
        importedCount += await importImageZipEntry(imageZipFile.name, imageEntry, context);
      }
    } catch (caughtError) {
      errors.push({
        fileName: imageZipFile.name,
        message: caughtError instanceof Error ? caughtError.message : String(caughtError),
      });
    }
  }

  return {
    errors,
    importedCount,
    skippedCount,
  };
}

async function importImageZipEntry(
  zipFileName: string,
  imageEntry: GlpiImageZipEntryUpload,
  context: EvalImportContext,
) {
  const createdDocument = await createDocument({
    input: {
      comment: `Import image zip: ${zipFileName}`,
      filename: imageEntry.fileName,
      name: imageEntry.reference || imageEntry.fileName,
    },
  });

  const documentId = extractCreatedId(createdDocument);
  const linkedAsset = context.assetReferencesByKey.get(normalizeKey(imageEntry.reference));

  if (documentId !== null && linkedAsset) {
    await createDocumentItem({
      input: {
        documents_id: documentId,
        items_id: linkedAsset.itemId,
        itemtype: linkedAsset.itemtype,
      },
    });
  }

  return 1;
}

async function importRecognizedFile(
  file: RecognizedGlpiParsedFile,
  context: EvalImportContext,
) {
  if (file.profile.id === EVAL_ASSETS_PROFILE_ID) {
    return importEvalAssetsFile(file, context);
  }

  if (file.profile.id === EVAL_TICKETS_PROFILE_ID) {
    return importEvalTicketsFile(file, context);
  }

  if (file.profile.id === EVAL_TICKET_COSTS_PROFILE_ID) {
    return importEvalTicketCostsFile(file, context);
  }

  let importedCount = 0;

  for (const item of getResourcePayloads(file)) {
    await createGlpiResourceItem(getGlpiDataResource(item.resourceId), item.payload);
    importedCount += 1;
  }

  return importedCount;
}

export function useImportGlpiCsv(): UseImportGlpiCsvResult {
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function importFiles({ imageZipFiles = [], importImages, recognizedFiles }: ImportFilesInput) {
    setError(null);
    setIsImporting(true);
    setResult(null);

    let importedCount = 0;
    let skippedCount = 0;
    const errors: ImportError[] = [];
    const context: EvalImportContext = {
      assetReferencesByKey: new Map(),
      ticketIdsByRef: new Map(),
    };

    try {
      for (const file of recognizedFiles) {
        try {
          importedCount += await importRecognizedFile(file, context);
        } catch (caughtError) {
          errors.push({
            fileName: file.fileName,
            message: caughtError instanceof Error ? caughtError.message : String(caughtError),
          });
        }

        skippedCount += file.invalidRows.length;
      }

      const imageImportResult = await importImageZipFiles(
        imageZipFiles,
        importImages,
        context,
      );

      importedCount += imageImportResult.importedCount;
      skippedCount += imageImportResult.skippedCount;
      errors.push(...imageImportResult.errors);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
    } finally {
      setResult({
        errors,
        failedCount: errors.length,
        importedCount,
        skippedCount,
      });
      setIsImporting(false);
    }
  }

  return {
    error,
    importFiles,
    isImporting,
    result,
  };
}

export type { ParsedGlpiImagesZipFile };
