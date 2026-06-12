import { localGet, localPut } from "../../../shared/api/localClient";
import type {
  KanbanColumnKey,
  KanbanSetting,
  UpdateKanbanSettingPayload,
} from "../model/kanbanSetting.types";

export function getKanbanSettings() {
  return localGet<KanbanSetting[]>("/kanban-settings");
}

export function updateKanbanSetting(
  columnKey: KanbanColumnKey,
  payload: UpdateKanbanSettingPayload,
) {
  return localPut<KanbanSetting>(`/kanban-settings/${columnKey}`, payload);
}
