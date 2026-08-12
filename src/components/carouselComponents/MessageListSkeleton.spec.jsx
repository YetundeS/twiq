import { describe, expect, test, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import MessageListSkeleton from "./MessageListSkeleton";

afterEach(cleanup);

describe("MessageListSkeleton", () => {
  test("renders the labeled status container", () => {
    const { getByTestId, getByRole } = render(<MessageListSkeleton />);
    const container = getByTestId("message-list-skeleton");
    expect(container).not.toBeNull();
    // role=status + aria-label lets screen readers announce loading state.
    expect(getByRole("status").getAttribute("aria-label")).toBe("Loading messages");
  });

  test("renders 4 message bubble placeholders (matches the BUBBLES array length)", () => {
    // Each bubble is a flex row; count them by direct children of the container.
    const { getByTestId } = render(<MessageListSkeleton />);
    const container = getByTestId("message-list-skeleton");
    expect(container.children.length).toBe(4);
  });

  test("alternates alignment — user (right), assistant (left), user, assistant", () => {
    const { getByTestId } = render(<MessageListSkeleton />);
    const rows = Array.from(getByTestId("message-list-skeleton").children);
    const alignments = rows.map((r) =>
      r.className.includes("justify-end") ? "user" : "assistant"
    );
    expect(alignments).toEqual(["user", "assistant", "user", "assistant"]);
  });

  test("assistant bubbles get a third line; user bubbles get two lines", () => {
    // Assistant bubble bubbles have longer content on average; the third
    // skeleton line reflects that visually.
    const { getByTestId } = render(<MessageListSkeleton />);
    const rows = Array.from(getByTestId("message-list-skeleton").children);
    // rows[1] = first assistant, rows[3] = second assistant
    const assistantInner = rows[1].firstElementChild; // the flex-col wrapper
    const userInner = rows[0].firstElementChild;
    expect(assistantInner.children.length).toBe(3);
    expect(userInner.children.length).toBe(2);
  });
});
