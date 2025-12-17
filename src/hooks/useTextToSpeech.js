import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

const TTS_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  PLAYING: "playing",
};

export const useTextToSpeech = () => {
  const [state, setState] = useState(TTS_STATES.IDLE);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(TTS_STATES.IDLE);
  }, []);

  const speak = useCallback(
    async (text, voiceId) => {
      if (!text) {
        setError("No text to speak");
        return false;
      }

      if (state === TTS_STATES.PLAYING) {
        stop();
        return true;
      }

      try {
        setState(TTS_STATES.LOADING);
        setError(null);

        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, voiceId }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to generate speech");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => setState(TTS_STATES.PLAYING);
        audio.onended = () => {
          setState(TTS_STATES.IDLE);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setError("Audio playback failed");
          setState(TTS_STATES.IDLE);
          URL.revokeObjectURL(audioUrl);
          toast.error("Audio playback failed");
        };

        await audio.play();
        return true;
      } catch (err) {
        if (err.name === "AbortError") {
          setState(TTS_STATES.IDLE);
          return false;
        }

        const errorMessage = err.message || "Failed to generate speech";
        setError(errorMessage);
        setState(TTS_STATES.IDLE);

        toast.error(errorMessage, {
          duration: 3000,
        });

        console.error("Text-to-speech failed:", err);
        return false;
      }
    },
    [state, stop],
  );

  return {
    speak,
    stop,
    state,
    isIdle: state === TTS_STATES.IDLE,
    isLoading: state === TTS_STATES.LOADING,
    isPlaying: state === TTS_STATES.PLAYING,
    error,
  };
};

export default useTextToSpeech;
