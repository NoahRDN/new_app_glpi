import {useQuery} from "@tanstack/react-query";
import { getSommeReouvertureByIdTicket } from "../api/superCost1.api";

export const superCost1QueryKey = ["sommeReouverture"] as const;

export function useSommeReouvertureByIdTicket(id_ticket: number) {

  return useQuery({
    queryKey: [...superCost1QueryKey, "id_ticket", id_ticket],
    queryFn : () => getSommeReouvertureByIdTicket(id_ticket),
    retry: 0
  });
}