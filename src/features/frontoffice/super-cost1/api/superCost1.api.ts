import { localDelete, localGet, localPost } from "../../../../shared/api/localClient";
import type { CreateSuperCost1, SuperCost1, SuperCost1GroupByCategoryTypeCout } from "../model/ticketSuperCost1.types";

export async function getSuperCost1GroupByCategorieTypeCout() : Promise<SuperCost1GroupByCategoryTypeCout[]>{
    return localGet<SuperCost1GroupByCategoryTypeCout[]>("/user-cost-1/group-by-category-type-cout");
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

export async function getSuperCost1ByIdTicket(id_ticket: number):  Promise<SuperCost1[]>{
    return localGet(`/user-cost-1/${id_ticket}`);
}