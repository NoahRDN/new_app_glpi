import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUsersTest } from "../api/userTest.api";
import { queryKeyUserTest } from "./useUserTest";

export function useCreateUserTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUsersTest,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeyUserTest,
      }),
  });
}
