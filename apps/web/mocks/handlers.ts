import { SignInResponse } from "@/app/auth-context";
import { http, HttpResponse, RequestHandler } from "msw";

export const handlers: RequestHandler[] = [
  http.post("*/auth/v1/signup", () => HttpResponse.json({})),

  http.post("*/auth/v1/token", () =>
    HttpResponse.json({
      access_token: `token`,
      user: {
        email: "bruce.wayne@batman.com",
        user_metadata: {
          display_name: "Bruce Wayne",
        },
      },
    } satisfies SignInResponse)
  ),

  http.put("*/auth/v1/user", () => HttpResponse.json({})),
];
