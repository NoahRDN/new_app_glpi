import { localDelete, localGet, localPost } from "../../../../shared/api/localClient";
import type { CreateSuperCost1, SuperCost1, SuperCost1GroupByCategory } from "../model/ticketSuperCost1.types";

export async function getSuperCost1GroupByCategorie() : Promise<SuperCost1GroupByCategory[]>{
    return localGet<SuperCost1GroupByCategory[]>("/user-cost-1/group-by-category");
}

export async function createSuperCost1(createSuperCostPayload: CreateSuperCost1): Promise<SuperCost1> {
  return localPost("/user-cost-1", createSuperCostPayload);
}

export async function deleteSuperCost1(id_ticket: number) {
  return localDelete(`/user-cost-1/${id_ticket}`);
}

export async function getSuperCosts1():  Promise<SuperCost1[]>{
    return localGet("/user-cost-1");
}