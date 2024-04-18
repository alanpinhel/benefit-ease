import axios from "axios";
import { cookies } from "./cookies";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  headers: {
    Authorization: `Bearer ${cookies.get("access_token") || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
