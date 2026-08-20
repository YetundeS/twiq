"use client";

import { createCoach, listPlanModels, updateCoach } from "@/apiCalls/adminAPI";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ICON_PRESETS, resolveCoachIcon } from "@/constants/coachIconPresets";
import { POPULAR_OPENROUTER_MODELS } from "@/constants/openrouterModels";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CoachKbTab from "./CoachKbTab";

// Kept in lock-step with the backend's validPromptTemplatesError
// (twiq-backend controllers/coachProfilesController.js). If the caps
// diverge, admins will hit backend 400s the FE didn't warn about.
const PROMPT_TEMPLATES_MAX = 6;
const PROMPT_TEMPLATE_MAX_CHARS = 500;

const PLANS = ["STARTER", "PRO", "ENTERPRISE"];

const emptyDraft = () => ({
  slug: "",
  display_name: "",
  description: "",
  system_prompt: "",
  default_model: "openai/gpt-4o",
  fallback_model: "",
  allowed_plans: [...PLANS],
  default_retrieval_k: 6,
  default_history_n: 20,
  is_published: true,
  icon_url: "",
  // Array editor stores strings; we send [] to backend if empty (clears
  // the column) or null if the admin didn't touch it (leaves as-is).
  prompt_templates: [],
});

// Small helper: renders a native select over the plan-models list, plus
// an "Other (custom)" escape hatch that reveals a text input for models
// not yet in plan_models. Local component — used twice in the same file,
// no reason to hoist further.
const OTHER_VALUE = "__other__";
function ModelSelectField({
  id,
  label,
  hint,
  value,
  onChange,
  disabled,
  availableModels,
  allowEmpty = false,
  placeholder = "openai/gpt-4o",
}) {
  const isKnown = availableModels.some((m) => m.model_id === value);
  const isEmpty = !value;
  // On existing coaches whose model isn't in the current plan-models list
  // (e.g. an admin typed a one-off before this dropdown existed), keep it
  // showing as "Other" so we don't silently swap their model on save.
  const [customMode, setCustomMode] = useState(false);
  const showCustom = customMode || (!isEmpty && !isKnown);
  const selectValue = showCustom ? OTHER_VALUE : isEmpty ? "" : value;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={selectValue}
        disabled={disabled}
        onChange={(e) => {
          const next = e.target.value;
          if (next === OTHER_VALUE) {
            setCustomMode(true);
            // Don't clobber existing custom value; leave it for the input.
            return;
          }
          setCustomMode(false);
          onChange(next);
        }}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
      >
        {allowEmpty && <option value="">— none —</option>}
        {availableModels.map((m) => (
          <option key={m.model_id} value={m.model_id}>
            {m.display_name} ({m.model_id})
          </option>
        ))}
        <option value={OTHER_VALUE}>Other (custom)…</option>
      </select>
      {showCustom && (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-xs mt-2"
          disabled={disabled}
        />
      )}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

// Only send changed fields to PATCH so we don't accidentally overwrite
// something a concurrent admin edited in the interim.
const buildPatch = (original, draft) => {
  const patch = {};
  const fields = [
    "display_name", "description", "system_prompt", "default_model",
    "fallback_model", "default_retrieval_k", "default_history_n", "is_published",
    "icon_url",
  ];
  for (const f of fields) {
    if (draft[f] !== original[f]) patch[f] = draft[f];
  }
  // Arrays need element-wise comparison.
  const origPlans = (original.allowed_plans || []).slice().sort().join(",");
  const nextPlans = (draft.allowed_plans || []).slice().sort().join(",");
  if (origPlans !== nextPlans) patch.allowed_plans = draft.allowed_plans;

  // prompt_templates: string array. JSON-compare so a reorder counts as a
  // change but same-content-same-order doesn't. Backend accepts [] to
  // clear, so empty draft on a coach that previously had prompts sends
  // the clear correctly.
  const origPrompts = JSON.stringify(original.prompt_templates ?? []);
  const nextPrompts = JSON.stringify(draft.prompt_templates ?? []);
  if (origPrompts !== nextPrompts) patch.prompt_templates = draft.prompt_templates;
  return patch;
};

const CoachEditorDialog = ({ isOpen, coach, onClose, onSaved }) => {
  const isCreating = !coach;
  const [draft, setDraft] = useState(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  // Deduped list of model_ids across every plan (via GET /admin/plan-models).
  // Powers the default_model + fallback_model dropdowns so admins don't have
  // to remember exact OpenRouter identifiers.
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Normalize on load: coach.prompt_templates may be null (unset in DB
      // for admin-created + seed coaches). The editor works on arrays.
      const normalized = coach
        ? {
            ...emptyDraft(),
            ...coach,
            prompt_templates: Array.isArray(coach.prompt_templates)
              ? coach.prompt_templates
              : [],
            icon_url: coach.icon_url ?? "",
          }
        : emptyDraft();
      setDraft(normalized);
      setActiveTab("general");
    }
  }, [isOpen, coach]);

  // Load the model allowlist once per dialog-open. Fails quietly — the
  // dropdown falls back to just the popular-models palette.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    listPlanModels()
      .then((rows) => {
        if (cancelled) return;
        // Dedupe by model_id across plans. Prefer the first display_name we
        // see for each id.
        const seen = new Map();
        for (const r of rows || []) {
          if (!r?.model_id || seen.has(r.model_id)) continue;
          seen.set(r.model_id, {
            model_id: r.model_id,
            display_name: r.display_name || r.model_id,
          });
        }
        setAvailableModels([...seen.values()]);
      })
      .catch(() => { /* silent — palette-only dropdown */ });
    return () => { cancelled = true; };
  }, [isOpen]);

  // Merge the popular-models palette with the admin's plan_models list.
  // Plan-models win on display_name when the same model_id appears in both
  // (admin's curated label > generic default).
  const modelPalette = useMemo(() => {
    const merged = new Map();
    for (const m of POPULAR_OPENROUTER_MODELS) merged.set(m.model_id, m);
    for (const m of availableModels) merged.set(m.model_id, m);
    return [...merged.values()];
  }, [availableModels]);

  const setField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const togglePlan = (plan) => {
    setDraft((prev) => {
      const has = (prev.allowed_plans || []).includes(plan);
      return {
        ...prev,
        allowed_plans: has
          ? prev.allowed_plans.filter((p) => p !== plan)
          : [...prev.allowed_plans, plan],
      };
    });
  };

  const addPromptTemplate = () => {
    setDraft((prev) => {
      const cur = prev.prompt_templates || [];
      if (cur.length >= PROMPT_TEMPLATES_MAX) return prev;
      return { ...prev, prompt_templates: [...cur, ""] };
    });
  };

  const updatePromptTemplate = (index, value) => {
    setDraft((prev) => {
      const next = [...(prev.prompt_templates || [])];
      next[index] = value;
      return { ...prev, prompt_templates: next };
    });
  };

  const removePromptTemplate = (index) => {
    setDraft((prev) => {
      const next = [...(prev.prompt_templates || [])];
      next.splice(index, 1);
      return { ...prev, prompt_templates: next };
    });
  };

  const handleSave = async () => {
    // Client-side validation mirrors the backend so we can surface issues
    // before firing the request. Backend re-validates in all cases.
    if (isCreating && !/^[a-z][a-z0-9_]{0,58}$/.test(draft.slug)) {
      return toast.error("Slug must start with a letter, use only lowercase letters/digits/underscores, ≤ 60 chars");
    }
    if (!draft.display_name.trim()) return toast.error("Display name required");
    if (!draft.system_prompt.trim()) return toast.error("System prompt required");
    if (!draft.default_model.trim()) return toast.error("Default model required");
    if (!draft.allowed_plans || draft.allowed_plans.length === 0) {
      return toast.error("Grant access to at least one plan");
    }

    setSaving(true);
    try {
      let result;
      if (isCreating) {
        result = await createCoach({
          slug: draft.slug,
          display_name: draft.display_name.trim(),
          description: draft.description?.trim() || null,
          system_prompt: draft.system_prompt,
          default_model: draft.default_model.trim(),
          fallback_model: draft.fallback_model?.trim() || null,
          allowed_plans: draft.allowed_plans,
          default_retrieval_k: Number(draft.default_retrieval_k),
          default_history_n: Number(draft.default_history_n),
          is_published: draft.is_published,
          icon_url: draft.icon_url?.trim() || null,
          prompt_templates: draft.prompt_templates?.length
            ? draft.prompt_templates
            : null,
        });
      } else {
        const patch = buildPatch(coach, draft);
        if (Object.keys(patch).length === 0) {
          toast.info("No changes to save");
          setSaving(false);
          return;
        }
        result = await updateCoach(coach.slug, patch);
      }
      onSaved(result, isCreating);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "New coach" : `Edit ${coach?.display_name || coach?.slug}`}
          </DialogTitle>
          <DialogDescription>
            {isCreating
              ? "Slug is immutable after creation — pick carefully."
              : "Slug and pinecone namespace are immutable. Everything else is editable."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className={`grid w-full ${isCreating ? "grid-cols-3" : "grid-cols-4"}`}>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
            {!isCreating && <TabsTrigger value="kb">Knowledge base</TabsTrigger>}
          </TabsList>

          {/* --- GENERAL --- */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={draft.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="my_coach"
                className="font-mono"
                disabled={!isCreating || saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                Immutable after creation. Powers URL routes + Pinecone namespace.
              </p>
            </div>
            <div>
              <Label htmlFor="display_name">Display name</Label>
              <Input
                id="display_name"
                value={draft.display_name}
                onChange={(e) => setField("display_name", e.target.value)}
                placeholder="My Coach"
                disabled={saving}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={draft.description || ""}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="One-line pitch shown in the coach picker (≤ 500 chars)."
                rows={2}
                maxLength={500}
                disabled={saving}
              />
            </div>
            <div>
              <Label>Icon</Label>
              {/* Preset picker only. Legacy URL rows still render via the
                  resolver (backwards compat), but new edits pick from the
                  curated set so the visual language stays consistent. */}
              {(() => {
                const resolved = resolveCoachIcon(draft.icon_url);
                const selectedKey = resolved.kind === "lucide" ? resolved.key : null;
                const isLegacyUrl = resolved.kind === "image";
                return (
                  <>
                    <div className="mt-1 grid grid-cols-8 gap-2">
                      {ICON_PRESETS.map(({ key, label, Icon }) => {
                        const isSelected = selectedKey === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            title={label}
                            aria-label={label}
                            aria-pressed={isSelected}
                            onClick={() => setField("icon_url", `lucide:${key}`)}
                            disabled={saving}
                            className={
                              "flex h-10 w-10 items-center justify-center rounded-md border transition " +
                              (isSelected
                                ? "border-red-500 bg-red-50 dark:bg-red-950/40 dark:border-red-400"
                                : "border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500")
                            }
                          >
                            <Icon className="h-5 w-5" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500">
                        {selectedKey
                          ? `Selected: ${ICON_PRESETS.find((p) => p.key === selectedKey)?.label}`
                          : isLegacyUrl
                            ? "Legacy URL (pick a preset to replace)"
                            : "Optional. Falls back to a generic icon if unset."}
                      </p>
                      {draft.icon_url ? (
                        <button
                          type="button"
                          onClick={() => setField("icon_url", "")}
                          disabled={saving}
                          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <X className="h-3 w-3" />
                          Clear
                        </button>
                      ) : null}
                    </div>
                  </>
                );
              })()}
            </div>
          </TabsContent>

          {/* --- BEHAVIOR --- */}
          <TabsContent value="behavior" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="system_prompt">System prompt</Label>
              <Textarea
                id="system_prompt"
                value={draft.system_prompt}
                onChange={(e) => setField("system_prompt", e.target.value)}
                placeholder="You are a helpful coach…"
                rows={12}
                maxLength={20000}
                className="font-mono text-xs"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">
                {draft.system_prompt.length} / 20 000 chars. Sent as the cached system message on every turn.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ModelSelectField
                id="default_model"
                label="Default model"
                value={draft.default_model}
                onChange={(v) => setField("default_model", v)}
                disabled={saving}
                availableModels={modelPalette}
                placeholder="openai/gpt-4o"
              />
              <ModelSelectField
                id="fallback_model"
                label="Fallback model"
                hint="Optional. Used when the primary model errors mid-stream."
                value={draft.fallback_model || ""}
                onChange={(v) => setField("fallback_model", v)}
                disabled={saving}
                availableModels={modelPalette}
                allowEmpty
                placeholder="anthropic/claude-3.5-sonnet"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="retrieval_k">Retrieval K</Label>
                <Input
                  id="retrieval_k"
                  type="number"
                  min="1"
                  max="30"
                  value={draft.default_retrieval_k}
                  onChange={(e) => setField("default_retrieval_k", Number(e.target.value))}
                  disabled={saving}
                />
                <p className="text-xs text-gray-500 mt-1">Chunks retrieved per turn (1–30)</p>
              </div>
              <div>
                <Label htmlFor="history_n">History N</Label>
                <Input
                  id="history_n"
                  type="number"
                  min="1"
                  max="100"
                  value={draft.default_history_n}
                  onChange={(e) => setField("default_history_n", Number(e.target.value))}
                  disabled={saving}
                />
                <p className="text-xs text-gray-500 mt-1">Recent messages sent to model (1–100)</p>
              </div>
            </div>

            {/* Starter prompts — rendered in the new-chat grid. Capped at 6
                to match the FE layout (2 cols × 3 rows on md). Empty entries
                are stripped server-side but flag them here to keep the UI
                honest. */}
            <div>
              <div className="flex items-center justify-between">
                <Label>Starter prompts</Label>
                <span className="text-xs text-gray-500">
                  {(draft.prompt_templates || []).length} / {PROMPT_TEMPLATES_MAX}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 mb-2">
                Clickable prompt cards on the coach&apos;s empty-chat page. Leave empty to fall back to the built-in defaults for seed coaches.
              </p>
              <div className="space-y-2">
                {(draft.prompt_templates || []).map((tpl, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Textarea
                      value={tpl}
                      onChange={(e) => updatePromptTemplate(i, e.target.value)}
                      placeholder={`Prompt ${i + 1}`}
                      rows={2}
                      maxLength={PROMPT_TEMPLATE_MAX_CHARS}
                      disabled={saving}
                      className="text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePromptTemplate(i)}
                      disabled={saving}
                      aria-label={`Remove prompt ${i + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPromptTemplate}
                  disabled={
                    saving ||
                    (draft.prompt_templates || []).length >= PROMPT_TEMPLATES_MAX
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add prompt
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* --- ACCESS --- */}
          <TabsContent value="access" className="space-y-4 mt-4">
            <div>
              <Label>Allowed plans</Label>
              <div className="mt-2 flex gap-2 flex-wrap">
                {PLANS.map((plan) => {
                  const active = (draft.allowed_plans || []).includes(plan);
                  return (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => togglePlan(plan)}
                      disabled={saving}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {plan}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Users on plans NOT selected here won&apos;t see this coach in the picker.
              </p>
            </div>
            <div className="border rounded-md p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.is_published}
                  onChange={(e) => setField("is_published", e.target.checked)}
                  disabled={saving}
                  className="h-4 w-4"
                />
                <span className="text-sm">Published</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                When unchecked, the coach is hidden from the picker but existing user
                sessions continue to work.
              </p>
            </div>
          </TabsContent>

          {/* --- KNOWLEDGE BASE --- */}
          {!isCreating && (
            <TabsContent value="kb" className="mt-4">
              <CoachKbTab slug={coach.slug} />
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : isCreating ? "Create coach" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoachEditorDialog;
