import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSuperCost1 } from "../api/superCost1.api";
import { superCost1QueryKey } from "./useSuperCost1";

export function useCreateSuperCost1() {

  const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: createSuperCost1,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: superCost1QueryKey,
      });
    },
  });
}