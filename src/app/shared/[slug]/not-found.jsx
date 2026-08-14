import { LinkIcon } from "lucide-react";
import Link from "next/link";

export default function SharedNotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-6">
            <div className="max-w-md text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-500/10 border border-gray-500/30 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-gray-500" />
                </div>
                <h1 className="text-2xl font-semibold">This shared chat isn’t available</h1>
                <p className="text-sm text-muted-foreground">
                    The link may be wrong, or the sender may have revoked it.
                </p>
                <Link
                    href="/"
                    className="inline-block text-sm underline text-muted-foreground hover:text-foreground"
                >
                    Go to TWIQ
                </Link>
            </div>
        </main>
    );
}
