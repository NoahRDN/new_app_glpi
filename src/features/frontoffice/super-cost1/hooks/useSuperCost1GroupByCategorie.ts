import { useQuery } from "@tanstack/react-query";
import { getSuperCost1GroupByCategorie } from "../api/superCost1.api";

export function useSuperCost1GroupByCategorie(){
    return useQuery({
        queryKey: ["superCost1GroupByCategorie"],
        queryFn: () => getSuperCost1GroupByCategorie()
    })
}