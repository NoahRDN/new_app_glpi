import { useQuery } from "@tanstack/react-query";
import { getSuperCosts1AllReouverture } from "../api/superCost1.api";

export function useSuperCost1AllReouverture(){
    return useQuery({
        queryKey: ["SuperCosts1AllReouverture"],
        queryFn: () => getSuperCosts1AllReouverture()
    })
}