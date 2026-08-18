// Curated palette of popular OpenRouter models for the coach editor
// dropdown. Merged with GET /admin/plan-models on render, deduped by
// model_id. Admins don't need to know exact OpenRouter IDs — they can
// pick from the list; "Other (custom)…" escape hatch stays for one-off
// models not here yet.
//
// Kept as a static constant (not a backend endpoint) because:
//   - The list changes rarely (~a few times a year as flagship models
//     ship). One code edit + deploy is fine.
//   - No admin-editing use case yet — this is a "get admins unstuck"
//     seed list, not a curated per-tenant catalog.
//
// Ordering: rough popularity, with cheap-fast models near the top for
// visibility. Not alphabetical — the dropdown is short enough that
// admins can eyeball it.
//
// Ids match OpenRouter's canonical `provider/model` form
// (https://openrouter.ai/models). Verify before adding new entries —
// a typo here silently mints an unreachable coach default at admin
// save-time.
export const POPULAR_OPENROUTER_MODELS = [
  // OpenAI
  { model_id: "openai/gpt-4o", display_name: "GPT-4o" },
  { model_id: "openai/gpt-4o-mini", display_name: "GPT-4o Mini" },
  { model_id: "openai/o1-mini", display_name: "o1 Mini" },

  // Anthropic
  {
    model_id: "anthropic/claude-3.5-sonnet",
    display_name: "Claude 3.5 Sonnet",
  },
  { model_id: "anthropic/claude-3.5-haiku", display_name: "Claude 3.5 Haiku" },
  { model_id: "anthropic/claude-3-opus", display_name: "Claude 3 Opus" },

  // Google
  { model_id: "google/gemini-2.0-flash-exp", display_name: "Gemini 2.0 Flash" },
  { model_id: "google/gemini-pro-1.5", display_name: "Gemini 1.5 Pro" },

  // Meta
  {
    model_id: "meta-llama/llama-3.3-70b-instruct",
    display_name: "Llama 3.3 70B",
  },
  {
    model_id: "meta-llama/llama-3.1-405b-instruct",
    display_name: "Llama 3.1 405B",
  },

  // Mistral
  { model_id: "mistralai/mistral-large", display_name: "Mistral Large" },

  // DeepSeek
  { model_id: "deepseek/deepseek-chat", display_name: "DeepSeek V3" },
  { model_id: "deepseek/deepseek-r1", display_name: "DeepSeek R1" },

  // Moonshot / Kimi
  { model_id: "moonshotai/kimi-k2", display_name: "Kimi K2" },

  // xAI
  { model_id: "x-ai/grok-2-1212", display_name: "Grok 2" },
];
