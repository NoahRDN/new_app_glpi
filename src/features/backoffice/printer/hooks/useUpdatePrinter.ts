import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePrinter } from "../../../../entities/printer/api/printer.api";
import { printersQueryKey } from "./usePrinters";

export function useUpdatePrinter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrinter,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: printersQueryKey,
      });
    },
  });
}
