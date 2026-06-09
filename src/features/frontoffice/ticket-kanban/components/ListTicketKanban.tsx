import { useMemo, useState } from "react";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { ticketFilterDefault } from "../../../../entities/ticket/model/ticket.config";
import { groupTicketsByKanban } from "../lib/ticketKanban";
import { ticketKanbanGroups } from "../model/ticketKanban.config";
import { useTicketKanbanCounts } from "../hooks/useTicketKanbanCounts";
import { SectionKanban } from "../../../../shared/ui/SectionKanban";
import { Modal } from "../../../../shared/ui/Modal";
import { TicketsAdd } from "../../ticket/components/TicketsAdd";
import { useAllTickets } from "../../ticket/hooks/useAllTickets";
import { Loader } from "../../../../shared/ui/Loader";

export function ListTicketKanban() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: ticketKanbanCounts,
  } = useTicketKanbanCounts();

  const {
      data: ticketsAll,
      isPending: isTicketsAllPending,
      isError: isTicketsAllError,
      error: ticketsAllError,
  } = useAllTickets({...ticketFilterDefault});
  
  const groupTickets = useMemo(() => {
    return groupTicketsByKanban(ticketsAll ?? []);
  }, [ticketsAll]);

  if (isTicketsAllPending) {
        return <Loader label="Chargement des Tickets..." />
    }

  if (isTicketsAllError) {
    return (
      <div className="col-span-12 text-red-500">
        {getUserErrorMessage(ticketsAllError, "Impossible de charger les tickets.")}
      </div>
    );
  }

  return (<>

    <Modal
      isOpen={isModalOpen}
      title="Création Computer"
      onClose={() => {
          setIsModalOpen(false)
      }}
    >
      <TicketsAdd isModal={true} onClose={() => setIsModalOpen(false)} />
    </Modal>

    <div className="col-span-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {ticketKanbanGroups.map((ticketKanbanGroup, index) => (
        <SectionKanban 
          key={index}
          onCreatedTicket={() => setIsModalOpen(true)}
          backgroundColorSection={"#ffe6e0"} 
          isDisplayAddTicket={ticketKanbanGroup.key === "new"} 
          ticketKanbanGroupName={ticketKanbanGroup.label}  
          totalTicketKanban={ticketKanbanCounts?.[ticketKanbanGroup.key] ?? 0} 
        >
          {groupTickets && groupTickets[ticketKanbanGroup.key].map((groupTicket, index) => <Button key={index} type="button" isWithBackground={false}>{groupTicket.name}</Button>)}
        </SectionKanban>        
      ))}
    </div>
  </>);
}
