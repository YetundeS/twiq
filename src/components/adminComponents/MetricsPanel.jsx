"use client";

// Admin chat-metrics dashboard (Phase 2 §6.14). Consumes
// GET /admin/metrics/chat?window=... — see backend PR #34.
//
// Layout:
//   [window selector: 24h / 7d / 30d]  [refresh]
//   ── Overall card ────────────────────────────
//     count, aborted, ttft/tps/duration p50/p95/mean
//   ── Per-model table ─────────────────────────
//   ── Per-coach table ─────────────────────────
//   ── Daily turns sparkline (inline SVG) ──────
//
// No chart library — matches the bundle-purge discipline. Sparkline
// pattern copied from src/components/settingsComps/UsageTab/index.jsx.

import { getChatMetrics } from "@/apiCalls/adminAPI";
import { models as COACHES } from "@/constants/sidebar";
import { Activity, AlertTriangle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const WINDOWS = [
  { key: "24h", label: "Last 24h" },
  { key: "7d",  label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
];

const COACH_NAME_BY_SLUG = COACHES.reduce((acc, m) => {
  acc[m.url] = m.name;
  return acc;
}, {});

function coachName(slug) {
  if (!slug || slug === "unknown") return "(unknown)";
  return COACH_NAME_BY_SLUG[slug] || slug;
}

function shortModel(id) {
  if (!id || id === "unknown" || id === "legacy") return id || "(unknown)";
  const parts = id.split("/");
  return parts[parts.length - 1];
}

function fmtNum(n) {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? v.toLocaleString() : "0";
}

function fmtMs(n) {
  if (n == null) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  if (v >= 1000) return `${(v / 1000).toFixed(2)}s`;
  return `${Math.round(v)}ms`;
}

function fmtRate(n) {
  if (n == null) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `${v.toFixed(1)}/s`;
}

// -----------------------------------------------------------------------------
// Sparkline — daily turn count. Reused from UsageTab.
// -----------------------------------------------------------------------------
function Sparkline({ perDay, windowKey }) {
  const days = windowKey === "24h" ? 1 : windowKey === "7d" ? 7 : 30;
  const filled = useMemo(() => padDays(perDay, days), [perDay, days]);
  const max = Math.max(1, ...filled.map((d) => d.count));
  const width = 600;
  const height = 80;
  const barW = width / filled.length;
  const gap = 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={`Daily turns over the last ${days} day${days === 1 ? "" : "s"}`}
    >
      {filled.map((d, i) => {
        const h = d.count === 0 ? 2 : Math.max(2, (d.count / max) * (height - 4));
        return (
          <rect
            key={d.date}
            x={i * barW + gap / 2}
            y={height - h}
            width={Math.max(1, barW - gap)}
            height={h}
            rx={1}
            className={d.count === 0 ? "fill-gray-200" : "fill-emerald-500"}
          >
            <title>{`${d.date}: ${d.count} turn${d.count === 1 ? "" : "s"}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

function padDays(perDay, n) {
  const byDate = new Map((perDay ?? []).map((d) => [d.key, d]));
  const out = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const iso = dt.toISOString().slice(0, 10);
    const row = byDate.get(iso);
    out.push({
      date: iso,
      count: Number(row?.count ?? 0),
    });
  }
  return out;
}

// -----------------------------------------------------------------------------
// StatsCell — one metric block within the overall summary
// -----------------------------------------------------------------------------
function StatsCell({ label, stats, format = fmtMs, tone = "" }) {
  if (!stats) {
    return (
      <div className="rounded-lg border border-gray-200 p-3">
        <div className={`text-xs font-medium text-gray-500 ${tone}`}>{label}</div>
        <div className="mt-1 text-sm text-gray-400">No data</div>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className={`text-xs font-medium text-gray-500 ${tone}`}>{label}</div>
      <div className="mt-1 grid grid-cols-3 gap-1 text-xs text-gray-700">
        <div><span className="text-gray-400">p50</span> {format(stats.p50)}</div>
        <div><span className="text-gray-400">p95</span> {format(stats.p95)}</div>
        <div><span className="text-gray-400">mean</span> {format(stats.mean)}</div>
      </div>
      <div className="mt-1 text-[11px] text-gray-400">n = {fmtNum(stats.count)}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// BreakdownTable — per-model / per-coach
// -----------------------------------------------------------------------------
function BreakdownTable({ title, rows, formatKey }) {
  if (!rows?.length) {
    return (
      <section className="space-y-2">
        <h3 className="text-base font-semibold text-black">{title}</h3>
        <p className="text-sm text-gray-500">No data in this window.</p>
      </section>
    );
  }
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold text-black">{title}</h3>
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Key</th>
              <th className="px-3 py-2 text-right font-medium">Turns</th>
              <th className="px-3 py-2 text-right font-medium">Aborted</th>
              <th className="px-3 py-2 text-right font-medium">TTFT p50 / p95</th>
              <th className="px-3 py-2 text-right font-medium">Duration p50 / p95</th>
              <th className="px-3 py-2 text-right font-medium">TPS mean</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {rows.map((r) => (
              <tr key={r.key} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{formatKey(r.key)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtNum(r.count)}</td>
                <td className={`px-3 py-2 text-right tabular-nums ${r.aborted > 0 ? "text-orange-600" : ""}`}>
                  {fmtNum(r.aborted)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {fmtMs(r.ttft_ms?.p50)} / {fmtMs(r.ttft_ms?.p95)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {fmtMs(r.stream_duration_ms?.p50)} / {fmtMs(r.stream_duration_ms?.p95)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtRate(r.tokens_per_second?.mean)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// MetricsPanel
// -----------------------------------------------------------------------------
export default function MetricsPanel() {
  const [windowKey, setWindowKey] = useState("24h");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (w) => {
    setLoading(true);
    setError(null);
    try {
      const out = await getChatMetrics(w);
      setData(out);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Failed to load metrics";
      setError(msg);
      toast.error("Couldn't load metrics", {
        description: msg,
        style: { border: "none", color: "red" },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load(windowKey);
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [windowKey, load]);

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-black">Chat metrics</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-md border border-gray-200">
            {WINDOWS.map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => setWindowKey(w.key)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  windowKey === w.key
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => load(windowKey)}
            disabled={loading}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            aria-label="Refresh metrics"
          >
            <RefreshCw className={`inline h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading && !data && (
        <p className="text-sm text-gray-500">Loading metrics…</p>
      )}

      {error && !loading && (
        <div className="flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {data && (
        <>
          {data.row_cap_hit && (
            <div className="flex items-start gap-2 rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                Row cap (50k) hit — this window has more chat rows than the aggregator pulls.
                Consider narrowing the window or promote to a Postgres RPC.
              </div>
            </div>
          )}

          {/* Overall */}
          <section className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-black">Overall</h3>
              <span className="text-xs text-gray-500">
                since {new Date(data.since).toLocaleString()} · {fmtNum(data.overall?.count)} turns
                {data.overall?.aborted > 0 && (
                  <span className="ml-1 text-orange-600">· {fmtNum(data.overall.aborted)} aborted</span>
                )}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatsCell label="Time to first token" stats={data.overall?.ttft_ms} format={fmtMs} />
              <StatsCell label="Stream duration" stats={data.overall?.stream_duration_ms} format={fmtMs} />
              <StatsCell label="Tokens per second" stats={data.overall?.tokens_per_second} format={fmtRate} />
            </div>
          </section>

          {/* Per-model */}
          <BreakdownTable title="By model" rows={data.per_model} formatKey={shortModel} />

          {/* Per-coach */}
          <BreakdownTable title="By coach" rows={data.per_coach} formatKey={coachName} />

          {/* Per-day sparkline */}
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-black">
              Daily turns (last {windowKey === "24h" ? "day" : windowKey === "7d" ? "7 days" : "30 days"})
            </h3>
            <Sparkline perDay={data.per_day} windowKey={windowKey} />
          </section>

          <p className="text-[11px] text-gray-400">
            TTFT is server-measured (stream open → first delta received) and excludes client RTT.
            Legacy assistant rows from before the observability rollout don't contribute to percentiles.
          </p>
        </>
      )}
    </div>
  );
}
