type ProductRowProps = {
  brand: string;
  checked?: boolean;
  color: string;
  onClick?: () => void;
  onToggle?: (checked: boolean) => void;
  price: string;
  product: string;
  selected?: boolean;
  sku: string;
  stock: number;
  variants: number;
};

export function ProductRow({
  brand,
  checked = false,
  color,
  onClick,
  onToggle,
  price,
  product,
  selected = false,
  sku,
  stock,
  variants,
}: ProductRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="grid grid-cols-[34px_70px_1.4fr_1fr_0.8fr_0.7fr_0.7fr_0.8fr_40px] items-center rounded-[26px] px-4 py-5"
      style={{
        backgroundColor: selected ? "color-mix(in srgb, var(--accent-blue) 8%, var(--panel-bg))" : "transparent",
      }}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <label className="flex cursor-pointer items-center justify-center">
        <input
          aria-label={`Select ${product}`}
          checked={checked}
          className="h-4 w-4 accent-[var(--accent-blue)]"
          type="checkbox"
          onChange={(event) => {
            event.stopPropagation();
            onToggle?.(event.target.checked);
          }}
          onClick={(event) => event.stopPropagation()}
        />
      </label>
      <div className="flex h-14 w-14 items-center justify-center rounded-[18px]" style={{ backgroundColor: "var(--panel-soft)" }}>
        <div className="h-10 w-8 rounded-[10px]" style={{ backgroundColor: color }} />
      </div>
      <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{product}</span>
      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{brand}</span>
      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{sku}</span>
      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{stock}</span>
      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{variants}</span>
      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{price}</span>
      <button
        type="button"
        aria-label={`More actions for ${product}`}
        className="text-left"
        style={{ color: "var(--text-secondary)" }}
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.(!checked);
        }}
      >
        •••
      </button>
    </div>
  );
}
