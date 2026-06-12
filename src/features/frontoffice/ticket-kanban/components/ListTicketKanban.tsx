import { useMemo, useState } from "react";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import {
  ticketFilterDefault,
  TICKET_IN_PROGRESS_STATUS_IDS,
  TICKET_STATUS_IDS,
  TICKET_SOLUTION_STATUS_IDS,
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
import { useCreateTicketFollowup } from "../../ticket/hooks/useCreateTicketFollowup";
import { useCreateTicketSolution } from "../../ticket/hooks/useCreateTicketSolution";
import { useUpdateTicketSolution } from "../../ticket/hooks/useUpdateTicketSolution";
import { TicketStatusTransitionForm, type TicketStatusTransitionMode } from "./TicketStatusTransitionForm";
import { TicketResolvedReviewForm } from "./TicketResolvedReviewForm";
import { getTicketSolutions } from "../../../../entities/ticket/api/ticketSolution.api";
import type { TicketKanbanGroupKey } from "../model/ticketKanban.types";

function hasAssignedTechnicianOrGroup(ticket: Ticket) {
  return ticket.team.some((teamMember) => {
    const normalizedRole = teamMember.role.trim().toLowerCase();
    const normalizedType = teamMember.type.trim().toLowerCase();

    return (
      normalizedRole === "assigned" &&
      (normalizedType === "user" || normalizedType === "group")
    );
  });
}

export function ListTicketKanban() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusRequirementModalOpen, setIsStatusRequirementModalOpen] = useState(false);
  const [statusTransitionError, setStatusTransitionError] = useState<unknown>(null);
  const [pendingTransition, setPendingTransition] = useState<{
    mode: TicketStatusTransitionMode;
    nextModeAfterSuccess?: "review";
    targetStatusId?: number;
    ticket: Ticket;
  } | null>(null);
  const [pendingResolvedReview, setPendingResolvedReview] = useState<{
    refuseStatusId: number;
    ticket: Ticket;
  } | null>(null);
  const [draggingTicketId, setDraggingTicketId] = useState<number | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    nextModeAfterSuccess?: TicketStatusTransitionMode;
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
    mutateAsync: createTicketSolutionAsync,
    isPending: isCreatingTicketSolution,
    error: createTicketSolutionError,
  } = useCreateTicketSolution();
  const {
    mutateAsync: updateTicketSolutionAsync,
    isPending: isUpdatingTicketSolution,
    error: updateTicketSolutionError,
  } = useUpdateTicketSolution();
  const {
    mutateAsync: createTicketFollowupAsync,
    isPending: isCreatingTicketFollowup,
    error: createTicketFollowupError,
  } = useCreateTicketFollowup();

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

  function closeStatusTransitionModal() {
    setIsStatusRequirementModalOpen(false);
    setPendingStatusChange(null);
    setPendingTransition(null);
    setPendingResolvedReview(null);
    setStatusTransitionError(null);
  }

  function openResolvedReviewModal(params: {
    refuseStatusId: number;
    ticket: Ticket;
  }) {
    setPendingStatusChange(null);
    setPendingTransition(null);
    setPendingResolvedReview(params);
    setStatusTransitionError(null);
    setIsStatusRequirementModalOpen(true);
  }

  async function redirectToMissingSolutionStep(ticket: Ticket) {
    await updateTicketStatusAsync({
      ticketId: ticket.id,
      statusId: TICKET_STATUS_IDS.ASSIGNED,
    });

    setPendingResolvedReview(null);
    setPendingStatusChange(null);
    setPendingTransition({
      mode: "resolve",
      nextModeAfterSuccess: "review",
      ticket,
    });
    setStatusTransitionError(null);
    setIsStatusRequirementModalOpen(true);
  }

  async function getLatestTicketSolution(ticketId: number) {
    const solutions = await getTicketSolutions(ticketId);
    const validSolutions = solutions.filter(
      (solution) => typeof solution.id === "number",
    );

    const sortedSolutions = [...validSolutions].sort((left, right) => {
      const leftTimestamp = new Date(
        left.date_mod ?? left.date_creation ?? "1970-01-01T00:00:00Z",
      ).getTime();
      const rightTimestamp = new Date(
        right.date_mod ?? right.date_creation ?? "1970-01-01T00:00:00Z",
      ).getTime();

      if (leftTimestamp === rightTimestamp) {
        return right.id - left.id;
      }

      return rightTimestamp - leftTimestamp;
    });

    return sortedSolutions[0];
  }

  async function handleTicketDrop(
    ticketId: number,
    statusId: number,
    destinationGroupKey: TicketKanbanGroupKey,
  ) {
    const droppedTicket = (ticketsAll ?? []).find((ticket) => ticket.id === ticketId);

    if (!droppedTicket) {
      return;
    }

    const currentStatusId = droppedTicket.status?.id;
    const alreadyHasAssignment = hasAssignedTechnicianOrGroup(droppedTicket);
    const isDoneDestination = destinationGroupKey === "done";
    const shouldCloseNewTicket =
      currentStatusId === TICKET_STATUS_IDS.NEW &&
      isDoneDestination;
    const shouldResolveNewTicket =
      currentStatusId === TICKET_STATUS_IDS.NEW &&
      statusId === TICKET_STATUS_IDS.SOLVED;
    const shouldResolveTicket =
      currentStatusId !== undefined &&
      TICKET_IN_PROGRESS_STATUS_IDS.includes(currentStatusId) &&
      statusId === TICKET_STATUS_IDS.SOLVED;
    const shouldCloseInProgressTicket =
      currentStatusId !== undefined &&
      TICKET_IN_PROGRESS_STATUS_IDS.includes(currentStatusId) &&
      isDoneDestination;
    const shouldApproveResolvedTicket =
      currentStatusId === TICKET_STATUS_IDS.SOLVED &&
      isDoneDestination;
    const shouldRefuseResolvedTicket =
      currentStatusId === TICKET_STATUS_IDS.SOLVED &&
      TICKET_IN_PROGRESS_STATUS_IDS.includes(statusId);
    const shouldReopenClosedTicket =
      currentStatusId === TICKET_STATUS_IDS.CLOSED &&
      TICKET_IN_PROGRESS_STATUS_IDS.includes(statusId);
    const shouldReturnClosedTicketToNew =
      currentStatusId === TICKET_STATUS_IDS.CLOSED &&
      statusId === TICKET_STATUS_IDS.NEW;
    const requiresAssignmentStep =
      currentStatusId === TICKET_STATUS_IDS.NEW &&
      TICKET_IN_PROGRESS_STATUS_IDS.includes(statusId) &&
      !alreadyHasAssignment;

    if (shouldCloseNewTicket) {
      if (!alreadyHasAssignment) {
        setPendingStatusChange({
          nextModeAfterSuccess: "resolve",
          statusId: TICKET_STATUS_IDS.ASSIGNED,
          ticket: droppedTicket,
        });
        setIsStatusRequirementModalOpen(true);
        return;
      }

      setPendingTransition({
        mode: "resolve",
        nextModeAfterSuccess: "review",
        ticket: droppedTicket,
      });
      setIsStatusRequirementModalOpen(true);
      return;
    }

    if (shouldResolveNewTicket) {
      if (!alreadyHasAssignment) {
        setPendingStatusChange({
          nextModeAfterSuccess: "resolve",
          statusId: TICKET_STATUS_IDS.ASSIGNED,
          ticket: droppedTicket,
        });
        setIsStatusRequirementModalOpen(true);
        return;
      }

      setPendingTransition({
        mode: "resolve",
        ticket: droppedTicket,
      });
      setIsStatusRequirementModalOpen(true);
      return;
    }

    if (requiresAssignmentStep) {
      setPendingStatusChange({
        statusId,
        ticket: droppedTicket,
      });
      setIsStatusRequirementModalOpen(true);
      return;
    }

    if (shouldResolveTicket) {
      setPendingTransition({
        mode: "resolve",
        ticket: droppedTicket,
      });
      setIsStatusRequirementModalOpen(true);
      return;
    }

    if (shouldCloseInProgressTicket) {
      setPendingTransition({
        mode: "resolve",
        nextModeAfterSuccess: "review",
        ticket: droppedTicket,
      });
      setIsStatusRequirementModalOpen(true);
      return;
    }

    if (shouldApproveResolvedTicket) {
      openResolvedReviewModal({
        refuseStatusId: TICKET_STATUS_IDS.ASSIGNED,
        ticket: droppedTicket,
      });
      return;
    }

    if (shouldRefuseResolvedTicket) {
      setPendingTransition({
        mode: "refuse",
        ticket: droppedTicket,
      });
      setIsStatusRequirementModalOpen(true);
      return;
    }

    if (shouldReopenClosedTicket) {
      setPendingTransition({
        mode: "reopen",
        targetStatusId: TICKET_STATUS_IDS.ASSIGNED,
        ticket: droppedTicket,
      });
      setIsStatusRequirementModalOpen(true);
      return;
    }

    if (shouldReturnClosedTicketToNew) {
      setPendingTransition({
        mode: "reopen",
        targetStatusId: TICKET_STATUS_IDS.NEW,
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
      title={
        pendingTransition?.mode === "approve"
          ? "Approuver la solution"
        : pendingTransition?.mode === "refuse"
          ? "Refuser la solution"
        : pendingTransition?.mode === "resolve"
          ? "Saisir une solution"
        : pendingTransition?.mode === "reopen"
          ? "Raison de réouverture"
        : pendingResolvedReview
          ? "Valider ou refuser la solution"
        : "Informations complémentaires requises"
      }
      onClose={closeStatusTransitionModal}
    >
      {pendingStatusChange ? (
        <TicketsAdd
          isModal={true}
          isAssignmentStepOnly={true}
          onClose={closeStatusTransitionModal}
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

            if (pendingStatusChange.nextModeAfterSuccess === "resolve") {
              setPendingStatusChange(null);
              setPendingTransition({
                mode: "resolve",
                nextModeAfterSuccess: "review",
                ticket: pendingStatusChange.ticket,
              });
              return;
            }

            closeStatusTransitionModal();
          }}
        />
      ) : pendingResolvedReview ? (
        <TicketResolvedReviewForm
          isPending={
            isUpdatingTicketSolution ||
            isCreatingTicketFollowup
          }
          submitError={
            statusTransitionError ??
            updateTicketSolutionError ??
            createTicketFollowupError
          }
          onClose={closeStatusTransitionModal}
          onApprove={async ({ comment }) => {
            try {
              setStatusTransitionError(null);

              const latestSolution = await getLatestTicketSolution(pendingResolvedReview.ticket.id);

              if (!latestSolution || typeof latestSolution.id !== "number") {
                await redirectToMissingSolutionStep(pendingResolvedReview.ticket);
                return;
              }

              await updateTicketSolutionAsync({
                id: latestSolution.id,
                ticketId: pendingResolvedReview.ticket.id,
                status: TICKET_SOLUTION_STATUS_IDS.ACCEPTED,
              });

              if (comment.length > 0) {
                await createTicketFollowupAsync({
                  ticketId: pendingResolvedReview.ticket.id,
                  payload: {
                    content: comment,
                    items_id: pendingResolvedReview.ticket.id,
                    itemtype: "Ticket",
                  },
                });
              }

              await updateTicketStatusAsync({
                ticketId: pendingResolvedReview.ticket.id,
                statusId: TICKET_STATUS_IDS.CLOSED,
              });
              closeStatusTransitionModal();
            } catch (error) {
              setStatusTransitionError(error);
            }
          }}
          onRefuse={async ({ comment }) => {
            try {
              setStatusTransitionError(null);

              const latestSolution = await getLatestTicketSolution(pendingResolvedReview.ticket.id);

              if (!latestSolution || typeof latestSolution.id !== "number") {
                await redirectToMissingSolutionStep(pendingResolvedReview.ticket);
                return;
              }

              await updateTicketSolutionAsync({
                id: latestSolution.id,
                ticketId: pendingResolvedReview.ticket.id,
                status: TICKET_SOLUTION_STATUS_IDS.REFUSED,
              });

              await createTicketFollowupAsync({
                ticketId: pendingResolvedReview.ticket.id,
                payload: {
                  content: comment,
                  items_id: pendingResolvedReview.ticket.id,
                  itemtype: "Ticket",
                },
              });

              await updateTicketStatusAsync({
                ticketId: pendingResolvedReview.ticket.id,
                statusId: pendingResolvedReview.refuseStatusId,
              });
              closeStatusTransitionModal();
            } catch (error) {
              setStatusTransitionError(error);
            }
          }}
        />
      ) : pendingTransition ? (
        <TicketStatusTransitionForm
          mode={pendingTransition.mode}
          isPending={
            isCreatingTicketSolution ||
            isUpdatingTicketSolution ||
            isCreatingTicketFollowup
          }
          submitError={
            statusTransitionError ??
            createTicketSolutionError ??
            updateTicketSolutionError ??
            createTicketFollowupError
          }
          onClose={closeStatusTransitionModal}
          onSubmit={async ({ comment }) => {
            try {
              setStatusTransitionError(null);

              if (pendingTransition.mode === "resolve") {
                await createTicketSolutionAsync({
                  ticketId: pendingTransition.ticket.id,
                  payload: {
                    content: comment,
                    items_id: pendingTransition.ticket.id,
                    itemtype: "Ticket",
                  },
                });

                await updateTicketStatusAsync({
                  ticketId: pendingTransition.ticket.id,
                  statusId: TICKET_STATUS_IDS.SOLVED,
                });

                if (pendingTransition.nextModeAfterSuccess === "review") {
                  setPendingTransition(null);
                  setPendingResolvedReview({
                    refuseStatusId: TICKET_STATUS_IDS.ASSIGNED,
                    ticket: pendingTransition.ticket,
                  });
                  return;
                }

                closeStatusTransitionModal();
                return;
              }

              if (pendingTransition.mode === "approve") {
                openResolvedReviewModal({
                  refuseStatusId: TICKET_STATUS_IDS.ASSIGNED,
                  ticket: pendingTransition.ticket,
                });
                return;
              }

              if (pendingTransition.mode === "refuse") {
                const latestSolution = await getLatestTicketSolution(pendingTransition.ticket.id);

                if (!latestSolution || typeof latestSolution.id !== "number") {
                  await redirectToMissingSolutionStep(pendingTransition.ticket);
                  return;
                }

                await updateTicketSolutionAsync({
                  id: latestSolution.id,
                  ticketId: pendingTransition.ticket.id,
                  status: TICKET_SOLUTION_STATUS_IDS.REFUSED,
                });

                await createTicketFollowupAsync({
                  ticketId: pendingTransition.ticket.id,
                  payload: {
                    content: comment,
                    items_id: pendingTransition.ticket.id,
                    itemtype: "Ticket",
                  },
                });

                await updateTicketStatusAsync({
                  ticketId: pendingTransition.ticket.id,
                  statusId: TICKET_STATUS_IDS.ASSIGNED,
                });
                closeStatusTransitionModal();
                return;
              }

              await createTicketFollowupAsync({
                ticketId: pendingTransition.ticket.id,
                payload: {
                  content: comment,
                  items_id: pendingTransition.ticket.id,
                  itemtype: "Ticket",
                },
              });

              await updateTicketStatusAsync({
                ticketId: pendingTransition.ticket.id,
                statusId: TICKET_STATUS_IDS.ASSIGNED,
              });

              if (
                pendingTransition.targetStatusId !== undefined &&
                pendingTransition.targetStatusId !== TICKET_STATUS_IDS.ASSIGNED
              ) {
                await updateTicketStatusAsync({
                  ticketId: pendingTransition.ticket.id,
                  statusId: pendingTransition.targetStatusId,
                });
              }
              closeStatusTransitionModal();
            } catch (error) {
              setStatusTransitionError(error);
            }
          }}
        />
      ) : null}
    </Modal>

    <div className="col-span-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {ticketKanbanGroups.map((ticketKanbanGroup) => (
        <SectionKanban
          key={ticketKanbanGroup.key}
          onCreatedTicket={() => setIsModalOpen(true)}
          onTicketDrop={(ticketId) =>
            handleTicketDrop(
              ticketId,
              ticketKanbanGroup.targetStatusId,
              ticketKanbanGroup.key,
            )
          }
          backgroundColorSection={ticketKanbanGroup.backgroundColorSection}
          isDisplayAddTicket={ticketKanbanGroup.key === "new"}
          ticketKanbanGroupName={ticketKanbanGroup.label}
          totalTicketKanban={groupTickets[ticketKanbanGroup.key].length}
        >
          {groupTickets[ticketKanbanGroup.key].map((groupTicket) => (
            <div
              key={groupTicket.id}
              className={`rounded-[18px] bg-(--panel-soft) p-3 ${draggingTicketId === groupTicket.id ? "opacity-40" : ""}`}
              draggable
              onDragStart={(event) => {
                setDraggingTicketId(groupTicket.id);
                event.dataTransfer.setData("ticketId", String(groupTicket.id));
              }}
              onDragEnd={() => {
                setDraggingTicketId(null);
              }}
            >
              <p className="font-semibold text-(--text-primary)">{groupTicket.name}</p>
              <p className="mt-1 text-xs text-(--text-secondary)">
                {groupTicket.status?.name ?? "Sans statut"}
              </p>

              {groupTicket.status?.id === TICKET_STATUS_IDS.SOLVED && (
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    className="px-3 py-2 text-xs"
                    onClick={() => {
                      openResolvedReviewModal({
                        refuseStatusId: TICKET_STATUS_IDS.ASSIGNED,
                        ticket: groupTicket,
                      });
                    }}
                  >
                    Valider / Refuser
                  </Button>
                </div>
              )}
            </div>
          ))}
        </SectionKanban>
      ))}
    </div>
  </>);
}
