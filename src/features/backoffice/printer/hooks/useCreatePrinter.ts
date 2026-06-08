import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPrinter } from "../../../../entities/printer/api/printer.api";
import { printersQueryKey } from "./usePrinters";

export function useCreatePrinter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrinter,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: printersQueryKey,
      });
    },
  });
}
