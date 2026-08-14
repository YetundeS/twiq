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

// GET /models — allowed models for the caller's plan (§6.9 model picker).
// Returns { models, plan } | throws.
export const getModelsAPI = async () => {
  const response = await API.get("/models", {
    headers: { ...addAuthHeader() },
  });
  return {
    models: response.data?.models ?? [],
    plan: response.data?.plan ?? null,
  };
};
