"use client";

import { createPlanModel, listOpenRouterModels } from "@/apiCalls/adminAPI";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const PROVIDERS = ["openai", "anthropic", "google", "meta", "mistral", "cohere"];

// Infer provider from a slash-namespaced model id like `openai/gpt-4o`.
const inferProvider = (modelId) => {
  const slash = modelId?.indexOf?.("/");
  if (slash > 0) {
    const guess = modelId.slice(0, slash);
    if (PROVIDERS.includes(guess)) return guess;
  }
  return "openai";
};

const AddPlanModelDialog = ({ isOpen, plan, existingModelIds, onClose, onAdded }) => {
  const [modelId, setModelId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [provider, setProvider] = useState("openai");
  const [maxTokens, setMaxTokens] = useState(4000);
  const [saving, setSaving] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const filterInputRef = useRef(null);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset when dialog closes so a re-open starts fresh.
      setModelId("");
      setDisplayName("");
      setProvider("openai");
      setMaxTokens(4000);
      setShowCatalog(false);
      setFilterQuery("");
    }
  }, [isOpen]);

  // Fetch OpenRouter catalog on first open only; backend caches 24h.
  useEffect(() => {
    if (!isOpen || catalog.length > 0 || catalogLoading) return;
    setCatalogLoading(true);
    listOpenRouterModels()
      .then((models) => setCatalog(models))
      .catch((err) => toast.error(err.message || "Failed to load OpenRouter catalog"))
      .finally(() => setCatalogLoading(false));
  }, [isOpen, catalog.length, catalogLoading]);

  useEffect(() => {
    if (showCatalog) filterInputRef.current?.focus();
  }, [showCatalog]);

  // When the user types a model id manually, auto-infer provider + display name.
  useEffect(() => {
    if (!modelId) return;
    const inferred = inferProvider(modelId);
    if (inferred) setProvider(inferred);
    if (!displayName) {
      const stripped = modelId.slice(modelId.indexOf("/") + 1);
      setDisplayName(stripped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId]);

  const filteredCatalog = useMemo(() => {
    if (!filterQuery) return catalog;
    const q = filterQuery.toLowerCase();
    return catalog.filter(
      (m) =>
        (m.id && m.id.toLowerCase().includes(q)) ||
        (m.name && m.name.toLowerCase().includes(q))
    );
  }, [catalog, filterQuery]);

  const pickFromCatalog = (m) => {
    setModelId(m.id);
    setDisplayName(m.name || m.id);
    setProvider(inferProvider(m.id));
    if (m.context_length) {
      // Cap suggested max_tokens at 8k — same order of magnitude as most
      // production configurations. Admin can override.
      setMaxTokens(Math.min(m.context_length, 8000));
    }
    setShowCatalog(false);
  };

  const handleSave = async () => {
    if (!modelId.trim()) return toast.error("model_id required");
    if (!displayName.trim()) return toast.error("display_name required");
    if (!Number.isFinite(Number(maxTokens)) || Number(maxTokens) <= 0) {
      return toast.error("max_tokens must be a positive integer");
    }
    if (existingModelIds?.has(modelId.trim())) {
      return toast.error(`${modelId.trim()} is already on ${plan}`);
    }

    setSaving(true);
    try {
      const created = await createPlanModel({
        plan,
        model_id: modelId.trim(),
        display_name: displayName.trim(),
        provider,
        max_tokens: Number(maxTokens),
        is_default: false,
        is_enabled: true,
        sort_order: 100, // manual adds land at the end; admin can re-order later
      });
      onAdded(created);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add model to {plan}</DialogTitle>
          <DialogDescription>
            Enter the OpenRouter model id manually or pick from the live catalog.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="model_id">Model ID</Label>
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setShowCatalog((v) => !v)}
                disabled={catalogLoading}
              >
                {catalogLoading
                  ? "Loading catalog…"
                  : showCatalog
                  ? "Hide catalog"
                  : "Browse OpenRouter catalog"}
              </button>
            </div>
            <Input
              id="model_id"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder="openai/gpt-4o"
              className="font-mono"
              disabled={saving}
            />
          </div>

          {showCatalog && (
            <div className="border rounded-md max-h-64 overflow-y-auto">
              <div className="p-2 border-b bg-gray-50 dark:bg-gray-800 sticky top-0">
                <Input
                  ref={filterInputRef}
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter…"
                  className="h-8 text-sm"
                />
              </div>
              {filteredCatalog.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 p-3 text-center">
                  {catalog.length === 0 ? "Catalog empty" : "No models match filter"}
                </div>
              ) : (
                <ul className="text-sm">
                  {filteredCatalog.slice(0, 200).map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => pickFromCatalog(m)}
                      >
                        <div className="font-mono text-xs">{m.id}</div>
                        {m.name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {m.name}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="GPT-4o"
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="provider">Provider</Label>
              <select
                id="provider"
                className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                disabled={saving}
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="max_tokens">Max tokens</Label>
              <Input
                id="max_tokens"
                type="number"
                min="1"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Adding…" : "Add model"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanModelDialog;
