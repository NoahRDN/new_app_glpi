import { useMemo, useState } from "react";
import { ordersRows } from "../features/orders/model/orders.mock";
import { DataTable } from "../shared/ui/DataTable";
import { OrderRow } from "../shared/ui/OrderRow";
import { PillFilter } from "../shared/ui/PillFilter";
import { Input } from "../shared/ui/Input";
import { Search } from "lucide-react";

type OrderItem = {
  active: boolean;
  customer: string;
  date: string;
  id: string;
  payment: string;
  price: string;
  status: string;
};

export function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    ordersRows.filter((row) => row.active).map((row) => row.id),
  );
  const [showMode, setShowMode] = useState<"all" | "selected" | "recent">("all");
  const [sortBy, setSortBy] = useState<"default" | "date" | "customer">("default");
  const [rows, setRows] = useState<OrderItem[]>([...ordersRows]);

  const visibleOrders = useMemo<OrderItem[]>(() => {
    const query = search.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      const matchesQuery =
        query.length === 0 ||
        row.id.toLowerCase().includes(query) ||
        row.customer.toLowerCase().includes(query) ||
        row.date.toLowerCase().includes(query);
      const matchesMode =
        showMode === "all" ||
        (showMode === "selected" && selectedIds.includes(row.id)) ||
        (showMode === "recent" && row.date.includes("Nov"));

      return matchesQuery && matchesMode;
    });

    if (sortBy === "customer") {
      return [...filtered].sort((left, right) => left.customer.localeCompare(right.customer));
    }
    if (sortBy === "date") {
      return [...filtered].sort((left, right) => left.date.localeCompare(right.date));
    }

    return filtered;
  }, [rows, search, selectedIds, showMode, sortBy]);

  const allVisibleSelected =
    visibleOrders.length > 0 && visibleOrders.every((order) => selectedIds.includes(order.id));

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((current) => {
      const visibleIds: string[] = visibleOrders.map((order) => order.id);
      if (checked) {
        return [...new Set([...current, ...visibleIds])];
      }

      return current.filter((id) => !visibleIds.includes(id));
    });
  };

  const toggleOrder = (id: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id),
    );
  };

  const addOrder = () => {
    setRows((current) => [
      {
        active: false,
        customer: "New Customer",
        date: "03 Jun 2026",
        id: `#10${String(100 + current.length)}`,
        payment: "Paid",
        price: "$29.90",
        status: "Unfulfilled",
      },
      ...current,
    ]);
  };

  return (
    <>
      <div className="col-span-12 flex flex-wrap items-center justify-between gap-4">
        <PillFilter active onClick={() => setShowMode((current) => current === "all" ? "selected" : current === "selected" ? "recent" : "all")}>
          Show: {showMode === "all" ? "All Orders" : showMode === "selected" ? "Selected Orders" : "Recent Orders"}
        </PillFilter>
        <div className="flex items-center gap-3">
          <button className="rounded-[18px] bg-[var(--accent-blue)] px-5 py-3 text-sm font-semibold text-white" onClick={addOrder}>+ New Product</button>
          <PillFilter onClick={() => setSelectedIds([])}>Clear</PillFilter>
          <PillFilter active onClick={() => setSortBy((current) => current === "default" ? "date" : current === "date" ? "customer" : "default")}>
            Sort by: {sortBy === "default" ? "Default" : sortBy === "date" ? "Date" : "Customer"}
          </PillFilter>
        </div>
      </div>

      <DataTable
        tableClassName="min-w-full"
        tableHead={
          <thead>
            <tr className="text-left text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
              <th className="w-[34px] px-4 py-4">
                <label className="flex items-center justify-center">
                  <input
                    aria-label="Select all orders"
                    checked={allVisibleSelected}
                    className="h-4 w-4 accent-[var(--accent-blue)]"
                    type="checkbox"
                    onChange={(event) => toggleAllVisible(event.target.checked)}
                  />
                </label>
              </th>
              <th className="px-4 py-4">Order</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Payment</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Price</th>
            </tr>
          </thead>
        }
        toolbar={
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[22px] px-5 py-4" style={{ backgroundColor: "var(--panel-soft)" }}>
            <Search color="var(--text-secondary)" />
            <Input
              className="w-full bg-transparent outline-none placeholder:text-[var(--text-secondary)]"
              placeholder="Search by order, customer, date..."
              style={{ color: "var(--text-primary)" }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              className="rounded-[18px] px-5 py-3 text-sm font-semibold"
              style={{ backgroundColor: "var(--panel-bg)", color: "var(--text-primary)" }}
              onClick={() => setShowMode(selectedIds.length > 0 ? "selected" : "recent")}
            >
              Action
            </button>
          </div>
        }
      >
        {visibleOrders.map((order) => (
          <OrderRow
            key={order.id}
            {...order}
            active={selectedIds.includes(order.id)}
            checked={selectedIds.includes(order.id)}
            onClick={() => toggleOrder(order.id, !selectedIds.includes(order.id))}
            onToggle={(checked) => toggleOrder(order.id, checked)}
          />
        ))}
      </DataTable>
    </>
  );
}
