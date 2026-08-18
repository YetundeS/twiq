"use client";

// SWR wrapper around GET /api/coaches. Replaces the hardcoded
// src/constants/sidebar.js `models` array so admin's archive-coach
// action actually hides the coach from the picker + sidebar.
//
// Returns `coaches` in the raw backend shape:
//   [{ slug, display_name, description, default_model, allowed_plans,
//      is_published, icon_url }]
//
// Backend already filters is_published=true, so every row here is
// live-published. The FE is responsible for per-plan visibility
// (see canAccessCoach below).

import useSWR from "swr";
import { toast } from "sonner";
import { getCoaches } from "@/apiCalls/coaches";

const KEY = "/api/coaches";

export default function useCoaches() {
  const { data, error, isLoading, mutate } = useSWR(KEY, getCoaches, {
    // Coach list changes only when an admin edits — no revalidateOnFocus
    // needed for polling, but keep revalidate-on-mount for freshness
    // after admin edits.
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
    // Surface fetch failures instead of silently rendering an empty
    // sidebar. SWR fires onError on every failed revalidation (including
    // retries), so guard on shouldRetryOnError=false-equivalent behavior
    // by only toasting the first-mount failure. In practice SWR's
    // errorRetryCount default (a few attempts with backoff) means one or
    // two toasts on a real outage, which is acceptable.
    onError: (err) => {
      toast.error("Couldn't load coaches", {
        description: err?.message || "Try refreshing the page.",
        style: { border: "none", color: "red" },
      });
    },
  });
  return {
    coaches: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

// Data-driven plan visibility check. Uses the backend's `allowed_plans`
// array on each coach instead of the older hardcoded starterModels /
// proModels lists in components/appSideBar/index.jsx — which don't know
// about coaches admins added through the panel.
//
// Returns true when the user's plan is in the coach's allowed_plans.
// Case-insensitive on the plan name because prod stores them uppercase
// (STARTER, PRO, ENTERPRISE) but user.subscription_plan is sometimes
// lowercase depending on the login path.
export function canAccessCoach(userPlan, coach) {
  if (!userPlan || !coach?.allowed_plans) return false;
  const upper = String(userPlan).toUpperCase();
  return coach.allowed_plans.some((p) => String(p).toUpperCase() === upper);
}
