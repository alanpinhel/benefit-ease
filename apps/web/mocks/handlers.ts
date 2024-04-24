import { SignInResponse } from "@/app/login/page";
import { Account, Transaction } from "@/app/page";
import { HttpResponse, RequestHandler, http } from "msw";

export const handlers: RequestHandler[] = [
  http.post("*/auth/v1/signup", () => {
    return HttpResponse.json({});
  }),
  http.post("*/auth/v1/token", () => {
    return HttpResponse.json({
      access_token: "access_token",
      refresh_token: "refresh_token",
      user: {
        email: "john.doe@gmail.com",
        user_metadata: {
          display_name: "John Doe",
        },
      },
    } satisfies SignInResponse);
  }),
  http.put("*/auth/v1/user", () => {
    return HttpResponse.json({});
  }),
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
        accounts: {
          benefits: {
            icon: "🥦",
          },
        },
      },
      {
        id: 2,
        amount: -29.21,
        name: "Uber",
        created_at: "2024-04-21T09:00:00",
        accounts: {
          benefits: {
            icon: "🚘",
          },
        },
      },
      {
        id: 3,
        amount: -14.15,
        name: "Uber",
        created_at: "2024-04-14T09:00:00",
        accounts: {
          benefits: {
            icon: "🚘",
          },
        },
      },
      {
        id: 4,
        amount: -12,
        name: "Uber",
        created_at: "2024-04-7T09:00:00",
        accounts: {
          benefits: {
            icon: "🚘",
          },
        },
      },
    ] satisfies Transaction[]);
  }),
];
