import {
  TICKET_DONE_STATUS_IDS,
  TICKET_IN_PROGRESS_STATUS_IDS,
  TICKET_STATUS_IDS,
} from "../../../../entities/ticket/model/ticket.config";
import type { KanbanSetting } from "../../../../entities/kanban-setting/model/kanbanSetting.types";
import type { TicketKanbanGroup } from "./ticketKanban.types";

export const ticketKanbanGroupsDefault: TicketKanbanGroup[] = [
  {
    key: "new",
    label: "Nouveau",
    statusIds: [TICKET_STATUS_IDS.NEW],
    canCreateTicket: true,
    targetStatusId: TICKET_STATUS_IDS.NEW,
    backgroundColorSection:"#cdd4f8",
  },
  {
    key: "in_progress",
    label: "In Progress",
    statusIds: [...TICKET_IN_PROGRESS_STATUS_IDS],
    targetStatusId: TICKET_STATUS_IDS.ASSIGNED,
    backgroundColorSection:"#f8cddc",
  },
  {
    key: "done",
    label: "Terminé",
    statusIds: [...TICKET_DONE_STATUS_IDS],
    targetStatusId: TICKET_STATUS_IDS.CLOSED,
    backgroundColorSection:"#cdf8d6",
  },
];

export function buildTicketKanbanGroups(
  settings: KanbanSetting[] | undefined,
): TicketKanbanGroup[] {
  if (!settings || settings.length === 0) {
    return ticketKanbanGroupsDefault;
  }

  const settingsByKey = new Map(
    settings.map((setting) => [setting.columnKey, setting]),
  );

  return [...ticketKanbanGroupsDefault]
    .map((group) => {
      const setting = settingsByKey.get(group.key);

      if (!setting) {
        return group;
      }

      return {
        ...group,
        backgroundColorSection: setting.backgroundColor,
        label: setting.labelMg,
      };
    })
    .sort((leftGroup, rightGroup) => {
      const leftOrder = settingsByKey.get(leftGroup.key)?.displayOrder ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = settingsByKey.get(rightGroup.key)?.displayOrder ?? Number.MAX_SAFE_INTEGER;

      return leftOrder - rightOrder;
    });
}
