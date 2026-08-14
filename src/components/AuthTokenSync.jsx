"use client";

// Mount-only client island that boots the Supabase auth-token sync on
// the first client render. Renders nothing.
//
// Mounted from src/app/layout.js so it runs on every route (auth pages,
// platform pages, marketing pages). Idempotent — safe if mounted more
// than once.

import { useEffect } from "react";
import { initAuthTokenSync } from "@/lib/authTokenSync";

export default function AuthTokenSync() {
    useEffect(() => {
        initAuthTokenSync();
    }, []);
    return null;
}
