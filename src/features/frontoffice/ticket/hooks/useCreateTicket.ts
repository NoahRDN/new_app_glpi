import { useMutation } from "@tanstack/react-query";
import { createTicket } from "../../../../entities/ticket/api/ticket.api";

export function useCreateTicket(){

    return useMutation({
        mutationFn: createTicket,
        retry: 0,
    })
}