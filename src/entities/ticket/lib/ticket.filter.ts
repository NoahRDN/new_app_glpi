import { normalizeKey } from "../../../shared/lib/normalizeKey";
import { ticketStatusKeywords } from "../model/ticket.config";
import type {  TicketFilters } from "../model/ticket.types";

export function buildTicketFilter(
  { filters, parts = ["is_deleted==false"] }:
  { filters: TicketFilters; parts?: string[] },
): string | undefined {
  const name = filters.name.trim();

  if (name.length > 0) {
    const searchParts: string[] = [];

    searchParts.push(`name=ilike=*${name}*`);

    const statusId = getTicketStatusValueInclude(name);

    if (statusId !== undefined) {
      searchParts.push(`status.id==${statusId}`);
    }

    if (searchParts.length === 1) {
      parts.push(searchParts[0]);
    } else {
      parts.push(`(${searchParts.join(",")})`);
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

export function getTicketStatusValueInclude(
  value: string | number | boolean | undefined,
): number | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = normalizeKey(value);

  const status = ticketStatusKeywords.find((statusKeyword) =>
    statusKeyword.keywords.some((keyword) =>
      normalizeKey(keyword).includes(normalizedValue),
    ),
  );

  return status?.statusId;
}