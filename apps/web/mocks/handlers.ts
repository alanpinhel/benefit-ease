import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("/auth/v1/signup", () => {
    return HttpResponse.json({});
  }),
];
