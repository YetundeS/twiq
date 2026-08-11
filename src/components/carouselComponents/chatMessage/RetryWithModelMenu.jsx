"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { memo } from "react";

// Strip the provider prefix so `openai/gpt-4o` renders as `gpt-4o`, matching
// how ModelBadge displays model identifiers.
const stripProvider = (model) => {
  if (!model) return model;
  const slash = model.indexOf("/");
  return slash >= 0 ? model.slice(slash + 1) : model;
};

// Dropdown next to Regenerate that lets the user pick a specific model.
// Backend `POST /:id/regenerate` validates model_id against the coach's
// allowlist (default_model + fallback_model today; widens to plan_models
// when §12.2 ships).
//
// Hidden when the coach has no fallback_model — with only one option
// (the default), the plain Regenerate button already covers it.
const RetryWithModelMenu = memo(({ coach, onPick }) => {
  const alternatives = [];
  if (coach?.fallback_model && coach.fallback_model !== coach.default_model) {
    alternatives.push(coach.fallback_model);
  }
  if (alternatives.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="messageActionBtn retryWithModel__trigger"
          aria-label="Retry with another model"
          title="Retry with another model"
        >
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="retryWithModel__content">
        {coach?.default_model && (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onPick();
            }}
          >
            <span className="retryWithModel__label">Regenerate</span>
            <span className="retryWithModel__model">
              {stripProvider(coach.default_model)}
            </span>
          </DropdownMenuItem>
        )}
        {alternatives.map((modelId) => (
          <DropdownMenuItem
            key={modelId}
            onSelect={(e) => {
              e.preventDefault();
              onPick(modelId);
            }}
          >
            <span className="retryWithModel__label">Retry with</span>
            <span className="retryWithModel__model">
              {stripProvider(modelId)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

RetryWithModelMenu.displayName = "RetryWithModelMenu";

export default RetryWithModelMenu;
