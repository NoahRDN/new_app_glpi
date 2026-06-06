import { useMemo, useState } from "react";
import { inventoryRows, productTabs } from "../../../features/backoffice/catalog/model/catalog.mock";
import { DataTable } from "../../../shared/ui/DataTable";
import { Modal1 } from "../../../shared/ui/Modal1";
import { PillFilter } from "../../../shared/ui/PillFilter";
import { ProductRow } from "../../../shared/ui/ProductRow";
import { Input } from "../../../shared/ui/Input";
import { Search } from "lucide-react";

type ProductItem = {
  brand: string;
  color: string;
  price: string;
  product: string;
  selected: boolean;
  sku: string;
  stock: number;
  variants: number;
};

export function ParcsPage() {
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "name" | "stock" | "price">("default");
  const [showMode, setShowMode] = useState<"all" | "selected" | "low-stock">("all");
  const [selectedSkus, setSelectedSkus] = useState<string[]>(
    inventoryRows.filter((row) => row.selected).map((row) => row.sku),
  );
  const [activeTab, setActiveTab] = useState<(typeof productTabs)[number]>("Inventory");
  const [draftProduct, setDraftProduct] = useState({
    sku: "10020",
    quantity: "2",
    name: "T-shirt with slogan",
    brand: "Bershka",
    shipping: "Standard shipping",
  });

  const visibleRows = useMemo<ProductItem[]>(() => {
    const query = search.trim().toLowerCase();
    const filtered: ProductItem[] = inventoryRows.filter((row) => {
      const matchesQuery =
        query.length === 0 ||
        row.product.toLowerCase().includes(query) ||
        row.brand.toLowerCase().includes(query) ||
        row.sku.toLowerCase().includes(query);
      const matchesMode =
        showMode === "all" ||
        (showMode === "selected" && selectedSkus.includes(row.sku)) ||
        (showMode === "low-stock" && row.stock <= 10);

      return matchesQuery && matchesMode;
    });

    if (sortBy === "name") {
      return [...filtered].sort((left, right) => left.product.localeCompare(right.product));
    }
    if (sortBy === "stock") {
      return [...filtered].sort((left, right) => left.stock - right.stock);
    }
    if (sortBy === "price") {
      return [...filtered].sort(
        (left, right) => Number.parseFloat(left.price.replace("$", "")) - Number.parseFloat(right.price.replace("$", "")),
      );
    }

    return filtered;
  }, [search, selectedSkus, showMode, sortBy]);

  const allVisibleSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selectedSkus.includes(row.sku));

  const cycleShowMode = () => {
    setShowMode((current) =>
      current === "all" ? "selected" : current === "selected" ? "low-stock" : "all",
    );
  };

  const cycleSort = () => {
    setSortBy((current) =>
      current === "default" ? "name" : current === "name" ? "stock" : current === "stock" ? "price" : "default",
    );
  };

  const toggleSku = (sku: string, checked: boolean) => {
    setSelectedSkus((current) =>
      checked ? [...new Set([...current, sku])] : current.filter((item) => item !== sku),
    );
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelectedSkus((current) => {
      const visibleSkus: string[] = visibleRows.map((row) => row.sku);
      if (checked) {
        return [...new Set([...current, ...visibleSkus])];
      }

      return current.filter((sku) => !visibleSkus.includes(sku));
    });
  };

  const openInventoryModal = (sku?: string) => {
    const row = inventoryRows.find((item) => item.sku === sku) ?? inventoryRows[1];
    setDraftProduct({
      sku: row.sku,
      quantity: String(row.stock),
      name: row.product,
      brand: row.brand,
      shipping: "Standard shipping",
    });
    setActiveTab("Inventory");
    setIsInventoryModalOpen(true);
  };

  const nextTab = () => {
    const currentIndex = productTabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % productTabs.length;
    setActiveTab(productTabs[nextIndex]);
  };

  return (
    <>
      <div className="col-span-12 flex flex-wrap items-center justify-between gap-4">
        <PillFilter active onClick={cycleShowMode}>
          Show: {showMode === "all" ? "All Products" : showMode === "selected" ? "Selected Products" : "Low Stock"}
        </PillFilter>
        <div className="flex items-center gap-3">
          <button
            className="rounded-[18px] bg-(--accent-blue) px-5 py-3 text-sm font-semibold text-white"
            onClick={() => openInventoryModal()}
          >
            + New Product
          </button>
          <PillFilter onClick={() => setSelectedSkus([])}>Clear</PillFilter>
          <PillFilter active onClick={cycleSort}>
            Sort by: {sortBy === "default" ? "Default" : sortBy === "name" ? "Name" : sortBy === "stock" ? "Stock" : "Price"}
          </PillFilter>
        </div>
      </div>

      <DataTable
        tableHeads={[
          <label className="flex items-center justify-center">
            <input
              aria-label="Select all products"
              checked={allVisibleSelected}
              className="h-4 w-4 accent-(--accent-blue)"
              type="checkbox"
              onChange={(event) => toggleAllVisible(event.target.checked)}
            />
          </label>,
          "Payment",
          "Brand",
          "Code",
          "Stock",
          "Var",
          "Price",
          "...",
        ]}
        toolbar={
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[22px] px-5 py-4" style={{ backgroundColor: "var(--panel-soft)" }}>
            <Search color="var(--text-secondary)" />
            <Input
              className="w-full bg-transparent outline-none placeholder-(--text-secondary)"
              placeholder="Search by Name, Brand, Variant etc..."
              style={{ color: "var(--text-primary)" }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              className="rounded-[18px] px-5 py-3 text-sm font-semibold"
              style={{ backgroundColor: "var(--panel-bg)", color: "var(--text-primary)" }}
              onClick={() => setShowMode(selectedSkus.length > 0 ? "selected" : "low-stock")}
            >
              Action
            </button>
          </div>
        }
      >
        
        {visibleRows.map((row) => (
          <ProductRow
            key={row.sku}
            {...row}
            checked={selectedSkus.includes(row.sku)}
            selected={selectedSkus.includes(row.sku)}
            onClick={() => openInventoryModal(row.sku)}
            onToggle={(checked) => toggleSku(row.sku, checked)}
          />
        ))}
      </DataTable>

      <Modal1 isOpen={isInventoryModalOpen} onClose={() => setIsInventoryModalOpen(false)}>
        <div className="w-full max-w-205 rounded-[34px] border shadow-2xl" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
          <div className="flex items-center justify-between border-b px-10 py-6" style={{ borderColor: "var(--panel-border)" }}>
            <div className="flex gap-10 overflow-auto">
              {productTabs.map((tab) => (
                <button
                  key={tab}
                  className="relative whitespace-nowrap pb-4 text-lg font-semibold"
                  style={{ color: tab === activeTab ? "var(--accent-blue)" : "var(--text-primary)" }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === activeTab ? (
                    <span className="absolute bottom-0 left-0 h-0.75 w-full rounded-full bg-(--accent-blue)" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="px-10 py-10">
            <h3 className="text-[2rem] font-semibold" style={{ color: "var(--text-primary)" }}>{activeTab}</h3>
            <div className="mt-10 grid grid-cols-2 gap-8 border-b pb-10" style={{ borderColor: "var(--panel-border)" }}>
              {activeTab === "Inventory" ? (
                <>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>SKU</p>
                    <input
                      className="mt-3 w-full rounded-[18px] border px-4 py-4 text-lg font-semibold outline-none"
                      style={{ borderColor: "var(--panel-border)", backgroundColor: "var(--panel-soft)", color: "var(--text-primary)" }}
                      value={draftProduct.sku}
                      onChange={(event) => setDraftProduct((current) => ({ ...current, sku: event.target.value }))}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Quantity</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <input
                        className="w-full rounded-[18px] border px-4 py-4 text-lg font-semibold outline-none"
                        style={{ borderColor: "var(--panel-border)", backgroundColor: "var(--panel-soft)", color: "var(--text-primary)" }}
                        value={draftProduct.quantity}
                        onChange={(event) => setDraftProduct((current) => ({ ...current, quantity: event.target.value }))}
                      />
                      <button
                        type="button"
                        className="rounded-[18px] px-4 py-4 text-lg"
                        style={{ backgroundColor: "var(--panel-soft)", color: "var(--text-secondary)" }}
                        onClick={() =>
                          setDraftProduct((current) => ({
                            ...current,
                            quantity: String(Math.max(0, Number(current.quantity || "0") + 1)),
                          }))
                        }
                      >
                        ⇅
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      {activeTab === "Infomation" ? "Product name" : activeTab === "Images" ? "Main asset" : activeTab === "Pricing" ? "Brand" : "Method"}
                    </p>
                    <input
                      className="mt-3 w-full rounded-[18px] border px-4 py-4 text-lg font-semibold outline-none"
                      style={{ borderColor: "var(--panel-border)", backgroundColor: "var(--panel-soft)", color: "var(--text-primary)" }}
                      value={activeTab === "Shipping" ? draftProduct.shipping : draftProduct.name}
                      onChange={(event) =>
                        setDraftProduct((current) => ({
                          ...current,
                          [activeTab === "Shipping" ? "shipping" : "name"]: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      {activeTab === "Infomation" ? "Brand" : activeTab === "Images" ? "Preview" : activeTab === "Pricing" ? "Price" : "Details"}
                    </p>
                    <input
                      className="mt-3 w-full rounded-[18px] border px-4 py-4 text-lg font-semibold outline-none"
                      style={{ borderColor: "var(--panel-border)", backgroundColor: "var(--panel-soft)", color: "var(--text-primary)" }}
                      value={draftProduct.brand}
                      onChange={(event) => setDraftProduct((current) => ({ ...current, brand: event.target.value }))}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-between gap-5">
              <button
                className="w-full rounded-[18px] px-5 py-4 text-sm font-semibold"
                style={{ backgroundColor: "var(--panel-soft)", color: "var(--text-primary)" }}
                onClick={() => setIsInventoryModalOpen(false)}
              >
                Cancel
              </button>
              <button className="w-full rounded-[18px] bg-(--accent-blue) px-5 py-4 text-sm font-semibold text-white" onClick={nextTab}>
                {activeTab === productTabs[productTabs.length - 1] ? "Save" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </Modal1>
    </>
  );
}
