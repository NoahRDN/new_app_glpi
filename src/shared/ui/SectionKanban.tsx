import type { ReactNode } from "react"
import { Button } from "./Button"
import { Plus } from "lucide-react"

type SectionKanbanProps = {
    children?: ReactNode,
    totalTicketKanban: number,
    ticketKanbanGroupName: string,
    isDisplayAddTicket: boolean,
    backgroundColorSection: string,
    onCreatedTicket: () => void;
    onTicketDrop: () => void;
    isUpdating?: boolean;
}

export function SectionKanban({onTicketDrop, onCreatedTicket, isDisplayAddTicket, children, totalTicketKanban, ticketKanbanGroupName, backgroundColorSection } : SectionKanbanProps){
    return <>
        <div
            className="flex min-h-80 flex-col gap-3 rounded-2xl p-5"
            style={{ backgroundColor: backgroundColorSection }}
            onDragOver={(event) => {
                event.preventDefault();
            }}
            onDrop={(event) => {
                event.preventDefault();
                onTicketDrop();
            }}
        >
            <div className="flex justify-between">
                <h3 className="font-bold">{ticketKanbanGroupName}</h3>
                <span className="bg-(--text-secondary) px-2 py-1 rounded-2xl">{totalTicketKanban}</span>
            </div>
            {children}
            {isDisplayAddTicket && <Button type="button" onClick={onCreatedTicket} className="bg-(--text-secondary)" isWithBackground={false}><Plus />Ajouter 1 Ticket</Button>}
        </div>
    </>
}