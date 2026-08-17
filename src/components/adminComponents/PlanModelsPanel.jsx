"use client";

import {
  createPlanModel,
  deletePlanModel,
  listPlanModels,
  updatePlanModel,
} from "@/apiCalls/adminAPI";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Trash2, Star, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AddPlanModelDialog from "./AddPlanModelDialog";
import ConfirmDialog from "./ConfirmDialog";

const PLANS = ["STARTER", "PRO", "ENTERPRISE"];

const PlanModelsPanel = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addPlan, setAddPlan] = useState("STARTER");
  const [busyId, setBusyId] = useState(null);
  // null when idle, else the row awaiting delete confirmation.
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listPlanModels();
      setRows(data);
    } catch (err) {
      toast.error(err.message || "Failed to load plan models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const grouped = useMemo(() => {
    const g = { STARTER: [], PRO: [], ENTERPRISE: [] };
    for (const r of rows) {
      if (g[r.plan]) g[r.plan].push(r);
    }
    for (const p of PLANS) {
      g[p].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }
    return g;
  }, [rows]);

  const handleToggleEnabled = async (row) => {
    setBusyId(row.id);
    try {
      const updated = await updatePlanModel(row.id, { is_enabled: !row.is_enabled });
      setRows((prev) => prev.map((r) => (r.id === row.id ? updated : r)));
      toast.success(updated.is_enabled ? "Model enabled" : "Model disabled");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleMakeDefault = async (row) => {
    // Backend enforces one default per plan via a partial unique index —
    // flip the OLD default off first, then promote the new one. Two writes,
    // done client-side because the backend has no atomic "swap default" RPC.
    const currentDefault = rows.find((r) => r.plan === row.plan && r.is_default);
    if (!currentDefault || currentDefault.id === row.id) return;

    setBusyId(row.id);
    try {
      await updatePlanModel(currentDefault.id, { is_default: false });
      const promoted = await updatePlanModel(row.id, { is_default: true });
      setRows((prev) =>
        prev.map((r) => {
          if (r.id === currentDefault.id) return { ...r, is_default: false };
          if (r.id === row.id) return promoted;
          return r;
        })
      );
      toast.success(`${promoted.display_name} is now the default for ${row.plan}`);
    } catch (err) {
      toast.error(err.message);
      // Best-effort refresh — the swap may be half-applied.
      refresh();
    } finally {
      setBusyId(null);
    }
  };

  const requestDelete = (row) => {
    if (row.is_default) {
      toast.error("Promote another model to default before deleting this one");
      return;
    }
    setDeleteCandidate(row);
  };

  const confirmDelete = async () => {
    const row = deleteCandidate;
    if (!row) return;
    setBusyId(row.id);
    try {
      await deletePlanModel(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      toast.success("Model removed");
      setDeleteCandidate(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleAddClick = (plan) => {
    setAddPlan(plan);
    setAddOpen(true);
  };

  const handleAdded = (newRow) => {
    setRows((prev) => [...prev, newRow]);
    setAddOpen(false);
    toast.success(`${newRow.display_name} added to ${newRow.plan}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Plan Models
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Curated model allowlist per subscription plan. Each plan has exactly one default.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} className="flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {PLANS.map((plan) => (
        <div key={plan} className="border rounded-lg bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{plan}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {grouped[plan].length} {grouped[plan].length === 1 ? "model" : "models"}
              </span>
            </div>
            <Button size="sm" onClick={() => handleAddClick(plan)} className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>

          {grouped[plan].length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
              No models seeded for {plan}. Users on this plan will fall back to the coach&apos;s default_model.
            </div>
          ) : (
            <ul className="divide-y">
              {grouped[plan].map((row) => (
                <li
                  key={row.id}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {row.display_name}
                      </span>
                      {row.is_default && (
                        <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                          <Star className="h-3 w-3" />
                          Default
                        </span>
                      )}
                      {!row.is_enabled && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono truncate">
                      {row.model_id} · {row.max_tokens} tokens
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!row.is_default && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === row.id}
                        onClick={() => handleMakeDefault(row)}
                        title="Promote to default for this plan"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === row.id}
                      onClick={() => handleToggleEnabled(row)}
                      title={row.is_enabled ? "Disable" : "Enable"}
                    >
                      {row.is_enabled ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      disabled={busyId === row.id || row.is_default}
                      onClick={() => requestDelete(row)}
                      title={row.is_default ? "Promote another to default first" : "Remove"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <AddPlanModelDialog
        isOpen={addOpen}
        plan={addPlan}
        existingModelIds={new Set(grouped[addPlan].map((r) => r.model_id))}
        onClose={() => setAddOpen(false)}
        onAdded={handleAdded}
      />

      <ConfirmDialog
        open={deleteCandidate !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCandidate(null);
        }}
        title={`Remove ${deleteCandidate?.display_name ?? "this model"} from ${deleteCandidate?.plan ?? "the plan"}?`}
        description="Users on that plan will lose access to this model."
        confirmLabel="Remove"
        busyLabel="Removing…"
        busy={busyId === deleteCandidate?.id}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PlanModelsPanel;
