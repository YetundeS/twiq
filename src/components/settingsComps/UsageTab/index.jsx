"use client";

import "@/app/platform/[slug]/settings/settings.css";
import { getUsage } from "@/apiCalls/userAPI";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { models as COACHES } from "@/constants/sidebar";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Coach slug → display name lookup so tables don't show raw slugs.
const COACH_NAME_BY_SLUG = COACHES.reduce((acc, m) => {
  acc[m.url] = m.name;
  return acc;
}, {});

function formatModel(id) {
  if (!id || id === "legacy") return "legacy";
  // openai/gpt-4o → gpt-4o
  const parts = id.split("/");
  return parts[parts.length - 1];
}

function formatNumber(n) {
  const v = Number(n ?? 0);
  if (!Number.isFinite(v)) return "0";
  return v.toLocaleString();
}

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function pct(used, quota) {
  const u = Number(used ?? 0);
  const q = Number(quota ?? 0);
  if (q <= 0) return 0;
  return Math.max(0, Math.min(100, (u / q) * 100));
}

// -----------------------------------------------------------------------------
// QuotaBar — one horizontal bar per token bucket. Color shifts when the bar
// crosses 80% so users see the warning before they hit the wall.
// -----------------------------------------------------------------------------
function QuotaBar({ label, used, quota }) {
  const p = pct(used, quota);
  const warn = p >= 80;
  const critical = p >= 95;
  const fill = critical
    ? "bg-red-500"
    : warn
      ? "bg-orange-400"
      : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-black">{label}</span>
        <span className="text-gray-600">
          {formatNumber(used)}{" "}
          <span className="text-gray-400">/ {formatNumber(quota)}</span>{" "}
          <span className="ml-1 text-xs text-gray-500">
            ({p.toFixed(p < 10 ? 1 : 0)}%)
          </span>
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={Math.round(p)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} usage`}
      >
        <div
          className={`h-full rounded-full transition-all ${fill}`}
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sparkline — 30-day daily turns. Inline SVG so we don't pull in a chart lib
// (bundle purge is a Phase 2 §10.2 goal). Renders zero bars for missing days.
// -----------------------------------------------------------------------------
function Sparkline({ byDay }) {
  const filled = useMemo(() => padDays(byDay, 30), [byDay]);
  const max = Math.max(1, ...filled.map((d) => d.turns));
  const width = 600;
  const height = 80;
  const barW = width / filled.length;
  const gap = 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Daily turns over the last 30 days"
    >
      {filled.map((d, i) => {
        const h = d.turns === 0 ? 2 : Math.max(2, (d.turns / max) * (height - 4));
        return (
          <rect
            key={d.date}
            x={i * barW + gap / 2}
            y={height - h}
            width={Math.max(1, barW - gap)}
            height={h}
            rx={1}
            className={d.turns === 0 ? "fill-gray-200" : "fill-emerald-500"}
          >
            <title>{`${d.date}: ${d.turns} turn${d.turns === 1 ? "" : "s"}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

function padDays(byDay, n) {
  const byDate = new Map((byDay ?? []).map((d) => [d.date, d]));
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const iso = dt.toISOString().slice(0, 10);
    const row = byDate.get(iso);
    out.push({
      date: iso,
      turns: Number(row?.turns ?? 0),
    });
  }
  return out;
}

// -----------------------------------------------------------------------------
// UsageTab
// -----------------------------------------------------------------------------
export function UsageTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const usage = await getUsage();
        if (!cancelled) setData(usage);
      } catch (err) {
        if (cancelled) return;
        const msg =
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load usage.";
        setError(msg);
        toast.error("Couldn't load usage", {
          description: msg,
          style: { border: "none", color: "red" },
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <TabsContent value="usage">
        <Card className="tabsContent">
          <CardHeader>
            <CardTitle className="text-black">Usage</CardTitle>
            <CardDescription>Loading your consumption…</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  if (error || !data) {
    return (
      <TabsContent value="usage">
        <Card className="tabsContent">
          <CardHeader>
            <CardTitle className="text-black">Usage</CardTitle>
            <CardDescription className="text-red-600">
              {error || "No usage data available."}
            </CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
    );
  }

  const cp = data.current_period || {};
  const q = cp.quota || {};
  const resetsAtStr = formatDate(cp.resets_at);

  return (
    <TabsContent value="usage">
      <Card className="tabsContent">
        <CardHeader>
          <CardTitle className="text-black">Usage</CardTitle>
          <CardDescription>
            How your tokens are being spent. Quota resets every 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Current period ---------------------------------------------------- */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-black">
                Current period
                {cp.plan && (
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {cp.plan}
                    {cp.is_beta ? " · beta" : ""}
                  </span>
                )}
              </h3>
              {resetsAtStr && (
                <span className="text-xs text-gray-500">
                  Resets {resetsAtStr}
                </span>
              )}
            </div>
            <QuotaBar label="Input tokens" used={cp.input} quota={q.input} />
            <QuotaBar label="Output tokens" used={cp.output} quota={q.output} />
            <QuotaBar
              label="Cached input tokens"
              used={cp.cached}
              quota={q.cached}
            />
          </section>

          {/* By coach ---------------------------------------------------------- */}
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-black">By coach</h3>
            <BreakdownTable
              headers={["Coach", "Turns", "Input", "Output", "Cached"]}
              rows={(data.by_coach || []).map((r) => [
                COACH_NAME_BY_SLUG[r.assistant_slug] || r.assistant_slug,
                formatNumber(r.turns),
                formatNumber(r.input_tokens),
                formatNumber(r.output_tokens),
                formatNumber(r.cached_tokens),
              ])}
              emptyMessage="No coach usage yet."
            />
          </section>

          {/* By model ---------------------------------------------------------- */}
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-black">By model</h3>
            <BreakdownTable
              headers={["Model", "Turns", "Input", "Output", "Cached"]}
              rows={(data.by_model || []).map((r) => [
                formatModel(r.model),
                formatNumber(r.turns),
                formatNumber(r.input_tokens),
                formatNumber(r.output_tokens),
                formatNumber(r.cached_tokens),
              ])}
              emptyMessage="No model usage yet."
            />
          </section>

          {/* By day sparkline -------------------------------------------------- */}
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-black">
              Daily turns (last 30 days)
            </h3>
            <Sparkline byDay={data.by_day} />
          </section>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function BreakdownTable({ headers, rows, emptyMessage }) {
  if (!rows.length) {
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  }
  return (
    <div className="overflow-x-auto rounded border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {headers.map((h, i) => (
              <th
                key={h}
                className={`px-3 py-2 text-left font-medium ${i === 0 ? "" : "text-right"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {rows.map((cells, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {cells.map((c, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 ${j === 0 ? "font-medium" : "text-right tabular-nums"}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
