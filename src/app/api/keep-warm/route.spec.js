import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { GET } from "./route";

// The route is the Vercel Cron target that pings the Render backend to
// keep it warm. These tests lock the auth contract + the base-URL
// derivation (must strip the `/api` suffix from NEXT_PUBLIC_SERVER_URI so
// we hit the backend's root health check, not a nested /api endpoint).

const ORIGINAL_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const ORIGINAL_SECRET = process.env.CRON_SECRET;

function mockRequest({ authHeader } = {}) {
  return {
    headers: {
      get: (name) =>
        name.toLowerCase() === "authorization" ? (authHeader ?? null) : null,
    },
  };
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
  delete process.env.CRON_SECRET;
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  process.env.NEXT_PUBLIC_SERVER_URI = ORIGINAL_URI;
  if (ORIGINAL_SECRET === undefined) {
    delete process.env.CRON_SECRET;
  } else {
    process.env.CRON_SECRET = ORIGINAL_SECRET;
  }
});

describe("keep-warm route — auth", () => {
  test("allows unauthed hits in dev when CRON_SECRET is not set", async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    const res = await GET(mockRequest());
    expect(res.status).toBe(200);
  });

  test("rejects requests missing the Bearer secret when CRON_SECRET is set", async () => {
    process.env.CRON_SECRET = "s3cret";
    const res = await GET(mockRequest());
    expect(res.status).toBe(401);
    expect(fetch).not.toHaveBeenCalled();
  });

  test("rejects requests with the wrong Bearer secret", async () => {
    process.env.CRON_SECRET = "s3cret";
    const res = await GET(mockRequest({ authHeader: "Bearer wrong" }));
    expect(res.status).toBe(401);
    expect(fetch).not.toHaveBeenCalled();
  });

  test("allows a correctly-authed cron hit and pings the backend", async () => {
    process.env.CRON_SECRET = "s3cret";
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    const res = await GET(mockRequest({ authHeader: "Bearer s3cret" }));
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("keep-warm route — backend URL derivation", () => {
  test("strips the /api suffix from NEXT_PUBLIC_SERVER_URI before pinging", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI = "https://twiq-server.onrender.com/api";
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    await GET(mockRequest());
    expect(fetch.mock.calls[0][0]).toBe("https://twiq-server.onrender.com");
  });

  test("strips a trailing /api/ (with slash)", async () => {
    process.env.NEXT_PUBLIC_SERVER_URI =
      "https://twiq-server.onrender.com/api/";
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    await GET(mockRequest());
    expect(fetch.mock.calls[0][0]).toBe("https://twiq-server.onrender.com");
  });

  test("returns 500 when NEXT_PUBLIC_SERVER_URI is unset", async () => {
    delete process.env.NEXT_PUBLIC_SERVER_URI;
    const res = await GET(mockRequest());
    expect(res.status).toBe(500);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("keep-warm route — backend failure", () => {
  test("returns 502 with a timeout hint when the fetch times out", async () => {
    fetch.mockImplementationOnce(() => {
      const err = new Error("timeout");
      err.name = "TimeoutError";
      return Promise.reject(err);
    });
    const res = await GET(mockRequest());
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toMatch(/timed out/i);
  });

  test("returns 502 on generic fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("ECONNRESET"));
    const res = await GET(mockRequest());
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toContain("ECONNRESET");
  });
});
