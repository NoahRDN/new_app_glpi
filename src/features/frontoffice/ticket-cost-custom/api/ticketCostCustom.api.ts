import { localGet } from "../../../../shared/api/localClient";
import type { TicketCostCustomGroupByCategory } from "../model/ticketCostCustom.types";

export async function getTicketCostsCustomGroupByCategorie() : Promise<TicketCostCustomGroupByCategory[]>{
    return localGet<TicketCostCustomGroupByCategory[]>("/user-cost/group-by-category");
}