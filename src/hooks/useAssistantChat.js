import { editChatMessage, fetchMessages } from "@/apiCalls/chatMessage";
import { fetchCoachPublicProfile } from "@/apiCalls/chatSessions";
import { invalidateModelsCache } from "@/lib/modelsCache";
import { regenerateChatMessage } from "@/apiCalls/regenerateChatMessage";
import { sendChatMessage } from "@/apiCalls/sendChatMessage";
import { parseMessageIdFromHash } from "@/lib/messageHash";
import { hasAccess } from "@/components/appSideBar";
import { modelDetailsMap } from "@/constants/carousel";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import useModelsStore from "@/store/useModelsStore";
import { useResponsiveSidebarToggle } from "@/store/useResponsiveSidebarToggle";
import { useChatMessages } from "./useApiCache";
import { withDeduplication } from "@/utils/requestDeduplication";
import { generateSignString } from "@/lib/utils";
import { createRafBatcher } from "@/lib/rafBatcher";
import { detectMessageDrift } from "@/lib/messageDrift";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "./use-mobile";
import useKeyboardShortcuts from "./useKeyboardShortcuts";

// Drift diagnostic buffer (§5.5.5). Bounded ring — inspect via
// window.__twiqDriftLog in dev tools. Not shipped to any backend today;
// see docs on messageDrift.js for regression-harness use.
const DRIFT_LOG_MAX = 20;

function recordMessageDrift(prevChats, nextMessages, sessionId) {
  const report = detectMessageDrift(prevChats, nextMessages);
  if (!report.drifted) return;
  const entry = {
    at: new Date().toISOString(),
    sessionId,
    ...report,
  };
  if (typeof window !== "undefined") {
    if (!Array.isArray(window.__twiqDriftLog)) window.__twiqDriftLog = [];
    window.__twiqDriftLog.push(entry);
    if (window.__twiqDriftLog.length > DRIFT_LOG_MAX) {
      window.__twiqDriftLog.splice(0, window.__twiqDriftLog.length - DRIFT_LOG_MAX);
    }
  }
  if (process.env.NODE_ENV !== "production") {
    // Loud in dev so we notice; silent in prod (log buffer still fills).
    // eslint-disable-next-line no-console
    console.warn(
      "[messageDrift] SWR revalidation dropped rows the local Zustand snapshot had.",
      entry
    );
  }
}

