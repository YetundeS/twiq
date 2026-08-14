import { models } from "@/constants/sidebar";
import { memo, useMemo } from "react";

// Header row on assistant replies: coach icon + display name. Coach lookup
// is driven off the `assistantSlug` (which matches models[].url in
// constants/sidebar.js). Falls back to a neutral pill when the slug isn't
// found (defensive against renames).
const CoachIdentity = memo(({ assistantSlug }) => {
  const coach = useMemo(
    () => models.find((m) => m.url === assistantSlug),
    [assistantSlug]
  );

  if (!coach) return null;
  const Icon = coach.icon;

  return (
    <div className="coachIdentity" aria-label={`Reply from ${coach.name}`}>
      <span className="coachIdentity__iconWrap">
        <Icon />
      </span>
      <span className="coachIdentity__name">{coach.name}</span>
    </div>
  );
});

CoachIdentity.displayName = "CoachIdentity";

export default CoachIdentity;
