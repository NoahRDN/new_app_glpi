type RadialGaugeProps = {
  color: string;
  label: string;
  progress?: number;
  value: string;
};

export function RadialGauge({ color, label, progress = 72, value }: RadialGaugeProps) {
  return (
    <article className="rounded-[30px] px-6 py-7 text-center" style={{ backgroundColor: "var(--panel-bg)" }}>
      <div className="mx-auto mb-8 h-34 w-34 rounded-full p-[10px]" style={{ backgroundColor: "var(--panel-soft)" }}>
        <div
          className="flex h-full w-full items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${color} 0 ${progress}%, color-mix(in srgb, var(--panel-border) 85%, transparent) ${progress}% 100%)`,
          }}
        >
          <div
            className="flex h-[82%] w-[82%] items-center justify-center rounded-full text-2xl font-semibold"
            style={{ backgroundColor: "var(--panel-bg)", color: "var(--text-primary)" }}
          >
            {value}
          </div>
        </div>
      </div>
      <p className="mt-1 text-[1.05rem]" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
    </article>
  );
}
