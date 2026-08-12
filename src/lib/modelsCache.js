// User-keyed in-memory cache for the allowed-models list served by
// GET /api/models. Fetched by the ModelPicker component (§6.9) — keyed
// by user id so that a logged-out+logged-in-as-different-user flow on
// the same tab doesn't reuse the previous user's plan-allowed models.
//
// Backend re-validates on PATCH so a stale cache is not a security hole;
// this is a UX correctness fix (a STARTER-after-PRO user was seeing
// PRO-only models in the dropdown for up to 5 min, all of which would
// have 400'd on PATCH).

import { getModelsAPI } from "@/apiCalls/userAPI";

const CACHE_MS = 5 * 60 * 1000;
const modelsCache = new Map(); // userId → { models, expiresAt }

export async function loadModelsCached(userId, fetcher = getModelsAPI, now = Date.now) {
  if (!userId) return [];
  const t = now();
  const hit = modelsCache.get(userId);
  if (hit && hit.expiresAt > t) return hit.models;
  const out = await fetcher();
  const models = out?.models || [];
  modelsCache.set(userId, { models, expiresAt: t + CACHE_MS });
  return models;
}

export function invalidateModelsCache(userId) {
  if (userId === undefined) modelsCache.clear();
  else modelsCache.delete(userId);
}

// Test-only accessor for asserting cache state without exposing the Map.
export function _cacheSizeForTests() {
  return modelsCache.size;
}
