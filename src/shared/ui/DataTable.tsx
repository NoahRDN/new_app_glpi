import type { ReactNode } from "react";

type DataTableProps = {
  children?: ReactNode;
  className?: string;
  tableClassName?: string;
  tableHeads?: ReactNode[];
  toolbar?: ReactNode;
  toolbarFooter?: ReactNode;
};

export function DataTable({
  children,
  className = "",
  tableClassName = "",
  tableHeads,
  toolbar,
  toolbarFooter,
}: DataTableProps) {
  return (
    <section
      className={`col-span-12 rounded-[34px] border p-6 shadow-[var(--shadow-soft)] ${className}`}
      style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}
    >
      <div className="rounded-[30px] p-5" style={{ backgroundColor: "var(--panel-bg)" }}>
        {toolbar}
        {tableHeads ? (
          <div className="overflow-x-auto">
            <table className={`w-full border-separate [border-spacing:0_0.5rem] ${tableClassName}`}>
              <thead>
                <tr className="text-left text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                    { tableHeads.map((tableHead, index) => {
                      return<th key={index} className="px-4 py-4">
                          {tableHead}
                        </th>
                    }) }
                </tr>
              </thead>
              <tbody>{children}</tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-2">{children}</div>
        )}
        {toolbarFooter}
      </div>
    </section>
  );
}
