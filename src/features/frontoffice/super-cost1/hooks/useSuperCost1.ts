import {useQuery} from "@tanstack/react-query";
import { getSuperCosts1 } from "../api/superCost1.api";

export const superCost1QueryKey = ["superCost1"] as const;

export function useSuperCost1() {

  return useQuery({
    queryKey: superCost1QueryKey,
    queryFn : () => getSuperCosts1(),
    retry: 0
  });
}