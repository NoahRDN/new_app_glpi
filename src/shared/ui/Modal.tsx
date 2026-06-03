import type { ReactNode } from "react";
import {CircleX} from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-xl rounded-[28px] border p-6 shadow-[var(--shadow-soft)]"
        style={{
          backgroundColor: "var(--panel-bg)",
          borderColor: "var(--panel-border)",
        }}
      >
        <header className="mb-4 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-semibold text-(--text-primary)">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            <CircleX color="var(--text-primary)" />
          </button>
        </header>

        <div>{children}</div>
      </section>
    </div>
  );
}
