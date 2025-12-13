import { useRef, useCallback } from 'react';

/**
 * Hook for detecting long press events
 *
 * @param {Function} onLongPress - Callback fired when long press is detected
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Duration in ms for long press (default: 500)
 * @param {Function} options.onStart - Callback fired when press starts
 * @param {Function} options.onFinish - Callback fired when press ends
 * @param {Function} options.onCancel - Callback fired when press is cancelled
 *
 * @returns {Object} - Event handlers to spread on target element
 *
 * @example
 * const longPressHandlers = useLongPress(() => {
 *   console.log('Long press detected!');
 * }, { threshold: 500 });
 *
 * <div {...longPressHandlers}>Press and hold me</div>
 */
export const useLongPress = (
  onLongPress,
  {
    threshold = 500,
    onStart = () => {},
    onFinish = () => {},
    onCancel = () => {},
  } = {}
) => {
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);

  const start = useCallback(
    (event) => {
      if (event?.preventDefault) {
        event.preventDefault();
      }

      onStart(event);
      isLongPressRef.current = false;

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress(event);
      }, threshold);
    },
    [onLongPress, threshold, onStart]
  );

  const endPress = useCallback(
    (event, shouldTriggerOnFinish = true) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!shouldTriggerOnFinish) {
        onCancel(event);
      } else if (!isLongPressRef.current) {
        onFinish(event);
      }
    },
    [onFinish, onCancel]
  );

  return {
    onMouseDown: start,
    onMouseUp: endPress,
    onMouseLeave: (e) => endPress(e, false),
    onTouchStart: start,
    onTouchEnd: endPress,
  };
};

export default useLongPress;
