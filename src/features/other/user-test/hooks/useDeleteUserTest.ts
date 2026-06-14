import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUsersTest } from "../api/userTest.api";
import { queryKeyUserTest } from "./useUserTest";

export function useDeleteUserTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUsersTest,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeyUserTest,
      }),
  });
}
