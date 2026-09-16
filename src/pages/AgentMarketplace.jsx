import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlass,
  Package,
  MapPin,
  Clock,
  CurrencyDollar,
  CaretRight,
  X,
  PaperPlaneTilt,
  CheckCircle,
  ArrowsClockwise,
  Bell,
  Warning,
} from "@phosphor-icons/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AgentMemberSidebar from "../components/AgentMemberSidebar";
import { useAuth } from "../context/AuthContext";
import { useUnreadNotifications } from "../hooks/useUnreadNotifications";
import { api, ApiError } from "../lib/api";

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
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const diffMs = target.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diffMs / 86400000);
}

function urgencyBadge(dateStr) {
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days <= 3) return { label: days < 0 ? "Overdue" : "Urgent", style: "bg-red-50 text-red-600 border-red-100" };
  if (days <= 7) return { label: "Due soon", style: "bg-amber-50 text-amber-600 border-amber-100" };
  return { label: "On schedule", style: "bg-emerald-50 text-emerald-600 border-emerald-100" };
}

function AgentMarketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const unreadCount = useUnreadNotifications(user?.id);
  const [searchParams] = useSearchParams();
  const linkedTenderId = searchParams.get("tenderId");

  const [tenders, setTenders] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTender, setSelectedTender] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);

  const [bidForm, setBidForm] = useState({ feeLkr: "", clearanceHours: "", notes: "" });
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidError, setBidError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [openTenders, mine] = await Promise.all([
          api.get("/tenders?status=open"),
          api.get("/bids/mine"),
        ]);
        if (!active) return;
        setTenders(openTenders);
        setMyBids(mine);
      } catch (err) {
        if (active) {
          setLoadError(
            err instanceof ApiError ? err.message : "Could not load the marketplace. Is the backend running?"
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

  // Deep-linked from a "direct_request" notification -- ?tenderId=... opens
  // that request's detail view once the marketplace list has loaded.
  useEffect(() => {
    if (!linkedTenderId || tenders.length === 0) return undefined;
    const match = tenders.find((tender) => tender.id === linkedTenderId);
    if (!match) return undefined;

    const timer = setTimeout(() => setSelectedTender(match), 0);
    return () => clearTimeout(timer);
  }, [linkedTenderId, tenders]);

  const myBidByTender = useMemo(() => {
    const map = new Map();
    myBids.forEach((bid) => map.set(bid.tenderId, bid));
    return map;
  }, [myBids]);

  const hasAgentBid = (tenderId) => myBidByTender.has(tenderId);

  const filteredTenders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return tenders;
    return tenders.filter((tender) =>
      [tender.description, tender.origin, tender.port, tender.hsCode]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [tenders, searchTerm]);

  const handleRefresh = () => {
    setLoading(true);
    setLoadError("");
    setReloadKey((key) => key + 1);
  };

  const [editingBidId, setEditingBidId] = useState(null);

  const openTender = (tender) => setSelectedTender(tender);

  const openBidForm = (tender, existingBid) => {
    setSelectedTender(tender);
    if (existingBid) {
      setEditingBidId(existingBid.id);
      setBidForm({
        feeLkr: String(existingBid.feeLkr ?? ""),
        clearanceHours: String(existingBid.clearanceTimelineHours ?? ""),
        notes: existingBid.notes || "",
      });
    } else {
      setEditingBidId(null);
      setBidForm({ feeLkr: "", clearanceHours: "", notes: "" });
    }
    setBidError("");
    setShowBidModal(true);
  };

  const closeBidModal = () => {
    setShowBidModal(false);
    setBidError("");
    setEditingBidId(null);
  };

  const submitBid = async (event) => {
    event.preventDefault();
    if (!selectedTender) return;

    const fee = Number(bidForm.feeLkr);
    const hours = Number(bidForm.clearanceHours);
    if (!fee || fee <= 0) {
      setBidError("Enter a valid clearance fee.");
      return;
    }
    if (!hours || hours <= 0) {
      setBidError("Enter a valid clearance time in hours.");
      return;
    }

    setBidSubmitting(true);
    setBidError("");
    const payload = {
      feeLkr: fee,
      clearanceTimelineHours: Math.round(hours),
      notes: bidForm.notes.trim() || null,
    };
    try {
      if (editingBidId) {
        const bid = await api.put(`/tenders/${selectedTender.id}/bids/${editingBidId}`, payload);
        setMyBids((current) => current.map((existing) => (existing.id === editingBidId ? bid : existing)));
      } else {
        const bid = await api.post(`/tenders/${selectedTender.id}/bids`, payload);
        setMyBids((current) => [...current, bid]);
      }
      setShowBidModal(false);
      setEditingBidId(null);
    } catch (err) {
      setBidError(err instanceof ApiError ? err.message : "Could not save your bid.");
    } finally {
      setBidSubmitting(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <AgentMemberSidebar />

      <main className="min-h-screen pt-[68px] lg:ml-[270px] lg:pt-0">
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Agency Member Workspace
            </p>
            <h1 className="text-base font-bold text-slate-800">Agent Marketplace</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              aria-label="Refresh marketplace"
            >
              <ArrowsClockwise size={17} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/agent-notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h2 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
                  Find New Import Requests
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Browse open shipment requests from SMEs and submit competitive bids
                  for customs clearance services.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <Package size={18} className="text-[#2563EB]" />
                <div>
                  <p className="text-xs text-slate-400">Open Requests</p>
                  <p className="text-lg font-bold text-slate-800">{filteredTenders.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="relative">
              <MagnifyingGlass
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by product, HS code, origin or port..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]"
                aria-label="Loading"
              />
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <Warning size={26} className="text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">{loadError}</p>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-[#173563] px-4 text-[13px] font-semibold text-white transition hover:bg-[#214777]"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTenders.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Package size={25} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-800">No open requests</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Check back later, or try a different search.
                  </p>
                </div>
              ) : (
                filteredTenders.map((tender) => {
                  const urgency = urgencyBadge(tender.mustReleaseBy);
                  const existingBid = myBidByTender.get(tender.id);
                  const alreadyBid = Boolean(existingBid);

                  return (
                    <div
                      key={tender.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm sm:p-6"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {tender.targetAgencyId && (
                              <span className="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-[12px] font-semibold text-purple-700">
                                Direct Request
                              </span>
                            )}
                            {urgency && (
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[12px] font-semibold ${urgency.style}`}
                              >
                                {urgency.label}
                              </span>
                            )}
                            <span className="text-xs font-medium text-slate-400">
                              Posted {timeAgo(tender.postedAt)}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-slate-900">
                              {tender.description || "Shipment request"}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {tender.hsCode ? (
                                <>HS Code: <span className="font-medium text-slate-700">{tender.hsCode}</span></>
                              ) : (
                                <span className="font-medium text-slate-700">No HS code provided</span>
                              )}
                            </p>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <MapPin size={15} />
                              </div>
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                  Route
                                </p>
                                <p className="text-xs font-semibold text-slate-700">
                                  {tender.origin || "-"} → {tender.port || "-"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <CurrencyDollar size={15} />
                              </div>
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                  CIF Value
                                </p>
                                <p className="text-xs font-semibold text-slate-700">
                                  USD {formatCurrency(tender.declaredValue)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <Clock size={15} />
                              </div>
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                  Must release by
                                </p>
                                <p className="text-xs font-semibold text-slate-700">
                                  {tender.mustReleaseBy || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">
                          <button
                            type="button"
                            onClick={() => openTender(tender)}
                            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Details
                            <CaretRight size={16} />
                          </button>

                          {alreadyBid ? (
                            existingBid.status === "pending" ? (
                              <button
                                type="button"
                                onClick={() => openBidForm(tender, existingBid)}
                                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                              >
                                <CheckCircle size={17} />
                                Edit Your Bid
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-50 px-5 text-sm font-semibold text-slate-500"
                              >
                                <CheckCircle size={17} />
                                {existingBid.status === "accepted" ? "Bid Accepted" : "Bid Not Selected"}
                              </button>
                            )
                          ) : (
                            <button
                              type="button"
                              onClick={() => openBidForm(tender)}
                              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                            >
                              {tender.targetAgencyId ? "Submit Pitch" : "Submit Bid"}
                              <PaperPlaneTilt size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                <PaperPlaneTilt size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#173563]">How bidding works</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Review SME import requirements, submit your best clearance fee and
                  timeline, then wait for the SME to compare bids and select an agent.
                  {!user?.profileComplete && (
                    <span className="mt-2 block font-semibold text-amber-700">
                      Note: your agent profile looks incomplete -- bidding may be
                      blocked until it's finished in Settings.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedTender && !showBidModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-medium text-slate-400">{selectedTender.id}</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedTender.description || "Shipment request"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTender(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">HS Code</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedTender.hsCode || "Not provided"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">CIF Value</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    USD {formatCurrency(selectedTender.declaredValue)}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Origin</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{selectedTender.origin || "-"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Destination</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{selectedTender.port || "-"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Estimated arrival</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedTender.estimatedArrival || "-"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Must release by</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedTender.mustReleaseBy || "-"}
                  </p>
                </div>
              </div>

              {selectedTender.requiredPermits?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Required permits
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTender.requiredPermits.map((permit) => (
                      <span
                        key={permit}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-[13px] font-semibold text-[#2563EB]"
                      >
                        {permit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTender(null)}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

                {myBidByTender.get(selectedTender.id)?.status === "pending" ? (
                  <button
                    type="button"
                    onClick={() => openBidForm(selectedTender, myBidByTender.get(selectedTender.id))}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    <CheckCircle size={17} />
                    Edit Your Bid
                  </button>
                ) : hasAgentBid(selectedTender.id) ? (
                  <button
                    type="button"
                    disabled
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-50 px-5 text-sm font-semibold text-slate-500"
                  >
                    <CheckCircle size={17} />
                    Bid Already Submitted
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openBidForm(selectedTender)}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-sm font-semibold text-white hover:bg-[#10294d]"
                  >
                    {selectedTender.targetAgencyId ? "Submit Pitch" : "Submit Bid"}
                    <PaperPlaneTilt size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showBidModal && selectedTender && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  {selectedTender.targetAgencyId
                    ? editingBidId ? "Update Your Pitch" : "Submit Your Pitch"
                    : editingBidId ? "Update Your Bid" : "Submit Your Bid"}
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {selectedTender.description || "Shipment request"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeBidModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={submitBid} className="space-y-5 p-6">
              {bidError && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
                  <Warning size={16} />
                  {bidError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Your Clearance Fee (LKR)
                </label>
                <div className="relative">
                  <CurrencyDollar
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bidForm.feeLkr}
                    onChange={(event) => setBidForm({ ...bidForm, feeLkr: event.target.value })}
                    placeholder="Enter your bid amount"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estimated Clearance Time (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={bidForm.clearanceHours}
                  onChange={(event) => setBidForm({ ...bidForm, clearanceHours: event.target.value })}
                  placeholder="e.g. 48 (for 2 days)"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message to SME
                </label>
                <textarea
                  rows={4}
                  value={bidForm.notes}
                  onChange={(event) => setBidForm({ ...bidForm, notes: event.target.value })}
                  placeholder="Explain why the SME should choose your agency..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs leading-5 text-slate-600">
                  Your bid will be sent to the SME for review. Make sure your price
                  and clearance time estimate are accurate before submitting.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeBidModal}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bidSubmitting}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bidSubmitting
                    ? "Saving..."
                    : selectedTender.targetAgencyId
                      ? editingBidId ? "Update Pitch" : "Submit Pitch"
                      : editingBidId ? "Update Bid" : "Submit Bid"}
                  <PaperPlaneTilt size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentMarketplace;
