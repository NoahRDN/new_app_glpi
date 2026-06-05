export const overviewMetrics = [
  { label: "Sales", value: "$21.2K", detail: "($15.8k last year)", delta: "105.23 %", tone: "positive" },
  { label: "Purchase", value: "$16.0K", detail: "($20.3k last year)", delta: "20.15 %", tone: "negative" },
  { label: "Return", value: "$259.0", detail: "($2005 last year)", delta: "15.20 %", tone: "positive" },
  { label: "Marketing", value: "$13.1K", detail: "($109k last year)", delta: "32.84 %", tone: "positive" },
] as const;

export const overviewCountries = [
  { name: "United States", amount: "12.8K", flag: "🇺🇸" },
  { name: "China", amount: "5.3K", flag: "🇨🇳" },
  { name: "Turkey", amount: "2.7K", flag: "🇹🇷" },
  { name: "Brasil", amount: "1.0K", flag: "🇧🇷" },
] as const;

export const overviewMiniCustomers = [
  { name: "Seth Daniels", handle: "@sethdaniels" },
  { name: "Myrtle Perkins", handle: "@myrtleperkins" },
  { name: "Dominic Baker", handle: "@dominicbaker" },
  { name: "Ollie Baldwin", handle: "@olliebaldwin" },
] as const;

export const overviewTransactions = [
  { title: "Payment from #10023", amount: "+ $650.00", status: "Completed" },
  { title: "Process refund to #10024", amount: "- $250.00", status: "Completed" },
  { title: "Payment failed from #10025", amount: "+ $128.00", status: "Declined" },
] as const;
