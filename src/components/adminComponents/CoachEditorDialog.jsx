"use client";

import { createCoach, updateCoach } from "@/apiCalls/adminAPI";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CoachKbTab from "./CoachKbTab";

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
});

// Only send changed fields to PATCH so we don't accidentally overwrite
// something a concurrent admin edited in the interim.
const buildPatch = (original, draft) => {
  const patch = {};
  const fields = [
    "display_name", "description", "system_prompt", "default_model",
    "fallback_model", "default_retrieval_k", "default_history_n", "is_published",
  ];
  for (const f of fields) {
    if (draft[f] !== original[f]) patch[f] = draft[f];
  }
  // Arrays need element-wise comparison.
  const origPlans = (original.allowed_plans || []).slice().sort().join(",");
  const nextPlans = (draft.allowed_plans || []).slice().sort().join(",");
  if (origPlans !== nextPlans) patch.allowed_plans = draft.allowed_plans;
  return patch;
};

const CoachEditorDialog = ({ isOpen, coach, onClose, onSaved }) => {
  const isCreating = !coach;
  const [draft, setDraft] = useState(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isOpen) {
      setDraft(coach ? { ...emptyDraft(), ...coach } : emptyDraft());
      setActiveTab("general");
    }
  }, [isOpen, coach]);

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
              <div>
                <Label htmlFor="default_model">Default model</Label>
                <Input
                  id="default_model"
                  value={draft.default_model}
                  onChange={(e) => setField("default_model", e.target.value)}
                  placeholder="openai/gpt-4o"
                  className="font-mono text-xs"
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor="fallback_model">Fallback model</Label>
                <Input
                  id="fallback_model"
                  value={draft.fallback_model || ""}
                  onChange={(e) => setField("fallback_model", e.target.value)}
                  placeholder="anthropic/claude-3.5-sonnet"
                  className="font-mono text-xs"
                  disabled={saving}
                />
              </div>
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
