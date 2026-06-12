import { glpiDelete, glpiGet, glpiPatch, glpiPost } from "../../../shared/api/glpiClient";
import type {
  CreateTicketResponse,
  CreateTicketSolutionPayload,
  TicketSolution,
  UpdateTicketSolutionPayload,
} from "../model/ticket.types";

type TimelineEntry<T> = {
  type: string;
  item: T;
};

function extractTimelineItem<T>(entry: T | TimelineEntry<T>): T {
  if (
    typeof entry === "object" &&
    entry !== null &&
    "item" in entry
  ) {
    return (entry as TimelineEntry<T>).item;
  }

  return entry as T;
}

export async function getTicketSolutions(ticketId: number | string): Promise<TicketSolution[]> {
  const response = await glpiGet<Array<TicketSolution | TimelineEntry<TicketSolution>>>(
    `/Assistance/Ticket/${ticketId}/Timeline/Solution`,
  );

  return response
    .map(extractTimelineItem)
    .filter((solution) => typeof solution.id === "number");
}

export async function createTicketSolution(params: {
  payload: CreateTicketSolutionPayload;
  ticketId: number | string;
}): Promise<CreateTicketResponse> {
  return glpiPost<CreateTicketResponse>(
    `/Assistance/Ticket/${params.ticketId}/Timeline/Solution`,
    params.payload,
  );
}

export async function updateTicketSolution(
  payload: UpdateTicketSolutionPayload,
): Promise<TicketSolution> {
  const { id, ticketId, ...body } = payload;

  return glpiPatch<TicketSolution>(
    `/Assistance/Ticket/${ticketId}/Timeline/Solution/${id}`,
    body,
  );
}

export async function deleteTicketSolution(
  ticketId: number | string,
  solutionId: number | string,
) {
  await glpiDelete(`/Assistance/Ticket/${ticketId}/Timeline/Solution/${solutionId}`);
}
