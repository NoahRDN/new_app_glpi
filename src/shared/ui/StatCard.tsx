type StatCardProps = {
  delta: string;
  detail?: string;
  label: string;
  tone?: "positive" | "negative";
  value: string;
};

export function StatCard({
  delta,
  detail,
  label,
  tone = "positive",
  value,
}: StatCardProps) {
  const accentColor = tone === "negative" ? "var(--accent-orange)" : "var(--accent-green)";

  return (
    <article
      className="col-span-12 rounded-[30px] px-8 py-9 text-center md:col-span-6 xl:col-span-3"
      style={{ backgroundColor: "var(--panel-bg)" }}
    >
      <div
        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-[30px]"
        style={{
          backgroundColor:
            tone === "negative"
              ? "color-mix(in srgb, var(--accent-orange) 14%, var(--panel-soft))"
              : "color-mix(in srgb, var(--accent-green) 14%, var(--panel-soft))",
          color: accentColor,
        }}
      >
        {tone === "negative" ? "↓" : "↑"}
      </div>
      <p className="text-[3.2rem] font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
      <p className="mt-3 text-lg" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      {detail ? (
        <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          {detail}
        </p>
      ) : null}
      <p className="mt-5 text-[1.65rem] font-semibold" style={{ color: accentColor }}>
        {tone === "negative" ? "↓ " : "↑ "}
        {delta}
      </p>
    </article>
  );
}
