import { addAuthHeader } from "@/lib/utils";
import { toast } from "sonner";


export const fetchChats = async (user, slug, updateSideBarSessions, setIsFetching, page = 1, limit = 20) => {
    try {
        if (!user?.id || !slug) return;

        // 🔹 Get auth headers with compression preference
        const authHeader = addAuthHeader();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/?userId=${user.id}&assistantSlug=${slug}&page=${page}&limit=${limit}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip, deflate, br",
                    ...authHeader, // 🔥 Spread token header dynamically
                },
            }
        );

        // Handle rate limiting
        const rateLimitRemaining = response.headers.get('RateLimit-Remaining');
        const rateLimitReset = response.headers.get('RateLimit-Reset');
        
        if (rateLimitRemaining && parseInt(rateLimitRemaining) < 5) {
            toast.warning(`Rate limit approaching`, {
                description: `${rateLimitRemaining} requests remaining`,
                style: {
                    border: "none",
                    color: "orange",
                },
            });
        }

        if (!response.ok) {
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                toast.error(`Rate limited`, {
                    description: `Please wait ${retryAfter ? Math.ceil(retryAfter / 60) + ' minutes' : 'a moment'} before trying again`,
                    style: {
                        border: "none",
                        color: "red",
                    },
                });
                return;
            }

            toast.error(`Failed to fetch ${slug} assistant chats`, {
                description: response?.statusText ?( response?.statusText?.includes('Unauthorized') ? 'Unauthorized - Please log in' : response?.statusText) : "Something went wrong - reload page",
                style: {
                    border: "none",
                    color: "red",
                },
            });
            return
        }
        
        const data = await response.json();
        
        // Handle paginated response
        if (data.data && data.pagination) {
            // New paginated format
            const sessions = data.data;
            const pagination = data.pagination;
            
            if (page === 1) {
                // First page - replace all sessions
                updateSideBarSessions(sessions);
            } else {
                // Subsequent pages - append to existing sessions
                updateSideBarSessions(sessions, true); // true indicates append mode
            }
            
            return {
                sessions,
                pagination,
                hasMore: pagination.hasMore
            };
        } else {
            // Legacy format - fallback for backward compatibility
            updateSideBarSessions(data);
            return { sessions: data, hasMore: false };
        }
    } catch (err) {
        toast.error(`Failed to fetch ${slug} assistant chats`, {
            description: "Something went wrong - reload page",
            style: {
                border: "none",
                color: "red",
            },
        });
    } finally {
        setIsFetching(false)
    }
};

export const updateSession = async (sessionId, patch) => {
    if (!sessionId) return null;

    const authHeader = addAuthHeader();
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/${sessionId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader,
                },
                body: JSON.stringify(patch),
            }
        );

        if (!response.ok) {
            let description = response.statusText || "Please try again";
            try {
                const body = await response.json();
                if (body?.error) description = body.error;
            } catch (_) { /* ignore parse failures */ }

            toast.error("Failed to update session", {
                description,
                style: { border: "none", color: "red" },
            });
            return null;
        }

        const data = await response.json();
        return data?.session ?? null;
    } catch (_err) {
        toast.error("Failed to update session", {
            description: "Something went wrong - please try again",
            style: { border: "none", color: "red" },
        });
        return null;
    }
};

export const deleteSession = async (sessionId) => {
    if (!sessionId) return false;

    const authHeader = addAuthHeader();
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/${sessionId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader,
                },
            }
        );

        if (!response.ok) {
            let description = response.statusText || "Please try again";
            try {
                const body = await response.json();
                if (body?.error) description = body.error;
            } catch (_) { /* ignore parse failures */ }

            toast.error("Failed to delete session", {
                description,
                style: { border: "none", color: "red" },
            });
            return false;
        }

        return true;
    } catch (_err) {
        toast.error("Failed to delete session", {
            description: "Something went wrong - please try again",
            style: { border: "none", color: "red" },
        });
        return false;
    }
};

// GET /api/chats/coach/:slug — read-only coach identity + model allowlist.
// Feeds the retry-with-model picker so we can offer the fallback model
// as an alternative to the coach default.
export const fetchCoachPublicProfile = async (slug) => {
    if (!slug) return null;
    const authHeader = addAuthHeader();
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/coach/${slug}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader,
                },
            }
        );
        if (!response.ok) return null;
        const data = await response.json();
        return data?.coach ?? null;
    } catch (_err) {
        return null;
    }
};

export const fetchChat = async (sessionId) => {
    try {
        if (!sessionId) return;

        // 🔹 Get auth headers
        const authHeader = addAuthHeader();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/${sessionId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader, // 🔥 Spread token header dynamically
                },
            }
        );

        
        if (!response.ok) {
            toast.error(`Failed to fetch chat`, {
                description: response?.statusText ?( response?.statusText?.includes('Unauthorized') ? 'Unauthorized - Please log in' : response?.statusText) : "Something went wrong - reload page",
                style: {
                    border: "none",
                    color: "red",
                },
            });
            return
        }

        const data = await response.json();

        return null

    } catch (error) {
        toast.error(`Failed to fetch chat`, {
            description: "Something went wrong - reload page",
            style: {
                border: "none",
                color: "red",
            },
        });
    }
}