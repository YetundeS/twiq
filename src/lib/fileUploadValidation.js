// Pure file-upload validation extracted from chatInputArea.handleFileChange
// so three call sites can share one pipeline: click-to-upload, drag-drop,
// and paste-image (§6.7 remainder).
//
// Client-side filter is UX only — the backend
// (middlewares/fileUploadMiddleware.js) remains the authoritative gate.

export const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
export const DEFAULT_MAX_FILES = 5;

export const DEFAULT_ALLOWED_TYPES = [
  // Document types
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/html",
  // Image types
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

/**
 * Validate a batch of newly-picked / dropped / pasted files against a set
 * of existing (already-attached) files.
 *
 * @param {File[]} newFiles - candidates the user is trying to add
 * @param {File[]} existingFiles - already attached to the message
 * @param {{maxSize?: number, maxFiles?: number, allowedTypes?: string[]}} [opts]
 * @returns {{ accepted: File[], rejections: {file: File, reason: string, message: string}[] }}
 *   `reason` is machine-readable: 'too_large' | 'unsupported_type' | 'duplicate' | 'max_files'
 *   `message` is a human-readable version suitable for a toast
 */
export function validateFilesForUpload(newFiles, existingFiles = [], opts = {}) {
  const maxSize = opts.maxSize ?? DEFAULT_MAX_SIZE;
  const maxFiles = opts.maxFiles ?? DEFAULT_MAX_FILES;
  const allowedTypes = opts.allowedTypes ?? DEFAULT_ALLOWED_TYPES;

  const accepted = [];
  const rejections = [];

  const isDuplicate = (candidate, poolA, poolB) => {
    for (const p of poolA) {
      if (p.name === candidate.name && p.size === candidate.size) return true;
    }
    for (const p of poolB) {
      if (p.name === candidate.name && p.size === candidate.size) return true;
    }
    return false;
  };

  for (const file of newFiles) {
    if (existingFiles.length + accepted.length >= maxFiles) {
      rejections.push({
        file,
        reason: "max_files",
        message: `You can only upload up to ${maxFiles} files per message.`,
      });
      continue;
    }

    if (file.size > maxSize) {
      const mb = Math.round(maxSize / (1024 * 1024));
      rejections.push({
        file,
        reason: "too_large",
        message: `${file.name} is too large. Max size is ${mb}MB.`,
      });
      continue;
    }

    if (!allowedTypes.includes(file.type)) {
      rejections.push({
        file,
        reason: "unsupported_type",
        message: `${file.name} is an unsupported file type.`,
      });
      continue;
    }

    if (isDuplicate(file, existingFiles, accepted)) {
      rejections.push({
        file,
        reason: "duplicate",
        message: `File "${file.name}" is already selected.`,
      });
      continue;
    }

    accepted.push(file);
  }

  return { accepted, rejections };
}
