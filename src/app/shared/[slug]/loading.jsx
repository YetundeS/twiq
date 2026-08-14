import MessageListSkeleton from "@/components/carouselComponents/MessageListSkeleton";

export default function SharedLoading() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-3xl px-4 pt-8 pb-16">
                <MessageListSkeleton />
            </div>
        </main>
    );
}
