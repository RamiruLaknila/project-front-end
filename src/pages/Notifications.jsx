import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  ChatCircle,
  Clock,
  FileText,
  Gavel,
  Package,
  Truck,
} from "@phosphor-icons/react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

const NOTIFICATIONS = [
  {
    id: "n1",
    type: "shipment",
    title: "Shipment cleared customs",
    description:
      "Your shipment IMP-2026-014 (Laptop Computers) has cleared customs and is ready for delivery.",
    time: "10 minutes ago",
    unread: true,
  },
  {
    id: "n2",
    type: "bid",
    title: "New bid received",
    description:
      "Colombo Customs Solutions submitted a bid for your shipment request REQ-2026-021.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "n3",
    type: "message",
    title: "New message from your clearing agent",
    description:
      "Nimal Perera sent you a message about the documents needed for IMP-2026-014.",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: "n4",
    type: "document",
    title: "Document requested",
    description:
      "Your clearing agent requested a copy of the commercial invoice for IMP-2026-012.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n5",
    type: "shipment",
    title: "Shipment in transit",
    description: "IMP-2026-009 (Solar Panels) has left the origin port and is now in transit.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: "n6",
    type: "system",
    title: "Welcome to ImportEase",
    description: "Your account is set up. Start by requesting your first clearing agent.",
    time: "5 days ago",
    unread: false,
  },
];

const TYPE_META = {
  shipment: { icon: Truck, style: "bg-blue-50 text-[#2563EB]" },
  bid: { icon: Gavel, style: "bg-amber-50 text-amber-600" },
  message: { icon: ChatCircle, style: "bg-violet-50 text-violet-600" },
  document: { icon: FileText, style: "bg-slate-100 text-slate-600" },
  system: { icon: Package, style: "bg-emerald-50 text-emerald-600" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

function Notifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = useMemo(
    () => items.filter((item) => item.unread).length,
    [items]
  );

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
      <AppNavbar />

      <main className="mx-auto w-full max-w-[880px] px-5 py-8 sm:px-8 lg:py-10">
        <div className="fade-up mb-6">
          <BackButton current="Notifications" />
        </div>

        <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
              Notifications
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
              Stay up to date on your shipments, agent bids and messages.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#173563] transition hover:border-slate-300 hover:bg-slate-50"
            >
              <CheckCircle size={16} />
              Mark all as read
            </button>
          )}
        </section>

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
                New notifications about your shipments and agents will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visibleItems.map((item) => {
                const meta = TYPE_META[item.type] || TYPE_META.system;
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
                          <p className="text-[14px] font-bold text-slate-800">
                            {item.title}
                          </p>
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

        <p className="mt-6 text-center text-[12px] text-slate-400">
          Looking for older activity? Visit your{" "}
          <Link to="/shipments" className="font-semibold text-[#2563EB] hover:underline">
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
