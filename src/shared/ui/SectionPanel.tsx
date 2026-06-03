import type { ReactNode } from "react";

type SectionPanelProps = {
  children: ReactNode;
  className?: string;
  title: string;
  trailing?: ReactNode;
};

export function SectionPanel({
  children,
  className = "",
  title,
  trailing,
}: SectionPanelProps) {
  return (
    <section
      className={`col-span-12 rounded-[34px] border p-5 shadow-[var(--shadow-soft)] ${className}`}
      style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-[1.7rem] font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
        {trailing}
      </div>
      {children}
    </section>
  );
}
