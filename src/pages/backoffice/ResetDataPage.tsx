import { Trash2 } from "lucide-react";
import { Button } from "../../shared/ui/Button";
import { MyError as ErrorMessage } from "../../shared/ui/MyError";
import { Success } from "../../shared/ui/Succcess";
import { useResetGlpiData } from "../../features/backoffice/glpi-data/hooks/useResetGlpiData";
import {
  GLPI_DATA_RESOURCES,
  type GlpiDataResourceId,
} from "../../features/backoffice/glpi-data/model/glpiDataResource.config";

export function ResetDataPage() {
  const { error, isResetting, resetResources, result } = useResetGlpiData();
  const selectedResources : GlpiDataResourceId[] = GLPI_DATA_RESOURCES.map((GLPI_DATA_RESOURCE) => GLPI_DATA_RESOURCE.id);

  async function handleReset() {
    if (selectedResources.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Confirmer la reinitialisation de ${selectedResources.length} ressource(s) GLPI ?`,
    );

    if (!confirmed) {
      return;
    }

    await resetResources(selectedResources);
  }

  return (
    <>
      <section className="col-span-12 rounded-[18px] border p-6 xl:col-span-5" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
        <Button className="my-5 bg-red-600 w-full justify-center" disabled={selectedResources.length === 0 || isResetting} onClick={handleReset}>
          <Trash2 size={18} />
          {isResetting ? "Reinitialisation..." : "Reinitialiser"}
        </Button>
        <div className="space-y-3">
          {GLPI_DATA_RESOURCES.filter((resource) => resource.resetEnabled).map((resource) => (
            <label
              key={resource.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl p-4"
              style={{ backgroundColor: "var(--panel-soft)" }}
            >
              <span>
                <span className="block font-semibold" style={{ color: "var(--text-primary)" }}>{resource.label}</span>
                <span className="mt-1 block text-sm" style={{ color: "var(--text-secondary)" }}>{resource.endpoint}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="col-span-12 rounded-[18px] border p-6 xl:col-span-7" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
        {error !== "" && <ErrorMessage>{error}</ErrorMessage>}
        {!result && error === "" && (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Aucun resultat disponible.
          </p>
        )}

        {result && (
          <div>
            {result.totalFailed === 0 ? (
              <Success>{result.totalDeleted} element(s) supprime(s).</Success>
            ) : (
              <ErrorMessage>{result.totalFailed} erreur(s) pendant la reinitialisation.</ErrorMessage>
            )}

            <div className="mt-5 space-y-3">
              {result.resources.map((item) => {
                const resource = GLPI_DATA_RESOURCES.find((config) => config.id === item.resourceId);

                return (
                  <div key={item.resourceId} className="rounded-xl p-4" style={{ backgroundColor: "var(--panel-soft)" }}>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {resource?.label ?? item.resourceId}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                      Trouves: {item.totalFound} | Supprimes: {item.deletedCount} | Echecs: {item.failedCount}
                    </p>

                    {item.errors.length > 0 && (
                      <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {item.errors.slice(0, 6).map((rowError) => (
                          <li key={`${rowError.id}-${rowError.message}`}>
                            ID {rowError.id}: {rowError.message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
