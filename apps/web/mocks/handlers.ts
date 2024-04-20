import { SignInResponse } from "@/app/login/page";
import { http, HttpResponse, RequestHandler } from "msw";

export const accounts = [
  {
    id: "1",
    balance: 360,
    benefit: {
      id: "1",
      name: "Mobilidade",
      color_from: "lime",
      color_to: "green",
      icon: "🚘",
    },
  },
  {
    id: "2",
    balance: 840,
    benefit: {
      id: "2",
      name: "Alimentação",
      color_from: "teal",
      color_to: "blue",
      icon: "🥦",
    },
  },
  {
    id: "3",
    balance: 120,
    benefit: {
      id: "3",
      name: "Cultura",
      color_from: "orange",
      color_to: "red",
      icon: "🎭",
    },
  },
  {
    id: "4",
    balance: 250,
    benefit: {
      id: "4",
      name: "Saúde",
      color_from: "#f27794",
      color_to: "#f08779",
      icon: "🩺",
    },
  },
];

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

  http.get("*/rest/v1/accounts", () => HttpResponse.json(accounts)),
];

/**
 * Expired Token Example Response:
 * {
 *   "code": 403,
 *   "error_code": "bad_jwt",
 *   "msg": "invalid JWT: unable to parse or verify signature, token is expired by 3h37m30s"
 * }
 */
