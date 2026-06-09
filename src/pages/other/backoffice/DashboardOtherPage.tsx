import { CustomerGrowthPanel } from "../../../features/other/dashboard/components/CustomerGrowthPanel";
import { SalesLocationsPanel } from "../../../features/other/dashboard/components/SalesLocationsPanel";
import { TransactionHistoryPanel } from "../../../features/other/dashboard/components/TransactionHistoryPanel";
import { RecentCustomersPanel } from "../../../features/other/dashboard/components/RecentCustomersPanel";
import { dashboardSummaryCards } from "../../../features/other/dashboard/model/dashboard.mock";
import { PillFilter } from "../../../shared/ui/PillFilter";
import { SectionPanel } from "../../../shared/ui/SectionPanel";
import { StatCard } from "../../../shared/ui/StatCard";

export function DashboardOtherPage() {
  return (
    <>
      <SectionPanel className="xl:col-span-12" title="Overview">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {["1 Year", "2 Year", "3 Year"].map((period, index) => (
            <PillFilter key={period} active={index === 0}>
              {period}
            </PillFilter>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-5">
          {dashboardSummaryCards.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              delta={card.delta}
              tone={card.tone}
            />
          ))}
        </div>
      </SectionPanel>
      <CustomerGrowthPanel />
      <SalesLocationsPanel />
      <TransactionHistoryPanel />
      <RecentCustomersPanel />
    </>
  );
}
