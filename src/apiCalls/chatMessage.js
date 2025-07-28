import { addAuthHeader } from "@/lib/utils";
import { toast } from "sonner";

export const fetchMessages = async (sessionId, assistantSlug, setIsFetchingChats, setActiveChatMessages, page = 1, limit = 50) => {
    try {
        // 🔹 Get auth headers with compression preference
        const authHeader = addAuthHeader();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/fetch/${sessionId}?assistantSlug=${assistantSlug}&page=${page}&limit=${limit}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br',
                    ...authHeader, // 🔥 Spread token header dynamically
                },
            }
        );

        // Handle rate limiting
        const rateLimitRemaining = response.headers.get('RateLimit-Remaining');
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

            toast.error(`Failed to fetch assistant messages`, {
                description: response?.statusText == 'Unauthorized' ? 'Unauthorized, Please login' : response?.statusText,
                style: {
                    border: "none",
                    color: "red",
                },
            });

            return
        }

        const data = await response?.json();
        
        // Handle paginated response
        if (data.messages && data.pagination) {
            // New paginated format
            const messages = data.messages;
            const pagination = data.pagination;
            
            if (page === 1) {
                // First page - replace all messages
                setActiveChatMessages(messages);
            } else {
                // Subsequent pages - prepend to existing messages (older messages)
                setActiveChatMessages(messages, true); // true indicates prepend mode for messages
            }
            
            return {
                messages,
                pagination,
                hasMore: pagination.hasMore
            };
        } else {
            // Legacy format - fallback for backward compatibility
            setActiveChatMessages(data?.messages || []);
            return { messages: data?.messages || [], hasMore: false };
        }
    } catch (err) {
        toast.error(`Failed to fetch assistant messages`, {
            description: "Something went wrong - reload page",
            style: {
                border: "none",
                color: "red",
            },
        });
    } finally {
        setIsFetchingChats(false);
    }
};