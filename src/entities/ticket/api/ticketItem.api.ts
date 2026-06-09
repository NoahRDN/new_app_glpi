import {
  glpiLegacyDelete,
  glpiLegacyGet,
  glpiLegacyPost,
} from "../../../shared/api/glpiLegacyClient";

export type TicketAssetLink = {
  id: number;
  itemtype: string;
  items_id: number;
  tickets_id: number;
  links?: {
    rel: string;
    href: string;
  }[];
};

type LegacyAsset = {
  id: number;
  name?: string;
  is_deleted?: boolean;
};

export async function getTicketAssetLinks(): Promise<TicketAssetLink[]> {
  return glpiLegacyGet<TicketAssetLink[]>("/Item_Ticket");
}

export async function getTicketAssetLinksByTicketId(
  ticketId: number,
): Promise<TicketAssetLink[]> {
  const links = await getTicketAssetLinks();

  return links.filter((link) => link.tickets_id === ticketId);
}

export async function linkAssetToTicket(payload: {
  ticketId: number;
  itemtype: string;
  itemId: number;
}) {
  const asset = await glpiLegacyGet<LegacyAsset>(
    `/${payload.itemtype}/${payload.itemId}`,
  );

  if (asset.is_deleted) {
    throw new Error("Impossible de lier un élément supprimé au ticket.");
  }

  const existingLinks = await getTicketAssetLinksByTicketId(payload.ticketId);

  const alreadyLinked = existingLinks.some(
    (link) =>
      link.itemtype === payload.itemtype && link.items_id === payload.itemId,
  );

  if (alreadyLinked) {
    throw new Error("Cet élément est déjà lié à ce ticket.");
  }

  return glpiLegacyPost<{ id: number }>("/Item_Ticket", {
    input: {
      tickets_id: payload.ticketId,
      itemtype: payload.itemtype,
      items_id: payload.itemId,
    },
  });
}

export async function unlinkAssetFromTicket(linkId: number) {
  return glpiLegacyDelete(`/Item_Ticket/${linkId}`);
}

