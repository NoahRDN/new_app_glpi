import { localDelete, localGet, localPost } from "../../../../shared/api/localClient";
import type { CreateSuperCost1, SuperCost1, SuperCost1GroupByCategoryTypeCout } from "../model/ticketSuperCost1.types";

export async function getSuperCost1GroupByCategorieTypeCout() : Promise<SuperCost1GroupByCategoryTypeCout[]>{
    return localGet<SuperCost1GroupByCategoryTypeCout[]>("/user-cost-1/group-by-category-type-cout");
}

export async function getSuperCost1MaxGlpi() : Promise<SuperCost1[]>{
    return localGet<SuperCost1[]>("/user-cost-1/max-glpi");
}

export async function getSuperCost1GroupByCategorieTypeCoutLastMax() : Promise<SuperCost1GroupByCategoryTypeCout[]>{
    return localGet<SuperCost1GroupByCategoryTypeCout[]>("/user-cost-1/group-by-category-type-cout/last-max");
}

export async function createSuperCost1(createSuperCostPayload: CreateSuperCost1): Promise<SuperCost1> {
  return localPost("/user-cost-1", createSuperCostPayload);
}

export async function deleteSuperCost1CoutSaisi(id_ticket: number) {
  return localDelete(`/user-cost-1/${id_ticket}/cout_saisie`);
}

export async function deleteAllSuperCost1() {
  return localDelete(`/user-cost-1`);
}

export async function getSuperCosts1():  Promise<SuperCost1[]>{
    return localGet("/user-cost-1");
}

export async function getSommeReouvertureByIdTicket(id_ticket: number):  Promise<number>{
    return localGet(`/user-cost-1/reouverture/${id_ticket}`);
}

export async function getSuperCost1ByIdTicket(id_ticket: number):  Promise<SuperCost1[]>{
    return localGet(`/user-cost-1/${id_ticket}`);
}

export async function getSuperCost1ByIdTicketMin(id_ticket: number):  Promise<SuperCost1[]>{
    return localGet(`/user-cost-1/${id_ticket}/min`);
}

export async function getSuperCost1ByIdTicketMoyenne(id_ticket: number):  Promise<SuperCost1[]>{
    return localGet(`/user-cost-1/${id_ticket}/moyenne`);
}

export async function getSuperCost1ByIdTicketSomme(id_ticket: number):  Promise<SuperCost1[]>{
    return localGet(`/user-cost-1/${id_ticket}/somme`);
}