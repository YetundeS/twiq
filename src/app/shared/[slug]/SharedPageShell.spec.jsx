import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SharedPageShell from "./SharedPageShell";

// Stub next/image so the shell can render in jsdom without going through
// Next's image optimizer. We only care about alt text + class attribute here.
vi.mock("next/image", () => ({
  default: ({ alt, className, src }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className={className} src={src} />
  ),
}));

// Stub next/link similarly — the real component needs a Next Router.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("SharedPageShell", () => {
  test("renders children so pages can compose their own content inside", () => {
    render(
      <SharedPageShell>
        <p>hello world</p>
      </SharedPageShell>,
    );
    expect(screen.getByText("hello world")).toBeDefined();
  });

  test("renders a TWIQ logo link pointing to the landing page", () => {
    render(<SharedPageShell />);
    const link = screen.getByRole("link", { name: /twiq/i });
    expect(link.getAttribute("href")).toBe("/");
  });

  test("renders both light and dark logo variants with the dark-mode swap classes", () => {
    render(<SharedPageShell />);
    const lightLogo = screen.getByAltText(/TWIQ.*light/i);
    const darkLogo = screen.getByAltText(/TWIQ.*dark/i);
    // Mirrors the swap pattern used by landingPageComponents/Header.jsx:
    // light visible in light mode, dark visible in dark mode.
    expect(lightLogo.className).toContain("block");
    expect(lightLogo.className).toContain("dark:hidden");
    expect(darkLogo.className).toContain("hidden");
    expect(darkLogo.className).toContain("dark:block");
  });

  test("renders the TwiqBg backdrop so the page has the branded background", () => {
    const { container } = render(<SharedPageShell />);
    expect(container.querySelector(".twiqBg")).not.toBeNull();
  });
});
