import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle,
  ChatCircle,
  Clock,
  EnvelopeSimple,
  Package,
  UserPlus,
} from "@phosphor-icons/react";

import AgentAdminSidebar from "../components/AgentAdminSidebar";

const NOTIFICATIONS = [
  {
    id: "d1",
    type: "member",
    title: "New agency member joined",
    description: "Kasun Fernando accepted your invitation and joined the agency.",
    time: "20 minutes ago",
    unread: true,
  },
  {
    id: "d2",
    type: "invite",
    title: "Invitation pending",
    description: "Your invitation to nadeesha@agency.lk is still pending.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "d3",
    type: "request",
    title: "New shipment request",
    description: "A new clearing request was posted and is visible to your agency.",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: "d4",
    type: "message",
    title: "New message from an SME",
    description: "An SME sent a message regarding an active shipment.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "d5",
    type: "member",
    title: "Agency profile updated",
    description: "Your agency profile changes were saved successfully.",
    time: "3 days ago",
    unread: false,
  },
];

const TYPE_META = {
  member: { icon: UserPlus, style: "bg-blue-50 text-[#2563EB]" },
  invite: { icon: EnvelopeSimple, style: "bg-amber-50 text-amber-600" },
  request: { icon: Package, style: "bg-emerald-50 text-emerald-600" },
  message: { icon: ChatCircle, style: "bg-violet-50 text-violet-600" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

function AgentAdminNotifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items]);

  const visibleItems = useMemo(() => {
    if (filter === "unread") {
      return items.filter((item) => item.unread);
    }
    return items;
  }, [items, filter]);

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
  };

  const markRead = (id) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AgentAdminSidebar />

      <main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0">
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:top-0">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Agency Workspace
            </p>
            <h1 className="text-base font-bold text-slate-800">Notifications</h1>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-[#173563] transition hover:border-slate-300 hover:bg-slate-50"
            >
              <CheckCircle size={15} />
              Mark all as read
            </button>
          )}
        </header>

        <div className="mx-auto max-w-[880px] px-5 py-7 sm:px-8 lg:py-9">
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
                        filter === item.key
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 text-[#2563EB]"
                      }`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {visibleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <Bell size={26} />
                </div>
                <p className="text-sm font-semibold text-slate-700">You're all caught up</p>
                <p className="mt-1 max-w-xs text-[13px] leading-5 text-slate-400">
                  New members, invitations and requests will show up here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {visibleItems.map((item) => {
                  const meta = TYPE_META[item.type] || TYPE_META.request;
                  const Icon = meta.icon;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => markRead(item.id)}
                        className={`flex w-full items-start gap-3.5 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5 ${
                          item.unread ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.style}`}
                        >
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[14px] font-bold text-slate-800">{item.title}</p>
                            {item.unread && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" />
                            )}
                          </div>

                          <p className="mt-1 text-[13px] leading-5 text-slate-500">
                            {item.description}
                          </p>

                          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                            <Clock size={12} />
                            {item.time}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AgentAdminNotifications;
