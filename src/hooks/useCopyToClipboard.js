import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

const COPY_FEEDBACK_DURATION = 2000; // Duration for copy feedback (toast and state)

/**
 * Hook for copying text to clipboard with user feedback
 *
 * @returns {Object} - { copyToClipboard, copied, error }
 *
 * @example
 * const { copyToClipboard, copied } = useCopyToClipboard();
 *
 * <button onClick={() => copyToClipboard('Hello World')}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </button>
 */
export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = useCallback(async (text) => {
    if (!text) {
      setError('No text to copy');
      return false;
    }

    try {
      // Check if clipboard API is available
      if (!navigator?.clipboard) {
        throw new Error('Clipboard API not available');
      }

      await navigator.clipboard.writeText(text);

      setCopied(true);
      setError(null);

      toast.success('Copied to clipboard', {
        duration: COPY_FEEDBACK_DURATION,
      });

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset copied state after duration
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, COPY_FEEDBACK_DURATION);

      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to copy';
      setError(errorMessage);
      setCopied(false);

      toast.error(errorMessage, {
        duration: 3000,
      });

      console.error('Copy to clipboard failed:', err);
      return false;
    }
  }, []);

  return { copyToClipboard, copied, error };
};

export default useCopyToClipboard;
