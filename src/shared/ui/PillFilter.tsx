type PillFilterProps = {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export function PillFilter({ active = false, children, onClick, type = "button" }: PillFilterProps) {
  return (
    <button
      type={type}
      className="rounded-[18px] px-5 py-3 text-sm font-semibold transition"
      style={{
        backgroundColor: active ? "var(--panel-bg)" : "var(--panel-soft)",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
