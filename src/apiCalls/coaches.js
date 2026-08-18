import { addAuthHeader } from "@/lib/utils";

/**
 * GET /api/coaches — public coach list for the picker + sidebar.
 *
 * Backend filters `is_published = true`; the FE further filters by
 * plan visibility per user (see `canAccessCoach` in useCoaches).
 *
 * §D-4: apiCalls that throw are the exception in this codebase — most
 * return `null` on failure and toast inline. This one throws so SWR
 * populates `error` and the caller (useCoaches) can decide how to
 * surface it.
 *
 * @returns {Promise<Array<{
 *   slug: string,
 *   display_name: string,
 *   description: string|null,
 *   default_model: string,
 *   fallback_model: string|null,
 *   allowed_plans: string[],
 *   is_published: boolean,
 *   icon_url: string|null,
 *   sort_index: number|null,
 * }>>}
 * @throws {Error} when the fetch returns a non-2xx or the network fails.
 */
export const getCoaches = async () => {
  const authHeader = addAuthHeader();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URI}/coaches`,
    {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    },
  );
  if (!response.ok) {
    let error = response.statusText || "Failed to load coaches";
    try {
      const body = await response.json();
      if (body?.error) error = body.error;
    } catch (_) {
      /* ignore parse failures */
    }
    throw new Error(error);
  }
  const data = await response.json();
  return Array.isArray(data?.coaches) ? data.coaches : [];
};
