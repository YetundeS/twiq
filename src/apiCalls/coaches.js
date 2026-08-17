import { addAuthHeader } from "@/lib/utils";

// GET /api/coaches — public coach list for the picker + sidebar.
// Backend filters is_published=true; the FE further filters by plan
// visibility per user. Returns { coaches: [...] } or throws.
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
