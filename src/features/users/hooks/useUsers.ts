import { useCallback, useEffect, useState } from "react";
import type { User } from "../../../entities/user/model/user.types";
import { getUsers } from "../../../entities/user/api/user.api";
import { getLocalNotes } from "../../../entities/local-note/api/localNote.api";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string>("");

    const refreshUsers = useCallback(async () => {
        try {
            const users = await getUsers();
            const notes = await getLocalNotes();
            console.log("notes: ",notes);
            setUsers(users);
            setErrors("");
        } catch (error) {
            console.error(error);
            setErrors("Erreur pendant le chargement des utilisateurs.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void refreshUsers();
        });
    }, [refreshUsers]);

    return {
        users,
        isLoading,
        errors,
        refreshUsers,
    };
}
