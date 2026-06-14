import { useQuery } from "@tanstack/react-query";
import { getTicketCostsCustomGroupByCategorie } from "../api/ticketCostCustom.api";

export function useTicketCostsCustomGroupByCategorie(){
    return useQuery({
        queryKey: ["ticketCostsCustomGroupByCategorie"],
        queryFn: () => getTicketCostsCustomGroupByCategorie()
    })
}