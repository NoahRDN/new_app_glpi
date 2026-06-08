import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrinter } from "../../../../entities/printer/api/printer.api";
import { printersQueryKey } from "./usePrinters";

export function useDeletePrinter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrinter,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: printersQueryKey,
      });
    },
  });
}
