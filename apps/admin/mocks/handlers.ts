import { accounts, transactions } from "@repo/mocks";
import { HttpResponse, RequestHandler, http } from "msw";

export const handlers: RequestHandler[] = [
  http.get("*/rest/v1/accounts", () => {
    return HttpResponse.json(accounts);
  }),
  http.get("*/rest/v1/transactions", () => {
    return HttpResponse.json(transactions);
  }),
];
