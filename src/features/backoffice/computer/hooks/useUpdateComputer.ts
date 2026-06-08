import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComputer } from "../../../../entities/computer/api/computer.api";
import { computersQueryKey } from "./useComputers";

export function useUpdateComputer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComputer,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: computersQueryKey,
      });
    },
  });
}