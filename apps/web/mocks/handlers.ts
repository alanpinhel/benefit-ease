import { SignInResponse } from "@/app/login/page";
import { accounts, benefits, transactions } from "@repo/mocks";
import { Account, Benefit } from "@repo/types";
import { HttpResponse, RequestHandler, http } from "msw";

export const handlers: RequestHandler[] = [
  http.post("*/auth/v1/signup", () => {
    return HttpResponse.json({});
  }),
  http.put("*/auth/v1/user", () => {
    return HttpResponse.json({
      id: 3,
      balance: 0,
      benefits: benefits[2] as Benefit,
    } satisfies Account);
  }),
  http.post("*/auth/v1/token", () => {
    return HttpResponse.json({
      access_token: "access_token",
      refresh_token: "refresh_token",
      user: {
        id: "id",
        email: "john.doe@gmail.com",
        user_metadata: {
          display_name: "John Doe",
        },
      },
    } satisfies SignInResponse);
  }),
  http.get("*/rest/v1/accounts", () => {
    return HttpResponse.json(accounts);
  }),
  http.get("*/rest/v1/transactions", () => {
    return HttpResponse.json(transactions);
  }),
];
