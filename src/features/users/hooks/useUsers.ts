import { useEffect, useState } from "react";
import type { User } from "../../../entities/user/model/user.types";
import { getUsers } from "../../../entities/user/api/user.api";

export function useUsers(){
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string>("");

    useEffect( () => {
        

        async function loadingUsers() {
            try {
                const usersRslt = await getUsers();
                setUsers(usersRslt);
            } catch (error) {
                console.log(error);
                setErrors("erreur")
            } finally {
                setIsLoading(false);
            }
        }

        loadingUsers();
        
    },[])

    return {
        users,
        isLoading, 
        errors,
    }
}