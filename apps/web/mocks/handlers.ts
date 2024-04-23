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
        balance: 360,
        benefits: {
          id: 1,
          name: "Mobilidade",
          color_from: "lime",
          color_to: "green",
          icon: "🚘",
        },
      },
      {
        id: 2,
        balance: 1200,
        benefits: {
          id: 2,
          name: "Alimentação",
          color_from: "teal",
          color_to: "blue",
          icon: "🥦",
        },
      },
      {
        id: 3,
        balance: 120,
        benefits: {
          id: 3,
          name: "Cultura",
          color_from: "orange",
          color_to: "red",
          icon: "🎭",
        },
      },
      {
        id: 4,
        balance: 250,
        benefits: {
          id: 4,
          name: "Saúde",
          color_from: "#f27794",
          color_to: "#f08779",
          icon: "🩺",
        },
      },
    ] satisfies Account[]);
  }),
  http.get("*/rest/v1/transactions", () => {
    return HttpResponse.json([
      {
        id: 1,
        amount: 1200,
        merchant: "Bora gastar!?",
        created_at: "2024-05-21T09:00:00",
        operation: "deposit",
        accounts: {
          benefits: {
            icon: "🥦",
          },
        },
      },
      {
        id: 2,
        amount: -29.21,
        merchant: "Supermercado",
        created_at: "2024-05-22T09:00:00",
        operation: "payment",
        accounts: {
          benefits: {
            icon: "🥦",
          },
        },
      },
      {
        id: 3,
        amount: -202,
        merchant: "Supermercado",
        created_at: "2024-05-23T09:00:00",
        operation: "payment",
        accounts: {
          benefits: {
            icon: "🥦",
          },
        },
      },
    ] satisfies Transaction[]);
  }),
];
