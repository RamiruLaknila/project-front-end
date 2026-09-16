import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  CaretRight,
  Clock,
  FileText,
  ArrowsClockwise,
  MagnifyingGlass,
  Warning,
  X,
} from "@phosphor-icons/react";
import IndividualAgentSidebar from "../components/IndividualAgentSidebar";
import { api, ApiError } from "../lib/api";

function IndividualAgentBids() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedRequest, setSelectedRequest] = useState(location.state?.request || null);
  const [forceEdit, setForceEdit] = useState(false);

  const [feeLkr, setFeeLkr] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [message, setMessage] = useState("");
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidError, setBidError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const existingBid = selectedRequest
    ? bids.find((bid) => bid.tenderId === selectedRequest.id)
    : null;
  const isEditing = Boolean(existingBid) && forceEdit;
  const showForm = !existingBid || forceEdit;

  const startEdit = () => {
    if (!existingBid) return;
    setFeeLkr(String(existingBid.feeLkr ?? ""));
    setEstimatedDays(String(Math.round((existingBid.clearanceTimelineHours || 0) / 24) || ""));
    setMessage(existingBid.notes || "");
    setBidError("");
    setForceEdit(true);
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.get("/bids/mine");
        if (active) setBids(data);
      } catch (err) {
        if (active) {
          setLoadError(
            err instanceof ApiError ? err.message : "Could not load your bids. Is the backend running?"
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

  const loadBids = () => {
    setLoading(true);
    setLoadError("");
    setReloadKey((key) => key + 1);
  };

  const handleSubmitBid = async (event) => {
    event.preventDefault();
    if (!selectedRequest) return;

    const fee = Number(feeLkr);
    const days = Number(estimatedDays);
    if (!fee || fee <= 0) {
      setBidError("Enter a valid bid amount.");
      return;
    }
    if (!days || days <= 0) {
      setBidError("Enter a valid number of days.");
      return;
    }

    setBidSubmitting(true);
    setBidError("");
    const payload = {
      feeLkr: fee,
      clearanceTimelineHours: Math.round(days * 24),
      notes: message.trim() || null,
    };
    try {
      if (isEditing) {
        const bid = await api.put(`/tenders/${selectedRequest.id}/bids/${existingBid.id}`, payload);
        setBids((current) => current.map((b) => (b.id === existingBid.id ? bid : b)));
      } else {
        const bid = await api.post(`/tenders/${selectedRequest.id}/bids`, payload);
        setBids((current) => [bid, ...current]);
      }
      setFeeLkr("");
      setEstimatedDays("");
      setMessage("");
      setForceEdit(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setBidError(err instanceof ApiError ? err.message : "Could not save your bid.");
    } finally {
      setBidSubmitting(false);
    }
  };

  const pendingBids = useMemo(() => bids.filter((bid) => bid.status === "pending"), [bids]);
  const acceptedBids = useMemo(() => bids.filter((bid) => bid.status === "accepted"), [bids]);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">
      <IndividualAgentSidebar />

      <main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0">
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Individual Agent Workspace
            </p>
            <h2 className="mt-0.5 text-base font-bold text-slate-800">My Bids</h2>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              title="Refresh"
              onClick={loadBids}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              <ArrowsClockwise size={17} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/individual-agent-notifications")}
              title="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              <Bell size={17} />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          <section className="mb-7">
            <h1 className="mt-1 text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
              My Bids
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
              Submit bids for SME requests and keep track of your submitted
              clearing service proposals.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <BidStat icon={<FileText size={19} />} label="Total Bids" value={bids.length} />
            <BidStat icon={<Clock size={19} />} label="Pending" value={pendingBids.length} />
            <BidStat icon={<CheckCircle size={19} />} label="Accepted" value={acceptedBids.length} />
          </section>

          {showSuccess && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-green-600">
                <CheckCircle size={19} />
              </div>
              <div>
                <p className="text-sm font-bold text-green-700">Bid submitted successfully</p>
                <p className="mt-0.5 text-xs text-green-600">
                  Your bid has been sent and is now pending SME review.
                </p>
              </div>
            </div>
          )}

          {selectedRequest && (
            <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-500">
                      {selectedRequest.targetAgencyId ? "Send Your Pitch" : "Submit New Bid"}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-[#173563]">
                      {selectedRequest.description || "Shipment request"}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedRequest.hsCode ? `HS Code ${selectedRequest.hsCode}` : "No HS code provided"} •{" "}
                      {selectedRequest.port || "Destination not specified"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-5 sm:grid-cols-3 sm:px-6">
                <SummaryItem label="Origin" value={selectedRequest.origin || "Not specified"} />
                <SummaryItem
                  label="CIF Value"
                  value={`USD ${Number(selectedRequest.declaredValue || 0).toLocaleString()}`}
                />
                <SummaryItem label="Destination" value={selectedRequest.port || "Not specified"} />
              </div>

              {showForm ? (
              <form onSubmit={handleSubmitBid} className="px-5 py-6 sm:px-6">
                {bidError && (
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
                    <Warning size={16} />
                    {bidError}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Your Bid Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        LKR
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={feeLkr}
                        onChange={(event) => setFeeLkr(event.target.value)}
                        placeholder="Enter your service fee"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-4 text-sm text-[#173563] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <p className="mt-1.5 text-[12px] text-slate-400">
                      Enter the clearing service fee you are proposing.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Estimated Completion
                    </label>
                    <div className="relative">
                      <Clock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="number"
                        min="1"
                        value={estimatedDays}
                        onChange={(event) => setEstimatedDays(event.target.value)}
                        placeholder="Number of days"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-16 text-sm text-[#173563] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        days
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12px] text-slate-400">
                      Estimated time required to complete clearance.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Message to SME
                  </label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={5}
                    placeholder="Explain your experience, proposed service, estimated process, or any other information useful to the SME..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-[#173563] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1.5 text-[12px] text-slate-400">
                    Keep your message clear and professional.
                  </p>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => (isEditing ? setForceEdit(false) : setSelectedRequest(null))}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bidSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {bidSubmitting
                      ? "Saving..."
                      : selectedRequest.targetAgencyId
                        ? isEditing ? "Update Pitch" : "Send Pitch"
                        : isEditing ? "Update Bid" : "Submit Bid"}
                    <CaretRight size={15} />
                  </button>
                </div>
              </form>
              ) : (
                <div className="px-5 py-6 sm:px-6">
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">Your Bid Amount</span>
                      <span className="text-sm font-bold text-[#173563]">
                        Rs. {Number(existingBid.feeLkr || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">Estimated Completion</span>
                      <span className="text-sm font-bold text-[#173563]">
                        {existingBid.clearanceTimelineHours} hours
                      </span>
                    </div>
                    {existingBid.notes && (
                      <div>
                        <span className="text-xs font-medium text-slate-500">Message to SME</span>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{existingBid.notes}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-medium text-slate-500">Status</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          existingBid.status === "accepted"
                            ? "bg-green-50 text-green-600"
                            : existingBid.status === "rejected"
                              ? "bg-red-50 text-red-500"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {existingBid.status === "accepted"
                          ? "Accepted"
                          : existingBid.status === "rejected"
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    </div>
                  </div>

                  {existingBid.status === "pending" && (
                    <button
                      type="button"
                      onClick={startEdit}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#173563] transition hover:bg-slate-50"
                    >
                      {selectedRequest.targetAgencyId ? "Edit Pitch" : "Edit Bid"}
                      <CaretRight size={15} />
                    </button>
                  )}
                </div>
              )}
            </section>
          )}

          {!selectedRequest && (
            <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                    <MagnifyingGlass size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#173563]">Looking for a new opportunity?</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Browse available SME requests and choose a request that matches
                      your clearing services.
                    </p>
                  </div>
                </div>
                <Link
                  to="/individual-agent-requests"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  Browse Requests
                  <CaretRight size={15} />
                </Link>
              </div>
            </section>
          )}

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-base font-bold text-[#173563]">Bid History</h2>
                <p className="mt-1 text-xs text-slate-400">Review the bids you have submitted to SMEs.</p>
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
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                <Warning size={22} className="text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">{loadError}</p>
                <button
                  type="button"
                  onClick={loadBids}
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-[#173563] px-4 text-[13px] font-semibold text-white transition hover:bg-[#10294d]"
                >
                  Try again
                </button>
              </div>
            ) : bids.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                {bids.map((bid) => (
                  <BidRow key={bid.id} bid={bid} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <FileText size={20} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#173563]">No bids submitted yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                  Your submitted bids will appear here once you respond to an SME
                  import request.
                </p>
                <Link
                  to="/individual-agent-requests"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  Browse SME Requests
                  <CaretRight size={15} />
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function BidStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
        {icon}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-[#173563]">{value}</p>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="mt-1 truncate text-xs font-semibold text-[#173563]">{value}</p>
    </div>
  );
}

function BidRow({ bid }) {
  const statusStyles = {
    pending: "bg-amber-50 text-amber-600",
    accepted: "bg-green-50 text-green-600",
    rejected: "bg-red-50 text-red-500",
  };

  const statusLabel = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 transition hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <FileText size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-bold text-[#173563]">Tender {bid.tenderId}</h3>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                statusStyles[bid.status] || "bg-slate-100 text-slate-500"
              }`}
            >
              {statusLabel[bid.status] || bid.status}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-slate-400">
            Clearance time: {bid.clearanceTimelineHours} hours
          </p>
          <p className="mt-1 text-[12px] text-slate-400">
            Submitted {bid.submittedAt ? new Date(bid.submittedAt).toLocaleDateString() : "-"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <div>
          <p className="text-[11px] text-slate-400">Your Bid</p>
          <p className="text-sm font-bold text-[#173563]">Rs. {Number(bid.feeLkr || 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default IndividualAgentBids;
