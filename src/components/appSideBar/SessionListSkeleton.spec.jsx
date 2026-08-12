import { describe, expect, test, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import SessionListSkeleton from "./SessionListSkeleton";

afterEach(cleanup);

describe("SessionListSkeleton", () => {
  test("renders the labeled status container", () => {
    const { getByTestId, getByRole } = render(<SessionListSkeleton />);
    expect(getByTestId("session-list-skeleton")).not.toBeNull();
    expect(getByRole("status").getAttribute("aria-label")).toBe("Loading chat sessions");
  });

  test("renders 6 session-row placeholders", () => {
    // Contract with the sidebar: enough rows to fill the visible list
    // without looking padded on typical viewport heights.
    const { getByTestId } = render(<SessionListSkeleton />);
    expect(getByTestId("session-list-skeleton").children.length).toBe(6);
  });

  test("each placeholder row has an icon square + a title bar", () => {
    const { getByTestId } = render(<SessionListSkeleton />);
    const rows = Array.from(getByTestId("session-list-skeleton").children);
    for (const row of rows) {
      // Two children per row: icon placeholder + title bar.
      expect(row.children.length).toBe(2);
    }
  });
});
