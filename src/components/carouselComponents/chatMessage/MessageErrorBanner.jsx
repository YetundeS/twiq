import { AlertTriangle, Lock, ShieldAlert, WifiOff } from "lucide-react";
import { memo, useMemo } from "react";

// Classify the free-text error message into a structured type so we can
// pick an appropriate icon and label. Backend + client push a variety of
// short strings via `getErrorMessage`; keep this list in sync with that.
const classify = (content = "") => {
  const text = String(content).toLowerCase();
  if (text.includes("unauthorized")) {
    return { type: "auth", label: "Signed out", Icon: Lock };
  }
  if (text.includes("quota")) {
    return { type: "quota", label: "Quota reached", Icon: ShieldAlert };
  }
  if (text.includes("your current plan")) {
    return { type: "plan", label: "Plan restriction", Icon: ShieldAlert };
  }
  if (text.includes("server error")) {
    return { type: "server", label: "Server error", Icon: AlertTriangle };
  }
  return { type: "generic", label: "Something went wrong", Icon: WifiOff };
};

const MessageErrorBanner = memo(({ content }) => {
  const { type, label, Icon } = useMemo(() => classify(content), [content]);

  return (
    <div className="messageErrorBanner" data-error-type={type} role="alert">
      <div className="messageErrorBanner__head">
        <Icon size={16} className="messageErrorBanner__icon" />
        <span className="messageErrorBanner__label">{label}</span>
      </div>
      <p className="messageErrorBanner__body">{content}</p>
      <div className="messageErrorBanner__actions">
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
