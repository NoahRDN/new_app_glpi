import { useQuery } from "@tanstack/react-query";
import { getUsersTest } from "../api/userTest.api";

export const queryKeyUserTest = ["local-data", "user-test"];

export function useUserTest(){
    return  useQuery({
        queryKey: queryKeyUserTest,
        queryFn: getUsersTest,
        retry: 1
    })   
}