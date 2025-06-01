import { addAuthHeader } from "@/lib/utils";

export async function sendChatMessage(
  content,
  session_id,
  assistantSlug,
  onMessage,
  onComplete,
  onError,
  abortController,
  updateActiveChatSession
) {


  try {
    // 🔹 Get auth headers
    const authHeader = addAuthHeader();

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/chat-message/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...authHeader, // 🔥 Spread token header dynamically
      },
      body: JSON.stringify({ content, session_id, assistantSlug }),
      signal: abortController.signal,
    });

    // ✅ Handle non-SSE errors BEFORE reading the stream
    if (!response.ok) {
      let errorText = 'Unknown error';
      // console.log('response: ', response)

      try {
        const errorData = await response.json();
        errorText = errorData.error || errorData.message || errorText;
      } catch (_) {
        errorText = response.statusText;
      }

      onError(`${errorText}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let receivedEnd = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop();

      for (let line of lines) {
        const match = line.match(/^data:\s*(.*)$/);
        if (!match) continue;

        const parsed = JSON.parse(match[1]);

        if (parsed.type === 'SUCCESS') {
          // console.log('parsed message: ', parsed.message)
          onMessage(parsed.message);
        }
        if (parsed.type === 'SESSION') {
          const stringedChatSession = JSON.stringify(parsed.chatSession, null, 2);
          const parsedChatSession = JSON.parse(stringedChatSession);
          updateActiveChatSession(parsedChatSession); // Update with session object
        }
        if (parsed.type === 'END') {
          receivedEnd = true;
          if (onComplete) onComplete();
          return;
        }
        if (parsed.type === 'ERROR') {
          // console.error('streaming Backend error:', parsed.message);
          onError(parsed.message);
          return;
        }
      }
    }

    // Loop ended, no more data, but no 'END' event received
    if (!receivedEnd) {
      // console.warn('Stream closed without END event');
      if (onComplete) onComplete();
    }
  } catch (err) {
    // console.log('err: ', err)
    if (err.name === 'AbortError') return console.log('Fetch aborted');
    onError(err.message || 'Unknown error');
  }
}
