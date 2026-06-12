import type { LucideIcon } from "lucide-react";

type InventorySummaryTileProps = {
  accentColor?: string;
  backgroundColor: string;
  Icon: LucideIcon;
  label: string;
  value: number;
};

export function InventorySummaryTile({
  accentColor = "rgba(15, 23, 42, 0.72)",
  backgroundColor,
  Icon,
  label,
  value,
}: InventorySummaryTileProps) {
  return (
    <article
      className="min-h-28 rounded-[4px] px-4 py-3 shadow-[var(--shadow-soft)]"
      style={{ backgroundColor }}
    >
      <div className="flex items-start justify-between gap-4">
        <p
          className="text-[3rem] leading-none tracking-[-0.04em]"
          style={{ color: accentColor }}
        >
          {value}
        </p>

        <span
          className="inline-flex h-11 w-11 items-center justify-center"
          style={{ color: accentColor }}
        >
          <Icon size={36} strokeWidth={1.9} />
        </span>
      </div>

      <p className="mt-2 text-[1.15rem] leading-6" style={{ color: accentColor }}>
        {label}
      </p>
    </article>
  );
}
