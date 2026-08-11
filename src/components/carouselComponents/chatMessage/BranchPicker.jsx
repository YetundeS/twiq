import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";

// Sibling cycler for messages that share a parent_id. Rendered above the
// active sibling; hidden entirely on groups with only one member. Matches
// the Claude/ChatGPT convention of "< 2/3 >".
const BranchPicker = memo(({ index, total, onPrev, onNext }) => {
  if (total <= 1) return null;
  const atStart = index <= 0;
  const atEnd = index >= total - 1;

  return (
    <div className="branchPicker" role="group" aria-label="Message branches">
      <button
        type="button"
        className="branchPicker__btn"
        aria-label="Previous branch"
        disabled={atStart}
        onClick={onPrev}
      >
        <ChevronLeft size={12} />
      </button>
      <span className="branchPicker__label">
        {index + 1} / {total}
      </span>
      <button
        type="button"
        className="branchPicker__btn"
        aria-label="Next branch"
        disabled={atEnd}
        onClick={onNext}
      >
        <ChevronRight size={12} />
      </button>
    </div>
  );
});

BranchPicker.displayName = "BranchPicker";

export default BranchPicker;
