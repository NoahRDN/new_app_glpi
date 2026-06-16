import { getTicketCostByIds } from "../../../../entities/ticket-cost/api/ticketCost.api";
import { totalCost } from "../../../../entities/ticket-cost/lib/ticketCost";
import { getTicketAssetLinks, getTicketAssetLinksByTicketId } from "../../../../entities/ticket/api/ticketItem.api";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { createSuperCost1, getSuperCost1ByIdTicket } from "../api/superCost1.api";
import type { CreateSuperCost1 } from "../model/ticketSuperCost1.types";

type ChoiceType = {
    ticket: Ticket,
    cout: number
}

export async function GLPIChoice({
    ticket, 
}: ChoiceType){
    console.log("holaaa");
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

        console.log(`cout_saisi ${ticket.id} -  ${ticketItem.id}: `, ` - `, createSuperCost1Playload_GLPI)  
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

        console.log(`cout_saisi ${ticket.id} -  ${ticketItem.id}: `, createSuperCost1Playload_SUPER_COST)  
    }
}

export async function reouverturChoice({
    ticket,
    cout
}: ChoiceType){
    const ticketId = ticket.id

    const superCost1ByIdTicketData = await getSuperCost1ByIdTicket(ticket ? ticket.id : -1)
    console.log("superCost1ByIdTicketData: ", superCost1ByIdTicketData)
    let group_super_cost_1 = "";
    superCost1ByIdTicketData.map((superCost1ByIdTicket) => {
        if (superCost1ByIdTicket.type_cout === "cout_saisi") {
            group_super_cost_1 = superCost1ByIdTicket.group_super_cost_1
        }
    })

    

    const ticketItems = await getTicketAssetLinksByTicketId(ticketId);
    ticketItems.map(async (ticketItem) => {
        let cout_saisi_final : number = 0;
        if (superCost1ByIdTicketData) {
            superCost1ByIdTicketData.map((superCost1) => {
                if (superCost1.id_item == ticketItem.items_id && superCost1.type_cout === "cout_saisi") {
                    cout_saisi_final = cout_saisi_final + superCost1.cout 
                }
            })
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
        console.log(`reouverture ${ticket.id} -  ${ticketItem.id}: `, createSuperCost1Playload_REOUVERTURE)
        await createSuperCost1(createSuperCost1Playload_REOUVERTURE)
    })
}