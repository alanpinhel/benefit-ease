import { http, HttpResponse, RequestHandler } from "msw";

export const handlers: RequestHandler[] = [
  http.post("*/auth/v1/signup", () =>
    HttpResponse.json({ id: "225b1d6f-4032-410a-8c24-33fc27cf7140" })
  ),
];
