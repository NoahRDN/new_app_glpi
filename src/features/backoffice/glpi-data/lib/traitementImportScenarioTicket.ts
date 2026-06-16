import { getAllTickets } from "../../../../entities/ticket/api/ticket.api";
import {  deleteSuperCost1CoutSaisi } from "../../../frontoffice/super-cost1/api/superCost1.api";
import { closeChoice, reouverturChoice } from "../../../frontoffice/super-cost1/lib/traitementScenarioTicket";

export async function traitementImportScenarioTicket({
    numTicket, mvt, valeur
} :{
    numTicket : string, mvt: string, valeur: number
}) {

    const idReferenceTicketStringCSV = numTicket
    const mvtCSV = mvt;
    const coutCSV = valeur;

    const tickets = await getAllTickets({name:"", external_id:idReferenceTicketStringCSV})
    
    const ticket = tickets.at(0)
    const  ticketId = ticket?.id;
    if (!ticketId) {
        return;
    }

    if (mvtCSV === "close") {
        await closeChoice({ticket: ticket, cout: coutCSV})
    } 

    if (mvtCSV === "cancel") {
        await deleteSuperCost1CoutSaisi(ticket.id);
        console.log(`cancel ${ticket.id} `)
    }

    if (mvtCSV === "open") {
        reouverturChoice({ticket: ticket, cout:coutCSV})
    }
}