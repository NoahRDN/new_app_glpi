export const dashboardSummaryCards = [
  { label: "Income", value: "$21.2K", delta: "105.23 %", tone: "positive" },
  { label: "Expense", value: "$16.0K", delta: "20.15 %", tone: "negative" },
  { label: "Total Visitor", value: "24.8K", delta: "15.20 %", tone: "positive" },
  { label: "Total Customer", value: "$13.1K", delta: "32.84 %", tone: "positive" },
] as const;

export type CustomerGrowthMonthBar = {
  month: string;
  men: number;
  women: number;
  fresh: number;
  muted?: boolean;
};

export const customerGrowthMonthBars: CustomerGrowthMonthBar[] = [
  { month: "Jan", men: 74, women: 36, fresh: 22 },
  { month: "Feb", men: 52, women: 58, fresh: 16 },
  { month: "Mar", men: 52, women: 22, fresh: 34 },
  { month: "Apr", men: 68, women: 14, fresh: 8 },
  { month: "May", men: 60, women: 40, fresh: 16 },
  { month: "Jun", men: 42, women: 26, fresh: 30 },
  { month: "Jul", men: 54, women: 70, fresh: 10 },
  { month: "Aug", men: 30, women: 0, fresh: 0, muted: true },
  { month: "Sep", men: 34, women: 0, fresh: 0, muted: true },
  { month: "Oct", men: 52, women: 0, fresh: 0, muted: true },
  { month: "Nov", men: 46, women: 0, fresh: 0, muted: true },
  { month: "Dec", men: 36, women: 0, fresh: 0, muted: true },
];

export const salesLocationsCountries = [
  { name: "United States", amount: "12.8K", flag: "🇺🇸" },
  { name: "China", amount: "5.3K", flag: "🇨🇳" },
  { name: "Turkey", amount: "2.7K", flag: "🇹🇷" },
  { name: "Brasil", amount: "1.0K", flag: "🇧🇷" },
] as const;

export const dashboardTransactions = [
  { id: "#10023", text: "Payment from", amount: "+ $650.00", status: "Completed", tone: "success" },
  { id: "#10024", text: "Process refund to", amount: "- $250.00", status: "Completed", tone: "success" },
  { id: "#10025", text: "Payment failed from", amount: "+ $128.00", status: "Declined", tone: "danger" },
] as const;

export const recentCustomers = [
  { name: "Seth Daniels", handle: "@sethdaniels", status: "Paid", accent: "blue" },
  { name: "Myrtle Perkins", handle: "@myrtleperkins", status: "Paid", accent: "green" },
  { name: "Dominic Baker", handle: "@dominicbaker", status: "Pending", accent: "purple" },
  { name: "Ollie Baldwin", handle: "@olliebaldwin", status: "Paid", accent: "orange" },
] as const;
