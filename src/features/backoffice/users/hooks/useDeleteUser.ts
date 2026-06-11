import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../../../entities/user/api/user.api";
import { usersQueryKey } from "./useUsers";
import { AppError } from "../../../../shared/errors/AppError";

export function useDeleteUser(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ( params: {
            userId: number,
        }) => {
            if (params.userId === -1) {
                throw new AppError({
                    message: "Missing userId in delete user mutation",
                    userMessage: "Utilisateur non trouvé.",
                    code: "VALIDATION_ERROR",
                })
            }

            return deleteUser(params.userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: usersQueryKey,
            })
        }
    })  
}
