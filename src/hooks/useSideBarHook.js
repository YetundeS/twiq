"use client"

import { fetchChats } from "@/apiCalls/chatSessions";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";

export const useSidebarChats = () => {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const { currentAssistantSlug, updateSideBarSessions, setCurrentAssistantSlug } = useSideBar();

    const [isFetching, setIsFetching] = useState(false)


    useEffect(() => {
        if (!pathname || !user?.id) return;

        // split the path into segments
        const segments = pathname.split('/').filter(Boolean);
        const assistantSlug = segments[2];  // index 2 is always your assistant slug

        // console.log('assistantSlug: ', assistantSlug)
        if (!assistantSlug) {
            updateSideBarSessions([])
        } else if (!currentAssistantSlug || assistantSlug !== currentAssistantSlug) { // only re-fetch if no slug yet (first load) or slug changed
            sidebarFetchChats(assistantSlug);
        }
    }, [pathname, user?.id, currentAssistantSlug]);

    const sidebarFetchChats = (assistantSlug) => {
        if (!assistantSlug) return;

        setIsFetching(true);

        fetchChats(
            user,
            assistantSlug,
            (sessions) => {
                updateSideBarSessions(sessions);
                setIsFetching(false);
                setCurrentAssistantSlug(assistantSlug);
            },
            setIsFetching
        )
    }

    return { isFetching }
};
