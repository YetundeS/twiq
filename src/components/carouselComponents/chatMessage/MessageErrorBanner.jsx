import { AlertTriangle, Lock, RefreshCw, ShieldAlert, WifiOff } from "lucide-react";
import { memo, useMemo } from "react";

// Classify the free-text error message into a structured type so we can
// pick an appropriate icon and label. Backend + client push a variety of
// short strings via `getErrorMessage`; keep this list in sync with that.
const classify = (content = "") => {
  const text = String(content).toLowerCase();
  if (text.includes("unauthorized")) {
    return { type: "auth", label: "Signed out", Icon: Lock, canRetry: false };
  }
  if (text.includes("quota")) {
    return { type: "quota", label: "Quota reached", Icon: ShieldAlert, canRetry: false };
  }
  if (text.includes("your current plan")) {
    return { type: "plan", label: "Plan restriction", Icon: ShieldAlert, canRetry: false };
  }
  if (text.includes("server error")) {
    return { type: "server", label: "Server error", Icon: AlertTriangle, canRetry: true };
  }
  return { type: "generic", label: "Something went wrong", Icon: WifiOff, canRetry: true };
};

const MessageErrorBanner = memo(({ content, onRetry }) => {
  const { type, label, Icon, canRetry } = useMemo(() => classify(content), [content]);
  const showRetry = canRetry && typeof onRetry === "function";

  return (
    <div className="messageErrorBanner" data-error-type={type} role="alert">
      <div className="messageErrorBanner__head">
        <Icon size={16} className="messageErrorBanner__icon" />
        <span className="messageErrorBanner__label">{label}</span>
      </div>
      <p className="messageErrorBanner__body">{content}</p>
      <div className="messageErrorBanner__actions">
        {showRetry && (
          <button
            type="button"
            className="messageErrorBanner__retry"
            onClick={onRetry}
          >
            <RefreshCw size={12} />
            Retry
          </button>
        )}
        <a
          className="messageErrorBanner__link"
          href="mailto:team@mail.twiq.ai?subject=Chat%20error%20report"
        >
          Report issue
        </a>
      </div>
    </div>
  );
});

MessageErrorBanner.displayName = "MessageErrorBanner";

export default MessageErrorBanner;
