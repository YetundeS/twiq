import { addAuthHeader } from "@/lib/utils";
import { toast } from "sonner";

export const fetchMessages = async (sessionId, assistantSlug, setIsFetchingChats, setActiveChatMessages) => {
    try {
        // 🔹 Get auth headers
        const authHeader = addAuthHeader();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/fetch/${sessionId}?assistantSlug=${assistantSlug}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader, // 🔥 Spread token header dynamically
                },
            }
        );

        if (!response.ok) {
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
        setActiveChatMessages(data?.messages || []);
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