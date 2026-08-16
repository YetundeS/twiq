import { Clock } from "lucide-react";
import Link from "next/link";
import SharedPageShell from "./SharedPageShell";

// Rendered when the backend returns 410 (expired share) or a non-200 that
// isn't a 404. Distinct from not-found.jsx so viewers know the link WAS
// valid at some point.
export default function SharedExpired({ unknown = false }) {
    return (
        <SharedPageShell>
            <main className="min-h-screen flex items-center justify-center text-gray-900 dark:text-gray-100 px-6">
                <div className="max-w-md text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <h1 className="text-2xl font-semibold">
                        {unknown ? "This shared chat can’t be loaded" : "This shared link has expired"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {unknown
                            ? "Please try again in a moment, or ask the sender for a fresh link."
                            : "Ask the sender for a fresh link — shares expire 30 days after they’re created."}
                    </p>
                    <Link
                        href="/"
                        className="inline-block text-sm underline text-muted-foreground hover:text-foreground"
                    >
                        Go to TWIQ
                    </Link>
                </div>
            </main>
        </SharedPageShell>
    );
}
