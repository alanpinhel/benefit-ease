import { Transaction } from "@repo/types";

export const transactions: Transaction[] = [
  {
    id: "1",
    amount: -212.23,
    name: "Supermercado",
    created_at: "2024-04-22T09:00:00+00:00",
    accounts: { benefits: { icon: "🥦" } },
  },
  {
    id: "2",
    amount: -29.21,
    name: "Uber",
    created_at: "2024-04-21T09:00:00+00:00",
    accounts: { benefits: { icon: "🚘" } },
  },
  {
    id: "3",
    amount: -14.15,
    name: "Uber",
    created_at: "2024-04-15T09:00:00+00:00",
    accounts: { benefits: { icon: "🚘" } },
  },
  {
    id: "4",
    amount: -12,
    name: "Uber",
    created_at: "2024-04-08T09:00:00+00:00",
    accounts: { benefits: { icon: "🚘" } },
  },
];
