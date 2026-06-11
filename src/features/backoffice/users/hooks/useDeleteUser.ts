import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../../../entities/user/api/user.api";
import { usersQueryKey } from "./useUsers";

export function useDeleteUser(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ( params: {
            userId: number,
        }) => {
            return deleteUser(params.userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: usersQueryKey,
            })
        }

    })  
}
