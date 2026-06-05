import { useMemo, useState } from "react";
import { MetricBadge } from "../../../../shared/ui/MetricBadge";
import { PillFilter } from "../../../../shared/ui/PillFilter";
import { RadialGauge } from "../../../../shared/ui/RadialGauge";
import { SectionPanel } from "../../../../shared/ui/SectionPanel";
import { customerGrowthMonthBars } from "../model/dashboard.mock";

const PERIODS = ["This Year", "This Quarter", "This Month"] as const;

export function CustomerGrowthPanel() {
  const [periodIndex, setPeriodIndex] = useState(0);
  const [visibleSeries, setVisibleSeries] = useState({
    men: true,
    women: true,
    fresh: true,
  });
  const [focusedMonth, setFocusedMonth] = useState(6);

  const scaledBars = useMemo(() => {
    const factor = periodIndex === 0 ? 1 : periodIndex === 1 ? 0.72 : 0.42;

    return customerGrowthMonthBars.map((item) => ({
      ...item,
      men: Math.round(item.men * factor),
      women: Math.round(item.women * factor),
      fresh: Math.round(item.fresh * factor),
    }));
  }, [periodIndex]);

  const activeMonth = scaledBars[focusedMonth] ?? scaledBars[0];

  return (
    <SectionPanel
      className="xl:col-span-8"
      title="Customer Growth"
      trailing={
        <PillFilter active onClick={() => setPeriodIndex((current) => (current + 1) % PERIODS.length)}>
          Show: In {PERIODS[periodIndex]}
        </PillFilter>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-[30px] p-6" style={{ backgroundColor: "var(--panel-bg)" }}>
          <div className="relative grid h-[445px] grid-cols-12 items-end gap-4">
            {scaledBars.map((item, index) => (
              <button
                key={item.month}
                type="button"
                className="relative flex h-full flex-col items-center justify-end"
                onClick={() => setFocusedMonth(index)}
                onMouseEnter={() => setFocusedMonth(index)}
              >
                <div
                  className="absolute inset-y-5 left-1/2 w-[5px] -translate-x-1/2 rounded-full"
                  style={{
                    backgroundColor: item.muted
                      ? "color-mix(in srgb, var(--panel-border) 95%, transparent)"
                      : "color-mix(in srgb, var(--panel-border) 65%, transparent)",
                  }}
                />
                {index === focusedMonth ? (
                  <>
                    <div
                      className="absolute left-1/2 top-12 z-10 w-[138px] -translate-x-1/2 rounded-[24px] p-4 text-left text-sm shadow-lg"
                      style={{ backgroundColor: "#ffffff", color: "#171717" }}
                    >
                      <p className="font-semibold">Man: {activeMonth.men}</p>
                      <p className="mt-1 font-semibold">Women: {activeMonth.women}</p>
                      <p className="mt-1 font-semibold">New: {activeMonth.fresh}</p>
                    </div>
                    <div className="absolute left-1/2 top-[182px] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_20px_rgba(90,69,197,0.18)]">
                      <div className="h-4 w-4 rounded-full bg-(--accent-purple)" />
                    </div>
                  </>
                ) : null}
                {!item.muted ? (
                  <>
                    {visibleSeries.men ? <div className="z-[1] mb-4 w-2.5 rounded-full" style={{ height: `${item.men}%`, backgroundColor: "var(--accent-blue)" }} /> : null}
                    {visibleSeries.women ? <div className="z-[1] mb-4 w-2.5 rounded-full" style={{ height: `${item.women}%`, backgroundColor: "var(--accent-purple)" }} /> : null}
                    {visibleSeries.fresh ? <div className="z-[1] mb-5 w-2.5 rounded-full" style={{ height: `${item.fresh}%`, backgroundColor: "var(--accent-green)" }} /> : null}
                  </>
                ) : (
                  <div className="mb-5 h-[10px] w-[6px] rounded-full" style={{ backgroundColor: "var(--panel-border)" }} />
                )}
                <span className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {item.month}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <MetricBadge active={visibleSeries.men} color="var(--accent-green)" label="Man Customer" onClick={() => setVisibleSeries((current) => ({ ...current, men: !current.men }))} />
            <MetricBadge active={visibleSeries.women} color="var(--accent-purple)" label="Women Customer" onClick={() => setVisibleSeries((current) => ({ ...current, women: !current.women }))} />
            <MetricBadge active={visibleSeries.fresh} color="var(--accent-blue)" label="New Customer" onClick={() => setVisibleSeries((current) => ({ ...current, fresh: !current.fresh }))} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <RadialGauge color="var(--accent-green)" progress={periodIndex === 0 ? 75 : periodIndex === 1 ? 62 : 48} value={periodIndex === 0 ? "75%" : periodIndex === 1 ? "62%" : "48%"} label="Customer Target" />
          <RadialGauge color="var(--accent-purple)" progress={periodIndex === 0 ? 50 : periodIndex === 1 ? 58 : 34} value={periodIndex === 0 ? "50%" : periodIndex === 1 ? "58%" : "34%"} label="Sales Target" />
        </div>
      </div>
    </SectionPanel>
  );
}
