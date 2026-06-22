import { useQuery } from "@tanstack/react-query";
import { getSuperCost1MaxGlpiByIdTicket } from "../api/superCost1.api";

export function useSuperCost1MaxGLPIByIdTicket(id_ticket: number){
    return useQuery({
        queryKey: ["superCost1MaxGlpi"],
        queryFn: () => getSuperCost1MaxGlpiByIdTicket(id_ticket)
    })
}