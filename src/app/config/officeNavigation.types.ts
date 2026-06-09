import type { LucideIcon } from "lucide-react";

export type OfficeNavigationItem = {
  description: string;
  Icon: LucideIcon;
  id: string;
  label: string;
  path: string;
  isHorizontalRowDown?: boolean;
};
