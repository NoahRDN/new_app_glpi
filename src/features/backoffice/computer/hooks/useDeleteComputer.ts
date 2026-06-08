import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComputer } from "../../../../entities/computer/api/computer.api";
import { computersQueryKey } from "./useComputers";

export function useDeleteComputer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComputer,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: computersQueryKey,
      });
    },
  });
}