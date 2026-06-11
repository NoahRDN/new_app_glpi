import { useMemo, useState } from "react";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import {
  ticketFilterDefault,
  TICKET_IN_PROGRESS_STATUS_IDS,
  TICKET_STATUS_IDS,
} from "../../../../entities/ticket/model/ticket.config";
import { groupTicketsByKanban } from "../lib/ticketKanban";
import { ticketKanbanGroups } from "../model/ticketKanban.config";
import { SectionKanban } from "../../../../shared/ui/SectionKanban";
import { Modal } from "../../../../shared/ui/Modal";
import { TicketsAdd } from "../../ticket/components/TicketsAdd";
import { useAllTickets } from "../../ticket/hooks/useAllTickets";
import { Loader } from "../../../../shared/ui/Loader";
import { useUpdateTicketStatus } from "../hooks/useUpdateTicketStatus";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { useCreateTicketTeamMember } from "../../ticket/hooks/useCreateTicketTeamMember";

export function ListTicketKanban() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusRequirementModalOpen, setIsStatusRequirementModalOpen] = useState(false);
  const [draggingTicketId, setDraggingTicketId] = useState<number | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    statusId: number;
    ticket: Ticket;
  } | null>(null);
  const {
    mutateAsync: updateTicketStatusAsync,
  } = useUpdateTicketStatus();
  const {
    mutateAsync: createTicketTeamMemberAsync,
  } = useCreateTicketTeamMember();

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

  async function handleTicketDrop(ticketId: number, statusId: number) {
    const droppedTicket = (ticketsAll ?? []).find((ticket) => ticket.id === ticketId);

    if (!droppedTicket) {
      return;
    }

    const currentStatusId = droppedTicket.status?.id;
    const requiresAssignmentStep =
      currentStatusId === TICKET_STATUS_IDS.NEW &&
      TICKET_IN_PROGRESS_STATUS_IDS.includes(statusId);

    if (requiresAssignmentStep) {
      setPendingStatusChange({
        statusId,
        ticket: droppedTicket,
      });
      setIsStatusRequirementModalOpen(true);
      return;
    }

    await updateTicketStatusAsync({
      ticketId,
      statusId,
    });
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

    <Modal
      isOpen={isStatusRequirementModalOpen}
      title="Informations complémentaires requises"
      onClose={() => {
        setIsStatusRequirementModalOpen(false);
        setPendingStatusChange(null);
      }}
    >
      <TicketsAdd
        isModal={true}
        isAssignmentStepOnly={true}
        onClose={() => {
          setIsStatusRequirementModalOpen(false);
          setPendingStatusChange(null);
        }}
        onSubmitAssignmentStep={async ({ technicianGroupId, technicianUserId }) => {
          if (!pendingStatusChange) {
            return;
          }

          if (technicianUserId !== undefined) {
            await createTicketTeamMemberAsync({
              ticketId: pendingStatusChange.ticket.id,
              payload: {
                id: technicianUserId,
                role: "assigned",
                type: "User",
              },
            });
          }

          if (technicianGroupId !== undefined) {
            await createTicketTeamMemberAsync({
              ticketId: pendingStatusChange.ticket.id,
              payload: {
                id: technicianGroupId,
                role: "assigned",
                type: "Group",
              },
            });
          }

          await updateTicketStatusAsync({
            ticketId: pendingStatusChange.ticket.id,
            statusId: pendingStatusChange.statusId,
          });

          setIsStatusRequirementModalOpen(false);
          setPendingStatusChange(null);
        }}
      />
    </Modal>

    <div className="col-span-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {ticketKanbanGroups.map((ticketKanbanGroup) => (
        <SectionKanban
          key={ticketKanbanGroup.key}
          onCreatedTicket={() => setIsModalOpen(true)}
          onTicketDrop={(ticketId) => handleTicketDrop(ticketId, ticketKanbanGroup.targetStatusId)}
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
              className={draggingTicketId === groupTicket.id ? "opacity-40" : ""}
              onDragStart={(event) => {
                setDraggingTicketId(groupTicket.id);
                event.dataTransfer.setData("ticketId", String(groupTicket.id));
              }}
              onDragEnd={() => {
                setDraggingTicketId(null);
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
