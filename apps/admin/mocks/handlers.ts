import { HttpResponse, RequestHandler, http } from "msw";

export const handlers: RequestHandler[] = [
  http.get("*/rest/v1/accounts", () => {
    return HttpResponse.json([]);
  }),
  http.get("*/rest/v1/transactions", () => {
    return HttpResponse.json([]);
  }),
];
