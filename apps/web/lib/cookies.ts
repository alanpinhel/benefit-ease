import { Cookies } from "react-cookie";

export const defaultSetOptions = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export const cookies = new Cookies(null, defaultSetOptions);
