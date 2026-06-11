import type { ReactNode } from "react";
import { CircleX } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  isModalColorGreen?: boolean;
  isModalColorRed?: boolean;
  onClose: () => void;
};

export function Modal({ isOpen, title, children, onClose , isModalColorGreen, isModalColorRed}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col rounded-[28px] border p-6 shadow-[var(--shadow-soft)] bg-(--panel-bg) border-(--panel-border) ${isModalColorGreen && `bg-green-300 border-green-300`} ${isModalColorRed && `bg-red-300 border-red-300`} `}
      >
        <header className="mb-4 flex shrink-0 items-center justify-between gap-4">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-(--text-primary)"
          >
            {title}
          </h2>

          <button type="button" onClick={onClose}>
            <CircleX color="var(--text-primary)" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          {children}
        </div>
      </section>
    </div>
  );
}