import { getTicketCostByIds } from "../../../../entities/ticket-cost/api/ticketCost.api";
import { totalCost } from "../../../../entities/ticket-cost/lib/ticketCost";
import { getTicket, updateTicket, type UpdateTicketPayload } from "../../../../entities/ticket/api/ticket.api";
import { getTicketAssetLinks, getTicketAssetLinksByTicketId } from "../../../../entities/ticket/api/ticketItem.api";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { createSuperCost1, getAllSuperCostReouvertureAfterClose, getPlafond, getSuperCost1ByIdTicket, getSuperCost1ByIdTicketMin, getSuperCost1ByIdTicketMoyenne, getSuperCost1ByIdTicketSomme, updateSuperCosts1CoutSaisie, updateSuperCosts1Reouverture } from "../api/superCost1.api";
import type { CreateSuperCost1 } from "../model/ticketSuperCost1.types";

type ChoiceType = {
    ticket: Ticket,
    cout: number,
    isUpdate?: boolean
    group_super_cost_1_update?: string,
    id_ticket_update?: number
}

type ReouvertureChoiceType = {
    ticket: Ticket,
    cout: number
    modeReouveture: number
    isUpdate?: boolean
    group_super_cost_1_update?: string,
    id_ticket_update?: number,
    pourcentage?: number,
    isRecalcule?: boolean
}

export async function GLPIChoice({
    ticket, 
}: ChoiceType){
    const ticketId = ticket.id
    const idsCost = ticket ? ticket.costs.map((cost) => cost.id) : []
    const ticketsCostData = await getTicketCostByIds(idsCost)

    let totalCostTicket = ticketsCostData ? ticketsCostData.reduce((sum, ticketCost) => {
        return sum + totalCost(ticketCost);
    }, 0) : -1;

    const ticketItems = await getTicketAssetLinksByTicketId(ticketId);

    totalCostTicket =  totalCostTicket / ticketItems.length;

    const now = new Date().toISOString();

    for (const ticketItem of ticketItems) {
        const createSuperCost1Playload_GLPI : CreateSuperCost1 = {
            category: ticketItem.itemtype,
            cout: totalCostTicket,
            group_super_cost_1: now,
            id_item: ticketItem.items_id,
            id_ticket: ticketId, 
            type_cout:"glpi"         
        }
        await createSuperCost1(createSuperCost1Playload_GLPI)
    }
}

export async function closeChoice({
    ticket,
    cout,
    isUpdate = false,
    group_super_cost_1_update= "-1 string",
    id_ticket_update= -1
}: ChoiceType){
    const ticketId = ticket.id

    const ticketAssetLinksData = await getTicketAssetLinks();

    const ticketAssetLinks = ticketAssetLinksData?.filter((link) => link.tickets_id === ticket?.id);

    const itemsType : string[] = [];
    const nombreCategoryTicketAssetLinks = ticketAssetLinks ? ticketAssetLinks.reduce((sum, ticketAssetLink) => {
        if (!itemsType.includes(ticketAssetLink.itemtype)) {
            itemsType.push(ticketAssetLink.itemtype);
            return sum + 1;
        }
        return sum;
    } ,0) : 0;
    const cout_saisi_final = cout / nombreCategoryTicketAssetLinks;

    const ticketItems = await getTicketAssetLinksByTicketId(ticketId);
    const now = new Date().toISOString();

    for (const ticketItem of ticketItems) {
        const createSuperCost1Playload_SUPER_COST : CreateSuperCost1 = {
            category: ticketItem.itemtype,
            cout: cout_saisi_final,
            group_super_cost_1: now,
            id_item: ticketItem.items_id,
            id_ticket: ticketId, 
            type_cout:"cout_saisi"         
        }

        if (!isUpdate) {
            await createSuperCost1(createSuperCost1Playload_SUPER_COST)
        } else {
            await updateSuperCosts1CoutSaisie({
                cout: cout_saisi_final,
                groupSuperCost1: group_super_cost_1_update,
                idItem:ticketItem.items_id,
                idTicket: id_ticket_update
            })

            const results = await getAllSuperCostReouvertureAfterClose(group_super_cost_1_update)
            console.log("results: ", results);
            await Promise.all(
                results.map(async (result) => {
                    const ticket1 = await getTicket(result.id_ticket)
                    await reouverturChoice({
                        cout: result.cout,
                        modeReouveture: result. mode_reouverture,
                        ticket: ticket1,
                        group_super_cost_1_update: result.group_super_cost_1,
                        id_ticket_update: Number(result.id_ticket),
                        isUpdate: true,
                        pourcentage: result.pourcentage
                    })
                })
            )
            
            
        }
    
    }
    const ticket1 = await getTicket(ticket.id)

    if (ticket1.status?.id !== 6) {
        const newStatusPlayload : UpdateTicketPayload = {
            id: ticket1.id,
            status: {
                id: 6
            }
        } 
        await updateTicket(newStatusPlayload)
    }
}

