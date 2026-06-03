import type { ReactNode } from "react";

type DataTableProps = {
  children: ReactNode;
  className?: string;
  tableClassName?: string;
  tableHead?: ReactNode;
  toolbar?: ReactNode;
};

export function DataTable({
  children,
  className = "",
  tableClassName = "",
  tableHead,
  toolbar,
}: DataTableProps) {
  return (
    <section
      className={`col-span-12 rounded-[34px] border p-6 shadow-[var(--shadow-soft)] ${className}`}
      style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}
    >
      <div className="rounded-[30px] p-5" style={{ backgroundColor: "var(--panel-bg)" }}>
        {toolbar}
        {tableHead ? (
          <div className="overflow-x-auto">
            <table className={`w-full border-separate [border-spacing:0_0.5rem] ${tableClassName}`}>
              {tableHead}
              <tbody>{children}</tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-2">{children}</div>
        )}
      </div>
    </section>
  );
}
