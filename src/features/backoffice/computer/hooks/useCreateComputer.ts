import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComputer } from "../../../../entities/computer/api/computer.api";
import { computersQueryKey } from "./useComputers";

export function useCreateComputer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComputer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: computersQueryKey,
      });
    },
  });
}