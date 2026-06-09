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
}

export function SectionKanban({onCreatedTicket, isDisplayAddTicket, children, totalTicketKanban, ticketKanbanGroupName, backgroundColorSection } : SectionKanbanProps){
    return <>
        <div className={`p-5 rounded-2xl flex flex-col gap-3`} 
            style={{ backgroundColor: backgroundColorSection }}
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