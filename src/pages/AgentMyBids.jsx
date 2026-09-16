import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  Clock,
  CurrencyDollar,
  FileText,
  Package,
  ArrowsClockwise,
  MagnifyingGlass,
  Warning,
  X,
} from "@phosphor-icons/react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";
import { api, ApiError } from "../lib/api";

function AgentMyBids() {
  const navigate = useNavigate();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editFee, setEditFee] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

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

  const openBidDetails = (bid) => {
    setSelectedBid(bid);
    setShowDetails(true);
    setEditing(false);
    setEditError("");
  };

  const closeBidDetails = () => {
    setShowDetails(false);
    setSelectedBid(null);
    setEditing(false);
  };

  const startEdit = () => {
    if (!selectedBid) return;
    setEditFee(String(selectedBid.feeLkr ?? ""));
    setEditHours(String(selectedBid.clearanceTimelineHours ?? ""));
    setEditNotes(selectedBid.notes || "");
    setEditError("");
    setEditing(true);
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!selectedBid) return;

    const fee = Number(editFee);
    const hours = Number(editHours);
    if (!fee || fee <= 0) {
      setEditError("Enter a valid clearance fee.");
      return;
    }
    if (!hours || hours <= 0) {
      setEditError("Enter a valid clearance time in hours.");
      return;
    }

    setEditSubmitting(true);
    setEditError("");
    try {
      const updated = await api.put(`/tenders/${selectedBid.tenderId}/bids/${selectedBid.id}`, {
        feeLkr: fee,
        clearanceTimelineHours: Math.round(hours),
        notes: editNotes.trim() || null,
      });
      setBids((current) => current.map((bid) => (bid.id === updated.id ? updated : bid)));
      setSelectedBid(updated);
      setEditing(false);
    } catch (err) {
      setEditError(err instanceof ApiError ? err.message : "Could not update your bid.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const statusLabel = (status) => {
    if (status === "accepted") return "Accepted";
    if (status === "rejected") return "Rejected";
    return "Pending";
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle size={15} />;
      case "rejected":
        return <X size={15} />;
      default:
        return <Clock size={15} />;
    }
  };

  const goToRequests = () => navigate("/agent-marketplace");
  const goToShipments = () => navigate("/agent-shipments");

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AgentMemberSidebar />

      <main className="min-h-screen pt-[68px] lg:ml-[270px] lg:pt-0">
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Agency Member Workspace
            </p>
            <p className="text-base font-bold text-slate-800">My Bids</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={loadBids}
              title="Refresh bids"
              className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <ArrowsClockwise size={18} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/agent-notifications")}
              title="Notifications"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Bell size={19} />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          <section className="mb-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
                  My Bids
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[16px]">
                  Track quotations submitted to SME import requests and manage your
                  active bids.
                </p>
              </div>
            </div>
          </section>

          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <FileText size={19} />
                </div>
                <span className="text-xs font-medium text-slate-400">Total</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{bids.length}</div>
              <div className="mt-1 text-xs text-slate-500">Submitted bids</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock size={19} />
                </div>
                <span className="text-xs font-medium text-slate-400">Pending</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {bids.filter((bid) => bid.status === "pending").length}
              </div>
              <div className="mt-1 text-xs text-slate-500">Awaiting SME response</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle size={19} />
                </div>
                <span className="text-xs font-medium text-slate-400">Accepted</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {bids.filter((bid) => bid.status === "accepted").length}
              </div>
              <div className="mt-1 text-xs text-slate-500">Successful bids</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <CurrencyDollar size={19} />
                </div>
                <span className="text-xs font-medium text-slate-400">Value</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                Rs. {bids.reduce((total, bid) => total + Number(bid.feeLkr || 0), 0).toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-500">Total quoted value</div>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">Submitted Quotations</h2>
                <p className="mt-1 text-xs text-slate-500">Review and manage your submitted bids.</p>
              </div>
              <button
                type="button"
                onClick={goToRequests}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d]"
              >
                Browse SME Requests
                <ArrowRight size={16} />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center px-6 py-16">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]"
                  aria-label="Loading"
                />
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <Warning size={26} className="text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">{loadError}</p>
                <button
                  type="button"
                  onClick={loadBids}
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-[#173563] px-4 text-[13px] font-semibold text-white transition hover:bg-[#214777]"
                >
                  Try again
                </button>
              </div>
            ) : bids.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CurrencyDollar size={22} />
                </div>
                <h3 className="text-base font-semibold text-slate-800">No bids yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  You have not submitted any quotations yet. Browse available SME
                  requests and submit your first bid.
                </p>
                <button
                  type="button"
                  onClick={goToRequests}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#10294d]"
                >
                  Find SME Requests
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bids.map((bid) => (
                  <div key={bid.id} className="p-5 transition hover:bg-slate-50 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                            Tender {bid.tenderId}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                              bid.status
                            )}`}
                          >
                            {getStatusIcon(bid.status)}
                            {statusLabel(bid.status)}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-800">
                          Clearance timeline: {bid.clearanceTimelineHours} hours
                        </h3>
                        {bid.notes && <p className="mt-1 text-sm text-slate-500">{bid.notes}</p>}

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                          <span>
                            Submitted:{" "}
                            <span className="font-medium text-slate-700">
                              {bid.submittedAt ? new Date(bid.submittedAt).toLocaleString() : "-"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <div className="text-lg font-bold text-[#173563]">
                          Rs. {Number(bid.feeLkr || 0).toLocaleString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => openBidDetails(bid)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB]"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={goToRequests}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <MagnifyingGlass size={19} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">SME Requests</h3>
                  <p className="mt-1 text-xs text-slate-500">Find new import opportunities.</p>
                </div>
                <ArrowRight
                  size={17}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2563EB]"
                />
              </div>
            </button>

            <button
              type="button"
              onClick={goToShipments}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Package size={19} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Shipments</h3>
                  <p className="mt-1 text-xs text-slate-500">Track your active shipments.</p>
                </div>
                <ArrowRight
                  size={17}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2563EB]"
                />
              </div>
            </button>
          </section>

          <div className="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            ImportEase · Agency Member Platform
          </div>
        </div>
      </main>

      {showDetails && selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#173563]">Bid Details</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Bid {selectedBid.id} · Tender {selectedBid.tenderId}
                </p>
              </div>
              <button
                type="button"
                onClick={closeBidDetails}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {editing ? (
              <form onSubmit={saveEdit} className="space-y-5 px-5 py-6 sm:px-6">
                {editError && (
                  <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
                    <Warning size={16} />
                    {editError}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Clearance Fee (LKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFee}
                      onChange={(event) => setEditFee(event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Clearance Time (hours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={editHours}
                      onChange={(event) => setEditHours(event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Message to SME
                  </label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(event) => setEditNotes(event.target.value)}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-sm font-semibold text-white transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-5 px-5 py-6 sm:px-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs font-medium text-slate-400">Clearance Fee</div>
                      <div className="mt-1 text-lg font-bold text-[#173563]">
                        Rs. {Number(selectedBid.feeLkr).toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs font-medium text-slate-400">Clearance Time</div>
                      <div className="mt-1 text-sm font-bold text-slate-800">
                        {selectedBid.clearanceTimelineHours} hours
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs font-medium text-slate-400">Status</div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                            selectedBid.status
                          )}`}
                        >
                          {getStatusIcon(selectedBid.status)}
                          {statusLabel(selectedBid.status)}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs font-medium text-slate-400">Submitted</div>
                      <div className="mt-1 text-sm font-semibold text-slate-700">
                        {selectedBid.submittedAt ? new Date(selectedBid.submittedAt).toLocaleString() : "-"}
                      </div>
                    </div>
                  </div>

                  {selectedBid.notes && (
                    <div>
                      <div className="mb-2 text-sm font-semibold text-slate-800">Your Notes</div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                        {selectedBid.notes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                  <button
                    type="button"
                    onClick={closeBidDetails}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                  {selectedBid.status === "pending" && (
                    <button
                      type="button"
                      onClick={startEdit}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#173563] transition hover:bg-slate-50"
                    >
                      Edit Bid
                    </button>
                  )}
                  {selectedBid.status === "accepted" && (
                    <button
                      type="button"
                      onClick={() => {
                        closeBidDetails();
                        navigate("/agent-shipments");
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10294d]"
                    >
                      View Shipment
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentMyBids;
