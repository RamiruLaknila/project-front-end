import { useEffect, useState } from "react";
import { api } from "../lib/api";

// Shared by every role's nav (AppNavbar for SMEs, AgentMemberSidebar and
// IndividualAgentSidebar for agents) so the bell badge and the "you have new
// notifications" banner all agree on one count. Re-checked on mount and
// whenever Notifications.jsx marks something read, via the
// "notificationsUpdated" event.
export function useUnreadNotifications(userId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      const timer = setTimeout(() => setCount(0), 0);
      return () => clearTimeout(timer);
    }

    let active = true;

    const load = async () => {
      try {
        const data = await api.get("/notifications?unreadOnly=true");
        if (active) setCount(data.length);
      } catch {
        if (active) setCount(0);
      }
    };

    load();
    window.addEventListener("notificationsUpdated", load);

    return () => {
      active = false;
      window.removeEventListener("notificationsUpdated", load);
    };
  }, [userId]);

  return count;
}
