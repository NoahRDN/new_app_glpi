import { createTicket} from "../../../../entities/ticket/api/ticket.api";
import { linkAssetToTicket } from "../../../../entities/ticket/api/ticketItem.api";
import type { CreateTicketPayload } from "../../../../entities/ticket/model/ticket.types";
export type SelectedTicketAsset = {
  itemtype: string;
  itemId: number;
};

export async function createTicketWithAssets(params: {
  ticket: CreateTicketPayload;
  assets: SelectedTicketAsset[];
}) {
  const createdTicket = await createTicket(params.ticket);

  for (const asset of params.assets) {
    await linkAssetToTicket({
      ticketId: createdTicket.id,
      itemtype: asset.itemtype,
      itemId: asset.itemId,
    });
  }

  return createdTicket;
}