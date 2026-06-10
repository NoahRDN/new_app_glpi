import { useState } from "react";
import { createComputer } from "../../../../entities/computer/api/computer.api";
import {
  createComputerModel,
  deleteComputerModel,
  findComputerModelByName,
} from "../../../../entities/computer-model/api/computerModel.api";
import {
  createDocumentWithFile,
  deleteDocument,
} from "../../../../entities/document/api/document.api";
import {
  createLocation,
  deleteLocation,
  findLocationByName,
} from "../../../../entities/location/api/location.api";
import {
  createManufacturer,
  deleteManufacturer,
  findManufacturerByName,
} from "../../../../entities/manufacturer/api/manufacturer.api";
import { createMonitor, deleteMonitor } from "../../../../entities/monitor/api/monitor.api";
import {
  createMonitorModel,
  deleteMonitorModel,
  findMonitorModelByName,
} from "../../../../entities/monitor-model/api/monitorModel.api";
import {
  createState,
  deleteState,
  findStateByName,
} from "../../../../entities/state/api/state.api";
import { createTicketCost, deleteTicketCost } from "../../../../entities/ticket-cost/api/ticketCost.api";
import { createTicketItemLink, deleteTicketItemLink } from "../../../../entities/ticket/api/ticketItem.api";
import {
  createUserFromName,
  deleteUser,
  findUserByName,
} from "../../../../entities/user/api/user.api";
import {
  AppError,
  extractAdditionalMessages,
  extractErrorDetail,
} from "../../../../shared/errors/AppError";
import { createGlpiResourceItem, deleteGlpiResourceItem } from "../api/glpiDataResource.api";
import { extractGlpiImageFilesFromZip } from "../lib/parseGlpiImagesZip";
import { resetGlpiResources } from "../lib/resetGlpiResources";
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
  additionalMessages?: string[];
  details?: string;
  fileName: string;
  message: string;
  profileLabel?: string;
  rawRow?: string;
  resourceId?: GlpiDataResourceId | "documents" | "ticket-links" | "ticket-costs" | "rollback";
  rollback?: boolean;
  rowIndex?: number;
  stage:
    | "profile-parse"
    | "resource-create"
    | "ticket-link"
    | "ticket-cost"
    | "image-import"
    | "rollback";
};

type ImportWarning = {
  details?: string;
  fileName: string;
  message: string;
  resourceId: string;
};

