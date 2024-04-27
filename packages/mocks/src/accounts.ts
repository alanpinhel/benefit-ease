import type { Account } from "@repo/types";

export const accounts: Account[] = [
  {
    id: 1,
    balance: 840,
    benefits: {
      id: 1,
      name: "Alimentação",
      color_from: "teal",
      color_to: "blue",
      icon: "🥦",
    },
  },
  {
    id: 2,
    balance: 360,
    benefits: {
      id: 2,
      name: "Mobilidade",
      color_from: "lime",
      color_to: "green",
      icon: "🚘",
    },
  },
];
