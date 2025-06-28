import { addAuthHeader } from "@/lib/utils";
import { toast } from "sonner";


export const fetchChats = async (user, slug, updateSideBarSessions, setIsFetching) => {
    try {
        if (!user?.id || !slug) return;

        // 🔹 Get auth headers
        const authHeader = addAuthHeader();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/?userId=${user.id}&assistantSlug=${slug}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader, // 🔥 Spread token header dynamically
                },
            }
        );

        if (!response.ok) {
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

        updateSideBarSessions(data);
    } catch (err) {
        // console.log('err: ', err)
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

export const fetchChat = async (sessionId) => {
    try {
        // console.log('sessionID: ', sessionId)
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
        // console.log('data: ', data)

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