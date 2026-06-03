import { useState } from "react";
import { SectionPanel } from "../../../shared/ui/SectionPanel";
import { dashboardTransactions } from "../model/dashboard.mock";

export function TransactionHistoryPanel() {
  const [showAll, setShowAll] = useState(false);
  const visibleTransactions = showAll ? dashboardTransactions : dashboardTransactions.slice(0, 2);

  return (
    <SectionPanel className="xl:col-span-7" title="Transaction History" trailing={<span className="text-3xl text-[var(--text-secondary)]">...</span>}>
      <div className="overflow-hidden rounded-[30px]" style={{ backgroundColor: "var(--panel-bg)" }}>
        <div
          className="grid grid-cols-[1.6fr_1fr_0.8fr] px-8 py-5 text-sm font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>Payment Number</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        <div className="px-8 pb-6">
          {visibleTransactions.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.6fr_1fr_0.8fr] items-center py-6"
              style={{
                borderTop: index === 0 ? "none" : "1px solid var(--panel-border)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold"
                  style={{
                    backgroundColor:
                      item.tone === "danger"
                        ? "color-mix(in srgb, var(--accent-orange) 12%, var(--panel-bg))"
                        : "color-mix(in srgb, var(--accent-green) 12%, var(--panel-bg))",
                    color: item.tone === "danger" ? "var(--accent-orange)" : "var(--accent-green)",
                  }}
                >
                  {item.tone === "danger" ? "×" : item.amount.startsWith("-") ? "↩" : "✓"}
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    {item.text} <span style={{ color: "var(--accent-blue)" }}>{item.id}</span>
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    Today, 10:30 AM
                  </p>
                </div>
              </div>
              <p className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                {item.amount}
              </p>
              <div>
                <span
                  className="inline-flex rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor:
                      item.tone === "danger"
                        ? "color-mix(in srgb, var(--accent-orange) 14%, var(--panel-bg))"
                        : "color-mix(in srgb, var(--accent-green) 14%, var(--panel-bg))",
                    color: item.tone === "danger" ? "var(--accent-orange)" : "var(--accent-green)",
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-8 pb-8">
          <button
            className="w-full rounded-[18px] px-5 py-4 text-sm font-semibold"
            style={{ backgroundColor: "var(--panel-soft)", color: "var(--text-secondary)" }}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "Show fewer transactions" : "View All transactions"}
          </button>
        </div>
      </div>
    </SectionPanel>
  );
}
