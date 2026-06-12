import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { ticketKanbanGroupsDefault } from "../model/ticketKanban.config";
import type {
  TicketKanban,
  TicketKanbanGroup,
} from "../model/ticketKanban.types";

export function createEmptyTicketKanban(): TicketKanban {
  return {
    new: [],
    in_progress: [],
    done: [],
  };
}

function getTicketStatusId(ticket: Ticket): number | undefined {
  return ticket.status?.id;
}

export function findTicketKanbanGroup(
  ticket: Ticket,
  groups: TicketKanbanGroup[] = ticketKanbanGroupsDefault,
): TicketKanbanGroup | undefined {
  const statusId = getTicketStatusId(ticket);

  if (statusId === undefined) {
    return undefined;
  }

  return groups.find((group) =>
    group.statusIds.includes(statusId),
  );
}

export function groupTicketsByKanban(
  tickets: Ticket[],
  groups: TicketKanbanGroup[] = ticketKanbanGroupsDefault,
): TicketKanban {
  const kanban = createEmptyTicketKanban();

  tickets.forEach((ticket) => {
    const group = findTicketKanbanGroup(ticket, groups);

    if (!group) {
      return;
    }

    kanban[group.key].push(ticket);
  });

  return kanban;
}
