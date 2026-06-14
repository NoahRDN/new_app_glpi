import { localDelete, localGet, localPost } from "../../../../shared/api/localClient";
import type { CreateSuperCost, SuperCost, SuperCostGroupByCategory } from "../model/ticketSuperCost.types";

export async function getSuperCostGroupByCategorie() : Promise<SuperCostGroupByCategory[]>{
    return localGet<SuperCostGroupByCategory[]>("/user-cost/group-by-category");
}

export async function createSuperCost(createSuperCostPayload: CreateSuperCost): Promise<SuperCost> {
  return localPost("/user-cost", createSuperCostPayload);
}

export async function deleteSuperCost(id_ticket: number) {
  return localDelete(`/user-cost/${id_ticket}`);
}

export async function getSuperCosts():  Promise<SuperCost[]>{
    return localGet("/user-cost");
}