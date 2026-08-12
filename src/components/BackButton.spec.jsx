import { describe, expect, test, vi, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";

// Mock next/navigation before importing the component so useRouter()
// returns our spy instead of throwing outside a Next request context.
const backSpy = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: backSpy }),
}));

const { default: BackButton } = await import("./BackButton");

afterEach(() => {
  cleanup();
  backSpy.mockClear();
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

  test("has explicit type='button' so it doesn't submit a form if nested", () => {
    const { getByRole } = render(<BackButton />);
    expect(getByRole("button").getAttribute("type")).toBe("button");
  });
});
