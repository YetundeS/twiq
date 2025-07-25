import { addAuthHeader } from "@/lib/utils";

// export async function sendChatMessage(
//   content,
//   session_id,
//   assistantSlug,
//   files,
//   onMessage,
//   onComplete,
//   onError,
//   abortController,
//   updateActiveChatSession
// ) {


//   try {
//     // 🔹 Get auth headers
//     const authHeader = addAuthHeader();

//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/chat-message/create`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'text/event-stream',
//         ...authHeader, // 🔥 Spread token header dynamically
//       },
//       body: JSON.stringify({ content, session_id, assistantSlug }),
//       signal: abortController.signal,
//     });

//     // ✅ Handle non-SSE errors BEFORE reading the stream
//     if (!response.ok) {
//       let errorText = 'Unknown error';
//       // console.log('response: ', response)

//       try {
//         const errorData = await response.json();
//         errorText = errorData.error || errorData.message || errorText;
//       } catch (_) {
//         errorText = response.statusText;
//       }

//       onError(`${errorText}`);
//       return;
//     }

//     const reader = response.body.getReader();
//     const decoder = new TextDecoder();
//     let buffer = '';
//     let receivedEnd = false;

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       buffer += decoder.decode(value, { stream: true });
//       const lines = buffer.split('\n\n');
//       buffer = lines.pop();

//       for (let line of lines) {
//         const match = line.match(/^data:\s*(.*)$/);
//         if (!match) continue;

//         const parsed = JSON.parse(match[1]);

//         if (parsed.type === 'SUCCESS') {
//           // console.log('parsed message: ', parsed.message)
//           onMessage(parsed.message);
//         }
//         if (parsed.type === 'SESSION') {
//           const stringedChatSession = JSON.stringify(parsed.chatSession, null, 2);
//           const parsedChatSession = JSON.parse(stringedChatSession);
//           updateActiveChatSession(parsedChatSession); // Update with session object
//         }
//         if (parsed.type === 'END') {
//           receivedEnd = true;
//           if (onComplete) onComplete();
//           return;
//         }
//         if (parsed.type === 'ERROR') {
//           // console.error('streaming Backend error:', parsed.message);
//           onError(parsed.message);
//           return;
//         }
//       }
//     }

//     // Loop ended, no more data, but no 'END' event received
//     if (!receivedEnd) {
//       // console.warn('Stream closed without END event');
//       if (onComplete) onComplete();
//     }
//   } catch (err) {
//     // console.log('err: ', err)
//     if (err.name === 'AbortError') return console.log('Fetch aborted');
//     onError(err.message || 'Unknown error');
//   }
// }


export async function sendChatMessage(
  content,
  session_id,
  assistantSlug,
  files,
  onMessage,
  onComplete,
  onError,
  abortController,
  updateActiveChatSession
) {
  try {
    const authHeader = addAuthHeader();

    // Create FormData if files exist, otherwise use JSON
    let body;
    let headers = {
      Accept: 'text/event-stream',
      ...authHeader,
    };

    if (files && files.length > 0) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('content', content);
      formData.append('session_id', session_id || '');
      formData.append('assistantSlug', assistantSlug);
      
      // Append all files
      files.forEach((file, index) => {
        formData.append('files', file); // Use 'files' as field name for multiple files
      });
      
      body = formData;
      // Don't set Content-Type header for FormData, let browser set it
    } else {
      // Use JSON for text-only messages
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({ content, session_id, assistantSlug });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/chat-message/create`, {
      method: 'POST',
      headers,
      body,
      signal: abortController.signal,
    });

    // Handle non-SSE errors BEFORE reading the stream
    if (!response.ok) {
      let errorText = 'Unknown error';
      
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
          onMessage(parsed.message);
        }
        if (parsed.type === 'SESSION') {
          const stringedChatSession = JSON.stringify(parsed.chatSession, null, 2);
          const parsedChatSession = JSON.parse(stringedChatSession);
          updateActiveChatSession(parsedChatSession);
        }
        if (parsed.type === 'END') {
          receivedEnd = true;
          if (onComplete) onComplete();
          return;
        }
        if (parsed.type === 'ERROR') {
          onError(parsed.message);
          return;
        }
      }
    }

    if (!receivedEnd) {
      if (onComplete) onComplete();
    }
  } catch (err) {
    if (err.name === 'AbortError') return console.log('Fetch aborted');
    onError(err.message || 'Unknown error');
  }
}