export type KanbanColumnKey = "new" | "in_progress" | "done";

export type KanbanSetting = {
  backgroundColor: string;
  columnKey: KanbanColumnKey;
  displayOrder: number;
  labelMg: string;
};

export type UpdateKanbanSettingPayload = {
  backgroundColor: string;
  labelMg: string;
};
