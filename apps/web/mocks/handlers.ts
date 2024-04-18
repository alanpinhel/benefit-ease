import { SignInResponse } from "@/app/login/page";
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

/**
 * Expired Token Example Response:
 * {
 *   "code": 403,
 *   "error_code": "bad_jwt",
 *   "msg": "invalid JWT: unable to parse or verify signature, token is expired by 3h37m30s"
 * }
 */
