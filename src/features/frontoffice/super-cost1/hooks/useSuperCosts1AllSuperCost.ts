import { useQuery } from "@tanstack/react-query";
import { getSuperCosts1AllSuperCost } from "../api/superCost1.api";

export function useSuperCosts1AllSuperCost(){
    return useQuery({
        queryKey: ["SuperCosts1AllSuperCost"],
        queryFn: () => getSuperCosts1AllSuperCost()
    })
}