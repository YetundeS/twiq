import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { searchChatsAPI, SEARCH_TIMEOUT_MS } from "./chatSessions";

// searchChatsAPI needs to survive rapid typing (previous fetch aborts when
// a newer one fires) and Render cold starts (client-side timeout so the
// user gets a clear message instead of an indefinite spinner). These tests
// lock both behaviors.

const ORIGINAL_URI = process.env.NEXT_PUBLIC_SERVER_URI;

beforeEach(() => {
  process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  process.env.NEXT_PUBLIC_SERVER_URI = ORIGINAL_URI;
});

describe("searchChatsAPI — happy path", () => {
  test("returns { results, count } on 200", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ id: 1 }], count: 1 }),
    });
    const out = await searchChatsAPI("hello");
    expect(out).toEqual({ results: [{ id: 1 }], count: 1 });
  });

  test("URL-encodes the query and includes limit", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [], count: 0 }),
    });
    await searchChatsAPI("hook + line", 5);
    const url = fetch.mock.calls[0][0];
    expect(url).toContain("q=hook+%2B+line");
    expect(url).toContain("limit=5");
  });
});

describe("searchChatsAPI — cancellation via caller signal", () => {
  test("returns { aborted: true } when the caller's signal is aborted", async () => {
    const controller = new AbortController();
    // Reject with an AbortError to simulate what fetch does on abort.
    fetch.mockImplementationOnce(() => {
      const err = new Error("aborted");
      err.name = "AbortError";
      return Promise.reject(err);
    });
    controller.abort();
    const out = await searchChatsAPI("hello", 20, {
      signal: controller.signal,
    });
    expect(out).toEqual({ aborted: true, results: [] });
  });
});

describe("searchChatsAPI — client-side timeout", () => {
  test("returns a wake-up-friendly error on TimeoutError", async () => {
    fetch.mockImplementationOnce(() => {
      const err = new Error("timeout");
      err.name = "TimeoutError";
      return Promise.reject(err);
    });
    const out = await searchChatsAPI("hello");
    expect(out.error).toMatch(/server may be waking up/i);
    expect(out.results).toEqual([]);
  });

  test("SEARCH_TIMEOUT_MS is exported and non-trivial", () => {
    expect(SEARCH_TIMEOUT_MS).toBeGreaterThan(1000);
    expect(SEARCH_TIMEOUT_MS).toBeLessThanOrEqual(30000);
  });
});

describe("searchChatsAPI — error handling", () => {
  test("returns backend error message when body has one", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
      json: async () => ({ error: "Query must be 3-200 characters" }),
    });
    const out = await searchChatsAPI("hi");
    expect(out.error).toBe("Query must be 3-200 characters");
    expect(out.results).toEqual([]);
  });

  test("falls back to statusText when body has no error field", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
      json: async () => ({}),
    });
    const out = await searchChatsAPI("hi");
    expect(out.error).toBe("Bad Request");
  });

  test("returns Network error on a generic fetch failure", async () => {
    fetch.mockRejectedValueOnce(new TypeError("network down"));
    const out = await searchChatsAPI("hello");
    expect(out.error).toBe("Network error. Please try again.");
    expect(out.results).toEqual([]);
  });
});
