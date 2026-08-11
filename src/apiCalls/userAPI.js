import { addAuthHeader } from "@/lib/utils";
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
});

// GET /user/usage — per-user consumption snapshot for the settings dashboard.
// Returns { usage: { current_period, by_coach, by_model, by_day } } or throws.
export const getUsage = async () => {
  const response = await API.get("/user/usage", {
    headers: { ...addAuthHeader() },
  });
  return response.data?.usage;
};
