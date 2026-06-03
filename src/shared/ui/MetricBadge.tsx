type MetricBadgeProps = {
  active?: boolean;
  color: string;
  label: string;
  onClick?: () => void;
};

export function MetricBadge({ active = false, color, label, onClick }: MetricBadgeProps) {
  return (
    <button
      type="button"
      className="flex min-w-[190px] items-center justify-center gap-3 rounded-[20px] px-5 py-3 text-sm font-medium"
      style={{
        backgroundColor: active ? "var(--panel-bg)" : "var(--panel-soft)",
        boxShadow: active ? `inset 0 0 0 1px ${color}` : "none",
      }}
      onClick={onClick}
    >
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span style={{ color: "var(--text-primary)" }}>{label}</span>
    </button>
  );
}
