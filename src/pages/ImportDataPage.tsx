import { useState, type ChangeEvent } from "react";
import { FileArchive, FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "../shared/ui/Button";
import { Error as ErrorMessage } from "../shared/ui/Error";
import { Success } from "../shared/ui/Succcess";
import { BUILT_IN_GLPI_IMPORT_PROFILES } from "../features/glpi-data/model/builtInGlpiImportProfiles";
import { parseCsvWithDetectedGlpiProfile } from "../features/glpi-data/lib/parseCsvWithDetectedGlpiProfile";
import { parseGlpiImagesZip } from "../features/glpi-data/lib/parseGlpiImagesZip";
import { useImportGlpiCsv } from "../features/glpi-data/hooks/useImportGlpiCsv";
import type {
  GlpiImageZipEntryPreview,
  ParsedGlpiImportAsset,
  ParsedGlpiImportFile,
  ParsedGlpiImagesZipFile,
  RecognizedGlpiParsedFile,
  UnknownGlpiParsedFile,
} from "../features/glpi-data/model/glpiImportProfile.types";

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

async function parseSelectedFile(file: File): Promise<ParsedGlpiImportFile | ParsedGlpiImagesZipFile> {
  if (file.name.toLowerCase().endsWith(".zip")) {
    const entries: GlpiImageZipEntryPreview[] = await parseGlpiImagesZip(file);

    return {
      entries,
      fileName: file.name,
      status: "image-zip",
    };
  }

  return parseCsvWithDetectedGlpiProfile(file, BUILT_IN_GLPI_IMPORT_PROFILES);
}

export function ImportDataPage() {
  const [selectedFilesBySlot, setSelectedFilesBySlot] = useState<Partial<Record<ImportFileSlotId, File>>>({});
  const [parsedFiles, setParsedFiles] = useState<ParsedGlpiImportAsset[]>([]);
  const [parseErrors, setParseErrors] = useState<FileParseError[]>([]);
  const [importImages, setImportImages] = useState(true);
  const { error, importFiles, isImporting, result } = useImportGlpiCsv();

  async function handleFileSlotChange(slotId: ImportFileSlotId, event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    const previousFileName = selectedFilesBySlot[slotId]?.name;

    if (!file) {
      setSelectedFilesBySlot((current) => {
        const next = { ...current };
        delete next[slotId];
        return next;
      });
      setParsedFiles((current) => current.filter((parsedFile) => parsedFile.fileName !== previousFileName));
      setParseErrors((current) => current.filter((parseError) => parseError.fileName !== previousFileName));
      return;
    }

    setSelectedFilesBySlot((current) => ({
      ...current,
      [slotId]: file,
    }));
    setParseErrors((current) =>
      current.filter(
        (parseError) =>
          parseError.fileName !== previousFileName &&
          parseError.fileName !== file.name,
      ),
    );

    try {
      const parsedFile = await parseSelectedFile(file);

      setParsedFiles((current) => {
        const filteredFiles = current.filter(
          (currentParsedFile) =>
            currentParsedFile.fileName !== previousFileName &&
            currentParsedFile.fileName !== file.name,
        );

        return [...filteredFiles, parsedFile];
      });
    } catch (caughtError) {
      setParsedFiles((current) =>
        current.filter(
          (currentParsedFile) =>
            currentParsedFile.fileName !== previousFileName &&
            currentParsedFile.fileName !== file.name,
        ),
      );
      setParseErrors((current) => [
        ...current.filter((parseError) => parseError.fileName !== file.name),
        {
          fileName: file.name,
          message: caughtError instanceof Error ? caughtError.message : String(caughtError),
        },
      ]);
    }
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

        {result && result.importedCount > 0 && (
          <Success>
            {result.importedCount} element(s) importe(s), {result.failedCount} echec(s), {result.skippedCount} ignore(s).
          </Success>
        )}

        {parsedFiles.length === 0 && parseErrors.length === 0 && (
          <div className="rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Aucun fichier selectionne.
            </p>
          </div>
        )}

        {parsedFiles.map((file, fileIndex) => {
          if (isImagesZipFile(file)) {
            return (
              <section key={`${file.fileName}-${fileIndex}`} className="rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
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
              <section key={`${file.fileName}-${fileIndex}`} className="rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{file.fileName}</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{file.reason ?? "Profil non reconnu."}</p>
              </section>
            );
          }

          return (
            <section key={`${file.fileName}-${fileIndex}`} className="rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
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
      </section>
    </>
  );
}
