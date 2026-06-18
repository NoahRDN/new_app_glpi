import { useQuery } from "@tanstack/react-query";
import { getSuperCost1MaxGlpi } from "../api/superCost1.api";

export function useSuperCost1MaxGLPI(){
    return useQuery({
        queryKey: ["superCost1MaxGlpi"],
        queryFn: () => getSuperCost1MaxGlpi()
    })
}