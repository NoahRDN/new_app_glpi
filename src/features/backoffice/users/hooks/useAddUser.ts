import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../../../entities/user/api/user.api";
import { usersQueryKey } from "./useUsers";

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: usersQueryKey,
      })
    }
  })
}
