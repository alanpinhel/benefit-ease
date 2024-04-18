import { Cookies } from "react-cookie";

const domain = () =>
  typeof window !== "undefined"
    ? window.location.hostname.split(".").slice(-2).join(".")
    : "";

export const cookies = new Cookies(undefined, {
  path: "/",
  secure: process.env.NODE_ENV === "production",
});
