import {useQuery} from "@tanstack/react-query";
import { getSuperCosts } from "../api/ticketSuperCost.api";

export const superCostQueryKey = ["superCost"] as const;

export function useSuperCost() {

  return useQuery({
    queryKey: superCostQueryKey,
    queryFn : () => getSuperCosts(),
    retry: 0
  });
}