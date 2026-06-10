import { useMemo, useState } from "react";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { ticketFilterDefault } from "../../../../entities/ticket/model/ticket.config";
import { groupTicketsByKanban } from "../lib/ticketKanban";
import { ticketKanbanGroups } from "../model/ticketKanban.config";
import { SectionKanban } from "../../../../shared/ui/SectionKanban";
import { Modal } from "../../../../shared/ui/Modal";
import { TicketsAdd } from "../../ticket/components/TicketsAdd";
import { useAllTickets } from "../../ticket/hooks/useAllTickets";
import { Loader } from "../../../../shared/ui/Loader";
import { useUpdateTicketStatus } from "../hooks/useUpdateTicketStatus";

export function ListTicketKanban() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTicketId, setDraggedTicketId] = useState<number | null>(null);

  const {
    mutateAsync: updateTicketStatusAsync,
  } = useUpdateTicketStatus();

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
      title="Création ticket"
      onClose={() => {
          setIsModalOpen(false)
      }}
    >
      <TicketsAdd isModal={true} onClose={() => setIsModalOpen(false)} />
    </Modal>

    <div className="col-span-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {ticketKanbanGroups.map((ticketKanbanGroup) => (
        <SectionKanban
          key={ticketKanbanGroup.key}
          onCreatedTicket={() => setIsModalOpen(true)}
          onTicketDrop={async () => {
            if (draggedTicketId === null) {
              return;
            }

            await updateTicketStatusAsync({
              ticketId: draggedTicketId,
              statusId: ticketKanbanGroup.targetStatusId,
            });

            setDraggedTicketId(null);
          }}
          backgroundColorSection={ticketKanbanGroup.backgroundColorSection}
          isDisplayAddTicket={ticketKanbanGroup.key === "new"}
          ticketKanbanGroupName={ticketKanbanGroup.label}
          totalTicketKanban={groupTickets[ticketKanbanGroup.key].length}
        >
          {groupTickets[ticketKanbanGroup.key].map((groupTicket) => (
            <Button
              key={groupTicket.id}
              type="button"
              isWithBackground={false}
              draggable
              onDragStart={() => {
                setDraggedTicketId(groupTicket.id);
              }}
              onDragEnd={() => {
                setDraggedTicketId(null);
              }}
            >
              {groupTicket.name}
            </Button>
          ))}
        </SectionKanban>
      ))}
    </div>
  </>);
}
