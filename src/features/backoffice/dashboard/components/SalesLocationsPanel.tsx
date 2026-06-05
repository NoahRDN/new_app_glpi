import { useState } from "react";
import { SectionPanel } from "../../../../shared/ui/SectionPanel";
import { salesLocationsCountries } from "../model/dashboard.mock";

export function SalesLocationsPanel() {
  const [activeCountry, setActiveCountry] = useState<string>(salesLocationsCountries[0].name);

  return (
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
            {salesLocationsCountries.map((country, index) => (
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
  );
}
