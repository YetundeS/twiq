"use client";

import { archiveCoach, listCoaches } from "@/apiCalls/adminAPI";
import { Button } from "@/components/ui/button";
import { Archive, Plus, RefreshCw, Pencil, EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CoachEditorDialog from "./CoachEditorDialog";
import ConfirmDialog from "./ConfirmDialog";

const CoachesPanel = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  // null when creating; the coach row when editing an existing one.
  const [editingCoach, setEditingCoach] = useState(null);
  const [busySlug, setBusySlug] = useState(null);
  // null when nothing pending, or the coach row awaiting confirmation.
  const [archiveCandidate, setArchiveCandidate] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listCoaches();
      setCoaches(data);
    } catch (err) {
      toast.error(err.message || "Failed to load coaches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreateClick = () => {
    setEditingCoach(null);
    setEditorOpen(true);
  };

  const handleEditClick = (coach) => {
    setEditingCoach(coach);
    setEditorOpen(true);
  };

  const handleSaved = (savedCoach, wasCreate) => {
    setCoaches((prev) =>
      wasCreate
        ? [...prev, savedCoach]
        : prev.map((c) => (c.slug === savedCoach.slug ? savedCoach : c))
    );
    setEditorOpen(false);
    setEditingCoach(null);
    toast.success(wasCreate ? "Coach created" : "Coach updated");
  };

  const requestArchive = (coach) => {
    setArchiveCandidate(coach);
  };

  const confirmArchive = async () => {
    const coach = archiveCandidate;
    if (!coach) return;
    setBusySlug(coach.slug);
    try {
      await archiveCoach(coach.slug);
      setCoaches((prev) =>
        prev.map((c) => (c.slug === coach.slug ? { ...c, is_published: false } : c))
      );
      toast.success(`${coach.display_name} archived`);
      setArchiveCandidate(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusySlug(null);
    }
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
            Coaches
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            The AI personas users chat with. Edit prompts, models, retrieval
            settings, and knowledge base per coach.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh} className="flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button onClick={handleCreateClick} className="flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" />
            New Coach
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">
                Coach
              </th>
              <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200 hidden sm:table-cell">
                Model
              </th>
              <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200 hidden md:table-cell">
                Plans
              </th>
              <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200 hidden md:table-cell">
                Status
              </th>
              <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coaches.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No coaches yet. Click &quot;New Coach&quot; to create the first.
                </td>
              </tr>
            ) : (
              coaches.map((coach) => (
                <tr key={coach.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {coach.display_name}
                    </div>
                    <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {coach.slug}
                    </div>
                    {coach.description && (
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-1 max-w-md">
                        {coach.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                    <div>{coach.default_model}</div>
                    {coach.fallback_model && (
                      <div className="text-gray-400">↳ {coach.fallback_model}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {(coach.allowed_plans || []).map((p) => (
                        <span
                          key={p}
                          className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {coach.is_published ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-300">
                        <Eye className="h-3 w-3" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <EyeOff className="h-3 w-3" />
                        Archived
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(coach)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {coach.is_published && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busySlug === coach.slug}
                          onClick={() => requestArchive(coach)}
                          title="Archive (hide from picker; keep existing sessions)"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CoachEditorDialog
        isOpen={editorOpen}
        coach={editingCoach}
        onClose={() => {
          setEditorOpen(false);
          setEditingCoach(null);
        }}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={archiveCandidate !== null}
        onOpenChange={(open) => {
          if (!open) setArchiveCandidate(null);
        }}
        title={`Archive ${archiveCandidate?.display_name ?? "this coach"}?`}
        description="Users will lose access from the New Chat picker. Existing sessions will continue to work."
        confirmLabel="Archive coach"
        busyLabel="Archiving…"
        busy={busySlug === archiveCandidate?.slug}
        onConfirm={confirmArchive}
      />
    </div>
  );
};

export default CoachesPanel;
