import type { ReactNode } from "react";

type BadgeTone = "default" | "danger" | "success" | "warning";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  const toneClass = {
    default: "border-[var(--panel-border)] bg-[var(--panel-soft)] text-[var(--text-secondary)]",
    danger: "border-rose-200/50 bg-rose-500/10 text-rose-500",
    success: "border-emerald-200/50 bg-emerald-500/10 text-emerald-500",
    warning: "border-amber-200/50 bg-amber-500/10 text-amber-500",
  }[tone];

  return (
    <span
      className={`inline-flex w-fit items-center justify-center rounded-full border px-2.5 py-1 text-xs capitalize tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}
