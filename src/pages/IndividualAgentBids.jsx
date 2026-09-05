import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Package,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import IndividualAgentSidebar from "../components/IndividualAgentSidebar";

function IndividualAgentBids() {
  const navigate = useNavigate();
  const location = useLocation();

  const [agent, setAgent] = useState(null);
  const [bids, setBids] = useState([]);

  const [selectedRequest, setSelectedRequest] = useState(
    location.state?.request || null
  );

  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedAgent = localStorage.getItem("clearingAgent");

    if (savedAgent) {
      try {
        setAgent(JSON.parse(savedAgent));
      } catch {
        setAgent(null);
      }
    }

    const savedBids = localStorage.getItem("individualAgentBids");

    if (savedBids) {
      try {
        const parsedBids = JSON.parse(savedBids);

        if (Array.isArray(parsedBids)) {
          setBids(parsedBids);
        }
      } catch {
        setBids([]);
      }
    }
  }, []);

  const displayName =
    agent?.fullName ||
    agent?.name ||
    localStorage.getItem("agentName") ||
    "Individual Agent";

  const handleLogout = () => {
    localStorage.removeItem("agentType");
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem("agentAuthenticated");
    localStorage.removeItem("agentLoggedIn");
    localStorage.removeItem("rememberAgent");

    navigate("/agent-signin");
  };

  const handleSubmitBid = (event) => {
    event.preventDefault();

    if (!selectedRequest) {
      return;
    }

    if (!bidAmount || !estimatedDays) {
      return;
    }

    const newBid = {
      id: `BID-${Date.now()}`,
      requestId: selectedRequest.id,
      product: selectedRequest.product,
      category: selectedRequest.category,
      destination: selectedRequest.destination,
      requestValue: selectedRequest.value,
      bidAmount,
      estimatedDays,
      message,
      status: "Pending",
      submittedAt: new Date().toLocaleDateString(),
    };

    const updatedBids = [newBid, ...bids];

    setBids(updatedBids);

    localStorage.setItem(
      "individualAgentBids",
      JSON.stringify(updatedBids)
    );

    setBidAmount("");
    setEstimatedDays("");
    setMessage("");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const pendingBids = useMemo(
    () => bids.filter((bid) => bid.status === "Pending"),
    [bids]
  );

  const acceptedBids = useMemo(
    () => bids.filter((bid) => bid.status === "Accepted"),
    [bids]
  );

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">
      {/* =====================================================
          SHARED INDIVIDUAL AGENT SIDEBAR
      ===================================================== */}
      <IndividualAgentSidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="min-h-screen lg:ml-[260px]">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Individual Agent Workspace
              </p>

              <h2 className="mt-0.5 text-base font-bold text-slate-800">
                My Bids
              </h2>
            </div>
          </div>

          {/* Header Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              title="Refresh"
              onClick={() => window.location.reload()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              <RefreshCw size={17} />
            </button>

            <button
              type="button"
              title="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            </button>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          {/* Heading */}
          <section className="mb-7">
            <p className="text-sm font-semibold text-[#2563EB]">
              Manage your opportunities
            </p>

            <h1 className="mt-1 text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
              My Bids
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Submit bids for SME requests and keep track of your submitted
              clearing service proposals.
            </p>
          </section>

          {/* =====================================================
              STATS
          ===================================================== */}
          <section className="grid gap-4 sm:grid-cols-3">
            <BidStat
              icon={<FileText size={19} />}
              label="Total Bids"
              value={bids.length}
            />

            <BidStat
              icon={<Clock3 size={19} />}
              label="Pending"
              value={pendingBids.length}
            />

            <BidStat
              icon={<CheckCircle2 size={19} />}
              label="Accepted"
              value={acceptedBids.length}
            />
          </section>

          {/* =====================================================
              SUCCESS MESSAGE
          ===================================================== */}
          {showSuccess && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-green-600">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-green-700">
                  Bid submitted successfully
                </p>

                <p className="mt-0.5 text-xs text-green-600">
                  Your bid has been saved and is now pending SME review.
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              SUBMIT BID
          ===================================================== */}
          {selectedRequest && (
            <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              {/* Header */}
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-500">
                      Submit New Bid
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-[#173563]">
                      {selectedRequest.product}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      {selectedRequest.id} •{" "}
                      {selectedRequest.destination ||
                        "Destination not specified"}
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

              {/* Request Summary */}
              <div className="grid gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-5 sm:grid-cols-3 sm:px-6">
                <SummaryItem
                  label="Category"
                  value={selectedRequest.category || "Not specified"}
                />

                <SummaryItem
                  label="Import Value"
                  value={selectedRequest.value || "Not specified"}
                />

                <SummaryItem
                  label="Destination"
                  value={selectedRequest.destination || "Not specified"}
                />
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmitBid}
                className="px-5 py-6 sm:px-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Bid Amount */}
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
                        value={bidAmount}
                        onChange={(event) =>
                          setBidAmount(event.target.value)
                        }
                        placeholder="Enter your service fee"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-4 text-sm text-[#173563] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Enter the clearing service fee you are proposing.
                    </p>
                  </div>

                  {/* Estimated Completion */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Estimated Completion
                    </label>

                    <div className="relative">
                      <Clock3
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="number"
                        min="1"
                        value={estimatedDays}
                        onChange={(event) =>
                          setEstimatedDays(event.target.value)
                        }
                        placeholder="Number of days"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-16 text-sm text-[#173563] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        days
                      </span>
                    </div>

                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Estimated time required to complete clearance.
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Message to SME
                  </label>

                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    rows={5}
                    placeholder="Explain your experience, proposed service, estimated process, or any other information useful to the SME..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-[#173563] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Keep your message clear and professional.
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                  >
                    Submit Bid
                    <ChevronRight size={15} />
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* =====================================================
              NO REQUEST SELECTED
          ===================================================== */}
          {!selectedRequest && (
            <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                    <Search size={20} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-[#173563]">
                      Looking for a new opportunity?
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Browse available SME requests and choose a request
                      that matches your clearing services.
                    </p>
                  </div>
                </div>

                <Link
                  to="/individual-agent-requests"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  Browse Requests
                  <ChevronRight size={15} />
                </Link>
              </div>
            </section>
          )}

          {/* =====================================================
              BID HISTORY
          ===================================================== */}
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-base font-bold text-[#173563]">
                  Bid History
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Review the bids you have submitted to SMEs.
                </p>
              </div>
            </div>

            {bids.length > 0 ? (
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

                <h3 className="mt-4 text-sm font-bold text-[#173563]">
                  No bids submitted yet
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                  Your submitted bids will appear here once you respond to
                  an SME import request.
                </p>

                <Link
                  to="/individual-agent-requests"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  Browse SME Requests
                  <ChevronRight size={15} />
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   BID STAT
============================================================ */
function BidStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-[#173563]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   SUMMARY ITEM
============================================================ */
function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3">
      <p className="text-[10px] font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-[#173563]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   BID ROW
============================================================ */
function BidRow({ bid }) {
  const statusStyles = {
    Pending: "bg-amber-50 text-amber-600",
    Accepted: "bg-green-50 text-green-600",
    Rejected: "bg-red-50 text-red-500",
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 transition hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <FileText size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-bold text-[#173563]">
              {bid.product}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                statusStyles[bid.status] ||
                "bg-slate-100 text-slate-500"
              }`}
            >
              {bid.status}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            {bid.id} • Request {bid.requestId}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Submitted {bid.submittedAt}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <div>
          <p className="text-[10px] text-slate-400">
            Your Bid
          </p>

          <p className="mt-0.5 text-sm font-bold text-[#173563]">
            LKR {Number(bid.bidAmount).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400">
            Completion
          </p>

          <p className="mt-0.5 text-sm font-semibold text-[#173563]">
            {bid.estimatedDays} days
          </p>
        </div>
      </div>
    </div>
  );
}

export default IndividualAgentBids;