export async function reouverturChoice({
    ticket,
    cout,
    modeReouveture,
    isUpdate = false,
    group_super_cost_1_update= "-1 string",
    id_ticket_update= -1,
    pourcentage=-1
}: ReouvertureChoiceType){
    const ticketId = ticket.id

    const plafond = await getPlafond();
    const superCost1ByIdTicketData = await getSuperCost1ByIdTicket(ticket ? ticket.id : -1, isUpdate ? group_super_cost_1_update : undefined)
    const getSuperCost1ByIdTicketMinData = await getSuperCost1ByIdTicketMin(ticket ? ticket.id : -1, isUpdate ? group_super_cost_1_update : undefined)
    const getSuperCost1ByIdTicketMoyenneData = await getSuperCost1ByIdTicketMoyenne(ticket ? ticket.id : -1, isUpdate ? group_super_cost_1_update : undefined)
    const getSuperCost1ByIdTicketSommeData = await getSuperCost1ByIdTicketSomme(ticket ? ticket.id : -1, isUpdate ? group_super_cost_1_update : undefined)
    const montantTotalPlafondData = await getSuperCost1ByIdTicketSomme(ticket ? ticket.id : -1, isUpdate ? group_super_cost_1_update : undefined);
    const montantTotalUtiliseData = await getSuperCost1ByIdTicketSomme(ticket ? ticket.id : -1, isUpdate ? group_super_cost_1_update : undefined, true);
    

    let montantTotalPlafond = 0;
    let montantTotalUtilise = 0;

    montantTotalPlafondData.map((montantTotalPlafondValue) => {
        montantTotalPlafond = montantTotalPlafond +  montantTotalPlafondValue.cout
    })

    montantTotalUtiliseData.map((montantTotalUtiliseValue) => {
        montantTotalUtilise = montantTotalUtilise +  montantTotalUtiliseValue.cout
    })

    montantTotalPlafond = montantTotalPlafond * plafond[0].pourcentage / 100;

    const montantTotalRestant = montantTotalPlafond - montantTotalUtilise

    
    let group_super_cost_1 = "";

    
    superCost1ByIdTicketData.map((superCost1ByIdTicket) => {
        if (superCost1ByIdTicket.type_cout === "cout_saisi") {
            group_super_cost_1 = superCost1ByIdTicket.group_super_cost_1
        }
    })

    const ticketItems = await getTicketAssetLinksByTicketId(ticketId);
    let cout_saisi_final : number = 0;

    for(const ticketItem of ticketItems){
        cout_saisi_final = 0;
        if (modeReouveture === 1) {
            if (superCost1ByIdTicketData) {
                superCost1ByIdTicketData.map((superCost1) => {
                    if (superCost1.id_item == ticketItem.items_id && superCost1.type_cout === "cout_saisi") {
                        cout_saisi_final = cout_saisi_final + superCost1.cout 
                    }
                })
            }
        }

        if (modeReouveture === 2) {
            if (getSuperCost1ByIdTicketMinData) {
                getSuperCost1ByIdTicketMinData.map((superCost1) => {
                    if (superCost1.id_item == ticketItem.items_id && superCost1.type_cout === "cout_saisi") {
                        cout_saisi_final = cout_saisi_final + superCost1.cout 
                    }
                })
            }
        }

        if (modeReouveture === 3) {
            if (getSuperCost1ByIdTicketMoyenneData) {
                getSuperCost1ByIdTicketMoyenneData.map((superCost1) => {
                if (superCost1.id_item == ticketItem.items_id && superCost1.type_cout === "cout_saisi") {
                    cout_saisi_final = cout_saisi_final + Number(superCost1.cout) 
                }
                })
            }
        }

        if (modeReouveture === 4) {
            if (getSuperCost1ByIdTicketSommeData) {
                getSuperCost1ByIdTicketSommeData.map((superCost1) => {
                    if (superCost1.id_item == ticketItem.items_id && superCost1.type_cout === "cout_saisi") {
                        cout_saisi_final = cout_saisi_final + Number(superCost1.cout)
                    }
                })
            }
        }
        
        if (isUpdate) {
            console.log("pourcentage: ", pourcentage)
            console.log("cout_saisi_final: ", cout_saisi_final)
            cout_saisi_final = pourcentage *  cout_saisi_final / 100
        } else {
            cout_saisi_final = cout *  cout_saisi_final / 100
        }

        if (cout_saisi_final > (montantTotalRestant/ticketItems.length)) {
            cout_saisi_final = montantTotalRestant/ticketItems.length
        }

        console.log("cout_saisi_final: ", cout_saisi_final , "cout: ", cout, "ticket: ", ticket.id)
        console.log("montantTotalRestant: ", montantTotalRestant, "montantTotalPlafond: ", montantTotalPlafond, "montantTotalUtilise: ", montantTotalUtilise, "plafond: ", plafond);
        const createSuperCost1Playload_REOUVERTURE : CreateSuperCost1 = {
            category: ticketItem.itemtype,
            cout: cout_saisi_final,
            group_super_cost_1: group_super_cost_1 ?? "-1 String",
            id_item: ticketItem.items_id,
            id_ticket: ticketId, 
            type_cout:"reouverture", 
            mode_reouverture: modeReouveture, 
            pourcentage: cout
        }
        if (!isUpdate) {
            await createSuperCost1(createSuperCost1Playload_REOUVERTURE)
        } else {
            if (modeReouveture === 4) {
                cout_saisi_final = cout_saisi_final / ticketItems.length
            }   
            await updateSuperCosts1Reouverture({
                cout: cout_saisi_final,
                groupSuperCost1: group_super_cost_1_update,
                idItem: ticketItem.items_id,
                idTicket: id_ticket_update
            })
            
        }
    }
    const ticket1 = await getTicket(ticket.id)
    if (ticket1.status?.id !== 2) {
        const newStatusPlayload : UpdateTicketPayload = {
            id: ticket1.id,
            status: {
                id: 2
            }
        } 
        await updateTicket(newStatusPlayload)
    }

}