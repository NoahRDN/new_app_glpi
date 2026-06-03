import { useState } from "react";
import { deleteUser } from "../../../entities/user/api/user.api";
import type { User } from "../../../entities/user/model/user.types";
import { defaultUser } from "../../../entities/user/model/user.configs";

export function useDeleteUser(){
    const [isDeletingUser, setIsDeletingUser] = useState<boolean>(false);
    const [isSuccessDeleteUser, setIsSuccessDeleteUser] = useState<boolean>(false);
    const [errorsDeleteUser, setErrorsDeleteUser] = useState<string>("");
    const [userDelete, setUserDelete] = useState<User>(defaultUser);

    async function deleteUserHooks(userId: number) {
        setIsSuccessDeleteUser(false);
        setIsDeletingUser(true);
        setErrorsDeleteUser("");
        
        try {
            setIsSuccessDeleteUser(false);
            await deleteUser(userId);
            setIsSuccessDeleteUser(true);
        } catch (error) {
            if(error instanceof Error){
                console.log(error)
                setErrorsDeleteUser(error.message)
            } else{
                setErrorsDeleteUser(`Erreur pendant la suppression de l'utilisateur ${userId}`);
            }
        } finally {
            setIsDeletingUser(false);
        }
    }

    return {
        isDeletingUser,
        isSuccessDeleteUser,
        errorsDeleteUser,
        deleteUserHooks,
        userDelete,
        setUserDelete,
        setIsSuccessDeleteUser
    }
}