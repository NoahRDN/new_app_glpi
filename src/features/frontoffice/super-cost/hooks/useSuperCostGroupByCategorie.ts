import { useQuery } from "@tanstack/react-query";
import { getSuperCostGroupByCategorie } from "../api/ticketSuperCost.api";

export function useSuperCostGroupByCategorie(){
    return useQuery({
        queryKey: ["superCostGroupByCategorie"],
        queryFn: () => getSuperCostGroupByCategorie()
    })
}