import { glpiDelete, glpiGet, glpiPatch, glpiPost } from "../../../shared/api/glpiClient";
import type {
  CreateTicketResponse,
  CreateTicketSolutionPayload,
  TicketSolution,
  UpdateTicketSolutionPayload,
} from "../model/ticket.types";

export async function getTicketSolutions(ticketId: number | string): Promise<TicketSolution[]> {
  return glpiGet<TicketSolution[]>(`/Assistance/Ticket/${ticketId}/Timeline/Solution`);
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
