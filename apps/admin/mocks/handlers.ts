import { Account, Transaction } from "@/app/page";
import { HttpResponse, RequestHandler, http } from "msw";

export const handlers: RequestHandler[] = [
  http.get("*/rest/v1/accounts", () => {
    return HttpResponse.json([
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
    ] satisfies Account[]);
  }),
  http.get("*/rest/v1/transactions", () => {
    return HttpResponse.json([
      {
        id: 1,
        amount: -212.23,
        name: "Supermercado",
        created_at: "2024-04-22T09:00:00",
        accounts: { benefits: { icon: "🥦" } },
      },
      {
        id: 2,
        amount: -29.21,
        name: "Uber",
        created_at: "2024-04-21T09:00:00",
        accounts: { benefits: { icon: "🚘" } },
      },
      {
        id: 3,
        amount: -14.15,
        name: "Uber",
        created_at: "2024-04-15T09:00:00",
        accounts: { benefits: { icon: "🚘" } },
      },
      {
        id: 4,
        amount: -12,
        name: "Uber",
        created_at: "2024-04-08T09:00:00",
        accounts: { benefits: { icon: "🚘" } },
      },
    ] satisfies Transaction[]);
  }),
];
