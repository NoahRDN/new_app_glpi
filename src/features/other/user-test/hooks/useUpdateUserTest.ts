import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserTest } from "../api/userTest.api";
import { queryKeyUserTest } from "./useUserTest";

export function useUpdateUserTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserTest,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeyUserTest,
      }),
  });
}
