import type { ReactNode } from "react";

type BadgeTone = "default" | "danger" | "success" | "warning";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  const toneClass = {
    default: "border-slate-200 bg-slate-100 text-slate-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  }[tone];

  return (
    <span
      className={`inline-flex w-fit items-center justify-center rounded-full border px-2.5 py-1 text-xs capitalize tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}
