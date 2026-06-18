import { getTicketCostByIds } from "../../../../entities/ticket-cost/api/ticketCost.api";
import { totalCost } from "../../../../entities/ticket-cost/lib/ticketCost";
import { getTicket, updateTicket, type UpdateTicketPayload } from "../../../../entities/ticket/api/ticket.api";
import { getTicketAssetLinks, getTicketAssetLinksByTicketId } from "../../../../entities/ticket/api/ticketItem.api";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { createSuperCost1, getSuperCost1ByIdTicket, getSuperCost1ByIdTicketMin, getSuperCost1ByIdTicketMoyenne, getSuperCost1ByIdTicketSomme } from "../api/superCost1.api";
import type { CreateSuperCost1 } from "../model/ticketSuperCost1.types";

type ChoiceType = {
    ticket: Ticket,
    cout: number
}

type ReouvertureChoiceType = {
    ticket: Ticket,
    cout: number
    modeReouveture: number
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
    cout
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

    
        await createSuperCost1(createSuperCost1Playload_SUPER_COST)
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
    modeReouveture
}: ReouvertureChoiceType){
    const ticketId = ticket.id

    const superCost1ByIdTicketData = await getSuperCost1ByIdTicket(ticket ? ticket.id : -1)
    const getSuperCost1ByIdTicketMinData = await getSuperCost1ByIdTicketMin(ticket ? ticket.id : -1)
    const getSuperCost1ByIdTicketMoyenneData = await getSuperCost1ByIdTicketMoyenne(ticket ? ticket.id : -1)
    const getSuperCost1ByIdTicketSommeData = await getSuperCost1ByIdTicketSomme(ticket ? ticket.id : -1)

    
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
        
        cout_saisi_final = cout *  cout_saisi_final / 100
        const createSuperCost1Playload_REOUVERTURE : CreateSuperCost1 = {
            category: ticketItem.itemtype,
            cout: cout_saisi_final,
            group_super_cost_1: group_super_cost_1 ?? "-1 String",
            id_item: ticketItem.items_id,
            id_ticket: ticketId, 
            type_cout:"reouverture"         
        }
        await createSuperCost1(createSuperCost1Playload_REOUVERTURE)
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