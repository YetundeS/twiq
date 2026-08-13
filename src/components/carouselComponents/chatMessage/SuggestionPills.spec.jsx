import { describe, expect, test, vi, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import SuggestionPills from "./SuggestionPills";

afterEach(cleanup);

describe("SuggestionPills", () => {
  test("renders nothing when suggestions is null / undefined / empty array", () => {
    const { container: c1 } = render(<SuggestionPills suggestions={null} onPick={vi.fn()} />);
    expect(c1.querySelector("[data-testid='suggestion-pills']")).toBeNull();
    const { container: c2 } = render(<SuggestionPills suggestions={undefined} onPick={vi.fn()} />);
    expect(c2.querySelector("[data-testid='suggestion-pills']")).toBeNull();
    const { container: c3 } = render(<SuggestionPills suggestions={[]} onPick={vi.fn()} />);
    expect(c3.querySelector("[data-testid='suggestion-pills']")).toBeNull();
  });

  test("renders one button per string on the happy path", () => {
    const { getAllByRole } = render(
      <SuggestionPills
        suggestions={["Draft a follow-up", "Turn this into a carousel", "Ask about X"]}
        onPick={vi.fn()}
      />
    );
    const btns = getAllByRole("button");
    expect(btns).toHaveLength(3);
    expect(btns.map((b) => b.textContent)).toEqual([
      "Draft a follow-up",
      "Turn this into a carousel",
      "Ask about X",
    ]);
  });

  test("clicking a pill calls onPick with that pill's text (does NOT auto-send)", () => {
    const onPick = vi.fn();
    const { getAllByRole } = render(
      <SuggestionPills suggestions={["a", "b", "c"]} onPick={onPick} />
    );
    fireEvent.click(getAllByRole("button")[1]);
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(onPick).toHaveBeenCalledWith("b");
  });

  test("filters non-string / empty / oversized items (FE defense-in-depth)", () => {
    // Backend already caps to 3 × 60 chars, but rendering junk from a bad
    // row shouldn't blow up the message list.
    const { getAllByRole, container } = render(
      <SuggestionPills
        suggestions={["keep", 42, null, "  ", { text: "nope" }, "also"]}
        onPick={vi.fn()}
      />
    );
    const btns = getAllByRole("button");
    expect(btns.map((b) => b.textContent)).toEqual(["keep", "also"]);
    // And the pill container still renders even when some items were filtered.
    expect(container.querySelector("[data-testid='suggestion-pills']")).not.toBeNull();
  });

  test("caps rendered pills at 3 even if more strings arrive", () => {
    const { getAllByRole } = render(
      <SuggestionPills
        suggestions={["a", "b", "c", "d", "e"]}
        onPick={vi.fn()}
      />
    );
    expect(getAllByRole("button")).toHaveLength(3);
  });

  test("does nothing on click when onPick is not provided (safe no-op)", () => {
    // Defensive — a parent that forgets to thread onPick shouldn't crash.
    const { getAllByRole } = render(
      <SuggestionPills suggestions={["a", "b", "c"]} onPick={undefined} />
    );
    expect(() => fireEvent.click(getAllByRole("button")[0])).not.toThrow();
  });
});
