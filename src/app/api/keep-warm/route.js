// Vercel Cron endpoint — pings the Render backend's / health check every
// 10 minutes so the container never spins down. Render's free/hobby tier
// idles a service after ~15 min of no traffic; the first request after
// idle takes 15-30s to boot Node, which surfaces in the app as slow /
// timed-out search + first-message-in-tab delays.
//
// Vercel auto-forwards `CRON_SECRET` as `Authorization: Bearer <secret>`
// when a scheduled cron fires. We check that so this route can't be spun
// up by anyone hitting the URL directly. Configured in vercel.json.

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function backendOrigin() {
  const raw = process.env.NEXT_PUBLIC_SERVER_URI || "";
  return raw.replace(/\/api\/?$/, "");
}

export async function GET(request) {
  // Vercel Cron authenticates via CRON_SECRET; when set, the header is
  // Authorization: Bearer <secret>. In dev (no secret) allow unauthed
  // hits so you can curl the route locally.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const origin = backendOrigin();
  if (!origin) {
    return Response.json(
      { ok: false, error: "NEXT_PUBLIC_SERVER_URI not configured" },
      { status: 500 },
    );
  }

  const startedAt = Date.now();
  try {
    const res = await fetch(origin, {
      signal: AbortSignal.timeout(25000),
      // Don't cache — every ping must actually hit the origin.
      cache: "no-store",
    });
    return Response.json({
      ok: res.ok,
      status: res.status,
      durationMs: Date.now() - startedAt,
      pinged: origin,
    });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error:
          err?.name === "TimeoutError"
            ? "backend timed out"
            : String(err?.message ?? err),
        durationMs: Date.now() - startedAt,
        pinged: origin,
      },
      { status: 502 },
    );
  }
}
