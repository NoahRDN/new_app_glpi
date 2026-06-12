import { useMemo, useState } from "react";
import { Loader } from "../../../../shared/ui/Loader";
import { MyError } from "../../../../shared/ui/MyError";
import { Success } from "../../../../shared/ui/Succcess";
import { Input } from "../../../../shared/ui/Input";
import { Button } from "../../../../shared/ui/Button";
import { useKanbanSettings } from "../../../shared/kanban-settings/hooks/useKanbanSettings";
import { useUpdateKanbanSetting } from "../../../shared/kanban-settings/hooks/useUpdateKanbanSetting";
import type { KanbanSetting } from "../../../../entities/kanban-setting/model/kanbanSetting.types";

const DEFAULT_STATUS_LABELS: Record<KanbanSetting["columnKey"], string> = {
  done: "Terminé",
  in_progress: "In Progress",
  new: "Nouveau",
};

function KanbanSettingRow({ setting }: { setting: KanbanSetting }) {
  const [labelMg, setLabelMg] = useState(setting.labelMg);
  const [backgroundColor, setBackgroundColor] = useState(setting.backgroundColor);
  const [successMessage, setSuccessMessage] = useState("");
  const {
    mutateAsync: updateKanbanSettingAsync,
    isPending,
    error,
  } = useUpdateKanbanSetting();

  const hasChanged =
    labelMg.trim() !== setting.labelMg ||
    backgroundColor.toLowerCase() !== setting.backgroundColor.toLowerCase();

  return (
    <div
      className="rounded-[18px] border p-5"
      style={{
        backgroundColor: "var(--panel-bg)",
        borderColor: "var(--panel-border)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-(--text-primary)">
            {DEFAULT_STATUS_LABELS[setting.columnKey]}
          </p>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Clé technique: <code>{setting.columnKey}</code>
          </p>
        </div>

        <div
          className="h-14 w-20 rounded-xl border"
          style={{
            backgroundColor,
            borderColor: "var(--panel-border)",
          }}
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-sm font-medium text-(--text-secondary)">
            Nom malgache affiché
          </span>
          <Input
            type="text"
            value={labelMg}
            onChange={(event) => {
              setSuccessMessage("");
              setLabelMg(event.target.value);
            }}
          />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-(--text-secondary)">
            Couleur de fond
          </span>
          <div className="flex items-center gap-3">
            <Input
              className="h-11 w-16 cursor-pointer p-1"
              type="color"
              value={backgroundColor}
              onChange={(event) => {
                setSuccessMessage("");
                setBackgroundColor(event.target.value);
              }}
            />
            <Input
              type="text"
              value={backgroundColor}
              onChange={(event) => {
                setSuccessMessage("");
                setBackgroundColor(event.target.value);
              }}
            />
          </div>
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="min-h-6 text-sm">
          {error instanceof Error && (
            <span className="text-red-500">{error.message}</span>
          )}
          {successMessage !== "" && <Success>{successMessage}</Success>}
        </div>

        <Button
          disabled={isPending || !hasChanged || labelMg.trim() === ""}
          type="button"
          onClick={async () => {
            await updateKanbanSettingAsync({
              columnKey: setting.columnKey,
              payload: {
                backgroundColor,
                labelMg: labelMg.trim(),
              },
            });

            setSuccessMessage("Paramètre kanban enregistré.");
          }}
        >
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}

export function KanbanSettingsManager() {
  const {
    data: settings = [],
    isPending,
    isError,
    error,
  } = useKanbanSettings();

  const orderedSettings = useMemo(
    () => [...settings].sort((left, right) => left.displayOrder - right.displayOrder),
    [settings],
  );

  if (isPending) {
    return <Loader label="Chargement des paramètres kanban..." />;
  }

  if (isError) {
    return (
      <MyError>
        {error instanceof Error
          ? error.message
          : "Impossible de charger les paramètres kanban."}
      </MyError>
    );
  }

  return (
    <section className="col-span-12 space-y-5">
      <div
        className="rounded-[18px] border p-6"
        style={{
          backgroundColor: "var(--panel-bg)",
          borderColor: "var(--panel-border)",
        }}
      >
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          Personnalisation du kanban
        </h1>
        <p className="mt-2 text-sm text-(--text-secondary)">
          Ces valeurs sont stockées en SQLite côté backend local. Elles changent
          seulement l’affichage NewApp du kanban, pas les vrais statuts GLPI.
        </p>
      </div>

      {orderedSettings.map((setting) => (
        <KanbanSettingRow
          key={`${setting.columnKey}-${setting.labelMg}-${setting.backgroundColor}`}
          setting={setting}
        />
      ))}
    </section>
  );
}
