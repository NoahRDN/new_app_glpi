import type { LucideIcon } from "lucide-react";
import { InventorySummaryTile } from "./InventorySummaryTile";

export type InventorySummaryItem = {
  accentColor?: string;
  backgroundColor: string;
  Icon: LucideIcon;
  id: string;
  label: string;
  value: number;
};

type InventorySummaryGridProps = {
  items: InventorySummaryItem[];
};

export function InventorySummaryGrid({ items }: InventorySummaryGridProps) {
  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <InventorySummaryTile
          key={item.id}
          accentColor={item.accentColor}
          backgroundColor={item.backgroundColor}
          Icon={item.Icon}
          label={item.label}
          value={item.value}
        />
      ))}
    </div>
  );
}
