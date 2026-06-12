import { useQuery } from "@tanstack/react-query";
import { getKanbanSettings } from "../../../../entities/kanban-setting/api/kanbanSetting.api";

export const kanbanSettingsQueryKey = ["local", "kanban-settings"] as const;

export function useKanbanSettings() {
  return useQuery({
    queryKey: kanbanSettingsQueryKey,
    queryFn: getKanbanSettings,
    retry: 1,
    staleTime: 60_000,
  });
}
