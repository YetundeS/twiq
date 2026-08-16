import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fetchSharedPublicSession } from "./shareSession";

// The public share endpoint is deliberately mounted OUTSIDE `/api/*` on the
// backend (dedicated publicShareLimiter + permissive CORS block). Since the
// same NEXT_PUBLIC_SERVER_URI env is shared with authed calls that DO live
// under `/api/*`, the caller must strip the trailing `/api` before hitting
// `/shared/…`. These tests lock that URL construction against regression.

const ORIGINAL_URI = process.env.NEXT_PUBLIC_SERVER_URI;

function jsonResponse(body, status = 200) {
  return {
    status,
    json: async () => body,
  };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  process.env.NEXT_PUBLIC_SERVER_URI = ORIGINAL_URI;
});

describe("fetchSharedPublicSession — URL construction", () => {
  test("strips a trailing /api when the env value carries it (prod shape)", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
    fetch.mockResolvedValueOnce(jsonResponse({ session: {}, messages: [] }));

    await fetchSharedPublicSession("abc123");

    expect(fetch).toHaveBeenCalledTimes(1);
    const url = fetch.mock.calls[0][0];
    expect(url).toBe("https://twiq-server.onrender.com/shared/abc123");
    expect(url).not.toContain("/api/shared/");
  });

  test("strips a trailing /api/ (with trailing slash)", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI =
      "https://twiq-server.onrender.com/api/";
    fetch.mockResolvedValueOnce(jsonResponse({ session: {}, messages: [] }));

    await fetchSharedPublicSession("abc123");

    const url = fetch.mock.calls[0][0];
    expect(url).toBe("https://twiq-server.onrender.com/shared/abc123");
  });

  test("leaves a bare origin (no /api suffix) untouched", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com";
    fetch.mockResolvedValueOnce(jsonResponse({ session: {}, messages: [] }));

    await fetchSharedPublicSession("abc123");

    const url = fetch.mock.calls[0][0];
    expect(url).toBe("https://twiq-server.onrender.com/shared/abc123");
  });

  test("URL-encodes the slug so a stray query char can't inject extra params", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
    fetch.mockResolvedValueOnce(jsonResponse({ session: {}, messages: [] }));

    await fetchSharedPublicSession("abc?x=1");

    const url = fetch.mock.calls[0][0];
    expect(url).toBe("https://twiq-server.onrender.com/shared/abc%3Fx%3D1");
  });
});

describe("fetchSharedPublicSession — response handling", () => {
  test("returns { status: 200, body } on a successful fetch", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
    const body = {
      session: { assistant_slug: "carousel", title: "T" },
      messages: [{ id: 1 }],
    };
    fetch.mockResolvedValueOnce(jsonResponse(body));

    const out = await fetchSharedPublicSession("abc123");

    expect(out).toEqual({ status: 200, body });
  });

  test("returns { status: 404 } (no body) on a not-found response", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
    fetch.mockResolvedValueOnce(jsonResponse({ error: "Not found" }, 404));

    const out = await fetchSharedPublicSession("abc123");

    expect(out).toEqual({ status: 404 });
  });

  test("returns { status: 410 } on an expired share", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
    fetch.mockResolvedValueOnce(jsonResponse({ error: "expired" }, 410));

    const out = await fetchSharedPublicSession("abc123");

    expect(out).toEqual({ status: 410 });
  });

  test("returns { status: 500 } when the fetch itself throws (network)", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
    fetch.mockRejectedValueOnce(new Error("network down"));

    const out = await fetchSharedPublicSession("abc123");

    expect(out).toEqual({ status: 500 });
  });

  test("returns { status: 500 } when NEXT_PUBLIC_SERVER_URI is missing", async () => {
    delete process.env.NEXT_PUBLIC_SERVER_URI;

    const out = await fetchSharedPublicSession("abc123");

    expect(out).toEqual({ status: 500 });
    expect(fetch).not.toHaveBeenCalled();
  });

  test("returns { status: 404 } when the slug is missing", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";

    const out = await fetchSharedPublicSession(null);

    expect(out).toEqual({ status: 404 });
    expect(fetch).not.toHaveBeenCalled();
  });
});
