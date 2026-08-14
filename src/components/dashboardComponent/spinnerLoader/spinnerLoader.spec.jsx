import { describe, expect, test, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import SpinnerLoader from "./index";

// Simple render assertions — SpinnerLoader is presentational, no logic to
// TDD. These pin the class contract that the CSS + button call sites rely on.

afterEach(cleanup);

describe("SpinnerLoader", () => {
  test("renders base .loader with role='status'", () => {
    const { container } = render(<SpinnerLoader />);
    const el = container.querySelector("div");
    expect(el).not.toBeNull();
    expect(el.className.split(/\s+/)).toContain("loader");
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-label")).toBe("Loading");
  });

  test("applies .inline when inline prop is true", () => {
    const { container } = render(<SpinnerLoader inline />);
    const classes = container.querySelector("div").className.split(/\s+/);
    expect(classes).toContain("loader");
    expect(classes).toContain("inline");
  });

  test("does NOT apply .inline by default", () => {
    const { container } = render(<SpinnerLoader />);
    const classes = container.querySelector("div").className.split(/\s+/);
    expect(classes).not.toContain("inline");
  });

  test("appends caller-provided className", () => {
    const { container } = render(<SpinnerLoader className="smaller" />);
    const classes = container.querySelector("div").className.split(/\s+/);
    expect(classes).toContain("loader");
    expect(classes).toContain("smaller");
  });

  test("combines inline prop with caller className", () => {
    const { container } = render(<SpinnerLoader inline className="custom" />);
    const classes = container.querySelector("div").className.split(/\s+/);
    expect(classes).toEqual(expect.arrayContaining(["loader", "inline", "custom"]));
  });

  test("does not render stray empty class tokens (no leading/trailing spaces)", () => {
    const { container } = render(<SpinnerLoader />);
    const raw = container.querySelector("div").getAttribute("class");
    expect(raw).not.toMatch(/^\s|\s$|\s{2,}/);
  });
});
