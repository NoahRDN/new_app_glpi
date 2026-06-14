import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSuperCost } from "../api/ticketSuperCost.api";

export const superCostQueryKey = ["superCost"] as const;

export function useCreateSuperCost() {

  const queryClient = useQueryClient();
    

  return useMutation({
    mutationFn: createSuperCost,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: superCostQueryKey,
      });
    },
  });
}