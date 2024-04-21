import axios, { isAxiosError } from "axios";
import { cookies } from "./cookies";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  headers: {
    Authorization: `Bearer ${cookies.get("access_token") || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});

function isExpiredTokenError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    error.response.data.message === "JWT expired"
  );
}

api.interceptors.response.use(
  (v) => v,
  async (error) => {
    if (!isExpiredTokenError(error)) {
      return Promise.reject(error);
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
        {
          refresh_token: cookies.get("refresh_token"),
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        }
      );
      cookies.set("access_token", response.data.access_token);
      cookies.set("refresh_token", response.data.refresh_token);
      return api({
        ...error.config,
        headers: {
          ...error.config?.headers,
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
);
