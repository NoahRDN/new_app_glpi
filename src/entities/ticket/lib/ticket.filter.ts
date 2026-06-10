import type {  TicketFilters } from "../model/ticket.types";

export function buildTicketFilter(
  { filters, parts = ["is_deleted==false"] }:
  { filters: TicketFilters; parts?: string[] },
): string | undefined {
  const name = filters.name.trim();

  if (name.length > 0) {
    parts.push(`name=ilike=*${name}*`);
  }

  return parts.join(";");
}
