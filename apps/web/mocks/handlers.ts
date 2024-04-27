import { SignInResponse } from "@/app/login/page";
import { accounts, transactions } from "@repo/mocks";
import { HttpResponse, RequestHandler, http } from "msw";

export const handlers: RequestHandler[] = [
  http.post("*/auth/v1/signup", () => {
    return HttpResponse.json({});
  }),
  http.put("*/auth/v1/user", () => {
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
  http.get("*/rest/v1/accounts", () => {
    return HttpResponse.json(accounts);
  }),
  http.get("*/rest/v1/transactions", () => {
    return HttpResponse.json(transactions);
  }),
];
