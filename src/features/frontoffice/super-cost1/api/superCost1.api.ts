import { localDelete, localGet, localPost, localPut } from "../../../../shared/api/localClient";
import type { CreateSuperCost1, Plafond, SuperCost1, SuperCost1GroupByCategoryTypeCout, UpdateSuperCost1CoutSaisiePayload, UpdateSuperCost1ReouverturePayload } from "../model/ticketSuperCost1.types";

export async function getSuperCost1GroupByCategorieTypeCout() : Promise<SuperCost1GroupByCategoryTypeCout[]>{
    return localGet<SuperCost1GroupByCategoryTypeCout[]>("/user-cost-1/group-by-category-type-cout");
}

export async function getSuperCost1MaxGlpiByIdTicket(id_ticket: number) : Promise<SuperCost1[]>{
    return localGet<SuperCost1[]>(`/user-cost-1/max-glpi/${id_ticket}`);
}

export async function getSuperCost1MaxGlpi() : Promise<SuperCost1[]>{
    return localGet<SuperCost1[]>(`/user-cost-1/max-glpi`);
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

export async function getSuperCost1ByIdTicket(id_ticket: number, group_super_cost?: string):  Promise<SuperCost1[]>{
    if (group_super_cost === undefined) {
        return localGet(`/user-cost-1/${id_ticket}/max`);
    }else{
        return localGet(`/user-cost-1/${id_ticket}/max/${group_super_cost}`);
    }
}

export async function getSuperCost1ByIdTicketMin(id_ticket: number, group_super_cost?: string):  Promise<SuperCost1[]>{
    if (group_super_cost === undefined) {
        return localGet(`/user-cost-1/${id_ticket}/min`);
    } else {
        return localGet(`/user-cost-1/${id_ticket}/min/${group_super_cost}`);
    }
}

export async function getSuperCost1ByIdTicketMoyenne(id_ticket: number, group_super_cost?: string):  Promise<SuperCost1[]>{
    if (group_super_cost === undefined) {
        return localGet(`/user-cost-1/${id_ticket}/moyenne`);
    } else {
        return localGet(`/user-cost-1/${id_ticket}/moyenne/${group_super_cost}`);
    }
}

export async function getSuperCost1ByIdTicketSomme(id_ticket: number, group_super_cost?: string, estReouverture: boolean = false):  Promise<SuperCost1[]>{
    if (estReouverture) {
        return localGet(`/user-cost-1/${id_ticket}/somme/reouverture/${group_super_cost}`);
    }
    if (group_super_cost === undefined) {
        return localGet(`/user-cost-1/${id_ticket}/somme`);
    } else {
        return localGet(`/user-cost-1/${id_ticket}/somme/${group_super_cost}`);
    }
}

export async function getSuperCosts1AllSuperCostSupprimer():  Promise<SuperCost1[]>{
    return localGet("/user-cost-1/all-supercost-supprimer");
}

export async function getSuperCosts1AllReouverture():  Promise<SuperCost1[]>{
    return localGet("/user-cost-1/all-reouverture");
}

export async function getSuperCosts1AllSuperCost():  Promise<SuperCost1[]>{
    return localGet("/user-cost-1/all-supercost");
}

export async function updateSuperCosts1Reouverture(
    payload: UpdateSuperCost1ReouverturePayload,
):  Promise<SuperCost1[]>{
    return localPut(`/user-cost-1/${1}/reouverture`, payload);
}

export async function updateSuperCostRestaure(
    id: number
):  Promise<SuperCost1[]>{
    return localPut(`/user-cost-1/update-supercost`, {id});
}

export async function updateSuperCosts1CoutSaisie(
    payload: UpdateSuperCost1CoutSaisiePayload,
):  Promise<SuperCost1[]>{
    return localPut(`/user-cost-1/${1}/cout-saisie`, payload);
}

export async function getAllSuperCostReouvertureAfterClose(group_super_cost: string):  Promise<SuperCost1[]>{
    return localGet(`/user-cost-1/get-supercost-reouverture/after-close/${group_super_cost}`);
}

export async function getPlafond():  Promise<Plafond[]>{
    return localGet(`/plafond`);
}