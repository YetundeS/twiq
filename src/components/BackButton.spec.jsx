import { describe, expect, test, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";

// Mock next/navigation before importing the component so useRouter()
// returns our spies instead of throwing outside a Next request context.
const backSpy = vi.fn();
const pushSpy = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: backSpy, push: pushSpy }),
}));

const { default: BackButton } = await import("./BackButton");

// jsdom starts with window.history.length === 1 (the current entry).
// Push a second entry so the "has history" branch is the default.
beforeEach(() => {
  if (window.history.length < 2) {
    window.history.pushState({}, "", "/some-previous-page");
  }
});

afterEach(() => {
  cleanup();
  backSpy.mockClear();
  pushSpy.mockClear();
});

describe("BackButton", () => {
  test("renders with default label 'Back'", () => {
    const { getByRole } = render(<BackButton />);
    expect(getByRole("button").textContent).toBe("Back");
  });

  test("uses caller-provided label", () => {
    const { getByRole } = render(<BackButton label="Cancel" />);
    expect(getByRole("button").textContent).toBe("Cancel");
  });

  test("calls router.back() once per click", () => {
    const { getByRole } = render(<BackButton />);
    fireEvent.click(getByRole("button"));
    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  test("multiple clicks fire router.back() each time", () => {
    const { getByRole } = render(<BackButton />);
    const btn = getByRole("button");
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(backSpy).toHaveBeenCalledTimes(3);
  });

  test("caller-provided className replaces the default", () => {
    const { getByRole } = render(<BackButton className="my-custom-class" />);
    expect(getByRole("button").className).toBe("my-custom-class");
  });

  test("empty-string className falls back to the default (qcheck L1)", () => {
    // `||` semantics — an empty string is not a useful class-list.
    const { getByRole } = render(<BackButton className="" />);
    expect(getByRole("button").className).not.toBe("");
    // Sanity: the default classes include recognizable Tailwind tokens.
    expect(getByRole("button").className).toContain("border-gray-300");
  });

  test("has explicit type='button' so it doesn't submit a form if nested", () => {
    const { getByRole } = render(<BackButton />);
    expect(getByRole("button").getAttribute("type")).toBe("button");
  });

  test("falls back to fallbackHref via router.push() when history is empty (qcheck L2)", () => {
    // Reset history to only the current entry — no previous page to go back to.
    // We can't truly wipe jsdom history, but we can spy on the branch by
    // mocking window.history.length via property override.
    const historySpy = vi.spyOn(window.history, "length", "get").mockReturnValue(1);
    try {
      const { getByRole } = render(<BackButton fallbackHref="/somewhere" />);
      fireEvent.click(getByRole("button"));
      expect(backSpy).not.toHaveBeenCalled();
      expect(pushSpy).toHaveBeenCalledWith("/somewhere");
    } finally {
      historySpy.mockRestore();
    }
  });

  test("fallbackHref defaults to '/'", () => {
    const historySpy = vi.spyOn(window.history, "length", "get").mockReturnValue(1);
    try {
      const { getByRole } = render(<BackButton />);
      fireEvent.click(getByRole("button"));
      expect(pushSpy).toHaveBeenCalledWith("/");
    } finally {
      historySpy.mockRestore();
    }
  });
});
