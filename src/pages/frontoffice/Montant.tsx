import type { TicketCost } from "../../entities/ticket-cost/api/ticketCost.api";
import type { TicketAssetLink } from "../../entities/ticket/api/ticketItem.api";
import { useSuperCost } from "../../features/frontoffice/ticket-kanban/hooks/useSuperCost";
import type { SuperCost } from "../../features/frontoffice/ticket-kanban/model/superCost.types";
import { useTicketAssetLinks } from "../../features/frontoffice/ticket/hooks/useTicketAssetLinks";
import { useAllTicketCosts } from "../../features/ticket-costs/hooks/useTicketCosts";
import { DataTable } from "../../shared/ui/DataTable";

export function Montant(){

    // const typeItems: Set<string[]> = new Set<string[]>();
    const typeItems: Set<string> = new Set<string>();
    
    const {
        data: ticketCostsAllData,
        // isPending: isTicketsAllPending,
        // isError: isTicketsAllError,
        // error: ticketsAllError,
    } = useAllTicketCosts();


    const {
        data: ticketAssetLinks,
        // isPending: isTicketsAllPending,
        // isError: isTicketsAllError,
        // error: ticketsAllError,
    } = useTicketAssetLinks();

    const {
        data: superCostAllData,
        // isPending: isTicketsAllPending,
        // isError: isTicketsAllError,
        // error: ticketsAllError,
    } = useSuperCost();

    const superCostAllDataGroup = superCostAllData?.reduce<Record<string, SuperCost[]>>(
        (acc, item) => {
            const key = String(item.id);
            (acc[key] ??= []).push(item);
            return acc;
        },
        {}
    );

    const ticketCosts: Record<string, TicketCost[]> | undefined= ticketCostsAllData?.reduce(
        (acc, item) => {
            const key = String(item.id);

            (acc[key] ??= []).push(item);
            return acc;
        },
        {} as Record<string, TicketCost[]>
    );

    const ticketAssetLinksGroupedByItemType: Record<string, TicketAssetLink[]>  | undefined = ticketAssetLinks?.reduce(
        (acc, item) => {
            typeItems.add(item.itemtype);
            (acc[item.itemtype] ??= []).push(item);
            return acc;
        },
        {} as Record<string, TicketAssetLink[]>
    );

    return <DataTable 
            tableHeads={[
                "type item",
                "prix fixe import", 
                "prix fixe loca-data",
                "total"
            ]}
        >
            {ticketAssetLinksGroupedByItemType &&
                Object.entries(ticketAssetLinksGroupedByItemType).map(([typeItem, links]) => {
                    return( 
                    <tr>
                        <td>{typeItem}</td>
                        <td>
                            {links.reduce((sum, link) => {
                                const costsForItem = ticketCosts?.[String(link.items_id)] ?? [];

                                const totalCost = costsForItem.reduce(
                                    (costSum, cost) => costSum + (Number(cost.cost_time) * Number(cost.actiontime) + Number(cost.cost_fixed)),
                                    0
                                );

                                return sum + totalCost;
                            }, 0)}
                        </td>
                        <td>
                            {links.reduce((sum, link) => {
                                const costsForItem = superCostAllDataGroup?.[String(link.items_id)] ?? [];

                                const totalCost = costsForItem.reduce(
                                    (costSum, cost) => costSum + Number(cost.montant),
                                    0
                                );

                                return sum + totalCost;
                            }, 0)}
                        </td>
                        <td>Total</td>
                    </tr>)
                })}
            
        </DataTable>

}

// /Assistance/Ticket/{id}/Cost