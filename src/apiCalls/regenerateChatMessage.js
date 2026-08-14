import { addAuthHeader } from "@/lib/utils";

// POST /chat-message/:id/regenerate — SSE. Mirrors sendChatMessage's SSE parsing
// but hits a different endpoint and never carries files. `modelId` is optional
// (retry-with-model); when set, the backend uses it instead of coach.default_model.
export async function regenerateChatMessage(
  targetMessageId,
  { modelId, onMessage, onComplete, onError, abortController }
) {
  try {
    const authHeader = addAuthHeader();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/chat-message/${targetMessageId}/regenerate`,
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Accept-Encoding": "gzip, deflate, br",
          "Content-Type": "application/json",
          ...authHeader,
        },
        body: JSON.stringify(modelId ? { model_id: modelId } : {}),
        signal: abortController.signal,
      }
    );

    if (!response.ok) {
      let errorText = "Unknown error";
      try {
        const errorData = await response.json();
        errorText = errorData.error || errorData.message || errorText;
      } catch (_) {
        errorText = response.statusText;
      }
      onError(errorText);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let receivedEnd = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop();

      for (const line of lines) {
        const match = line.match(/^data:\s*(.*)$/);
        if (!match) continue;
        const parsed = JSON.parse(match[1]);

        if (parsed.type === "SUCCESS") {
          onMessage(parsed.message);
        }
        // SESSION + TITLE frames don't apply on regenerate (the session
        // already exists; title trigger was consumed on the original turn).
        // Backend won't emit them, but we ignore defensively.
        if (parsed.type === "END") {
          receivedEnd = true;
          if (onComplete) onComplete();
          return;
        }
        if (parsed.type === "ERROR") {
          onError(parsed.message);
          return;
        }
      }
    }

    if (!receivedEnd && onComplete) onComplete();
  } catch (err) {
    if (err.name === "AbortError") return;
    onError(err.message || "Unknown error");
  }
}
