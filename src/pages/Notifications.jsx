import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CheckCircle, Clock, Trash, Warning } from "@phosphor-icons/react";

import AppNavbar from "../components/ui/AppNavbar";
import { api, ApiError } from "../lib/api";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

function timeAgo(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString();
}

// Where a click on a notification should take the SME, based on its `type`.
function notificationLink(item) {
  switch (item.type) {
    case "new_bid":
      return item.tenderId ? `/find-agent?tenderId=${item.tenderId}` : "/find-agent";
    case "stage_update":
      return item.shipmentId ? `/track-shipment?shipmentId=${item.shipmentId}` : "/track-shipment";
    default:
      return null;
  }
}

function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [filter, setFilter] = useState("all");
  const [reloadKey, setReloadKey] = useState(0);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.get("/notifications");
        if (active) setItems(data);
      } catch (err) {
        if (active) {
          setLoadError(
            err instanceof ApiError ? err.message : "Could not load notifications. Is the backend running?"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);

  const visibleItems = useMemo(() => {
    if (filter === "unread") {
      return items.filter((item) => !item.read);
    }
    return items;
  }, [items, filter]);

  const markRead = async (item) => {
    if (item.read) return;

    setActionError("");
    setItems((current) => current.map((i) => (i.id === item.id ? { ...i, read: true } : i)));

    try {
      await api.put(`/notifications/${item.id}/read`);
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (err) {
      setItems((current) => current.map((i) => (i.id === item.id ? { ...i, read: false } : i)));
      setActionError(err instanceof ApiError ? err.message : "Could not update this notification.");
    }
  };

  const handleItemClick = (item) => {
    markRead(item);
    const link = notificationLink(item);
    if (link) navigate(link);
  };

  const markAllRead = async () => {
    const unreadIds = items.filter((item) => !item.read).map((item) => item.id);
    if (unreadIds.length === 0) return;

    setActionError("");
    setItems((current) => current.map((item) => ({ ...item, read: true })));

    try {
      await Promise.all(unreadIds.map((id) => api.put(`/notifications/${id}/read`)));
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not mark everything as read.");
      // Some of the calls above may have partially succeeded -- reconcile with the server.
      setReloadKey((key) => key + 1);
    }
  };

  const clearAll = async () => {
    setClearingAll(true);
    setActionError("");
    try {
      await api.del("/notifications");
      setItems([]);
      setConfirmingClear(false);
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not clear notifications.");
    } finally {
      setClearingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AppNavbar />

      <main className="mx-auto w-full max-w-[880px] px-5 py-8 sm:px-8 lg:py-10">

        <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
              Notifications
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
              Stay up to date on your shipments, agent bids and messages.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#173563] transition hover:border-slate-300 hover:bg-slate-50"
              >
                <CheckCircle size={16} />
                Mark all as read
              </button>
            )}
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
              >
                <Trash size={16} />
                Clear all
              </button>
            )}
          </div>
        </section>

        {confirmingClear && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] font-semibold text-red-700">
              Clear all notifications? This can't be undone.
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setConfirmingClear(false)}
                disabled={clearingAll}
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-[12px] font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={clearingAll}
                className="rounded-lg bg-red-600 px-3 py-2 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {clearingAll ? "Clearing..." : "Yes, Clear All"}
              </button>
            </div>
          </div>
        )}

        {actionError && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-600">
            <Warning size={17} />
            {actionError}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">
          <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3 sm:px-5">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition ${
                  filter === item.key
                    ? "bg-[#173563] text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {item.label}
                {item.key === "unread" && unreadCount > 0 && (
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                      filter === item.key ? "bg-white/20 text-white" : "bg-blue-50 text-[#2563EB]"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]"
                aria-label="Loading"
              />
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <Warning size={26} className="text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">{loadError}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setLoadError("");
                  setReloadKey((key) => key + 1);
                }}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-[#173563] px-4 text-[13px] font-semibold text-white transition hover:bg-[#214777]"
              >
                Try again
              </button>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                <Bell size={26} />
              </div>
              <p className="text-sm font-semibold text-slate-700">You're all caught up</p>
              <p className="mt-1 max-w-xs text-[13px] leading-5 text-slate-400">
                New notifications about your shipments and agents will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visibleItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`flex w-full items-start gap-3.5 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5 ${
                      !item.read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                      <Bell size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[14px] font-semibold text-slate-800">{item.message}</p>
                        {!item.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" />
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                        <Clock size={12} />
                        {timeAgo(item.createdAt)}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-6 text-center text-[12px] text-slate-400">
          Looking for older activity? Visit your{" "}
          <Link to="/track-shipment" className="font-semibold text-[#2563EB] hover:underline">
            shipments
          </Link>{" "}
          or{" "}
          <Link to="/messages" className="font-semibold text-[#2563EB] hover:underline">
            messages
          </Link>
          .
        </p>
      </main>
    </div>
  );
}

export default Notifications;
