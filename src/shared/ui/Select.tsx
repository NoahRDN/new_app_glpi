import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SelectProps = ComponentPropsWithoutRef<"select"> & {
    children: ReactNode;
    isFullWidth?: boolean;
};

export function Select({ isFullWidth, children, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`${isFullWidth ? "w-full" : "w-auto"} rounded-[18px] border px-3 py-3 text-lg font-semibold outline-none border-[var(--panel-border)] bg-[var(--panel-soft)] text-[var(--text-primary)] ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}