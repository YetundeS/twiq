"use client";

// Right-side artifact renderer (Phase 3 track 3). Read-only.
//
// Controlled by useArtifactStore — mount once at the platform layout
// level and the "view as ..." button on individual chat messages calls
// store.open(payload) to fill it.
//
// Dispatches on activeArtifact.kind:
//   - "carousel"     → 10 slide cards (CarouselArtifactBody)
//   - "video_script" → 4 section cards + hashtags footer (VideoScriptArtifactBody)
//
// New artifact types slot in as another body sub-component + one branch
// in the switch. Header, Copy-all button, and Sheet framing stay generic.

import { useMemo } from "react";
import { Copy, FileText, LayoutGrid } from "lucide-react";
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

// -----------------------------------------------------------------------------
// Pure formatters — shared with the "Copy all" button.
// -----------------------------------------------------------------------------

function formatCarouselFull(slides = []) {
    return slides
        .map((s) => `Slide ${s.index} — ${s.title}\n${s.body}`.trim())
        .join("\n\n");
}

function formatVideoScriptFull(sections = [], hashtags = null) {
    const body = sections
        .map((s) => `${s.title}\n${s.body}`.trim())
        .join("\n\n");
    return hashtags ? `${body}\n\nHashtags: ${hashtags}` : body;
}

// -----------------------------------------------------------------------------
// Kind-specific renderers
// -----------------------------------------------------------------------------

function CarouselArtifactBody({ slides, copyToClipboard }) {
    return (
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
    );
}

function VideoScriptArtifactBody({ sections, hashtags, copyToClipboard }) {
    return (
        <div className="px-4 pb-8 flex flex-col gap-3">
            {sections.map((section) => (
                <article
                    key={section.key}
                    data-testid={`artifact-section-${section.index}`}
                    className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2"
                >
                    <header className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold">{section.title}</h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                copyToClipboard(`${section.title}\n${section.body}`)
                            }
                            aria-label={`Copy ${section.title}`}
                            data-testid={`artifact-copy-section-${section.index}`}
                        >
                            <Copy size={12} />
                        </Button>
                    </header>
                    {section.body ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {section.body}
                        </p>
                    ) : (
                        <p className="text-xs italic text-muted-foreground">
                            (No content for this section — the coach didn&apos;t label it.)
                        </p>
                    )}
                </article>
            ))}

            {hashtags && (
                <article
                    data-testid="artifact-hashtags"
                    className="rounded-lg border border-dashed border-border bg-muted/40 p-4 flex items-start justify-between gap-2"
                >
                    <div>
                        <h3 className="text-sm font-semibold mb-1">Hashtags</h3>
                        <p className="text-sm text-muted-foreground break-words">
                            {hashtags}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(hashtags)}
                        aria-label="Copy hashtags"
                        data-testid="artifact-copy-hashtags"
                    >
                        <Copy size={12} />
                    </Button>
                </article>
            )}
        </div>
    );
}

// -----------------------------------------------------------------------------
// Panel shell
// -----------------------------------------------------------------------------

export default function ArtifactPanel() {
    const activeArtifact = useArtifactStore((s) => s.activeArtifact);
    const close = useArtifactStore((s) => s.close);
    const { copyToClipboard } = useCopyToClipboard();

    const open = !!activeArtifact;
    const kind = activeArtifact?.kind;

    const fullText = useMemo(() => {
        if (!activeArtifact) return "";
        if (kind === "carousel") return formatCarouselFull(activeArtifact.slides);
        if (kind === "video_script")
            return formatVideoScriptFull(activeArtifact.sections, activeArtifact.hashtags);
        return "";
    }, [activeArtifact, kind]);

    const onOpenChange = (next) => {
        if (!next) close();
    };

    const headerIcon = kind === "video_script" ? FileText : LayoutGrid;
    const description =
        kind === "video_script"
            ? "4-section video script. Read-only for now — regenerate via chat to make changes."
            : "10-slide carousel preview. Read-only for now — regenerate via chat to make changes.";
    const copyAllLabel =
        kind === "video_script" ? "Copy full script" : "Copy all slides";

    const HeaderIcon = headerIcon;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                data-testid="artifact-panel"
                data-artifact-kind={kind}
                className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto"
            >
                <SheetHeader>
                    <div className="flex items-center gap-2">
                        <HeaderIcon size={18} className="text-muted-foreground" />
                        <SheetTitle>{activeArtifact?.title || "Artifact"}</SheetTitle>
                    </div>
                    <SheetDescription>{description}</SheetDescription>
                    <div className="pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => copyToClipboard(fullText)}
                            data-testid="artifact-copy-all"
                        >
                            <Copy size={14} /> {copyAllLabel}
                        </Button>
                    </div>
                </SheetHeader>

                {kind === "carousel" && (
                    <CarouselArtifactBody
                        slides={activeArtifact.slides ?? []}
                        copyToClipboard={copyToClipboard}
                    />
                )}
                {kind === "video_script" && (
                    <VideoScriptArtifactBody
                        sections={activeArtifact.sections ?? []}
                        hashtags={activeArtifact.hashtags ?? null}
                        copyToClipboard={copyToClipboard}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
