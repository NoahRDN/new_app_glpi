import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKanbanSetting } from "../../../../entities/kanban-setting/api/kanbanSetting.api";
import type {
  KanbanColumnKey,
  UpdateKanbanSettingPayload,
} from "../../../../entities/kanban-setting/model/kanbanSetting.types";
import { kanbanSettingsQueryKey } from "./useKanbanSettings";

export function useUpdateKanbanSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnKey,
      payload,
    }: {
      columnKey: KanbanColumnKey;
      payload: UpdateKanbanSettingPayload;
    }) => updateKanbanSetting(columnKey, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: kanbanSettingsQueryKey,
      }),
  });
}
