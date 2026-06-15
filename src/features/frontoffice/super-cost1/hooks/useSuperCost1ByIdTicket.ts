import {useQuery} from "@tanstack/react-query";
import { getSuperCost1ByIdTicket } from "../api/superCost1.api";

export const superCost1QueryKey = ["superCost1"] as const;

export function useSuperCost1ByIdTicket(id_ticket: number) {

  return useQuery({
    queryKey: [...superCost1QueryKey, "id_ticket", id_ticket],
    queryFn : () => getSuperCost1ByIdTicket(id_ticket),
    retry: 0
  });
}