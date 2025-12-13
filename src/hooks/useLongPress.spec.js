/**
 * TODO: Add testing framework (vitest + @testing-library/react recommended)
 *
 * Unit tests for useLongPress hook
 */

// import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
// import { renderHook, act } from '@testing-library/react';
// import { useLongPress } from './useLongPress';

/**
 * Test suite: useLongPress
 *
 * Tests should verify long press detection and event handling
 * Note: Internal function renamed from 'clear' to 'endPress' for clarity
 */

// describe('useLongPress', () => {
//   beforeEach(() => {
//     vi.useFakeTimers();
//   });
//
//   afterEach(() => {
//     vi.useRealTimers();
//     vi.clearAllMocks();
//   });
//
//   test('returns event handlers object', () => {
//     const onLongPress = vi.fn();
//     const { result } = renderHook(() => useLongPress(onLongPress));
//
//     expect(result.current).toEqual({
//       onMouseDown: expect.any(Function),
//       onMouseUp: expect.any(Function),
//       onMouseLeave: expect.any(Function),
//       onTouchStart: expect.any(Function),
//       onTouchEnd: expect.any(Function),
//     });
//   });
//
//   test('triggers long press after threshold (mouse)', () => {
//     const onLongPress = vi.fn();
//     const threshold = 500;
//     const { result } = renderHook(() =>
//       useLongPress(onLongPress, { threshold })
//     );
//
//     const mockEvent = { preventDefault: vi.fn() };
//
//     act(() => {
//       result.current.onMouseDown(mockEvent);
//     });
//
//     expect(onLongPress).not.toHaveBeenCalled();
//
//     act(() => {
//       vi.advanceTimersByTime(threshold);
//     });
//
//     expect(onLongPress).toHaveBeenCalledWith(mockEvent);
//   });
//
//   test('triggers long press after threshold (touch)', () => {
//     const onLongPress = vi.fn();
//     const threshold = 500;
//     const { result } = renderHook(() =>
//       useLongPress(onLongPress, { threshold })
//     );
//
//     const mockEvent = { preventDefault: vi.fn() };
//
//     act(() => {
//       result.current.onTouchStart(mockEvent);
//     });
//
//     act(() => {
//       vi.advanceTimersByTime(threshold);
//     });
//
//     expect(onLongPress).toHaveBeenCalledWith(mockEvent);
//   });
//
//   test('does not trigger long press if released before threshold', () => {
//     const onLongPress = vi.fn();
//     const threshold = 500;
//     const { result } = renderHook(() =>
//       useLongPress(onLongPress, { threshold })
//     );
//
//     const mockEvent = { preventDefault: vi.fn() };
//
//     act(() => {
//       result.current.onMouseDown(mockEvent);
//     });
//
//     act(() => {
//       vi.advanceTimersByTime(threshold - 100);
//     });
//
//     act(() => {
//       result.current.onMouseUp(mockEvent);
//     });
//
//     act(() => {
//       vi.advanceTimersByTime(100);
//     });
//
//     expect(onLongPress).not.toHaveBeenCalled();
//   });
//
//   test('cancels long press when mouse leaves', () => {
//     const onLongPress = vi.fn();
//     const onCancel = vi.fn();
//     const threshold = 500;
//     const { result } = renderHook(() =>
//       useLongPress(onLongPress, { threshold, onCancel })
//     );
//
//     const mockEvent = { preventDefault: vi.fn() };
//
//     act(() => {
//       result.current.onMouseDown(mockEvent);
//     });
//
//     act(() => {
//       vi.advanceTimersByTime(threshold - 100);
//     });
//
//     act(() => {
//       result.current.onMouseLeave(mockEvent);
//     });
//
//     act(() => {
//       vi.advanceTimersByTime(100);
//     });
//
//     expect(onLongPress).not.toHaveBeenCalled();
//     expect(onCancel).toHaveBeenCalledWith(mockEvent);
//   });
//
//   test('calls onStart when press begins', () => {
//     const onLongPress = vi.fn();
//     const onStart = vi.fn();
//     const { result } = renderHook(() =>
//       useLongPress(onLongPress, { onStart })
//     );
//
//     const mockEvent = { preventDefault: vi.fn() };
//
//     act(() => {
//       result.current.onMouseDown(mockEvent);
//     });
//
//     expect(onStart).toHaveBeenCalledWith(mockEvent);
//   });
//
//   test('calls onFinish when press ends without long press', () => {
//     const onLongPress = vi.fn();
//     const onFinish = vi.fn();
//     const threshold = 500;
//     const { result } = renderHook(() =>
//       useLongPress(onLongPress, { threshold, onFinish })
//     );
//
//     const mockEvent = { preventDefault: vi.fn() };
//
//     act(() => {
//       result.current.onMouseDown(mockEvent);
//     });
//
//     act(() => {
//       vi.advanceTimersByTime(threshold - 100);
//     });
//
//     act(() => {
//       result.current.onMouseUp(mockEvent);
//     });
//
//     expect(onFinish).toHaveBeenCalledWith(mockEvent);
//   });
//
//   test('uses default threshold of 500ms when not specified', () => {
//     const onLongPress = vi.fn();
//     const { result } = renderHook(() => useLongPress(onLongPress));
//
//     const mockEvent = { preventDefault: vi.fn() };
//
//     act(() => {
//       result.current.onMouseDown(mockEvent);
//     });
//
//     act(() => {
//       vi.advanceTimersByTime(499);
//     });
//
//     expect(onLongPress).not.toHaveBeenCalled();
//
//     act(() => {
//       vi.advanceTimersByTime(1);
//     });
//
//     expect(onLongPress).toHaveBeenCalled();
//   });
//
//   test('handles custom threshold values', () => {
//     const onLongPress = vi.fn();
//     const threshold = 1000;
//     const { result } = renderHook(() =>
//       useLongPress(onLongPress, { threshold })
//     );
//
//     const mockEvent = { preventDefault: vi.fn() };
//
//     act(() => {
//       result.current.onMouseDown(mockEvent);
//     });
//
//     act(() => {
//       vi.advanceTimersByTime(999);
//     });
//
//     expect(onLongPress).not.toHaveBeenCalled();
//
//     act(() => {
//       vi.advanceTimersByTime(1);
//     });
//
//     expect(onLongPress).toHaveBeenCalled();
//   });
// });

export default {};
