import { useState } from "react";
import type { CreateTicket } from "../../../../entities/ticket/model/ticket.types";
import { getDeveloperErrorDetails, getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { MyError } from "../../../../shared/ui/MyError";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { createTicketDefault } from "../../../../entities/ticket/model/ticket.config";
import { Textarea } from "../../../../shared/ui/Textarea";
import { Button } from "../../../../shared/ui/Button";
import { useNavigate } from "react-router";
import { Select } from "../../../../shared/ui/Select";

export function TicketsAdd(){
    const {
        mutateAsync: createTicketAsync,
        isPending: isCreatingTicket,
        isError: isCreatePrinterError,
        error: createPrinterError,
        isSuccess: isTicketSuccess,
    } = useCreateTicket();

    const [form, setForm] = useState<CreateTicket>({...createTicketDefault});
    const navigate = useNavigate();
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = form.name.trim();
        const content = form.content.trim();

        if (name.length === 0 || content.length == 0) {
            return;
        }

        await createTicketAsync({
            ...form
        });

    }

    if (isCreatePrinterError) {
        return <MyError>
            <p>{getUserErrorMessage(createPrinterError, "Erreur lors de la création du ticket.")}</p>

            {import.meta.env.DEV && (
                <pre className="mt-4 whitespace-pre-wrap rounded bg-red-100 p-3 text-xs">
                {getDeveloperErrorDetails(createPrinterError)}
                </pre>
            )}
        </MyError>
    }

    if (isTicketSuccess) {
        return  <>
            <div className="rounded-[30px] p-5 bg-green-200 text-green-500">
                Votre Ticket a été créer avec succès
            </div>
            <Button otherClassName="mt-3" onClick={() => window.location.reload()}>
                Retour
            </Button>
        </>

    }

    return<>
        <h1>Création ticket</h1>
    
        <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
            <Label htmlFor="ticketName" id="titre">Titre ticket</Label>
            <Input 
                value={form.name}
                id="ticketName" type="text" 
                onChange={(event) => {
                    setForm({
                        ...form,
                        name: event.target.value
                    });
                }}
            />
            <Label htmlFor="contentTicket">Description</Label>
            <Textarea 
                value={form.content}
                onChange={(event) => {
                    setForm({
                        ...form,
                        content: event.target.value
                    });
                }}
                id="contentTicket" />
            <Label htmlFor="elementsTicket">Element</Label>

            <div className="flex">
                <span>Mes éléments</span>
                <Select>
                    <option value="">--------</option>
                </Select>
            </div>
            
            <div className="flex">
                <span>Ou recherche complète</span>
                <Select> 
                    <option value="">--------</option>
                </Select>
            </div>
            <Button type="submit" otherClassName="justify-center">
                {isCreatingTicket ? "Création Ticket..." : "Valider"}
            </Button>
        </form>
    </>
}