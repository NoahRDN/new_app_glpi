import { useQuery } from "@tanstack/react-query";
import { getSuperCost1GroupByCategorieTypeCout } from "../api/superCost1.api";

export function useSuperCost1GroupByCategorieTypeCout(){
    return useQuery({
        queryKey: ["superCost1GroupByCategorie"],
        queryFn: () => getSuperCost1GroupByCategorieTypeCout()
    })
}