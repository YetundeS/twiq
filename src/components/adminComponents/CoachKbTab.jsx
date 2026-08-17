"use client";

import {
  deleteCoachKbFile,
  listCoachKb,
  uploadCoachKb,
} from "@/apiCalls/adminAPI";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Upload, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "./ConfirmDialog";

const KB_ACCEPT = ".pdf,.txt,.md,.docx,.html";

const formatSize = (bytes) => {
  if (bytes == null) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const CoachKbTab = ({ slug }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  // null when idle, else the file row awaiting delete confirmation.
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const inputRef = useRef(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listCoachKb(slug);
      setFiles(data);
    } catch (err) {
      toast.error(err.message || "Failed to load KB files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleUpload = async (event) => {
    const picked = Array.from(event.target.files || []);
    if (picked.length === 0) return;

    setUploading(true);
    try {
      const result = await uploadCoachKb(slug, picked);
      // Ingest result carries ingested (n) + skipped (list) + files (new rows).
      // Merge new rows into state; report skipped as warnings so admin can act.
      if (result.files?.length) {
        setFiles((prev) => [...result.files, ...prev]);
      }
      if (result.skipped?.length) {
        for (const s of result.skipped) {
          toast.warning(`Skipped ${s.filename}: ${s.reason}`);
        }
      }
      if (result.ingested > 0) {
        toast.success(
          `Ingested ${result.ingested} file${result.ingested === 1 ? "" : "s"} (${result.chunkCount} chunks)`
        );
      }
      if (result.ingested === 0 && result.skipped?.length === 0) {
        toast.info("No files were ingested");
      }
      // Refresh to ensure we caught any rows the server produced that weren't
      // in the initial insert result (edge case; cheap since backend paginates).
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const requestDelete = (file) => {
    setDeleteCandidate(file);
  };

  const confirmDelete = async () => {
    const file = deleteCandidate;
    if (!file) return;
    setBusyId(file.id);
    try {
      await deleteCoachKbFile(slug, file.id);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      toast.success(`Deleted ${file.file_name}`);
      setDeleteCandidate(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
            Knowledge base
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Files ingested into <span className="font-mono">coach:{slug}</span> — surfaced on every retrieval turn for this coach.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={KB_ACCEPT}
            onChange={handleUpload}
            className="hidden"
            id="coach-kb-upload"
          />
          <Button
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <RefreshCw className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      ) : files.length === 0 ? (
        <div className="border rounded-md py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          No files ingested yet. Supported: PDF, TXT, MD, DOCX, HTML.
        </div>
      ) : (
        <ul className="divide-y border rounded-md">
          {files.map((file) => (
            <li key={file.id} className="px-3 py-2 flex items-center gap-3">
              <FileText className="h-4 w-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.file_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-3">
                  <span>{file.chunk_count} chunks</span>
                  {file.file_size && <span>{formatSize(file.file_size)}</span>}
                  {file.created_at && (
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:bg-red-50 shrink-0"
                disabled={busyId === file.id}
                onClick={() => requestDelete(file)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleteCandidate !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCandidate(null);
        }}
        title={`Delete ${deleteCandidate?.file_name ?? "this file"}?`}
        description="Its vectors will be removed from Pinecone and this coach's retrieval will stop surfacing them on the next query."
        confirmLabel="Delete file"
        busyLabel="Deleting…"
        busy={busyId === deleteCandidate?.id}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CoachKbTab;
