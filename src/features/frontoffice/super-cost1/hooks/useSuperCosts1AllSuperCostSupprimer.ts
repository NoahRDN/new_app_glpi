import { useQuery } from "@tanstack/react-query";
import { getSuperCosts1AllSuperCostSupprimer } from "../api/superCost1.api";

export function useSuperCosts1AllSuperCostSupprimer(){
    return useQuery({
        queryKey: ["superCosts1AllSuperCostSupprimer"],
        queryFn: () => getSuperCosts1AllSuperCostSupprimer()
    })
}