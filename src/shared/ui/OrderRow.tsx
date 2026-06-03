type OrderRowProps = {
  active?: boolean;
  checked?: boolean;
  customer: string;
  date: string;
  id: string;
  onClick?: () => void;
  onToggle?: (checked: boolean) => void;
  payment: string;
  price: string;
  status: string;
};

export function OrderRow({
  active = false,
  checked = false,
  customer,
  date,
  id,
  onClick,
  onToggle,
  payment,
  price,
  status,
}: OrderRowProps) {
  return (
    <tr
      className="cursor-pointer"
      style={{
        backgroundColor: active ? "color-mix(in srgb, var(--accent-blue) 8%, var(--panel-bg))" : "transparent",
      }}
      onClick={onClick}
    >
      <td className="rounded-l-[26px] px-4 py-6 align-middle">
        <label className="flex cursor-pointer items-center justify-center">
          <input
            aria-label={`Select ${id}`}
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
      </td>
      <td className="px-4 py-6 align-middle text-[1.8rem] font-semibold" style={{ color: "var(--accent-blue)" }}>{id}</td>
      <td className="px-4 py-6 align-middle text-lg font-medium" style={{ color: "var(--text-primary)" }}>{date}</td>
      <td className="px-4 py-6 align-middle text-lg font-medium" style={{ color: "var(--text-primary)" }}>{customer}</td>
      <td className="px-4 py-6 align-middle">
        <span className="inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: "color-mix(in srgb, var(--accent-green) 14%, var(--panel-bg))", color: "var(--accent-green)" }}>{payment}</span>
      </td>
      <td className="px-4 py-6 align-middle">
        <span className="inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: "color-mix(in srgb, #f59e0b 16%, var(--panel-bg))", color: "#f59e0b" }}>{status}</span>
      </td>
      <td className="rounded-r-[26px] px-4 py-6 align-middle text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{price}</td>
    </tr>
  );
}
