import { useState } from "react";
import type { CreateTicket } from "../../../../entities/ticket/model/ticket.types";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { MyError } from "../../../../shared/ui/MyError";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { createTicketDefault } from "../../../../entities/ticket/model/ticket.config";

export function TicketsAdd(){
    const {
        mutateAsync: createPrinterAsync,
        isError: isCreatePrinterError,
        error: createPrinterError,
    } = useCreateTicket();

    const [form] = useState<CreateTicket>(createTicketDefault);

    if (isCreatePrinterError) {
        return <MyError>
            {getUserErrorMessage(createPrinterError)}
        </MyError>
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = form.name.trim();

        if (name.length === 0) {
            return;
        }

        await createPrinterAsync({
            ...form
        });

    }

    return<>
        <h1>Création ticket</h1>

        <form className="flex gap-3 flex-col w-full " onSubmit={handleSubmit}>
            <Label id="titre">Titre ticket</Label>
            <Input type="text" />
            <Label>Description</Label>
            <textarea
            className="w-full rounded-[18px] border px-4 py-4 text-lg font-semibold outline-none border-(--panel-border) bg-(--panel-soft) text-(--text-primary)"
            ></textarea>
        </form>
    </>
}