import { glpiGetPaginated } from "../../../../shared/api/glpiClient";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { ticketKanbanGroups } from "../model/ticketKanban.config";
import type { TicketKanbanGroupKey } from "../model/ticketKanban.types";

export type TicketKanbanCounts = Record<TicketKanbanGroupKey, number>;

function createEmptyTicketKanbanCounts(): TicketKanbanCounts {
  return {
    new: 0,
    in_progress: 0,
    done: 0,
  };
}

async function getTicketCountByStatusId(statusId: number): Promise<number> {
  const params = new URLSearchParams({
    start: "0",
    limit: "1",
    filter: `status.id==${statusId}`,
  });

  const page = await glpiGetPaginated<Ticket>(
    `/Assistance/Ticket?${params.toString()}`,
  );

  return page.total;
}

export async function getTicketKanbanCounts(): Promise<TicketKanbanCounts> {
  const counts = createEmptyTicketKanbanCounts();

  await Promise.all(
    ticketKanbanGroups.map(async (group) => {
      const statusCounts = await Promise.all(
        group.statusIds.map((statusId) => getTicketCountByStatusId(statusId)),
      );

      counts[group.key] = statusCounts.reduce(
        (sum, count) => sum + count,
        0,
      );
    }),
  );

  return counts;
}