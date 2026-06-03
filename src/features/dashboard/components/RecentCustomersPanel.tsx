import { useState } from "react";
import { MiniSparkline } from "../../../shared/ui/MiniSparkline";
import { SectionPanel } from "../../../shared/ui/SectionPanel";
import { recentCustomers } from "../model/dashboard.mock";

function Avatar({ name, accent }: { accent: string; name: string }) {
  const colors = {
    blue: ["#2a6df2", "#6f83ff"],
    green: ["#0da26f", "#2dd4bf"],
    orange: ["#f59e0b", "#f97316"],
    purple: ["#5a45c5", "#8b5cf6"],
  } as const;

  const [from, to] = colors[accent as keyof typeof colors] ?? colors.blue;
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div
      className="flex h-13 w-13 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initials}
    </div>
  );
}

export function RecentCustomersPanel() {
  const [showAll, setShowAll] = useState(false);
  const visibleCustomers = showAll ? recentCustomers : recentCustomers.slice(0, 3);

  return (
    <SectionPanel className="xl:col-span-5" title="Recent Customers" trailing={<span className="text-3xl text-(--text-secondary)">...</span>}>
      <div className="rounded-[30px] px-6 py-3" style={{ backgroundColor: "var(--panel-bg)" }}>
        {visibleCustomers.map((customer, index) => (
          <div
            key={customer.name}
            className="flex items-center justify-between gap-4 py-5"
            style={{
              borderTop: index === 0 ? "none" : "1px solid var(--panel-border)",
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar name={customer.name} accent={customer.accent} />
              <div>
                <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  {customer.name}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {customer.handle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="text-sm font-semibold"
                style={{
                  color: customer.status === "Pending" ? "var(--accent-orange)" : "var(--accent-green)",
                }}
              >
                {customer.status}
              </span>
              <MiniSparkline
                color={
                  customer.accent === "purple"
                    ? "var(--accent-purple)"
                    : customer.accent === "green"
                      ? "var(--accent-green)"
                      : customer.accent === "orange"
                        ? "var(--accent-orange)"
                        : "var(--accent-blue)"
                }
              />
            </div>
          </div>
        ))}

        <div className="pb-4 pt-2">
          <button
            className="w-full rounded-[18px] px-5 py-4 text-sm font-semibold"
            style={{ backgroundColor: "var(--panel-soft)", color: "var(--text-secondary)" }}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "Show fewer Customers" : "View more Customers"}
          </button>
        </div>
      </div>
    </SectionPanel>
  );
}
