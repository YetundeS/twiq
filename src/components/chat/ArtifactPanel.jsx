"use client";

// Right-side artifact renderer (Phase 3 track 3 MVP). Read-only.
//
// Controlled by useArtifactStore — mount this once at the platform
// layout level and the "View as carousel" button on individual chat
// messages calls store.open(payload) to fill it.
//
// Copy affordances: whole-carousel or single-slide, both via the shared
// useCopyToClipboard hook so the toast + timing are consistent with the
// rest of the chat surface.

import { useMemo } from "react";
import { Copy, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import useArtifactStore from "@/store/useArtifactStore";

function formatFullCarousel(slides) {
    return slides
        .map((s) => `Slide ${s.index} — ${s.title}\n${s.body}`.trim())
        .join("\n\n");
}

export default function ArtifactPanel() {
    const activeArtifact = useArtifactStore((s) => s.activeArtifact);
    const close = useArtifactStore((s) => s.close);
    const { copyToClipboard } = useCopyToClipboard();

    const open = !!activeArtifact;
    const slides = activeArtifact?.slides ?? [];
    const fullText = useMemo(() => formatFullCarousel(slides), [slides]);

    const onOpenChange = (next) => {
        if (!next) close();
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                data-testid="artifact-panel"
                className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto"
            >
                <SheetHeader>
                    <div className="flex items-center gap-2">
                        <LayoutGrid size={18} className="text-muted-foreground" />
                        <SheetTitle>{activeArtifact?.title || "Carousel"}</SheetTitle>
                    </div>
                    <SheetDescription>
                        10-slide carousel preview. Read-only for now — regenerate via
                        chat to make changes.
                    </SheetDescription>
                    <div className="pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => copyToClipboard(fullText)}
                            data-testid="artifact-copy-all"
                        >
                            <Copy size={14} /> Copy all slides
                        </Button>
                    </div>
                </SheetHeader>

                <div className="px-4 pb-8 flex flex-col gap-3">
                    {slides.map((slide) => (
                        <article
                            key={slide.key}
                            data-testid={`artifact-slide-${slide.index}`}
                            className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2"
                        >
                            <header className="flex items-center justify-between gap-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs font-mono text-muted-foreground">
                                        Slide {slide.index}
                                    </span>
                                    <h3 className="text-sm font-semibold">{slide.title}</h3>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            `Slide ${slide.index} — ${slide.title}\n${slide.body}`
                                        )
                                    }
                                    aria-label={`Copy slide ${slide.index}`}
                                    data-testid={`artifact-copy-slide-${slide.index}`}
                                >
                                    <Copy size={12} />
                                </Button>
                            </header>
                            {slide.body ? (
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {slide.body}
                                </p>
                            ) : (
                                <p className="text-xs italic text-muted-foreground">
                                    (No content for this slide — the coach didn&apos;t label it.)
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
