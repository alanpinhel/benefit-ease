import { http, HttpResponse, RequestHandler } from "msw";

export const handlers: RequestHandler[] = [
  http.post("*/auth/v1/signup", () =>
    HttpResponse.json({
      id: "225b1d6f-4032-410a-8c24-33fc27cf7140",
    })
  ),

  http.post("*/auth/v1/token", () =>
    HttpResponse.json({
      access_token: `eyJhbGciOiJIUzI1NiIsImtpZCI6InpaWFZzQ3R4V1JjQkJ3MVMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzEzMTgxODY1LCJpYXQiOjE3MTMxNzgyNjUsImlzcyI6Imh0dHBzOi8vbnd6c2l3dW9uYWxtY3hmaHV3c3ouc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImE2NGE2ZjU5LTEyZTYtNGY5NS05YjU4LTA5OTdjNWVmZjNiNiIsImVtYWlsIjoiYWxhbnBpbmhlbEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTcxMzE3ODI2NX1dLCJzZXNzaW9uX2lkIjoiYTAzY2U1ZTktMmUxYi00MDE0LWJmNTctZTA5NWU4Yjk3Zjk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.-53HWnGB0okjYNb75tx-qhmNvcdbcqH0MqmmUNBWdEs`,
    })
  ),
];
