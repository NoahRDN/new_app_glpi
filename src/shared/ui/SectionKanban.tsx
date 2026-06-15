import { useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";
import { Plus } from "lucide-react";

type SectionKanbanProps = {
  children?: ReactNode;
  totalTicketKanban: number;
  ticketKanbanGroupName: string;
  isDisplayAddTicket: boolean;
  backgroundColorSection: string;
  onCreatedTicket: () => void;
  onTicketDrop: (ticketId: number) => void | Promise<void>;
  isUpdating?: boolean;
};

export function SectionKanban({
  onTicketDrop,
  onCreatedTicket,
  isDisplayAddTicket,
  children,
  totalTicketKanban,
  ticketKanbanGroupName,
  backgroundColorSection,
}: SectionKanbanProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragDepth = useRef(0);

  return (
    <div
      className={`flex min-h-80 flex-col gap-3 rounded-2xl p-5 transition ${
        isDragOver ? "ring-4 ring-blue-400" : ""
      }`}
      style={{ backgroundColor: backgroundColorSection }}
      onDragEnter={() => {
        dragDepth.current += 1;
        setIsDragOver(true);
      }}
      onDragLeave={() => {
        dragDepth.current -= 1;

        if (dragDepth.current <= 0) {
          dragDepth.current = 0;
          setIsDragOver(false);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={async (event) => {
        event.preventDefault();

        dragDepth.current = 0;
        setIsDragOver(false);

        const ticketId = Number(event.dataTransfer.getData("ticketId"));

        console.log("groupTicket: ", ticketId);

        if (Number.isNaN(ticketId)) {
          return;
        }

        await onTicketDrop(ticketId);
      }}
    >
      <div className="flex justify-between">
        <h3 className="font-bold">{ticketKanbanGroupName}</h3>

        <span className="rounded-2xl bg-(--text-secondary) px-2 py-1">
          {totalTicketKanban}
        </span>
      </div>

      {children}

      {isDisplayAddTicket && (
        <Button
          type="button"
          onClick={onCreatedTicket}
          className="bg-(--text-secondary)"
          isWithBackground={false}
        >
          <Plus />
          Ajouter 1 Ticket
        </Button>
      )}
    </div>
  );
}