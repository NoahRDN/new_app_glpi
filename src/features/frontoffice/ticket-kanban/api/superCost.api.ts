import { localDelete, localGet, localPost } from "../../../../shared/api/localClient";
import type { CreateSuperCost, SuperCost } from "../model/superCost.types";

export async function createSuperCost(createSuperCostPayload: CreateSuperCost): Promise<SuperCost> {
  return localPost("/user-cost", createSuperCostPayload);
}

export async function deleteSuperCost(id_ticket: number) {
    console.log("ito: ", id_ticket);
  return localDelete(`/user-cost/${id_ticket}`);
}

export async function getSuperCosts():  Promise<SuperCost[]>{
    return localGet("/user-cost");
}