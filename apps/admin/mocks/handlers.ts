import { Benefit } from "@/app/page";
import { accounts, transactions } from "@repo/mocks";
import { HttpResponse, RequestHandler, http } from "msw";

export const benefits: Benefit[] = [
  { id: 1, name: "Alimentação", icon: "🥦" },
  { id: 2, name: "Mobilidade", icon: "🚘" },
  { id: 3, name: "Saúde", icon: "🩺" },
];

export const handlers: RequestHandler[] = [
  http.get("*/rest/v1/accounts", () => {
    return HttpResponse.json(accounts);
  }),
  http.delete("*/rest/v1/accounts", () => {
    return HttpResponse.json({});
  }),
  http.post("*/rest/v1/accounts", () => {
    return HttpResponse.json({});
  }),
  http.get("*/rest/v1/transactions", () => {
    return HttpResponse.json(transactions);
  }),
  http.get("*/rest/v1/benefits", () => {
    return HttpResponse.json(benefits);
  }),
];
