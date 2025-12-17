import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTextToSpeech } from "./useTextToSpeech";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("useTextToSpeech", () => {
  let mockAudioInstance;
  let mockFetch;

  beforeEach(() => {
    mockAudioInstance = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      src: "",
      currentTime: 0,
      onplay: null,
      onended: null,
      onerror: null,
    };

    class MockAudio {
      constructor(url) {
        mockAudioInstance.src = url;
        Object.assign(this, mockAudioInstance);
        return mockAudioInstance;
      }
    }

    vi.stubGlobal("Audio", MockAudio);
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:mock-url"),
      revokeObjectURL: vi.fn(),
    });

    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  test("returns initial idle state with speak and stop functions", () => {
    const { result } = renderHook(() => useTextToSpeech());

    expect(result.current).toEqual({
      speak: expect.any(Function),
      stop: expect.any(Function),
      state: "idle",
      isIdle: true,
      isLoading: false,
      isPlaying: false,
      error: null,
    });
  });

  test("transitions to loading state when speak is called", async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                blob: () =>
                  Promise.resolve(new Blob(["audio"], { type: "audio/mpeg" })),
              }),
            100,
          ),
        ),
    );

    const { result } = renderHook(() => useTextToSpeech());

    act(() => {
      result.current.speak("Hello world");
    });

    expect(result.current.state).toBe("loading");
    expect(result.current.isLoading).toBe(true);
  });

  test("transitions to playing state after audio starts", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["audio"], { type: "audio/mpeg" })),
    });

    const { result } = renderHook(() => useTextToSpeech());

    await act(async () => {
      await result.current.speak("Hello world");
    });

    act(() => {
      if (mockAudioInstance.onplay) {
        mockAudioInstance.onplay();
      }
    });

    expect(result.current.state).toBe("playing");
    expect(result.current.isPlaying).toBe(true);
  });

  test("transitions to idle state when audio ends", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["audio"], { type: "audio/mpeg" })),
    });

    const { result } = renderHook(() => useTextToSpeech());

    await act(async () => {
      await result.current.speak("Hello world");
    });

    act(() => {
      if (mockAudioInstance.onplay) {
        mockAudioInstance.onplay();
      }
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      if (mockAudioInstance.onended) {
        mockAudioInstance.onended();
      }
    });

    expect(result.current.state).toBe("idle");
    expect(result.current.isIdle).toBe(true);
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  test("stop() pauses audio and resets state to idle", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["audio"], { type: "audio/mpeg" })),
    });

    const { result } = renderHook(() => useTextToSpeech());

    await act(async () => {
      await result.current.speak("Hello world");
    });

    act(() => {
      if (mockAudioInstance.onplay) {
        mockAudioInstance.onplay();
      }
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(mockAudioInstance.pause).toHaveBeenCalled();
    expect(result.current.state).toBe("idle");
  });

  test("returns false and sets error when text is empty", async () => {
    const { result } = renderHook(() => useTextToSpeech());

    let returnValue;
    await act(async () => {
      returnValue = await result.current.speak("");
    });

    expect(returnValue).toBe(false);
    expect(result.current.error).toBe("No text to speak");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("returns false and sets error when text is null", async () => {
    const { result } = renderHook(() => useTextToSpeech());

    let returnValue;
    await act(async () => {
      returnValue = await result.current.speak(null);
    });

    expect(returnValue).toBe(false);
    expect(result.current.error).toBe("No text to speak");
  });

  test("handles API error response", async () => {
    const errorMessage = "Failed to generate speech";
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    });

    const { result } = renderHook(() => useTextToSpeech());

    let returnValue;
    await act(async () => {
      returnValue = await result.current.speak("Hello world");
    });

    expect(returnValue).toBe(false);
    expect(result.current.state).toBe("idle");
    expect(result.current.error).toBe(errorMessage);
  });

  test("sends correct request body to API", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["audio"], { type: "audio/mpeg" })),
    });

    const { result } = renderHook(() => useTextToSpeech());

    const testText = "Test speech text";
    const testVoiceId = "custom-voice-id";

    await act(async () => {
      await result.current.speak(testText, testVoiceId);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: testText, voiceId: testVoiceId }),
      signal: expect.any(AbortSignal),
    });
  });

  test("creates Audio with correct blob URL", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["audio"], { type: "audio/mpeg" })),
    });

    const { result } = renderHook(() => useTextToSpeech());

    await act(async () => {
      await result.current.speak("Hello world");
    });

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockAudioInstance.src).toBe("blob:mock-url");
  });

  test("cleans up audio on unmount", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["audio"], { type: "audio/mpeg" })),
    });

    const { result, unmount } = renderHook(() => useTextToSpeech());

    await act(async () => {
      await result.current.speak("Hello world");
    });

    act(() => {
      if (mockAudioInstance.onplay) {
        mockAudioInstance.onplay();
      }
    });

    unmount();

    expect(mockAudioInstance.pause).toHaveBeenCalled();
  });
});
