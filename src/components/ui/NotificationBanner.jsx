import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X } from "@phosphor-icons/react";

// A one-shot "you have new notifications" banner shown right after sign-in.
// Dedupes with sessionStorage keyed by user id, so it appears once per
// browser session rather than on every page navigation, while the bell badge
// (driven by the same count) stays visible everywhere.
function NotificationBanner({ userId, count, notificationsPath }) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!userId || count <= 0) return;

    const key = `notifBannerSeen:${userId}`;
    try {
      if (sessionStorage.getItem(key)) return undefined;
      sessionStorage.setItem(key, "1");
    } catch {
      /* Private browsing etc. -- just show it once this render, no persistence. */
    }
    const timer = setTimeout(() => setDismissed(false), 0);
    return () => clearTimeout(timer);
  }, [userId, count]);

  if (dismissed || count <= 0) return null;

  return (
    <div className="fixed inset-x-0 top-3 z-[70] flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-xl bg-[#173563] px-4 py-2.5 text-white shadow-lg">
        <Bell className="h-4 w-4 shrink-0" />
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            navigate(notificationsPath);
          }}
          className="text-[13px] font-semibold hover:underline"
        >
          You have {count} new notification{count === 1 ? "" : "s"}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="ml-1 rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default NotificationBanner;
