import { useQuery } from "@tanstack/react-query";
import { getSuperCost1GroupByCategorieTypeCoutLastMax } from "../api/superCost1.api";

export function useSuperCost1GroupByCategorieTypeCoutLastMax(){
    return useQuery({
        queryKey: ["superCost1GroupByCategorieLastMax"],
        queryFn: () => getSuperCost1GroupByCategorieTypeCoutLastMax()
    })
}