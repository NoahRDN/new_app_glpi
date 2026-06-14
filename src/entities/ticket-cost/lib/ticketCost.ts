import type { TicketCost } from "../api/ticketCost.api";

export function totalCost(ticketCost: TicketCost){
    return Number(ticketCost.cost_fixed) + (Number(ticketCost.actiontime) * Number(ticketCost.cost_time))
}