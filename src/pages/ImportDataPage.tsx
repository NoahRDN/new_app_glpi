import { useState, type ChangeEvent } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "../shared/ui/Button";
import { Error as ErrorMessage } from "../shared/ui/Error";
import { Success } from "../shared/ui/Succcess";
import { useImportGlpiCsv } from "../features/glpi-data/hooks/useImportGlpiCsv";
import { parseGlpiCsv } from "../features/glpi-data/lib/parseGlpiCsv";
import {
  GLPI_DATA_RESOURCES,
  getGlpiDataResource,
  type GlpiDataResourceId,
} from "../features/glpi-data/model/glpiDataResource.config";
import type { ParsedGlpiImportPreview } from "../features/glpi-data/model/glpiDataImport.types";

export function ImportDataPage() {
  const [resourceId, setResourceId] = useState<GlpiDataResourceId>("users");
  const [parseError, setParseError] = useState("");
  const [preview, setPreview] = useState<ParsedGlpiImportPreview | null>(null);
  const { error, importPreview, isImporting, result } = useImportGlpiCsv();
  const selectedResource = getGlpiDataResource(resourceId);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;

    if (!file) {
      setPreview(null);
      setParseError("");
      return;
    }

    try {
      const nextPreview = await parseGlpiCsv(file, selectedResource);
      setPreview(nextPreview);
      setParseError("");
    } catch (caughtError) {
      setPreview(null);
      setParseError(caughtError instanceof Error ? caughtError.message : String(caughtError));
    }
  }

  async function handleImport() {
    if (!preview) {
      return;
    }

    await importPreview(preview);
  }

  return (
    <>
      <section className="col-span-12">
        <div className="flex items-center justify-between gap-4 rounded-[18px] border p-6" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-secondary)" }}>
              Import data
            </p>
            <h2 className="mt-2 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Import CSV GLPI
            </h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-(--panel-soft)">
            <FileSpreadsheet size={20} />
          </div>
        </div>
      </section>

      <section className="col-span-12 rounded-[18px] border p-6 xl:col-span-4" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
        <label className="text-sm font-semibold" htmlFor="import-resource" style={{ color: "var(--text-primary)" }}>
          Ressource
        </label>
        <select
          id="import-resource"
          className="mt-3 w-full rounded-[12px] border px-4 py-3 outline-none"
          style={{ backgroundColor: "var(--panel-soft)", borderColor: "var(--panel-border)", color: "var(--text-primary)" }}
          value={resourceId}
          onChange={(event) => {
            setResourceId(event.target.value as GlpiDataResourceId);
            setPreview(null);
            setParseError("");
          }}
        >
          {GLPI_DATA_RESOURCES.map((resource) => (
            <option key={resource.id} value={resource.id}>
              {resource.label}
            </option>
          ))}
        </select>

        <div className="mt-5 rounded-[12px] p-4" style={{ backgroundColor: "var(--panel-soft)" }}>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{selectedResource.description}</p>
          <p className="mt-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Colonnes obligatoires
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            {selectedResource.requiredColumns.join(", ")}
          </p>
          {selectedResource.optionalColumns.length > 0 && (
            <>
              <p className="mt-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Colonnes optionnelles
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {selectedResource.optionalColumns.join(", ")}
              </p>
            </>
          )}
        </div>

        <div className="mt-5">
          <input
            accept=".csv,text/csv"
            className="block w-full rounded-[12px] border px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "var(--panel-soft)", borderColor: "var(--panel-border)", color: "var(--text-primary)" }}
            type="file"
            onChange={handleFileChange}
          />
        </div>

        <Button otherClassName="mt-5" disabled={!preview || isImporting} onClick={handleImport}>
          <Upload size={18} />
          {isImporting ? "Import en cours..." : "Importer"}
        </Button>
      </section>

      <section className="col-span-12 rounded-[18px] border p-6 xl:col-span-8" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
        {parseError !== "" && <ErrorMessage>{parseError}</ErrorMessage>}
        {error !== "" && <ErrorMessage>{error}</ErrorMessage>}
        {result && result.importedCount > 0 && (
          <Success>{result.importedCount} ligne(s) importee(s) sur {result.totalCount}.</Success>
        )}

        {!preview && parseError === "" && (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Aucune previsualisation disponible.
          </p>
        )}

        {preview && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{preview.fileName}</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{preview.rows.length} ligne(s)</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[12px]" style={{ backgroundColor: "var(--panel-soft)" }}>
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                    <th className="px-4 py-4">Ligne</th>
                    {preview.headers.map((header) => (
                      <th key={header} className="px-4 py-4">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 10).map((row) => (
                    <tr key={row.line} className="border-t" style={{ borderColor: "var(--panel-border)" }}>
                      <td className="px-4 py-3">{row.line}</td>
                      {preview.headers.map((header) => (
                        <td key={`${row.line}-${header}`} className="px-4 py-3">
                          {String(row.payload[header] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result && result.errors.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {result.errors.slice(0, 8).map((item) => (
                  <li key={`${item.line}-${item.message}`}>Ligne {item.line}: {item.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </>
  );
}
