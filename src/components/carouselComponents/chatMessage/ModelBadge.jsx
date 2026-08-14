import { memo } from "react";

// Strip provider prefix so `openai/gpt-4o` renders as `gpt-4o`.
// Coach-facing users don't need to see routing metadata.
const stripProvider = (model) => {
  if (!model || typeof model !== "string") return model;
  const slash = model.indexOf("/");
  return slash >= 0 ? model.slice(slash + 1) : model;
};

const ModelBadge = memo(({ model }) => {
  if (!model) return null;

  const label = stripProvider(model);

  return (
    <span className="modelBadge" title={model}>
      {label}
    </span>
  );
});

ModelBadge.displayName = "ModelBadge";

export default ModelBadge;
