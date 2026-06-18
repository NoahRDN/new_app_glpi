import {useQuery} from "@tanstack/react-query";
import { getSuperCost1ByIdTicketMin } from "../api/superCost1.api";

export const superCost1QueryKey = ["superCost1"] as const;

export function useSuperCost1ByIdTicketMin(id_ticket: number) {

  return useQuery({
    queryKey: [...superCost1QueryKey, "id_ticket", id_ticket],
    queryFn : () => getSuperCost1ByIdTicketMin(id_ticket),
    retry: 0
  });
}
