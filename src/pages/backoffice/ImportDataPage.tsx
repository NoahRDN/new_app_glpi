import { useMemo, useState, type ChangeEvent } from "react";
import { FileArchive, FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "../../shared/ui/Button";
import { MyError as ErrorMessage } from "../../shared/ui/MyError";
import { Success } from "../../shared/ui/Succcess";
import { BUILT_IN_GLPI_IMPORT_PROFILES } from "../../features/backoffice/glpi-data/model/builtInGlpiImportProfiles";
import { parseCsvWithGlpiProfile } from "../../features/backoffice/glpi-data/lib/parseCsvWithGlpiProfile";
import { parseGlpiImagesZip } from "../../features/backoffice/glpi-data/lib/parseGlpiImagesZip";
import { detectMatchingGlpiImportProfiles } from "../../features/backoffice/glpi-data/lib/detectGlpiImportProfile";
import { parseCsvRaw } from "../../features/backoffice/glpi-data/lib/parseCsvRaw";
import { useImportGlpiCsv } from "../../features/backoffice/glpi-data/hooks/useImportGlpiCsv";
import type {
  GlpiImageZipEntryPreview,
  GlpiImportProfile,
  ParsedGlpiImportAsset,
  ParsedGlpiImagesZipFile,
  RecognizedGlpiParsedFile,
  UnknownGlpiParsedFile,
} from "../../features/backoffice/glpi-data/model/glpiImportProfile.types";

type FileParseError = {
  fileName: string;
  message: string;
};

type ImportFileSlotId = "csv1" | "csv2" | "csv3" | "imagesZip";

type ImportFileSlot = {
  accept: string;
  id: ImportFileSlotId;
  label: string;
};

type CsvImportFileSlotId = Exclude<ImportFileSlotId, "imagesZip">;

const IMPORT_FILE_SLOTS: ImportFileSlot[] = [
  {
    accept: ".csv,text/csv",
    id: "csv1",
    label: "Fichier CSV 1",
  },
  {
    accept: ".csv,text/csv",
    id: "csv2",
    label: "Fichier CSV 2",
  },
  {
    accept: ".csv,text/csv",
    id: "csv3",
    label: "Fichier CSV 3",
  },
  {
    accept: ".zip,application/zip",
    id: "imagesZip",
    label: "Images ZIP",
  },
];

function isRecognizedFile(file: ParsedGlpiImportAsset): file is RecognizedGlpiParsedFile {
  return file.status === "recognized";
}

function isUnknownFile(file: ParsedGlpiImportAsset): file is UnknownGlpiParsedFile {
  return file.status === "unknown";
}

function isImagesZipFile(file: ParsedGlpiImportAsset): file is ParsedGlpiImagesZipFile {
  return file.status === "image-zip";
}

function getProfileImportOrder(file: RecognizedGlpiParsedFile) {
  return file.profile.importOrder ?? 1000;
}

function sortRecognizedFilesByProfileOrder(files: RecognizedGlpiParsedFile[]) {
  return [...files].sort((leftFile, rightFile) => {
    const importOrderDifference = getProfileImportOrder(leftFile) - getProfileImportOrder(rightFile);

    if (importOrderDifference !== 0) {
      return importOrderDifference;
    }

    const profileLabelDifference = leftFile.profile.label.localeCompare(rightFile.profile.label);

    if (profileLabelDifference !== 0) {
      return profileLabelDifference;
    }

    return leftFile.fileName.localeCompare(rightFile.fileName);
  });
}

function isCsvSlotId(slotId: ImportFileSlotId): slotId is CsvImportFileSlotId {
  return slotId !== "imagesZip";
}

function getProfileById(profileId: string) {
  return BUILT_IN_GLPI_IMPORT_PROFILES.find((profile) => profile.id === profileId) ?? null;
}

function getImportStageLabel(stage: string) {
  switch (stage) {
    case "profile-parse":
      return "Analyse du profil";
    case "resource-create":
      return "Création ressource";
    case "ticket-link":
      return "Liaison ticket / asset";
    case "ticket-cost":
      return "Création coût ticket";
    case "image-import":
      return "Import image / document";
    case "rollback":
      return "Rollback / réinitialisation";
    default:
      return stage;
  }
}

export function ImportDataPage() {
  const [selectedFilesBySlot, setSelectedFilesBySlot] = useState<Partial<Record<ImportFileSlotId, File>>>({});
  const [selectedProfileIdsBySlot, setSelectedProfileIdsBySlot] = useState<Partial<Record<CsvImportFileSlotId, string[]>>>({});
  const [compatibleProfilesBySlot, setCompatibleProfilesBySlot] = useState<Partial<Record<CsvImportFileSlotId, GlpiImportProfile[]>>>({});
  const [parsedFilesBySlot, setParsedFilesBySlot] = useState<Partial<Record<ImportFileSlotId, ParsedGlpiImportAsset[]>>>({});
  const [parseErrorsBySlot, setParseErrorsBySlot] = useState<Partial<Record<ImportFileSlotId, FileParseError>>>({});
  const [importImages, setImportImages] = useState(true);
  const { error, importFiles, isImporting, result } = useImportGlpiCsv();

  const parsedFiles = useMemo(
    () =>
      Object.values(parsedFilesBySlot).flatMap((slotFiles) =>
        (slotFiles ?? []).filter((parsedFile): parsedFile is ParsedGlpiImportAsset => Boolean(parsedFile)),
      ),
    [parsedFilesBySlot],
  );
  const parseErrors = useMemo(
    () => Object.values(parseErrorsBySlot).filter((parseError): parseError is FileParseError => Boolean(parseError)),
    [parseErrorsBySlot],
  );

  function clearSlotFeedback(slotId: ImportFileSlotId) {
    setParseErrorsBySlot((current) => {
      const next = { ...current };
      delete next[slotId];
      return next;
    });
  }

  async function parseAndStoreFile(slotId: ImportFileSlotId, file: File, nextSelectedProfileIds?: string[]) {
    clearSlotFeedback(slotId);

    if (!isCsvSlotId(slotId)) {
      try {
        const entries: GlpiImageZipEntryPreview[] = await parseGlpiImagesZip(file);
        const parsedFile: ParsedGlpiImagesZipFile = {
          entries,
          fileName: file.name,
          status: "image-zip",
        };

        setParsedFilesBySlot((current) => ({
          ...current,
          [slotId]: [parsedFile],
        }));
      } catch (caughtError) {
        setParsedFilesBySlot((current) => {
          const next = { ...current };
          delete next[slotId];
          return next;
        });
        setParseErrorsBySlot((current) => ({
          ...current,
          [slotId]: {
            fileName: file.name,
            message: caughtError instanceof Error ? caughtError.message : String(caughtError),
          },
        }));
      }
      return;
    }

    try {
      const rawFile = await parseCsvRaw(file);
      const compatibleProfiles = detectMatchingGlpiImportProfiles(
        rawFile.headers,
        BUILT_IN_GLPI_IMPORT_PROFILES,
      );

      setCompatibleProfilesBySlot((current) => ({
        ...current,
        [slotId]: compatibleProfiles,
      }));

      if (compatibleProfiles.length === 0) {
        setSelectedProfileIdsBySlot((current) => {
          const next = { ...current };
          delete next[slotId];
          return next;
        });
        setParsedFilesBySlot((current) => ({
          ...current,
          [slotId]: [
            {
              fileName: rawFile.fileName,
              headers: rawFile.headers,
              rawRows: rawFile.rows,
              reason: [
                "Nom de colonne non conforme a un profil d'import GLPI.",
                `Colonnes detectees: ${rawFile.headers.join(" ; ") || "<aucune>"}`,
              ].join(" "),
              status: "unknown",
            },
          ],
        }));
        return;
      }

      const selectedProfileIds =
        nextSelectedProfileIds?.filter((profileId) =>
          compatibleProfiles.some((profile) => profile.id === profileId),
        ) ??
        selectedProfileIdsBySlot[slotId]?.filter((profileId) =>
          compatibleProfiles.some((profile) => profile.id === profileId),
        ) ??
        [];

      const effectiveSelectedProfileIds =
        selectedProfileIds.length > 0 ? selectedProfileIds : [compatibleProfiles[0].id];

      setSelectedProfileIdsBySlot((current) => ({
        ...current,
        [slotId]: effectiveSelectedProfileIds,
      }));

      const parsedFilesForSlot = await Promise.all(
        effectiveSelectedProfileIds.map(async (profileId) => {
          const profile = getProfileById(profileId);

          if (!profile) {
            return null;
          }

          return parseCsvWithGlpiProfile(file, profile);
        }),
      );

      setParsedFilesBySlot((current) => ({
        ...current,
        [slotId]: parsedFilesForSlot.filter(
          (parsedFile): parsedFile is RecognizedGlpiParsedFile | UnknownGlpiParsedFile =>
            Boolean(parsedFile),
        ),
      }));
    } catch (caughtError) {
      setParsedFilesBySlot((current) => {
        const next = { ...current };
        delete next[slotId];
        return next;
      });
      setParseErrorsBySlot((current) => ({
        ...current,
        [slotId]: {
          fileName: file.name,
          message: caughtError instanceof Error ? caughtError.message : String(caughtError),
        },
      }));
    }
  }

  async function handleFileSlotChange(slotId: ImportFileSlotId, event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;

    if (!file) {
      setSelectedFilesBySlot((current) => {
        const next = { ...current };
        delete next[slotId];
        return next;
      });
      if (isCsvSlotId(slotId)) {
        setSelectedProfileIdsBySlot((current) => {
          const next = { ...current };
          delete next[slotId];
          return next;
        });
        setCompatibleProfilesBySlot((current) => {
          const next = { ...current };
          delete next[slotId];
          return next;
        });
      }
      setParsedFilesBySlot((current) => {
        const next = { ...current };
        delete next[slotId];
        return next;
      });
      setParseErrorsBySlot((current) => {
        const next = { ...current };
        delete next[slotId];
        return next;
      });
      return;
    }

    setSelectedFilesBySlot((current) => ({
      ...current,
      [slotId]: file,
    }));

    await parseAndStoreFile(slotId, file);
  }

  async function handleProfileCheckedChange(
    slotId: CsvImportFileSlotId,
    profileId: string,
    checked: boolean,
  ) {
    const currentFile = selectedFilesBySlot[slotId];
    const currentSelection = selectedProfileIdsBySlot[slotId] ?? [];
    const nextSelectedProfileIds = checked
      ? [...new Set([...currentSelection, profileId])]
      : currentSelection.filter((currentProfileId) => currentProfileId !== profileId);

    if (!currentFile) {
      setSelectedProfileIdsBySlot((current) => ({
        ...current,
        [slotId]: nextSelectedProfileIds,
      }));
      return;
    }

    if (nextSelectedProfileIds.length === 0) {
      setSelectedProfileIdsBySlot((current) => ({
        ...current,
        [slotId]: [],
      }));
      setParsedFilesBySlot((current) => {
        const next = { ...current };
        delete next[slotId];
        return next;
      });
      clearSlotFeedback(slotId);
      return;
    }

    await parseAndStoreFile(slotId, currentFile, nextSelectedProfileIds);
  }

  async function handleImport() {
    const recognizedFiles = sortRecognizedFilesByProfileOrder(parsedFiles.filter(isRecognizedFile));
    const imageZipFileNames = new Set(parsedFiles.filter(isImagesZipFile).map((file) => file.fileName));
    const selectedFiles = Object.values(selectedFilesBySlot).filter((file): file is File => Boolean(file));
    const imageZipFiles = selectedFiles.filter(
      (file) =>
        file.name.toLowerCase().endsWith(".zip") &&
        imageZipFileNames.has(file.name),
    );

    if (recognizedFiles.length === 0 && imageZipFiles.length === 0) {
      return;
    }

    await importFiles({
      imageZipFiles,
      importImages,
      recognizedFiles,
    });
  }

  const canImport = parsedFiles.some((file) => isRecognizedFile(file) || isImagesZipFile(file));

  return (
    <>
      <section className="col-span-12">
        <div className="flex items-center justify-between gap-4 rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-secondary)" }}>
              Import data
            </p>
            <h2 className="mt-2 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Import CSV par profils GLPI
            </h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-(--panel-soft)">
            <FileSpreadsheet size={20} />
          </div>
        </div>
      </section>

      <section className="col-span-12 rounded-[18px] border p-6 xl:col-span-4" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
        <div className="space-y-5">
          {IMPORT_FILE_SLOTS.map((slot) => (
            <div key={slot.id}>
              <label className="text-sm font-semibold" htmlFor={`import-file-${slot.id}`} style={{ color: "var(--text-primary)" }}>
                {slot.label}
              </label>
              {(() => {
                if (!isCsvSlotId(slot.id)) {
                  return null;
                }

                const csvSlotId = slot.id;
                const compatibleProfiles = compatibleProfilesBySlot[csvSlotId] ?? [];

                if (compatibleProfiles.length <= 1) {
                  return null;
                }

                return (
                  <div
                    className="mt-2 space-y-2 rounded-[12px] border px-4 py-3"
                    style={{ backgroundColor: "var(--panel-soft)", borderColor: "var(--panel-border)" }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                      Profils compatibles
                    </p>
                    {compatibleProfiles.map((profile) => (
                      <label key={profile.id} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-primary)" }}>
                        <input
                          checked={(selectedProfileIdsBySlot[csvSlotId] ?? []).includes(profile.id)}
                          className="h-4 w-4 accent-(--accent-blue)"
                          type="checkbox"
                          onChange={(event) =>
                            handleProfileCheckedChange(csvSlotId, profile.id, event.target.checked)
                          }
                        />
                        <span>{profile.label}</span>
                      </label>
                    ))}
                  </div>
                );
              })()}
              <input
                accept={slot.accept}
                className="mt-2 block w-full rounded-[12px] border px-4 py-3 text-sm outline-none"
                id={`import-file-${slot.id}`}
                style={{ backgroundColor: "var(--panel-soft)", borderColor: "var(--panel-border)", color: "var(--text-primary)" }}
                type="file"
                onChange={(event) => handleFileSlotChange(slot.id, event)}
              />
            </div>
          ))}
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-[12px] p-4" style={{ backgroundColor: "var(--panel-soft)" }}>
          <input
            checked={importImages}
            className="h-4 w-4 accent-(--accent-blue)"
            type="checkbox"
            onChange={(event) => setImportImages(event.target.checked)}
          />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Importer les images ZIP
          </span>
        </label>

        <Button otherClassName="mt-5" disabled={!canImport || isImporting} onClick={handleImport}>
          <Upload size={18} />
          {isImporting ? "Import en cours..." : "Importer les fichiers"}
        </Button>
      </section>

      <section className="col-span-12 space-y-5 xl:col-span-8">
        {parseErrors.map((parseError) => (
          <ErrorMessage key={parseError.fileName}>
            {parseError.fileName}: {parseError.message}
          </ErrorMessage>
        ))}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <>
            {result.failedCount === 0 ? (
              <Success>
                Import termine: {result.importedCount} element(s) importe(s), {result.failedCount} echec(s), {result.skippedCount} ignore(s).
              </Success>
            ) : (
              <ErrorMessage>
                Import termine avec erreur(s): {result.importedCount} element(s) importe(s), {result.failedCount} echec(s), {result.skippedCount} ignore(s).
              </ErrorMessage>
            )}

            {(result.resources.length > 0 || result.files.length > 0) && (
              <section
                className="rounded-[18px] border p-6"
                style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}
              >
                <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Détail de l'import
                </h3>

                {result.resources.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                      Par ressource
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {result.resources.map((item) => (
                        <article
                          key={item.resourceId}
                          className="rounded-[16px] border p-4"
                          style={{ backgroundColor: "var(--panel-soft)", borderColor: "var(--panel-border)" }}
                        >
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                            {item.importedCount} importé(s) | {item.skippedCount} ignoré(s)
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {result.files.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                      Par fichier
                    </p>
                    <div className="mt-3 space-y-3">
                      {result.files.map((item) => (
                        <article
                          key={`${item.fileName}-${item.profileLabel ?? "no-profile"}`}
                          className="rounded-[16px] border p-4"
                          style={{ backgroundColor: "var(--panel-soft)", borderColor: "var(--panel-border)" }}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                {item.fileName}
                              </p>
                              {item.profileLabel ? (
                                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                                  Profil: {item.profileLabel}
                                </p>
                              ) : null}
                            </div>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                              {item.importedCount} importé(s) | {item.skippedCount} ignoré(s)
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {result.warnings.length > 0 && (
              <section
                className="rounded-[18px] border p-6"
                style={{
                  backgroundColor: "color-mix(in srgb, #f59e0b 10%, var(--panel-bg))",
                  borderColor: "color-mix(in srgb, #f59e0b 35%, var(--panel-border))",
                }}
              >
                <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Avertissements d'import
                </h3>

                <div className="mt-4 space-y-4">
                  {result.warnings.map((item, index) => (
                    <article
                      key={`${item.fileName}-${item.resourceId}-${index}`}
                      className="rounded-[16px] border p-4"
                      style={{
                        backgroundColor: "color-mix(in srgb, #f59e0b 8%, var(--panel-soft))",
                        borderColor: "color-mix(in srgb, #f59e0b 25%, var(--panel-border))",
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className="rounded-[10px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                          style={{
                            backgroundColor: "color-mix(in srgb, #f59e0b 18%, transparent)",
                            color: "var(--text-primary)",
                          }}
                        >
                          Correction automatique
                        </span>
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {item.fileName}
                        </span>
                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          Ressource: {item.resourceId}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {item.message}
                      </p>

                      {item.details ? (
                        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                          {item.details}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {result.errors.length > 0 && (
              <section
                className="rounded-[18px] border p-6"
                style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}
              >
                <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Détail des erreurs d'import
                </h3>

                <div className="mt-4 space-y-4">
                  {result.errors.map((item, index) => (
                    <article
                      key={`${item.fileName}-${item.stage}-${index}`}
                      className="rounded-[16px] border p-4"
                      style={{ backgroundColor: "var(--panel-soft)", borderColor: "var(--panel-border)" }}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-[10px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]" style={{ backgroundColor: "color-mix(in srgb, #ef4444 14%, transparent)", color: "var(--text-primary)" }}>
                          {getImportStageLabel(item.stage)}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {item.fileName}
                        </span>
                        {item.profileLabel ? (
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            Profil: {item.profileLabel}
                          </span>
                        ) : null}
                        {item.resourceId ? (
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            Ressource: {item.resourceId}
                          </span>
                        ) : null}
                        {item.rowIndex !== undefined ? (
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            Ligne: {item.rowIndex + 2}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {item.message}
                      </p>

                      {item.details ? (
                        <pre
                          className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[12px] p-3 text-xs"
                          style={{ backgroundColor: "color-mix(in srgb, var(--panel-bg) 75%, black 6%)", color: "var(--text-secondary)" }}
                        >
                          {item.details}
                        </pre>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {parsedFiles.length === 0 && parseErrors.length === 0 && (
          <div className="rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Aucun fichier selectionne.
            </p>
          </div>
        )}

        {IMPORT_FILE_SLOTS.map((slot) => {
          const slotFiles = parsedFilesBySlot[slot.id];

          if (!slotFiles || slotFiles.length === 0) {
            return null;
          }

          return (
            <div key={slot.id} className="space-y-5">
              {slotFiles.map((file, fileIndex) => {
                if (isImagesZipFile(file)) {
                  return (
                    <section key={`${slot.id}-${fileIndex}`} className="rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
                      <div className="flex items-center gap-3">
                        <FileArchive size={20} />
                        <div>
                          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{file.fileName}</h3>
                          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{file.entries.length} image(s) reconnue(s)</p>
                        </div>
                      </div>

                      {file.entries.length > 0 && (
                        <div className="mt-5 overflow-x-auto rounded-[12px]" style={{ backgroundColor: "var(--panel-soft)" }}>
                          <table className="min-w-full">
                            <thead>
                              <tr className="text-left text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                                <th className="px-4 py-4">Fichier</th>
                                <th className="px-4 py-4">Reference detectee</th>
                              </tr>
                            </thead>
                            <tbody>
                              {file.entries.slice(0, 10).map((entry) => (
                                <tr key={`${file.fileName}-${entry.fileName}`} className="border-t" style={{ borderColor: "var(--panel-border)" }}>
                                  <td className="px-4 py-3">{entry.fileName}</td>
                                  <td className="px-4 py-3">{entry.reference}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </section>
                  );
                }

                if (isUnknownFile(file)) {
                  return (
                    <section key={`${slot.id}-${fileIndex}`} className="rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
                      <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{file.fileName}</h3>
                      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{file.reason ?? "Profil non reconnu."}</p>
                    </section>
                  );
                }

                return (
                  <section key={`${slot.id}-${fileIndex}`} className="rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{file.fileName}</h3>
                        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Profil reconnu: {file.profile.label}</p>
                      </div>
                      <div className="rounded-[12px] px-3 py-2 text-sm font-semibold" style={{ backgroundColor: "var(--panel-soft)", color: "var(--text-primary)" }}>
                        Ordre {file.profile.importOrder ?? 1000}
                      </div>
                    </div>

                    <div className="mt-5 overflow-x-auto rounded-[12px]" style={{ backgroundColor: "var(--panel-soft)" }}>
                      <table className="min-w-full">
                        <thead>
                          <tr className="text-left text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                            {file.profile.previewColumns.map((column) => (
                              <th key={`${column.resource}-${column.field}`} className="px-4 py-4">{column.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {file.rows.slice(0, 10).map((row, rowIndex) => (
                            <tr key={`${file.fileName}-${rowIndex}`} className="border-t" style={{ borderColor: "var(--panel-border)" }}>
                              {file.profile.previewColumns.map((column) => {
                                const resource = row[column.resource];
                                const value = resource?.[column.field];

                                return (
                                  <td key={`${column.resource}-${column.field}`} className="px-4 py-3">
                                    {String(value ?? "")}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {file.invalidRows.length > 0 && (
                      <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {file.invalidRows.slice(0, 6).map((invalidRow) => (
                          <li key={invalidRow.rowIndex}>
                            Ligne {invalidRow.rowIndex + 2}: {invalidRow.reasons.join(", ")}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          );
        })}
      </section>
    </>
  );
}
