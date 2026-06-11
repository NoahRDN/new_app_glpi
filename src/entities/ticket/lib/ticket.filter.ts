import { normalizeKey } from "../../../shared/lib/normalizeKey";
import { ticketStatusKeywords } from "../model/ticket.config";
import type {  TicketFilters } from "../model/ticket.types";

export function buildTicketFilter(
  { filters, parts = ["is_deleted==false"] }:
  { filters: TicketFilters; parts?: string[] },
): string | undefined {
  const name = filters.name.trim();

  if (name.length > 0) {
    parts.push(`name=ilike=*${name}*`);
    const statusId = getTicketStatusValue(name);
    console.log("name: ", name, "status: ", statusId)
    if (statusId !== undefined) {
      parts.push(`status.id==${statusId}`);
      console.log("hola: ", parts.at(parts.length-1));
    }
  }

  return parts.join(";");
}

export function getTicketStatusValue(
  value: string | number | boolean | undefined,
): number | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = normalizeKey(value);

  const status = ticketStatusKeywords.find((statusKeyword) =>
    statusKeyword.keywords.some(
      (keyword) => normalizeKey(keyword) === normalizedValue,
    ),
  );

  return status?.statusId;
}