export const inventoryRows = [
  { product: "V-neck cotton T-shirt", brand: "Mango", sku: "10000", stock: 10, variants: 10, price: "$14.90", selected: false, color: "#171717" },
  { product: "T-shirt with slogan", brand: "Bershka", sku: "10020", stock: 2, variants: 2, price: "$35.90", selected: true, color: "#d9d9d9" },
  { product: "Animals print t-shirt", brand: "Pull&Bear", sku: "10006", stock: 4, variants: 4, price: "$7.99", selected: false, color: "#ece7db" },
  { product: "Men's Pique Short Sleeve Polo Shirt", brand: "Uniqlo", sku: "10003", stock: 87, variants: 6, price: "$50.00", selected: false, color: "#7b6241" },
  { product: "Apollinaire Text T-Shirt", brand: "Zara", sku: "10004", stock: 96, variants: 11, price: "$35.90", selected: false, color: "#7cb342" },
  { product: "Organic cotton T-shirt", brand: "Mango", sku: "10005", stock: 32, variants: 1, price: "$15.99", selected: false, color: "#111111" },
] as const;

export const productTabs = ["Infomation", "Images", "Pricing", "Inventory", "Shipping"] as const;
