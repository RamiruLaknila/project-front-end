import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChatCircle,
  MagnifyingGlass,
  Package,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";
import { formatChatTime } from "../lib/utils";

// Same polling approach as the importer-side Messages page -- no
// websocket/Firestore-listener infrastructure exists in this app yet, so a
// conversation just re-fetches on an interval while it's open.
const MESSAGE_POLL_MS = 4000;
const CONVERSATION_POLL_MS = 10000;

function getInitials(name) {
  if (!name) return "SM";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Shared messaging UI for all three clearing-agent variants (agency
 * member, independent agent, agency admin). Each variant's page just
 * supplies its own sidebar + label, since the underlying data (a
 * conversation IS the shipment the agent is assigned to, with its
 * importer) is identical across all three.
 */
function AgentMessagesPanel({ sidebar, workspaceLabel }) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  const [shipments, setShipments] = useState([]);
  const [conversationsError, setConversationsError] = useState("");

  const [selectedId, setSelectedId] = useState(searchParams.get("shipment") || null);

  const [messages, setMessages] = useState([]);
  const [messagesError, setMessagesError] = useState("");
  const [sending, setSending] = useState(false);

  const conversations = useMemo(
    () =>
      shipments
        .map((s) => ({
          id: s.id,
          importerName: s.importerName || "Importer",
          route: [s.origin, s.destination].filter(Boolean).join(" → "),
          initials: getInitials(s.importerName),
          shipmentId: s.reference || s.id,
          product: s.description || "",
          lastMessage: s.lastMessage || "No messages yet",
          lastTime: formatChatTime(s.lastMessageAt || s.createdAt),
          sortKey: s.lastMessageAt || s.createdAt || "",
        }))
        .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1)),
    [shipments]
  );

  const effectiveId = selectedId || conversations[0]?.id || null;
  const selectedConversation = conversations.find((c) => c.id === effectiveId);

  const filteredConversations = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return conversations;
    return conversations.filter(
      (c) =>
        c.importerName.toLowerCase().includes(value) ||
        c.product.toLowerCase().includes(value) ||
        c.shipmentId.toLowerCase().includes(value)
    );
  }, [conversations, search]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await api.get("/shipments");
        if (active) {
          setShipments(data);
          setConversationsError("");
        }
      } catch (err) {
        if (active) {
          setConversationsError(err instanceof ApiError ? err.message : "Could not load conversations.");
        }
      }
    };

    load();
    const interval = setInterval(load, CONVERSATION_POLL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!effectiveId) return;

    let active = true;

    const load = async () => {
      try {
        const data = await api.get(`/shipments/${effectiveId}/messages`);
        if (active) {
          setMessages(data);
          setMessagesError("");
        }
      } catch (err) {
        if (active) {
          setMessagesError(err instanceof ApiError ? err.message : "Could not load messages.");
        }
      }
    };

    load();
    const interval = setInterval(load, MESSAGE_POLL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [effectiveId]);

  const selectConversation = (id) => {
    setSelectedId(id);
    setMessages([]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !selectedConversation || sending) return;

    setSending(true);
    try {
      const sent = await api.post(`/shipments/${effectiveId}/messages`, { text });
      setMessages((current) => [...current, sent]);
      setShipments((current) =>
        current.map((s) =>
          s.id === effectiveId ? { ...s, lastMessage: text, lastMessageAt: sent.createdAt } : s
        )
      );
      setDraft("");
      setMessagesError("");
    } catch (err) {
      setMessagesError(err instanceof ApiError ? err.message : "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      {sidebar}

      <main className="min-h-screen pt-[68px] lg:ml-[270px] lg:pt-0">
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:top-0">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {workspaceLabel}
            </p>
            <h1 className="text-base font-bold text-slate-800">Messages</h1>
          </div>

          <div className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
            {conversations.length}
          </div>
        </header>

        <div className="mx-auto max-w-[1080px] px-5 py-7 sm:px-8 lg:py-9">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,.025)]">
            <div className="grid md:min-h-[620px] md:grid-cols-[290px_1fr]">
              {/* CONVERSATION SIDEBAR */}
              <aside className="border-b border-slate-200 bg-white md:border-b-0 md:border-r">
                <div className="border-b border-slate-100 p-4">
                  <h2 className="text-sm font-bold text-[#14213D]">Conversations</h2>
                  <p className="mt-1 text-[10px] text-slate-400">Importers you're working with</p>

                  <div className="relative mt-4">
                    <MagnifyingGlass
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search conversations..."
                      className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-[#173B6C] focus:bg-white focus:ring-2 focus:ring-[#173B6C]/10"
                    />
                  </div>
                </div>

                {conversationsError && (
                  <div className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] font-medium text-red-600">
                    {conversationsError}
                  </div>
                )}

                <div className="max-h-[540px] overflow-y-auto">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => {
                      const isSelected = conversation.id === effectiveId;

                      return (
                        <button
                          key={conversation.id}
                          type="button"
                          onClick={() => selectConversation(conversation.id)}
                          className={`w-full border-b border-slate-100 p-4 text-left transition ${
                            isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                isSelected ? "bg-[#173563] text-white" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {conversation.initials}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-[12px] font-bold text-slate-800">
                                  {conversation.importerName}
                                </p>
                                <span className="shrink-0 text-[9px] text-slate-400">
                                  {conversation.lastTime}
                                </span>
                              </div>

                              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                {conversation.route}
                              </p>

                              <p className="mt-2 truncate text-[10px] text-slate-500">
                                {conversation.lastMessage}
                              </p>

                              <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">
                                {conversation.shipmentId}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-5 py-12 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <MagnifyingGlass size={18} />
                      </div>
                      <p className="mt-3 text-xs font-bold text-slate-700">
                        {conversations.length === 0 ? "No conversations yet" : "No conversations found"}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {conversations.length === 0
                          ? "Once you're assigned to a shipment, you can message the importer here."
                          : "Try another search."}
                      </p>
                    </div>
                  )}
                </div>
              </aside>

              {/* CHAT AREA */}
              {selectedConversation ? (
                <div className="flex flex-col md:min-h-[620px]">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173563] text-[11px] font-bold text-white">
                        {selectedConversation.initials}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold text-slate-800">
                          {selectedConversation.importerName}
                        </h2>
                        <p className="truncate text-[10px] text-slate-400">
                          {selectedConversation.route}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <Package size={15} />
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                            Shipment
                          </p>
                          <p className="mt-0.5 text-[11px] font-bold text-slate-700">
                            {selectedConversation.shipmentId}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0 sm:max-w-[220px]">
                        <p className="truncate text-[10px] text-slate-500">
                          {selectedConversation.product}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-[#FBFCFE] px-4 py-5 sm:px-6">
                    {messagesError && (
                      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
                        {messagesError}
                      </div>
                    )}

                    {messages.length === 0 && !messagesError && (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <p className="text-xs font-semibold text-slate-500">No messages yet</p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Say hello to get the conversation started.
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {messages.map((item) => {
                        const isMe = item.senderId === user?.id;

                        return (
                          <div key={item.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`flex max-w-[85%] items-end gap-2 sm:max-w-[70%] ${
                                isMe ? "flex-row-reverse" : ""
                              }`}
                            >
                              {!isMe && (
                                <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#173563] text-[9px] font-bold text-white sm:flex">
                                  {selectedConversation.initials}
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
                                  <p className="text-[12px] leading-5">{item.text}</p>
                                </div>
                                <p
                                  className={`mt-1 text-[9px] text-slate-400 ${
                                    isMe ? "text-right" : "text-left"
                                  }`}
                                >
                                  {formatChatTime(item.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 bg-white p-3 sm:p-4">
                    <form onSubmit={sendMessage} className="flex items-end gap-2">
                      <div className="relative flex-1">
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage(e);
                            }
                          }}
                          rows={1}
                          placeholder="Write a message..."
                          className="max-h-28 min-h-10 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-[#173B6C] focus:bg-white focus:ring-2 focus:ring-[#173B6C]/10"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!draft.trim() || sending}
                        className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173563] text-white shadow-sm transition hover:bg-[#102A4D] disabled:cursor-not-allowed disabled:opacity-40"
                        title="Send message"
                      >
                        <PaperPlaneTilt size={15} />
                      </button>
                    </form>

                    <p className="mt-2 px-1 text-[9px] text-slate-400">
                      Press Enter to send • Shift + Enter for a new line
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center px-6 text-center md:min-h-[620px]">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <ChatCircle size={24} />
                    </div>
                    <h2 className="mt-4 text-sm font-bold text-slate-800">Select a conversation</h2>
                    <p className="mx-auto mt-1 max-w-xs text-[11px] leading-5 text-slate-400">
                      Choose an importer from the conversation list to start messaging.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AgentMessagesPanel;