export default function useAssistantChat(modelName, assistantSlug) {
  const [inputValue, setInputValue] = useState("");
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [uploadBtnActive, setUploadBtnActive] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [streamingData, setStreamingData] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [showToggleChat, setShowToggleChat] = useState(false);
  const [coach, setCoach] = useState(null);
  const streamingDataRef = useRef("");
  // rAF batching (§10.2 perf sprint). When SSE chunks arrive in bursts
  // (fast models, network buffering) each one used to trigger a React
  // commit of the whole message window. The batcher caps commits at
  // paint-frame cadence — see src/lib/rafBatcher.js. Lazily initialized
  // so hydration doesn't allocate an unused batcher on servers.
  const streamingBatcherRef = useRef(null);
  if (streamingBatcherRef.current === null) {
    streamingBatcherRef.current = createRafBatcher();
  }
  const eventSourceRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore()
  const isMobile = useIsMobile();

  const pathname = usePathname();
  const router = useRouter();
  const [isFetchingChats, setIsFetchingChats] = useState(true);


  const { addToSideBarSessions, updateSessionInSideBar, isSidebarOpen, isMobileSidebarOpen } = useSideBar();
  const {
    activeSessionID,
    activeChatMessages: chats,
    messagesHasMore,
    messagesPage,
    updateActiveSessionID,
    updateActiveChatMessages,
    setActiveChatMessages,
    setMessagesHasMore,
    setMessagesPage,
    resetMessagesPagination,
    setActiveCoach,
  } = useModelsStore();

  const modelDescription = modelDetailsMap[assistantSlug]?.description;

  const toggleSidebar = useResponsiveSidebarToggle();

  // Extract session ID from pathname
  const sessionId = useMemo(() => {
    const match = pathname.match(/\/platform\/@[^/]+\/[^/]+\/([^/?#]+)/);
    return match?.[1];
  }, [pathname]);

  // Use SWR hook for cached message fetching
  const { 
    messages, 
    hasMore, 
    isLoading: isLoadingMessages,
    mutate: mutateMessages 
  } = useChatMessages(sessionId, assistantSlug, {
    enabled: !!sessionId && !!assistantSlug,
    page: messagesPage,
  });

  // Optimized fetch messages with deduplication
  const fetchMessagesDeduped = useMemo(
    () => withDeduplication(fetchMessages),
    []
  );

  useEffect(() => {
    if (!sessionId) {
      resetMessagesPagination();
      return;
    }

    updateActiveSessionID(sessionId);
  }, [sessionId, updateActiveSessionID, resetMessagesPagination]);

  useEffect(() => {
    setIsFetchingChats(isLoadingMessages);
  }, [isLoadingMessages]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      // Zustand↔SWR drift diagnostic (audit §5.5.5). Observe whether the
      // SWR revalidation is about to clobber optimistic rows that Zustand
      // had. Zero behavior change — still copies over — just tells us
      // when the theoretical race is actually happening in dev.
      //
      // Read current Zustand via getState() (NOT through `chats`) so the
      // effect's dep array doesn't include a value the effect mutates.
      // qcheck H1 fix — putting `chats` in deps caused an infinite
      // render loop: effect writes to Zustand → chats ref changes →
      // effect fires → writes to Zustand → ...
      const currentChats = useModelsStore.getState().activeChatMessages;
      recordMessageDrift(currentChats, messages, activeSessionID);
      setActiveChatMessages(messages);
      setMessagesHasMore(hasMore);
    }
  }, [messages, hasMore, activeSessionID, setActiveChatMessages, setMessagesHasMore]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    if(inputValue && !streaming) {  // active when not streaming and there's prompt
      setSendBtnActive(true)
    } else {
      setSendBtnActive(false)
    }

    if(!streaming) {  // active when not streaming
      setUploadBtnActive(true)
    } else {
      setUploadBtnActive(false)
    }
  }, [inputValue, streaming]);


  function getErrorMessage(error = '') {
    if (error.includes('Unauthorized')) return 'Unauthorized - Please login';
    if (error.includes('Quota exceeded')) return 'Quota exceeded - Please upgrade your plan';
    if (error.includes('Your current plan')) return error;
    return 'Server Error - Please try again.';
  }

  // Append to ref immediately (so post-stream reads see the full accumulated
  // content) but schedule at most one React commit per animation frame.
  const updateStreamingData = (chunk) => {
    streamingDataRef.current += chunk;
    streamingBatcherRef.current.schedule(() => {
      setStreamingData(streamingDataRef.current);
    });
  };

  // Reset all streaming state atomically. Cancels any pending rAF so a
  // late-fire doesn't briefly re-paint stale content after reset. Callers
  // that want to keep the accumulated content (onComplete/onAbort insert
  // paths) should read streamingDataRef.current BEFORE calling this.
  const resetStreaming = () => {
    streamingBatcherRef.current.cancel();
    streamingDataRef.current = "";
    setStreamingData("");
  };

  // Cancel any pending rAF on unmount so it can't fire against an
  // unmounted component (React warns; not a hard crash but noisy).
  useEffect(() => {
    const batcher = streamingBatcherRef.current;
    return () => batcher?.cancel();
  }, []);

  // sendMessage accepts an optional `overrideText`. Retry-on-error uses it to
  // re-send the last user message without going through the input state
  // (inputValue is asynchronous — setState + call in the same tick loses the
  // new value). Files aren't carried through on retry: if you had uploads, the
  // errored turn either succeeded far enough to consume them or fell back to
  // a plain retry.
  const sendMessage = useCallback(async (overrideText) => {
    const text = typeof overrideText === "string" ? overrideText : inputValue;
    if (!text || streaming) return;

    const hasModelAccess = hasAccess(user?.subscription_plan, modelName);

    if (!hasModelAccess) {
      toast.error(`Upgrade to access "${modelName}" model`, {
        style: {
          border: "none",
          color: "red",
        },
      });

      setInputValue("");
      return; // stop execution
    }

    const usingOverride = typeof overrideText === "string";
    const filesForTurn = usingOverride ? [] : uploadedFiles;

    const userChat = {
      sender: "user", // "user" || 'assistant'
      content: text,
      sessionID: activeSessionID || 'newChat',
      created_at: new Date(),
      has_files: Array.isArray(filesForTurn) && filesForTurn.length > 0,
      linkedFiles: Array.isArray(filesForTurn)
        ? filesForTurn.map(({ name, type }) => ({ name, type }))
        : null,
    };

    // Update local state 
    updateActiveChatMessages(userChat);

    setStreaming(true);
    resetStreaming();

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    const currentInput = text;
    const currentFiles = filesForTurn;

    sendChatMessage(
      currentInput,
      activeSessionID,
      assistantSlug,
      currentFiles,
      (streamedData) => {
          updateStreamingData(streamedData);
      },
      () => {
        setStreaming(false);
        const finalMessage = streamingDataRef.current;
        resetStreaming();

        const assistantChat = {
          sender: "assistant",
          content: finalMessage,
          sessionID: activeSessionID || 'newChat',
          created_at: new Date(),
        };

        updateActiveChatMessages(assistantChat);

        // Invalidate cache to get latest messages
        mutateMessages();

        // Suggestion pills (§6.15 Phase 3 track 1) are generated on the
        // backend via setImmediate AFTER the response is sent, then
        // persisted to chat_messages.suggestions. The mutateMessages()
        // above runs BEFORE that background job completes, so pills
        // don't render on the just-completed reply. Refetch twice more
        // (2s + 5s) to catch typical + slow generations. Each mutate
        // is a single GET; SWR dedupes so rapid-fire won't hammer the
        // backend. If suggestions still haven't landed by 5s, they show
        // on next natural refetch (page nav, focus, etc).
        setTimeout(() => mutateMessages(), 2000);
        setTimeout(() => mutateMessages(), 5000);
      },
      (error) => {
        closeStreaming();
        const assistantErrorChat = {
          sender: "assistant",
          status: "error",
          content: getErrorMessage(error),
          sessionID: activeSessionID || 'newChat',
          created_at: new Date(),
        };

        updateActiveChatMessages(assistantErrorChat);
      },
      abortController,
      (chatSession) => {
        if (chatSession.id) {
          handleNewChatSession(chatSession);
        }
      },
      (newTitle) => {
        if (activeSessionID && newTitle) {
          updateSessionInSideBar(activeSessionID, { title: newTitle });
        }
      }
    );

    setInputValue("");
    setUploadedFiles([])
  }, [
    inputValue,
    streaming,
    user?.subscription_plan,
    modelName,
    uploadedFiles,
    activeSessionID,
    assistantSlug,
    updateActiveChatMessages,
    updateSessionInSideBar,
    mutateMessages
  ]);

  // end streaming output from assistant
  const closeStreaming = () => {
    if (eventSourceRef.current instanceof AbortController) {
      eventSourceRef.current.abort();
      if (streamingDataRef.current) {
        const assistantChat = {
          sender: "assistant",
          content: streamingDataRef.current,
          sessionID: activeSessionID || 'newChat',
          created_at: new Date(),
        };

        updateActiveChatMessages(assistantChat);
      }
      setStreaming(false);
      resetStreaming();
      eventSourceRef.current = null;
      setUploadedFiles([])
    }
  };


  const handleNewChatSession = useCallback(async (newChatSession) => {
    addToSideBarSessions(newChatSession);
    updateActiveSessionID(newChatSession?.id);
  }, [addToSideBarSessions, updateActiveSessionID]);

  // Load more messages for infinite scroll
  const loadMoreMessages = useCallback(async () => {
    if (!messagesHasMore || isLoadingMessages || !sessionId) return;

    const nextPage = messagesPage + 1;
    setMessagesPage(nextPage);

    try {
      const result = await fetchMessagesDeduped(
        sessionId, 
        assistantSlug, 
        () => {}, // No need for loading state since we have SWR
        setActiveChatMessages, 
        nextPage
      );

      if (result && result.messages) {
        setActiveChatMessages(result.messages, true); // Prepend older messages
        setMessagesHasMore(result.hasMore);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
      toast.error('Failed to load more messages', {
        description: 'Please try again',
        style: { border: "none", color: "red" },
      });
    }
  }, [
    messagesHasMore, 
    isLoadingMessages, 
    sessionId, 
    messagesPage, 
    assistantSlug,
    fetchMessagesDeduped,
    setActiveChatMessages,
    setMessagesPage,
    setMessagesHasMore
  ]);

  // closes stream when component unmounts unexpectedly
  useEffect(() => {
    return () => {
      closeStreaming();
    };
  }, []);

  // Search-fragment scroll-into-view (§6.11 polish). When landing on this
  // session via /platform/[org]/[coach]/[id]#message-N (from SearchDialog),
  // scroll that message into view + pulse it. Three layered robustness
  // fixes on top of the original chatMessageWindow.jsx implementation:
  //
  //   1. Poll for the target element for ~1s (10 × 100ms) in case the DOM
  //      hasn't finished painting when the effect first fires.
  //   2. If the target message id isn't in the loaded window at all, call
  //      loadMoreMessages() (prepends older history) and re-run — up to
  //      MAX_PAGES additional pages before giving up.
  //   3. Fallback toast when we've exhausted history and the message
  //      genuinely can't be found (deleted, wrong link, sibling that lost
  //      to a regenerate).
  //
  // handledHashRef ensures we only do this dance once per hash — resets
  // on hash change.
  const searchScrollHashRef = useRef(null);
  const searchScrollPagesLoadedRef = useRef(0);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const HIGHLIGHT_MS = 2000;
    const POLL_INTERVAL_MS = 100;
    const POLL_MAX_ATTEMPTS = 10; // 10 × 100ms = 1s window for DOM to paint
    const MAX_PAGES_TO_LOAD = 5; // hard cap on auto-load-more iterations

    let pollTimer = null;
    let cancelled = false;

    const attemptScroll = () => {
      const hash = window.location.hash;
      const targetId = parseMessageIdFromHash(hash);
      if (!targetId) return;
      if (searchScrollHashRef.current === hash) return;

      // First: is the target even in the loaded window?
      const loaded = useModelsStore.getState().activeChatMessages || [];
      const inLoaded = loaded.some((m) => String(m?.id) === String(targetId));

      if (!inLoaded) {
        // Try to page backwards until it appears or we exhaust history.
        if (
          messagesHasMore &&
          searchScrollPagesLoadedRef.current < MAX_PAGES_TO_LOAD
        ) {
          searchScrollPagesLoadedRef.current += 1;
          loadMoreMessages();
          // The effect re-runs when activeChatMessages updates (via the
          // chats dep below); we'll attempt again there.
          return;
        }
        // Exhausted — mark handled and surface a clear message.
        searchScrollHashRef.current = hash;
        toast.info("That message isn't in this chat's loaded history.", {
          description: "It may have been deleted or is beyond what's saved.",
          style: { border: "none" },
        });
        return;
      }

      // Target row is in state; poll the DOM until React has painted it.
      let attempts = 0;
      const pollForElement = () => {
        if (cancelled) return;
        const el = document.getElementById(`message-${targetId}`);
        if (el) {
          searchScrollHashRef.current = hash;
          searchScrollPagesLoadedRef.current = 0;
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("messageHighlightPulse");
          setTimeout(
            () => el.classList.remove("messageHighlightPulse"),
            HIGHLIGHT_MS,
          );
          return;
        }
        attempts += 1;
        if (attempts >= POLL_MAX_ATTEMPTS) return; // give up quietly
        pollTimer = setTimeout(pollForElement, POLL_INTERVAL_MS);
      };
      pollForElement();
    };

    if (chats?.length) attemptScroll();
    window.addEventListener("hashchange", attemptScroll);
    return () => {
      cancelled = true;
      if (pollTimer !== null) clearTimeout(pollTimer);
      window.removeEventListener("hashchange", attemptScroll);
    };
    // chats?.length in deps so re-runs after loadMoreMessages prepends
    // older history. messagesHasMore + loadMoreMessages captured via
    // closure — they're stable enough (from useCallback) that including
    // them here would just churn without changing behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats?.length]);

  // Reset the search-scroll bookkeeping on session change.
  useEffect(() => {
    searchScrollHashRef.current = null;
    searchScrollPagesLoadedRef.current = 0;
  }, [sessionId]);

  useEffect(() => {
    setShowToggleChat(!isSidebarOpen || isMobile);
  }, [isSidebarOpen, isMobile]);

  // Fetch coach public profile per assistantSlug. Powers the retry-with-
  // model dropdown, the ModelPicker's "Default (<model>)" label, and any
  // future coach-metadata UI. Fails silently — the dropdown just hides
  // itself if coach is null.
  //
  // Mirrors the result into useModelsStore.activeCoach so ModelPicker
  // can read it without prop-drilling coach through 14 page files.
  //
  // Also re-fetch on window focus. Admins can update coach.default_model
  // (or the plan's allowed models) at any time; without this, a user
  // sitting on a chat page with the tab focused sees a stale "Default"
  // label until they navigate coaches or hard-refresh. Focus re-fetch is
  // cheap (single small GET) and gives an "eventually consistent" feel
  // within seconds of returning to the tab.
  useEffect(() => {
    if (!assistantSlug) {
      setCoach(null);
      setActiveCoach(null);
      return;
    }
    let cancelled = false;
    const refetch = () => {
      fetchCoachPublicProfile(assistantSlug).then((data) => {
        if (cancelled) return;
        setCoach(data);
        setActiveCoach(data);
      });
    };
    refetch();

    const onFocus = () => {
      // Bust the plan-models cache too so the ModelPicker's alternatives
      // list reflects any admin change to plan_models. Keyed by userId
      // per modelsCache.js — invalidating our slot only.
      if (user?.id) invalidateModelsCache(user.id);
      refetch();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
    }
    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", onFocus);
      }
    };
  }, [assistantSlug, user?.id, setActiveCoach]);

  const startNewChat = useCallback(() => {
    if (!assistantSlug) return;
    const organization = user?.organization_name
      ? generateSignString(user.organization_name)
      : "";
    if (!organization) return;
    router.push(`/platform/${organization}/${assistantSlug}/`);
  }, [assistantSlug, user?.organization_name, router]);

  const handleEscape = useCallback(() => {
    // closeStreaming is a plain function defined in this hook; it reads from
    // refs, so a stale closure here is safe but eslint-react-hooks flags it.
    if (streaming) closeStreaming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);

  useKeyboardShortcuts({
    onNewChat: startNewChat,
    onEscape: handleEscape,
  });

  // Retry the failed turn: drop the errored assistant + its user message
  // from state, then re-run sendMessage with the user text as an override.
  // No-op unless the tail of `chats` is the errored assistant preceded by a
  // user turn (i.e., we actually have something to retry).
  const retryLastMessage = useCallback(() => {
    if (streaming) return;
    if (!Array.isArray(chats) || chats.length < 2) return;

    const errored = chats[chats.length - 1];
    if (errored?.sender !== "assistant" || errored?.status !== "error") return;

    const userTurn = chats[chats.length - 2];
    if (userTurn?.sender !== "user" || !userTurn.content) return;

    const trimmed = chats.slice(0, -2);
    setActiveChatMessages(trimmed);
    sendMessage(userTurn.content);
  }, [chats, streaming, setActiveChatMessages, sendMessage]);

  // Regenerate a specific assistant reply. Optimistically drop the target
  // row from local state, then stream the replacement in via SSE. On END,
  // invalidate the SWR cache — the backend inserted a sibling row (same
  // parent_id, later created_at) which the sibling filter will resolve on
  // the next full fetch.
  const regenerateAssistantReply = useCallback(async (targetMessageId, options = {}) => {
    if (!targetMessageId || streaming) return;

    const hasModelAccess = hasAccess(user?.subscription_plan, modelName);
    if (!hasModelAccess) {
      toast.error(`Upgrade to access "${modelName}" model`, {
        style: { border: "none", color: "red" },
      });
      return;
    }

    // Drop the target reply from state so the loader renders in its place.
    // If it's not the tail row, filter it out; otherwise slice(-1) is fine.
    setActiveChatMessages(
      (chats || []).filter(
        (m) => !(m?.id === targetMessageId && m?.sender === "assistant")
      )
    );

    setStreaming(true);
    resetStreaming();

    const abortController = new AbortController();
    eventSourceRef.current = abortController;

    regenerateChatMessage(targetMessageId, {
      abortController,
      modelId: options.modelId,
      onMessage: (chunk) => updateStreamingData(chunk),
      onComplete: () => {
        setStreaming(false);
        const finalMessage = streamingDataRef.current;
        resetStreaming();
        updateActiveChatMessages({
          sender: "assistant",
          content: finalMessage,
          sessionID: activeSessionID || "newChat",
          created_at: new Date(),
        });
        mutateMessages();
      },
      onError: (error) => {
        closeStreaming();
        updateActiveChatMessages({
          sender: "assistant",
          status: "error",
          content: getErrorMessage(error),
          sessionID: activeSessionID || "newChat",
          created_at: new Date(),
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, streaming, activeSessionID, user?.subscription_plan, modelName, setActiveChatMessages, updateActiveChatMessages, mutateMessages]);

  // Edit a user message in place. Optimistic update; roll back on API failure.
  // No auto-resend — user decides whether to send a new turn after editing.
  const editUserMessage = useCallback(async (messageId, nextContent) => {
    if (!messageId || typeof nextContent !== "string") return null;
    const trimmed = nextContent.trim();
    if (!trimmed) return null;

    const current = (chats || []).find((m) => m?.id === messageId);
    if (!current || current.sender !== "user") return null;
    if (current.content === trimmed) return current;

    const prevContent = current.content;
    const optimistic = (chats || []).map((m) =>
      m?.id === messageId
        ? {
            ...m,
            content: trimmed,
            edited_at: new Date().toISOString(),
            original_content: m.original_content ?? prevContent,
          }
        : m
    );
    setActiveChatMessages(optimistic);

    const updated = await editChatMessage(messageId, trimmed);
    if (!updated) {
      // Roll back — toast fired inside editChatMessage
      const rolledBack = (chats || []).map((m) =>
        m?.id === messageId ? { ...m, content: prevContent } : m
      );
      setActiveChatMessages(rolledBack);
      return null;
    }
    return updated;
  }, [chats, setActiveChatMessages]);


  return {
    toggleSidebar,
    modelDescription,
    isFetchingChats,
    inputValue,
    setInputValue,
    sendMessage,
    closeStreaming,
    streamingData,
    streaming,
    sendBtnActive,
    uploadBtnActive,
    uploadedFiles,
    setUploadedFiles,
    chats,
    messagesEndRef,
    aiSuggestions,
    showToggleChat,
    retryLastMessage,
    regenerateAssistantReply,
    editUserMessage,
    coach,
    // New optimized features
    loadMoreMessages,
    messagesHasMore,
    isLoadingMessages,
    mutateMessages
  };
}