type ImportResult = {
  errors: ImportError[];
  failedCount: number;
  files: ImportFileSummary[];
  importedCount: number;
  resources: ImportResourceSummary[];
  skippedCount: number;
  warnings: ImportWarning[];
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

type RollbackAction = {
  label: string;
  run: () => Promise<void>;
};

type ImportResourceSummary = {
  importedCount: number;
  label: string;
  resourceId: string;
  skippedCount: number;
};

type ImportFileSummary = {
  fileName: string;
  importedCount: number;
  profileLabel?: string;
  resourceIds: string[];
  skippedCount: number;
};

type ImportExecutionSummary = {
  errors?: ImportError[];
  files?: ImportFileSummary[];
  importedCount: number;
  resources: ImportResourceSummary[];
  skippedCount?: number;
  warnings?: ImportWarning[];
};

class ImportRowError extends Error {
  public readonly originalError: unknown;
  public readonly rowIndex: number;

  constructor(rowIndex: number, originalError: unknown) {
    super(originalError instanceof Error ? originalError.message : String(originalError));
    this.name = "ImportRowError";
    this.originalError = originalError;
    this.rowIndex = rowIndex;
  }
}

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

function collectImportResetResourceIds(params: {
  imageZipFiles: File[];
  recognizedFiles: RecognizedGlpiParsedFile[];
}) {
  const resourceIds = new Set<GlpiDataResourceId>();

  params.recognizedFiles.forEach((file) => {
    if (file.profile.id === EVAL_ASSETS_PROFILE_ID) {
      [
        "users",
        "states",
        "locations",
        "manufacturers",
        "computerModels",
        "monitorModels",
        "computers",
        "monitors",
      ].forEach((resourceId) => {
        resourceIds.add(resourceId as GlpiDataResourceId);
      });
      return;
    }

    if (file.profile.id === EVAL_TICKETS_PROFILE_ID) {
      resourceIds.add("tickets");
      return;
    }

    if (file.profile.id === EVAL_TICKET_COSTS_PROFILE_ID) {
      resourceIds.add("tickets");
      return;
    }

    Object.keys(file.profile.resourceMappings).forEach((resourceId) => {
      resourceIds.add(resourceId as GlpiDataResourceId);
    });
  });

  if (params.imageZipFiles.length > 0) {
    resourceIds.add("documents");
  }

  return [...resourceIds];
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

function getImportErrorMessage(error: unknown) {
  const sourceError = error instanceof ImportRowError ? error.originalError : error;

  if (sourceError instanceof AppError) {
    return extractErrorDetail(sourceError.details ?? "") ?? sourceError.message;
  }

  if (sourceError instanceof Error) {
    return sourceError.message;
  }

  return String(sourceError);
}

function getImportErrorDetails(error: unknown) {
  const sourceError = error instanceof ImportRowError ? error.originalError : error;

  if (sourceError instanceof AppError) {
    const extractedDetails = extractErrorDetail(sourceError.details ?? "");
    const additionalMessages = extractAdditionalMessages(sourceError.details ?? "");

    return [
      `Code: ${sourceError.code}`,
      sourceError.status !== undefined ? `Status: ${sourceError.status}` : undefined,
      `Message: ${sourceError.message}`,
      extractedDetails ? `Détail GLPI: ${extractedDetails}` : undefined,
      additionalMessages.length > 0
        ? `Messages additionnels:\n${additionalMessages.map((item) => `- ${item}`).join("\n")}`
        : undefined,
      sourceError.details ? `Réponse brute: ${sourceError.details}` : undefined,
    ]
      .filter((item): item is string => Boolean(item))
      .join("\n");
  }

  if (sourceError instanceof Error) {
    return sourceError.stack ?? sourceError.message;
  }

  return String(sourceError);
}

function getImportAdditionalMessages(error: unknown) {
  const sourceError = error instanceof ImportRowError ? error.originalError : error;

  if (sourceError instanceof AppError) {
    return extractAdditionalMessages(sourceError.details ?? "");
  }

  return [];
}

function getImportRowIndex(error: unknown) {
  if (error instanceof ImportRowError) {
    return error.rowIndex;
  }

  return undefined;
}

function stringifyImportRow(row: Record<string, string | undefined> | undefined) {
  if (!row) {
    return undefined;
  }

  return JSON.stringify(row, null, 2);
}

function getDetectedTypeLabel(detectedType: string) {
  if (detectedType === "jpg") {
    return "JPEG";
  }

  return detectedType.toUpperCase();
}

function createNameResolver<T extends { id: number; name: string }>(params: {
  createItem: (payload: { name: string }) => Promise<T>;
  deleteItem: (id: number) => Promise<void>;
  findItemByName: (name: string) => Promise<T | undefined>;
  rollbackActions: RollbackAction[];
  rollbackLabel: string;
}) {
  const cache = new Map<string, number>();

  return async function resolveIdByName(name: string | number | boolean | undefined) {
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (normalizedName.length === 0) {
      return undefined;
    }

    const cacheKey = normalizeKey(normalizedName);
    const cachedId = cache.get(cacheKey);

    if (cachedId !== undefined) {
      return cachedId;
    }

    const existingItem = await params.findItemByName(normalizedName);

    if (existingItem) {
      cache.set(cacheKey, existingItem.id);
      return existingItem.id;
    }

    try {
      const createdItem = await params.createItem({ name: normalizedName });
      params.rollbackActions.push({
        label: `${params.rollbackLabel}#${createdItem.id}`,
        run: () => params.deleteItem(createdItem.id),
      });
      cache.set(cacheKey, createdItem.id);
      return createdItem.id;
    } catch (caughtError) {
      const itemAfterFailedCreate = await params.findItemByName(normalizedName);

      if (itemAfterFailedCreate) {
        cache.set(cacheKey, itemAfterFailedCreate.id);
        return itemAfterFailedCreate.id;
      }

      throw caughtError;
    }
  };
}

function createUserResolver(params: {
  rollbackActions: RollbackAction[];
}) {
  const cache = new Map<string, number>();

  return async function resolveUserIdByName(name: string | number | boolean | undefined) {
    const normalizedName = typeof name === "string" ? name.trim() : "";

    if (normalizedName.length === 0) {
      return undefined;
    }

    const cacheKey = normalizeKey(normalizedName);
    const cachedId = cache.get(cacheKey);

    if (cachedId !== undefined) {
      return cachedId;
    }

    const existingUser = await findUserByName(normalizedName);

    if (existingUser) {
      cache.set(cacheKey, existingUser.id);
      return existingUser.id;
    }

    try {
      const createdUser = await createUserFromName(normalizedName);
      params.rollbackActions.push({
        label: `user#${createdUser.id}`,
        run: () => deleteUser(createdUser.id),
      });
      cache.set(cacheKey, createdUser.id);
      return createdUser.id;
    } catch (caughtError) {
      const userAfterFailedCreate = await findUserByName(normalizedName);

      if (userAfterFailedCreate) {
        cache.set(cacheKey, userAfterFailedCreate.id);
        return userAfterFailedCreate.id;
      }

      throw caughtError;
    }
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
  rollbackActions: RollbackAction[],
) : Promise<ImportExecutionSummary> {
  const resolveStateId = createNameResolver({
    createItem: createState,
    deleteItem: deleteState,
    findItemByName: findStateByName,
    rollbackActions,
    rollbackLabel: "state",
  });
  const resolveLocationId = createNameResolver({
    createItem: createLocation,
    deleteItem: deleteLocation,
    findItemByName: findLocationByName,
    rollbackActions,
    rollbackLabel: "location",
  });
  const resolveManufacturerId = createNameResolver({
    createItem: createManufacturer,
    deleteItem: deleteManufacturer,
    findItemByName: findManufacturerByName,
    rollbackActions,
    rollbackLabel: "manufacturer",
  });
  const resolveComputerModelId = createNameResolver({
    createItem: createComputerModel,
    deleteItem: deleteComputerModel,
    findItemByName: findComputerModelByName,
    rollbackActions,
    rollbackLabel: "computerModel",
  });
  const resolveMonitorModelId = createNameResolver({
    createItem: createMonitorModel,
    deleteItem: deleteMonitorModel,
    findItemByName: findMonitorModelByName,
    rollbackActions,
    rollbackLabel: "monitorModel",
  });
  const resolveUserId = createUserResolver({
    rollbackActions,
  });

  let importedCount = 0;
  let computerCount = 0;
  let monitorCount = 0;

  for (const [rowIndex, row] of file.rows.entries()) {
    try {
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

      const commonPayload = {
        location_id: await resolveLocationId(data.locationName),
        manufacturer_id: await resolveManufacturerId(data.manufacturerName),
        otherserial: inventoryNumber || undefined,
        status_id: await resolveStateId(data.statusLabel),
        user_id: await resolveUserId(data.userName),
      };

      if (normalizeKey(itemType) === "monitor") {
        const createdMonitor = await createMonitor({
          ...commonPayload,
          model_id: await resolveMonitorModelId(data.modelName),
          name,
        });
        rollbackActions.push({
          label: `monitor#${createdMonitor.id}`,
          run: () => deleteMonitor(createdMonitor.id),
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
        monitorCount += 1;
        continue;
      }

      const createdComputer = await createComputer({
        ...commonPayload,
        model_id: await resolveComputerModelId(data.modelName),
        name,
      });
      rollbackActions.push({
        label: `computer#${createdComputer.id}`,
        run: () => deleteGlpiResourceItem(getGlpiDataResource("computers"), createdComputer.id),
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
      computerCount += 1;
    } catch (caughtError) {
      throw new ImportRowError(rowIndex, caughtError);
    }
  }

  return {
    importedCount,
    resources: [
      {
        importedCount: computerCount,
        label: "Ordinateurs",
        resourceId: "computers",
        skippedCount: 0,
      },
      {
        importedCount: monitorCount,
        label: "Moniteurs",
        resourceId: "monitors",
        skippedCount: 0,
      },
    ].filter((item) => item.importedCount > 0),
  };
}

async function importEvalTicketsFile(
  file: RecognizedGlpiParsedFile,
  context: EvalImportContext,
  rollbackActions: RollbackAction[],
): Promise<ImportExecutionSummary> {
  let importedCount = 0;
  let ticketLinkCount = 0;

  for (const [rowIndex, row] of file.rows.entries()) {
    try {
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
        rollbackActions.push({
          label: `ticket#${ticketId}`,
          run: () => deleteGlpiResourceItem(getGlpiDataResource("tickets"), ticketId),
        });
      }

      if (ticketId !== null) {
        const items = parseItemsList(data.itemsRaw);

        for (const itemReference of items) {
          const linkedAsset = context.assetReferencesByKey.get(normalizeKey(itemReference));

          if (!linkedAsset) {
            continue;
          }

          const createdLink = await createTicketItemLink({
            itemId: linkedAsset.itemId,
            itemtype: linkedAsset.itemtype,
            ticketId,
          });
          const linkId = extractCreatedId(createdLink);

          if (linkId !== null) {
            rollbackActions.push({
              label: `ticketItemLink#${linkId}`,
              run: () => deleteTicketItemLink(linkId),
            });
          }

          ticketLinkCount += 1;
        }
      }

      importedCount += 1;
    } catch (caughtError) {
      throw new ImportRowError(rowIndex, caughtError);
    }
  }

  return {
    importedCount,
    resources: [
      {
        importedCount,
        label: "Tickets",
        resourceId: "tickets",
        skippedCount: 0,
      },
      {
        importedCount: ticketLinkCount,
        label: "Liaisons ticket / élément",
        resourceId: "ticket-links",
        skippedCount: 0,
      },
    ].filter((item) => item.importedCount > 0),
  };
}

async function importEvalTicketCostsFile(
  file: RecognizedGlpiParsedFile,
  context: EvalImportContext,
  rollbackActions: RollbackAction[],
): Promise<ImportExecutionSummary> {
  let importedCount = 0;

  for (const [rowIndex, row] of file.rows.entries()) {
    try {
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

      const createdTicketCost = await createTicketCost({
        input: {
          actiontime: Number(data.durationSecond ?? 0),
          cost_fixed: Number(data.fixedCost ?? 0),
          cost_time: Number(data.timeCost ?? 0),
          tickets_id: ticketId,
        },
      });
      const ticketCostId = extractCreatedId(createdTicketCost);

      if (ticketCostId !== null) {
        rollbackActions.push({
          label: `ticketCost#${ticketCostId}`,
          run: () => deleteTicketCost(ticketCostId),
        });
      }

      importedCount += 1;
    } catch (caughtError) {
      throw new ImportRowError(rowIndex, caughtError);
    }
  }

  return {
    importedCount,
    resources: [
      {
        importedCount,
        label: "Coûts de ticket",
        resourceId: "ticket-costs",
        skippedCount: 0,
      },
    ],
  };
}

async function importImageZipFiles(
  imageZipFiles: File[],
  importImages: boolean,
  context: EvalImportContext,
  rollbackActions: RollbackAction[],
): Promise<ImportExecutionSummary> {
  let importedCount = 0;
  let skippedCount = 0;
  const errors: ImportError[] = [];
  const files: ImportFileSummary[] = [];
  const warnings: ImportWarning[] = [];

  if (!importImages) {
    return {
      errors,
      files: imageZipFiles.map((file) => ({
        fileName: file.name,
        importedCount: 0,
        profileLabel: "Archive images / documents ignorée",
        resourceIds: ["images-zip"],
        skippedCount: 1,
      })),
      importedCount,
      resources: [
        {
          importedCount: 0,
          label: "Images ZIP ignorées",
          resourceId: "images-zip",
          skippedCount: imageZipFiles.length,
        },
      ],
      skippedCount: imageZipFiles.length,
    };
  }

  for (const imageZipFile of imageZipFiles) {
    try {
      const imageEntries = await extractGlpiImageFilesFromZip(imageZipFile);
      let fileImportedCount = 0;

      imageEntries.forEach((imageEntry) => {
        if (!imageEntry.wasRenamed || !imageEntry.originalFileName) {
          return;
        }

        warnings.push({
          details: `Le contenu réel détecté est ${getDetectedTypeLabel(imageEntry.detectedType ?? "")}, mais l'extension du fichier ne correspondait pas.`,
          fileName: imageEntry.originalFileName,
          message: `Image corrigée automatiquement : ${imageEntry.originalFileName} a été importée sous le nom ${imageEntry.fileName}.`,
          resourceId: "documents",
        });
      });

      for (const imageEntry of imageEntries) {
        const importedEntryCount = await importImageZipEntry(
          imageZipFile.name,
          imageEntry,
          context,
          rollbackActions,
        );
        importedCount += importedEntryCount;
        fileImportedCount += importedEntryCount;
        skippedCount += importedEntryCount === 0 ? 1 : 0;
      }

      files.push({
        fileName: imageZipFile.name,
        importedCount: fileImportedCount,
        profileLabel: "Archive images / documents",
        resourceIds: ["documents"],
        skippedCount: imageEntries.length - fileImportedCount,
      });
    } catch (caughtError) {
      errors.push({
        additionalMessages: getImportAdditionalMessages(caughtError),
        details: getImportErrorDetails(caughtError),
        fileName: imageZipFile.name,
        message: getImportErrorMessage(caughtError),
        resourceId: "documents",
        rowIndex: getImportRowIndex(caughtError),
        stage: "image-import",
      });
      throw caughtError;
    }
  }

  return {
    errors,
    files,
    importedCount,
    resources: [
      {
        importedCount,
        label: "Documents / images",
        resourceId: "documents",
        skippedCount,
      },
    ],
    skippedCount,
    warnings,
  };
}

async function importImageZipEntry(
  zipFileName: string,
  imageEntry: GlpiImageZipEntryUpload,
  context: EvalImportContext,
  rollbackActions: RollbackAction[],
) {
  const linkedAsset = context.assetReferencesByKey.get(normalizeKey(imageEntry.reference));

  if (!linkedAsset) {
    return 0;
  }

  const comment = imageEntry.wasRenamed && imageEntry.originalFileName
    ? `Import image zip: ${zipFileName}. Nom original: ${imageEntry.originalFileName}, corrigé en: ${imageEntry.fileName}.`
    : `Import image zip: ${zipFileName}`;

  const createdDocument = await createDocumentWithFile({
    comment,
    file: imageEntry.file,
    fileName: imageEntry.fileName,
    items_id: linkedAsset.itemId,
    itemtype: linkedAsset.itemtype,
    name: imageEntry.reference || imageEntry.fileName,
  });

  const documentId = extractCreatedId(createdDocument);

  if (documentId === null) {
    throw new Error(
      `Échec de l'import de l'image ${imageEntry.fileName}: document GLPI invalide.`,
    );
  }

  rollbackActions.push({
    label: `document#${documentId}`,
    run: () => deleteDocument(documentId),
  });

  return 1;
}

async function importRecognizedFile(
  file: RecognizedGlpiParsedFile,
  context: EvalImportContext,
  rollbackActions: RollbackAction[],
): Promise<ImportExecutionSummary> {
  if (file.profile.id === EVAL_ASSETS_PROFILE_ID) {
    return importEvalAssetsFile(file, context, rollbackActions);
  }

  if (file.profile.id === EVAL_TICKETS_PROFILE_ID) {
    return importEvalTicketsFile(file, context, rollbackActions);
  }

  if (file.profile.id === EVAL_TICKET_COSTS_PROFILE_ID) {
    return importEvalTicketCostsFile(file, context, rollbackActions);
  }

  let importedCount = 0;
  const resourceCountById = new Map<string, number>();

  for (const item of getResourcePayloads(file)) {
    const resource = getGlpiDataResource(item.resourceId);
    const createdItem = await createGlpiResourceItem(resource, item.payload);
    const createdId = extractCreatedId(createdItem);

    if (createdId !== null) {
      rollbackActions.push({
        label: `${item.resourceId}#${createdId}`,
        run: () => deleteGlpiResourceItem(resource, createdId),
      });
    }
    importedCount += 1;
    resourceCountById.set(item.resourceId, (resourceCountById.get(item.resourceId) ?? 0) + 1);
  }

  return {
    importedCount,
    resources: [...resourceCountById.entries()].map(([resourceId, count]) => ({
      importedCount: count,
      label: getGlpiDataResource(resourceId as GlpiDataResourceId).label,
      resourceId,
      skippedCount: 0,
    })),
  };
}

async function rollbackImport(rollbackActions: RollbackAction[]) {
  const rollbackErrors: string[] = [];

  for (const action of [...rollbackActions].reverse()) {
    try {
      await action.run();
    } catch (caughtError) {
      rollbackErrors.push(
        `${action.label}: ${getImportErrorMessage(caughtError)}`,
      );
    }
  }

  return rollbackErrors;
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
    const fileSummaries: ImportFileSummary[] = [];
    const resourceSummaryMap = new Map<string, ImportResourceSummary>();
    const warnings: ImportWarning[] = [];
    const context: EvalImportContext = {
      assetReferencesByKey: new Map(),
      ticketIdsByRef: new Map(),
    };
    const rollbackActions: RollbackAction[] = [];
    const resetResourceIds = collectImportResetResourceIds({
      imageZipFiles,
      recognizedFiles,
    });

    try {
      for (const file of recognizedFiles) {
        try {
          const fileImportResult = await importRecognizedFile(file, context, rollbackActions);
          importedCount += fileImportResult.importedCount;
          fileSummaries.push(
            ...(fileImportResult.files ?? [{
              fileName: file.fileName,
              importedCount: fileImportResult.importedCount,
              profileLabel: file.profile.label,
              resourceIds: fileImportResult.resources.map((item) => item.resourceId),
              skippedCount: file.invalidRows.length,
            }]),
          );
          fileImportResult.resources.forEach((item) => {
            const current = resourceSummaryMap.get(item.resourceId);

            if (current) {
              current.importedCount += item.importedCount;
              current.skippedCount += item.skippedCount;
              return;
            }

            resourceSummaryMap.set(item.resourceId, { ...item });
          });
        } catch (caughtError) {
          const rowIndex = getImportRowIndex(caughtError);

          errors.push({
            additionalMessages: getImportAdditionalMessages(caughtError),
            details: getImportErrorDetails(caughtError),
            fileName: file.fileName,
            message: getImportErrorMessage(caughtError),
            profileLabel: file.profile.label,
            rawRow: stringifyImportRow(
              rowIndex !== undefined ? file.rawRows[rowIndex] : undefined,
            ),
            resourceId: file.profile.id === EVAL_ASSETS_PROFILE_ID
              ? "computers"
              : file.profile.id === EVAL_TICKETS_PROFILE_ID
                ? "tickets"
                : file.profile.id === EVAL_TICKET_COSTS_PROFILE_ID
                  ? "ticket-costs"
                  : undefined,
            rowIndex,
            stage:
              file.profile.id === EVAL_ASSETS_PROFILE_ID
                ? "resource-create"
                : file.profile.id === EVAL_TICKETS_PROFILE_ID
                  ? "ticket-link"
                  : file.profile.id === EVAL_TICKET_COSTS_PROFILE_ID
                    ? "ticket-cost"
                    : "resource-create",
          });
          throw caughtError;
        }
        skippedCount += file.invalidRows.length;
      }

      const imageImportResult = await importImageZipFiles(
        imageZipFiles,
        importImages,
        context,
        rollbackActions,
      );

      importedCount += imageImportResult.importedCount;
      skippedCount += imageImportResult.skippedCount ?? 0;
      errors.push(...(imageImportResult.errors ?? []));
      fileSummaries.push(...(imageImportResult.files ?? []));
      warnings.push(...(imageImportResult.warnings ?? []));
      imageImportResult.resources.forEach((item) => {
        const current = resourceSummaryMap.get(item.resourceId);

        if (current) {
          current.importedCount += item.importedCount;
          current.skippedCount += item.skippedCount;
          return;
        }

        resourceSummaryMap.set(item.resourceId, { ...item });
      });
    } catch (caughtError) {
      const rollbackErrors = await rollbackImport(rollbackActions);
      const resetResult = resetResourceIds.length > 0
        ? await resetGlpiResources({
            resourceIds: resetResourceIds,
          })
        : null;
      importedCount = 0;

      const baseMessage = getImportErrorMessage(caughtError);
      const rollbackMessage =
        rollbackErrors.length > 0
          ? ` Rollback partiel en erreur: ${rollbackErrors.join(" | ")}`
          : " Rollback exécuté.";
      const resetMessage = resetResult
        ? ` Réinitialisation appelée: ${resetResult.totalDeleted} suppression(s), ${resetResult.totalFailed} erreur(s).`
        : "";

      errors.push({
        additionalMessages: getImportAdditionalMessages(caughtError),
        details: [
          getImportErrorDetails(caughtError),
          rollbackErrors.length > 0
            ? `Erreurs de rollback:\n${rollbackErrors.join("\n")}`
            : "Rollback exécuté sans erreur supplémentaire.",
          resetResult
            ? [
                "Réinitialisation automatique déclenchée.",
                `Suppressions: ${resetResult.totalDeleted}`,
                `Erreurs: ${resetResult.totalFailed}`,
                ...resetResult.resources.flatMap((resource) =>
                  resource.errors.map((rowError) =>
                    `${resource.resourceId}#${rowError.id}: ${rowError.message}`,
                  ),
                ),
              ].join("\n")
            : undefined,
        ].join("\n\n"),
        fileName: "import",
        message: `${baseMessage}${rollbackMessage}${resetMessage}`,
        resourceId: "rollback",
        rollback: true,
        rowIndex: getImportRowIndex(caughtError),
        stage: "rollback",
      });
      setError(`${baseMessage}${rollbackMessage}${resetMessage}`);
    } finally {
      setResult({
        errors,
        failedCount: errors.length,
        files: fileSummaries,
        importedCount,
        resources: [...resourceSummaryMap.values()],
        skippedCount,
        warnings,
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
