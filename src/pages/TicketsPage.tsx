import { useMemo, useState } from "react";
import {
  overviewCountries,
  overviewMetrics,
  overviewMiniCustomers,
  overviewTransactions,
} from "../features/overview/model/overview.mock";
import { MetricBadge } from "../shared/ui/MetricBadge";
import { PillFilter } from "../shared/ui/PillFilter";
import { SectionPanel } from "../shared/ui/SectionPanel";
import { StatCard } from "../shared/ui/StatCard";

function SparkLine({ stroke, path }: { path: string; stroke: string }) {
  return (
    <svg viewBox="0 0 320 130" className="h-[130px] w-full" fill="none" aria-hidden="true">
      <path d={path} stroke={stroke} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function TicketsPage() {
  const [period, setPeriod] = useState<"year" | "quarter" | "month">("year");
  const [visibleLines, setVisibleLines] = useState({
    marketing: true,
    direct: true,
  });
  const [activeCountry, setActiveCountry] = useState<string>(overviewCountries[0].name);
  const [showAllCustomers, setShowAllCustomers] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const linePaths = useMemo(() => {
    if (period === "quarter") {
      return {
        direct: "M20 150C95 108 120 72 195 94C270 116 330 132 420 182C510 232 560 210 630 170C700 130 765 160 845 190C910 214 945 190 970 135",
        marketing: "M20 104C90 76 140 104 205 126C270 148 322 54 392 60C462 66 522 120 604 130C686 140 745 204 820 214C895 224 940 174 970 112",
      };
    }

    if (period === "month") {
      return {
        direct: "M20 180C90 122 140 118 210 140C280 162 335 182 410 210C485 238 548 214 610 164C672 114 742 126 812 142C882 158 936 170 970 126",
        marketing: "M20 120C80 86 128 82 190 116C252 150 300 104 360 94C420 84 486 126 560 140C634 154 706 186 790 208C874 230 930 190 970 148",
      };
    }

    return {
      direct: "M20 125C75 110 90 65 145 78C200 90 220 164 275 140C330 116 365 138 420 180C475 222 525 210 580 240C635 270 695 152 750 150C805 148 850 175 905 185C938 191 955 175 970 140",
      marketing: "M20 85C75 70 135 92 190 118C245 144 270 40 325 52C380 64 420 130 475 128C530 126 585 165 640 148C695 131 735 180 790 206C845 232 900 210 970 82",
    };
  }, [period]);

  return (
    <>
      <div className="col-span-12 flex flex-wrap items-center gap-3">
        <PillFilter active onClick={() => setPeriod((current) => current === "year" ? "quarter" : current === "quarter" ? "month" : "year")}>
          Show: {period === "year" ? "This Year" : period === "quarter" ? "This Quarter" : "This Month"}
        </PillFilter>
      </div>

      <SectionPanel className="xl:col-span-12" title="Analytics Overview">
        <div className="grid grid-cols-12 gap-5">
          {overviewMetrics.map((item) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              detail={item.detail}
              delta={item.delta}
              tone={item.tone}
            />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        className="xl:col-span-12"
        title="Sales Figures"
        trailing={
          <div className="flex gap-3">
            <MetricBadge active={visibleLines.marketing} color="var(--accent-purple)" label="Marketing" onClick={() => setVisibleLines((current) => ({ ...current, marketing: !current.marketing }))} />
            <MetricBadge active={visibleLines.direct} color="var(--accent-green)" label="Direct" onClick={() => setVisibleLines((current) => ({ ...current, direct: !current.direct }))} />
          </div>
        }
      >
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 rounded-[28px] p-6 xl:col-span-12" style={{ backgroundColor: "var(--panel-bg)" }}>
            <div className="relative mb-8 grid h-[340px] grid-cols-12 gap-4 overflow-hidden">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="relative col-span-1">
                  <div className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2" style={{ backgroundColor: "var(--panel-border)" }} />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
                  </span>
                </div>
              ))}
              <div className="pointer-events-none absolute inset-x-8 top-10">
                <svg viewBox="0 0 980 260" className="h-[250px] w-full" fill="none" aria-hidden="true">
                  {visibleLines.direct ? <path d={linePaths.direct} stroke="var(--accent-green)" strokeWidth="4" strokeLinecap="round" /> : null}
                  {visibleLines.marketing ? <path d={linePaths.marketing} stroke="var(--accent-purple)" strokeWidth="4" strokeLinecap="round" /> : null}
                </svg>
                <div className="absolute left-[56%] top-[18%] rounded-[24px] bg-white px-5 py-4 text-sm shadow-lg dark:text-slate-900">
                  <p className="text-slate-400">{period === "year" ? "July" : period === "quarter" ? "May" : "Week 3"}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{period === "month" ? "$92.0" : period === "quarter" ? "$184.0" : "$259.0"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 rounded-[24px] border p-5 xl:col-span-6" style={{ borderColor: "var(--panel-border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full border-[8px]" style={{ borderColor: "var(--panel-border)", borderTopColor: "var(--accent-green)", borderRightColor: "var(--accent-green)" }} />
                    <div>
                      <p className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>75%</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Hit Rate this year</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent-green)" }}>↑ 20.15 %</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t pt-5" style={{ borderColor: "var(--panel-border)" }}>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full border-[8px]" style={{ borderColor: "var(--panel-border)", borderTopColor: "var(--accent-purple)", borderRightColor: "var(--accent-purple)" }} />
                    <div>
                      <p className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>50%</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Deals this year</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent-orange)" }}>↓ 20.15 %</p>
                </div>
              </div>

              <div className="col-span-12 rounded-[24px] border p-5 xl:col-span-6" style={{ borderColor: "var(--panel-border)" }}>
                <SparkLine stroke="var(--accent-purple)" path="M12 105C45 65 64 46 88 55C112 64 124 72 146 60C168 48 182 68 201 75C220 82 244 54 266 66C288 78 304 26 322 18C340 10 350 20 365 28C380 36 390 84 405 96C420 108 452 93 486 80" />
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-[2rem] font-semibold" style={{ color: "var(--text-primary)" }}>$21.2K</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Visitors this year</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent-green)" }}>↑ 105.23 %</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel className="xl:col-span-7" title="Sales Locations">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 rounded-[28px] p-6 xl:col-span-4" style={{ backgroundColor: "var(--panel-bg)" }}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[2.4rem] font-semibold" style={{ color: "var(--text-primary)" }}>21.2K</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Our customers</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--accent-green)" }}>↑ 105.23 %</p>
            </div>

            <div className="mt-8 space-y-4">
              {overviewCountries.map((country, index) => (
                <button
                  key={country.name}
                  type="button"
                  className="flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left"
                  style={{
                    backgroundColor:
                      activeCountry === country.name
                        ? "color-mix(in srgb, var(--accent-blue) 10%, var(--panel-soft))"
                        : "var(--panel-soft)",
                  }}
                  onClick={() => setActiveCountry(country.name)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{index + 1}.</span>
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{country.name}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{country.amount}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-12 rounded-[28px] p-6 xl:col-span-8" style={{ backgroundColor: "var(--panel-bg)" }}>
            <div className="relative h-[320px] overflow-hidden rounded-[24px]" style={{ backgroundColor: "color-mix(in srgb, var(--panel-soft) 45%, transparent)" }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_55%,rgba(0,0,0,0.02),transparent_50%)]" />
              <button type="button" className={`absolute left-[28%] top-[22%] rounded-full transition ${activeCountry === "United States" ? "scale-110" : ""}`} style={{ backgroundColor: "#2a6df2", height: "88px", width: "88px" }} onClick={() => setActiveCountry("United States")} />
              <button type="button" className={`absolute left-[64%] top-[26%] rounded-full transition ${activeCountry === "Turkey" ? "scale-110" : ""}`} style={{ backgroundColor: "#5a45c5", height: "40px", width: "40px" }} onClick={() => setActiveCountry("Turkey")} />
              <button type="button" className={`absolute left-[71%] top-[48%] rounded-full transition ${activeCountry === "China" ? "scale-110" : ""}`} style={{ backgroundColor: "#0da26f", height: "88px", width: "88px" }} onClick={() => setActiveCountry("China")} />
              <button type="button" className={`absolute left-[48%] top-[68%] rounded-full transition ${activeCountry === "Brasil" ? "scale-110" : ""}`} style={{ backgroundColor: "#f59e0b", height: "72px", width: "72px" }} onClick={() => setActiveCountry("Brasil")} />
              <div className="absolute left-[41%] top-[41%] rounded-full bg-[#1d1d1d] px-5 py-3 text-sm font-medium text-white">
                {activeCountry}
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel className="xl:col-span-5" title="Recent Customers">
        <div className="rounded-[28px] p-4" style={{ backgroundColor: "var(--panel-bg)" }}>
          {(showAllCustomers ? overviewMiniCustomers : overviewMiniCustomers.slice(0, 3)).map((customer, index) => (
            <div key={customer.name} className="flex items-center justify-between gap-4 px-2 py-4" style={{ borderTop: index === 0 ? "none" : "1px solid var(--panel-border)" }}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--avatar-bg)] text-lg">🧔</div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{customer.name}</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{customer.handle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <span>◔</span>
                <span>⊘</span>
              </div>
            </div>
          ))}
          <button className="mt-4 w-full rounded-[18px] px-5 py-4 text-sm font-semibold" style={{ backgroundColor: "var(--panel-soft)", color: "var(--text-secondary)" }} onClick={() => setShowAllCustomers((current) => !current)}>
            {showAllCustomers ? "Show fewer Customers" : "View more Customers"}
          </button>
        </div>
      </SectionPanel>

      <SectionPanel className="xl:col-span-7" title="Transaction History">
        <div className="rounded-[28px] p-4" style={{ backgroundColor: "var(--panel-bg)" }}>
          <div className="grid grid-cols-[1.7fr_1fr_0.9fr] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
            <span>Payment Number</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {(showAllTransactions ? overviewTransactions : overviewTransactions.slice(0, 2)).map((item, index) => (
            <div key={item.title} className="grid grid-cols-[1.7fr_1fr_0.9fr] items-center px-4 py-5" style={{ borderTop: index === 0 ? "none" : "1px solid var(--panel-border)" }}>
              <div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>Today, 10:30 AM</p>
              </div>
              <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{item.amount}</p>
              <span className="inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: item.status === "Declined" ? "color-mix(in srgb, var(--accent-orange) 14%, var(--panel-bg))" : "color-mix(in srgb, var(--accent-green) 14%, var(--panel-bg))", color: item.status === "Declined" ? "var(--accent-orange)" : "var(--accent-green)" }}>
                {item.status}
              </span>
            </div>
          ))}
          <button className="mt-4 w-full rounded-[18px] px-5 py-4 text-sm font-semibold" style={{ backgroundColor: "var(--panel-soft)", color: "var(--text-secondary)" }} onClick={() => setShowAllTransactions((current) => !current)}>
            {showAllTransactions ? "Show fewer transactions" : "View All transactions"}
          </button>
        </div>
      </SectionPanel>
    </>
  );
}
