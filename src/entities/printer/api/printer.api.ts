import {
  glpiDelete,
  glpiGet,
  glpiGetPaginated,
  glpiPatch,
  glpiPost,
} from "../../../shared/api/glpiClient";
import { buildPrinterFilter } from "../lib/printer.filter";
import type {
  CreatePrinter,
  GlpiPrinter,
  Printer,
  PrinterFilters,
  UpdatePrinter,
} from "../model/printer.types";

export async function getPrinters(): Promise<Printer[]> {
  return glpiGet<GlpiPrinter[]>("/Assets/Printer");
}

export async function getPrintersPage(
  page: number,
  limit: number,
  filters: PrinterFilters,
) {
  const start = page * limit;

  const params = new URLSearchParams({
    start: String(start),
    limit: String(limit),
  });

  const filter = buildPrinterFilter({ filters });

  if (filter) {
    params.set("filter", filter);
  }

  return glpiGetPaginated<GlpiPrinter>(
    `/Assets/Printer?${params.toString()}`,
  );
}

export async function getPrinter(printerId: number | string): Promise<Printer> {
  return glpiGet<GlpiPrinter>(`/Assets/Printer/${printerId}`);
}

export async function createPrinter(createPrinterPayload: CreatePrinter): Promise<Printer> {
  return glpiPost<GlpiPrinter>("/Assets/Printer", createPrinterPayload);
}

export async function updatePrinter(updatePrinterPayload: UpdatePrinter): Promise<Printer> {
  const { id, ...payload } = updatePrinterPayload;
  return glpiPatch<GlpiPrinter>(`/Assets/Printer/${id}`, payload);
}

export async function deletePrinter(printerId: number | string) {
  await glpiDelete(`/Assets/Printer/${printerId}`);
}
