import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsers, getUsersPage } from "../../../../entities/user/api/user.api";
import type { UserFilters } from "../../../../entities/user/model/user.types";

export const usersQueryKey = ["administration", "users"] as const; 

export function useUsersPage(
    {page, limit,filters}:
    {page: number, limit: number,filters: UserFilters}){

    return useQuery({
        queryKey: [...usersQueryKey, page, limit, filters ],
        queryFn: () => getUsersPage({page, limit,filters}),
        placeholderData: keepPreviousData,
        staleTime: 60_000,
        retry: 1,
    })    
}

export function useUsers(){
    return useQuery({
        queryKey: usersQueryKey,
        queryFn: () => getUsers({})
    })
}

