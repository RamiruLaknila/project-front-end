import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Paperclip,
  Phone,
  Search,
  Send,
  ShieldCheck,
  MoreHorizontal,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

function Messages() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [conversations, setConversations] = useState([
    {
      id: 1,
      agentName: "Nimal Perera",
      agency: "Colombo Customs Solutions",
      initials: "NP",
      status: "Online",
      shipmentId: "IMP-204821",
      product: "Laptop computers - 50 units",
      lastMessage:
        "I have reviewed your shipment details. We can proceed with the clearance.",
      lastTime: "10:42 AM",
      unread: 2,
    },
    {
      id: 2,
      agentName: "John doe",
      agency: "LankaClear Logistics",
      initials: "KF",
      status: "Offline",
      shipmentId: "IMP-204615",
      product: "Automotive spare parts",
      lastMessage:
        "Please send the commercial invoice when available.",
      lastTime: "Yesterday",
      unread: 0,
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] =
    useState(1);

  const [messages, setMessages] = useState({
    1: [
      {
        id: 1,
        sender: "agent",
        text: "Hello! Thank you for selecting Colombo Customs Solutions.",
        time: "10:31 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Hi Nimal. I wanted to confirm whether you need any additional documents for this shipment.",
        time: "10:34 AM",
      },
      {
        id: 3,
        sender: "agent",
        text: "I have reviewed your shipment details. We can proceed with the clearance.",
        time: "10:42 AM",
      },
    ],

    2: [
      {
        id: 1,
        sender: "agent",
        text: "Please send the commercial invoice when available.",
        time: "Yesterday",
      },
    ],
  });

  const selectedConversation = conversations.find(
    (conversation) =>
      conversation.id === selectedConversationId
  );

  const selectedMessages =
    messages[selectedConversationId] || [];

  const filteredConversations = useMemo(() => {
    const value = search.toLowerCase().trim();

    return conversations.filter((conversation) => {
      return (
        conversation.agentName
          .toLowerCase()
          .includes(value) ||
        conversation.agency
          .toLowerCase()
          .includes(value) ||
        conversation.product
          .toLowerCase()
          .includes(value) ||
        conversation.shipmentId
          .toLowerCase()
          .includes(value)
      );
    });
  }, [conversations, search]);

  const selectConversation = (id) => {
    setSelectedConversationId(id);

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              unread: 0,
            }
          : conversation
      )
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || !selectedConversation) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: cleanMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((current) => ({
      ...current,
      [selectedConversationId]: [
        ...(current[selectedConversationId] || []),
        newMessage,
      ],
    }));

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              lastMessage: cleanMessage,
              lastTime: "Just now",
            }
          : conversation
      )
    );

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-up {
          animation:
            fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .scale-in {
          animation:
            scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .slide-down {
          animation:
            slideDown 0.25s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .calculator-delay-1 {
          animation-delay: 0.05s;
        }

        .calculator-delay-2 {
          animation-delay: 0.1s;
        }

        .calculator-delay-3 {
          animation-delay: 0.15s;
        }

        .calculator-delay-4 {
          animation-delay: 0.2s;
        }

        .calculator-delay-5 {
          animation-delay: 0.25s;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scale-in,
          .slide-down {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        {/* ===================================================
            BACK BUTTON
        ==================================================== */}

        <div className="fade-up mb-6">
          <BackButton current="Messages" />
        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up calculator-delay-1 mb-8">

          <div className="flex flex-col items-center justify-center text-center">

            {/* BADGE */}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

              <MessageCircle
                size={13}
                className="text-blue-600"
                strokeWidth={2}
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                Agent communication
              </span>

            </div>

            {/* TITLE */}

            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[40px]">
              Messages
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
              Communicate directly with the clearing agents
              handling your import shipments.
            </p>

            {/* STATUS */}

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

              <CheckCircle2
                size={14}
                className="text-emerald-600"
              />

              <span className="text-[10px] font-semibold text-emerald-700">
                Secure messaging
              </span>

            </div>

          </div>

        </section>

        
        {/* ===================================================
            INFO BANNER
        ==================================================== */}

        <div className="fade-up calculator-delay-3 mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3.5">

          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>

            <p className="text-[10px] font-bold text-blue-800">
              Secure communication
            </p>

            <p className="mt-1 text-[11px] leading-5 text-blue-700">
              Use messages to discuss shipment details,
              documents, clearance requirements and other
              import-related questions with your selected
              clearing agent.
            </p>

          </div>

        </div>

        {/* ===================================================
            MESSAGE CARD
        ==================================================== */}

        <section className="fade-up calculator-delay-4 scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,.025)]">

          <div className="grid min-h-[620px] md:grid-cols-[290px_1fr]">

            {/* =================================================
                CONVERSATION SIDEBAR
            ================================================== */}

            <aside className="border-b border-slate-200 bg-white md:border-b-0 md:border-r">

              {/* SIDEBAR HEADER */}

              <div className="border-b border-slate-100 p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <h2 className="text-sm font-bold text-[#14213D]">
                        Conversations
                      </h2>

                      <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500 sm:block">
                        Agents
                      </span>

                    </div>

                    <p className="mt-1 text-[9px] text-slate-400">
                      Your clearing agents
                    </p>

                  </div>

                  <div className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-700">
                    {conversations.length}
                  </div>

                </div>

                {/* SEARCH */}

                <div className="relative mt-4">

                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search conversations..."
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[10px] text-slate-700 outline-none transition focus:border-[#173B6C] focus:bg-white focus:ring-2 focus:ring-[#173B6C]/10"
                  />

                </div>

              </div>

              {/* CONVERSATION LIST */}

              <div className="max-h-[540px] overflow-y-auto">

                {filteredConversations.length > 0 ? (

                  filteredConversations.map(
                    (conversation) => {

                      const isSelected =
                        conversation.id ===
                        selectedConversationId;

                      return (

                        <button
                          key={conversation.id}
                          type="button"
                          onClick={() =>
                            selectConversation(
                              conversation.id
                            )
                          }
                          className={`w-full border-b border-slate-100 p-4 text-left transition ${
                            isSelected
                              ? "bg-blue-50/70"
                              : "hover:bg-slate-50"
                          }`}
                        >

                          <div className="flex gap-3">

                            {/* AVATAR */}

                            <div className="relative shrink-0">

                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-[10px] font-bold ${
                                  isSelected
                                    ? "bg-[#173563] text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {conversation.initials}
                              </div>

                              {conversation.status ===
                                "Online" && (
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                              )}

                            </div>

                            {/* CONTENT */}

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p className="truncate text-[11px] font-bold text-slate-800">
                                  {conversation.agentName}
                                </p>

                                <span className="shrink-0 text-[8px] text-slate-400">
                                  {conversation.lastTime}
                                </span>

                              </div>

                              <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                {conversation.agency}
                              </p>

                              <p className="mt-2 truncate text-[9px] text-slate-500">
                                {conversation.lastMessage}
                              </p>

                              <div className="mt-2 flex items-center justify-between">

                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-500">
                                  {conversation.shipmentId}
                                </span>

                                {conversation.unread >
                                  0 && (
                                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-bold text-white">
                                    {conversation.unread}
                                  </span>
                                )}

                              </div>

                            </div>

                          </div>

                        </button>

                      );

                    }
                  )

                ) : (

                  <div className="px-5 py-12 text-center">

                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <Search size={18} />
                    </div>

                    <p className="mt-3 text-xs font-bold text-slate-700">
                      No conversations found
                    </p>

                    <p className="mt-1 text-[9px] text-slate-400">
                      Try another search.
                    </p>

                  </div>

                )}

              </div>

            </aside>

            {/* =================================================
                CHAT AREA
            ================================================== */}

            {selectedConversation ? (

              <div className="flex min-h-[620px] flex-col">

                {/* CHAT HEADER */}

                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="relative shrink-0">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                        {selectedConversation.initials}
                      </div>

                      {selectedConversation.status ===
                        "Online" && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      )}

                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h2 className="truncate text-sm font-bold text-slate-800">
                          {selectedConversation.agentName}
                        </h2>

                        <CheckCircle2
                          size={13}
                          className="shrink-0 text-blue-600"
                        />

                      </div>

                      <p className="truncate text-[9px] text-slate-400">
                        {selectedConversation.agency}
                        {" • "}
                        {selectedConversation.status}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title="Call agent"
                    >
                      <Phone size={14} />
                    </button>

                    <button
                      type="button"
                      className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:flex"
                      title="More options"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                  </div>

                </div>

                {/* SHIPMENT CONTEXT */}

                <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">

                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <PackageIcon />
                      </div>

                      <div>

                        <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
                          Shipment
                        </p>

                        <p className="mt-0.5 text-[10px] font-bold text-slate-700">
                          {selectedConversation.shipmentId}
                        </p>

                      </div>

                    </div>

                    <div className="min-w-0 sm:max-w-[220px]">

                      <p className="truncate text-[9px] text-slate-500">
                        {selectedConversation.product}
                      </p>

                    </div>

                    <Link
                      to="/track-shipment"
                      className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-blue-700 hover:text-blue-800"
                    >
                      View shipment
                      <ChevronRight size={12} />
                    </Link>

                  </div>

                </div>

                {/* MESSAGES */}

                <div className="flex-1 overflow-y-auto bg-[#FBFCFE] px-4 py-5 sm:px-6">

                  <div className="mb-5 flex items-center justify-center">

                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[8px] font-semibold text-slate-400">
                      Today
                    </div>

                  </div>

                  <div className="space-y-4">

                    {selectedMessages.map(
                      (item) => {

                        const isMe =
                          item.sender === "me";

                        return (

                          <div
                            key={item.id}
                            className={`flex ${
                              isMe
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >

                            <div
                              className={`flex max-w-[85%] items-end gap-2 sm:max-w-[70%] ${
                                isMe
                                  ? "flex-row-reverse"
                                  : ""
                              }`}
                            >

                              {!isMe && (
                                <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#173563] text-[8px] font-bold text-white sm:flex">
                                  {
                                    selectedConversation.initials
                                  }
                                </div>
                              )}

                              <div>

                                <div
                                  className={`rounded-2xl px-4 py-3 ${
                                    isMe
                                      ? "rounded-br-md bg-[#173563] text-white"
                                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                                  }`}
                                >

                                  <p className="text-[11px] leading-5">
                                    {item.text}
                                  </p>

                                </div>

                                <p
                                  className={`mt-1 text-[8px] text-slate-400 ${
                                    isMe
                                      ? "text-right"
                                      : "text-left"
                                  }`}
                                >
                                  {item.time}
                                </p>

                              </div>

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>

                {/* MESSAGE INPUT */}

                <div className="border-t border-slate-100 bg-white p-3 sm:p-4">

                  <form
                    onSubmit={sendMessage}
                    className="flex items-end gap-2"
                  >

                    <button
                      type="button"
                      className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title="Attach document"
                    >
                      <Paperclip size={16} />
                    </button>

                    <div className="relative flex-1">

                      <textarea
                        value={message}
                        onChange={(e) =>
                          setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {

                          if (
                            e.key === "Enter" &&
                            !e.shiftKey
                          ) {
                            e.preventDefault();
                            sendMessage(e);
                          }

                        }}
                        rows={1}
                        placeholder="Write a message..."
                        className="max-h-28 min-h-10 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-3 text-[10px] text-slate-700 outline-none transition focus:border-[#173B6C] focus:bg-white focus:ring-2 focus:ring-[#173B6C]/10"
                      />

                    </div>

                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173563] text-white shadow-sm transition hover:bg-[#102A4D] disabled:cursor-not-allowed disabled:opacity-40"
                      title="Send message"
                    >
                      <Send size={15} />
                    </button>

                  </form>

                  <p className="mt-2 px-1 text-[8px] text-slate-400">
                    Press Enter to send • Shift + Enter
                    for a new line
                  </p>

                </div>

              </div>

            ) : (

              /* =================================================
                 NO SELECTED CONVERSATION
              ================================================== */

              <div className="flex min-h-[620px] items-center justify-center px-6 text-center">

                <div>

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <MessageCircle size={24} />
                  </div>

                  <h2 className="mt-4 text-sm font-bold text-slate-800">
                    Select a conversation
                  </h2>

                  <p className="mx-auto mt-1 max-w-xs text-[10px] leading-5 text-slate-400">
                    Choose a clearing agent from the
                    conversation list to start messaging.
                  </p>

                </div>

              </div>

            )}

          </div>

        </section>

        {/* ===================================================
            BOTTOM NAVIGATION
        ==================================================== */}

        <div className="fade-up calculator-delay-5 mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

          {/* BACK */}

          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:justify-start"
          >

            <ArrowLeft size={16} />

            Back to Dashboard

          </Link>

          {/* NEXT */}

          <Link
            to="/track-shipment"
            className="group flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(23,59,108,.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.18)]"
          >

            View Shipment

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />

          </Link>

        </div>

        {/* ===================================================
            FOOTER NOTE
        ==================================================== */}

        <div className="fade-up mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <ShieldCheck
            size={13}
            className="text-emerald-600"
          />

          <span>
            Messages are only shared between you and your
            selected clearing agent.
          </span>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   SMALL PACKAGE ICON
========================================================= */

function PackageIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16.5 9.4-9-5.19" />

      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />

      <polyline points="3.29 7 12 12 20.71 7" />

      <line
        x1="12"
        y1="22"
        x2="12"
        y2="12"
      />
    </svg>
  );
}

export default Messages;