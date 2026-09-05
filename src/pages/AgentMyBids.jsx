import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Package,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";

function AgentMyBids() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const storedAgent = localStorage.getItem("clearingAgent");

    if (!storedAgent) {
      navigate("/agent-signin", { replace: true });
      return;
    }

    try {
      const parsedAgent = JSON.parse(storedAgent);

      if (parsedAgent.agentType !== "agency-member") {
        navigate("/agent-signin", { replace: true });
        return;
      }

      setAgent(parsedAgent);
    } catch (error) {
      console.error("Failed to load agent:", error);
      navigate("/agent-signin", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = () => {
    const savedBids = localStorage.getItem("agentBids");

    if (savedBids) {
      try {
        setBids(JSON.parse(savedBids));
      } catch (error) {
        console.error("Failed to load bids:", error);
        setBids([]);
      }
    } else {
      setBids([
        {
          id: "BID-001",
          shipmentId: "IMP-1001",
          company: "TechWorld Imports",
          product: "Electronic Components",
          amount: 85000,
          status: "Pending",
          submittedAt: "Today, 10:30 AM",
          validUntil: "Sep 10, 2026",
          notes:
            "Quotation includes customs clearance, documentation handling and delivery coordination.",
        },
        {
          id: "BID-002",
          shipmentId: "IMP-1002",
          company: "Lanka Home Supplies",
          product: "Household Appliances",
          amount: 62000,
          status: "Accepted",
          submittedAt: "Yesterday, 3:15 PM",
          validUntil: "Sep 08, 2026",
          notes:
            "Full clearance service including customs documentation and shipment coordination.",
        },
        {
          id: "BID-003",
          shipmentId: "IMP-1003",
          company: "Island Textiles",
          product: "Textile Materials",
          amount: 48000,
          status: "Rejected",
          submittedAt: "Sep 2, 2026",
          validUntil: "Sep 06, 2026",
          notes:
            "Quotation submitted for standard import clearance and documentation services.",
        },
      ]);
    }
  };

  const openBidDetails = (bid) => {
    setSelectedBid(bid);
    setShowDetails(true);
  };

  const closeBidDetails = () => {
    setShowDetails(false);
    setSelectedBid(null);
  };

  const agentName = agent?.fullName || "Agency Member";

  const getStatusStyles = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "Pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle2 size={15} />;

      case "Rejected":
        return <X size={15} />;

      case "Pending":
      default:
        return <Clock3 size={15} />;
    }
  };

  const goToDashboard = () => {
    navigate("/agent-dashboard");
  };

  const goToRequests = () => {
    navigate("/agent-requests");
  };

  const goToMyBids = () => {
    navigate("/agent-my-bids");
  };

  const goToShipments = () => {
    navigate("/agent-shipments");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AgentMemberSidebar />

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <main className="min-h-screen lg:ml-[270px]">
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agency Member Workspace
              </p>

              <p className="text-base font-bold text-slate-800">
                My Bids
              </p>
            </div>
          </div>

          {/* HEADER ACTIONS */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={loadBids}
              title="Refresh bids"
              className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <RefreshCw size={18} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              title="Notifications"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Bell size={19} strokeWidth={1.8} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2563EB]" />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          {/* PAGE HEADING */}
          <section className="mb-7">
            <div className="mb-2 flex items-center gap-2">
              
             
            </div>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                  My Bids
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Track quotations submitted to SME import requests and manage
                  your active bids.
                </p>
              </div>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* TOTAL */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <FileText size={19} strokeWidth={1.8} />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Total
                </span>
              </div>

              <div className="text-2xl font-bold text-slate-800">
                {bids.length}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Submitted bids
              </div>
            </div>

            {/* PENDING */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock3 size={19} strokeWidth={1.8} />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Pending
                </span>
              </div>

              <div className="text-2xl font-bold text-slate-800">
                {bids.filter((bid) => bid.status === "Pending").length}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Awaiting SME response
              </div>
            </div>

            {/* ACCEPTED */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={19} strokeWidth={1.8} />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Accepted
                </span>
              </div>

              <div className="text-2xl font-bold text-slate-800">
                {bids.filter((bid) => bid.status === "Accepted").length}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Successful bids
              </div>
            </div>

            {/* TOTAL VALUE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <DollarSign size={19} strokeWidth={1.8} />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Value
                </span>
              </div>

              <div className="text-2xl font-bold text-slate-800">
                Rs.{" "}
                {bids
                  .reduce(
                    (total, bid) => total + Number(bid.amount || 0),
                    0
                  )
                  .toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Total quoted value
              </div>
            </div>
          </div>

          {/* BID LIST */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Submitted Quotations
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Review and manage your submitted bids.
                </p>
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

            {bids.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <DollarSign size={22} strokeWidth={1.8} />
                </div>

                <h3 className="text-base font-semibold text-slate-800">
                  No bids yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  You have not submitted any quotations yet. Browse available
                  SME requests and submit your first bid.
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
                  <div
                    key={bid.id}
                    className="p-5 transition hover:bg-slate-50 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        {/* BADGES */}
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {bid.id}
                          </span>

                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                            {bid.shipmentId}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                              bid.status
                            )}`}
                          >
                            {getStatusIcon(bid.status)}
                            {bid.status}
                          </span>
                        </div>

                        {/* COMPANY */}
                        <h3 className="text-base font-bold text-slate-800">
                          {bid.company}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {bid.product}
                        </p>

                        {/* DATE INFO */}
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                          <span>
                            Submitted:{" "}
                            <span className="font-medium text-slate-700">
                              {bid.submittedAt}
                            </span>
                          </span>

                          <span>
                            Valid until:{" "}
                            <span className="font-medium text-slate-700">
                              {bid.validUntil}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* BID VALUE */}
                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <div className="text-lg font-bold text-[#173563]">
                          Rs. {Number(bid.amount).toLocaleString()}
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

          {/* QUICK NAVIGATION */}
          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* REQUESTS */}
            <button
              type="button"
              onClick={goToRequests}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Search size={19} strokeWidth={1.8} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    SME Requests
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Find new import opportunities.
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2563EB]"
                />
              </div>
            </button>

            {/* MY BIDS */}
            <button
              type="button"
              onClick={goToMyBids}
              className="group rounded-2xl border border-blue-200 bg-blue-50/50 p-5 text-left shadow-[0_2px_10px_rgba(15,23,42,.02)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2563EB]">
                <DollarSign size={19} strokeWidth={1.8} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    My Bids
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your submitted quotations.
                  </p>
                </div>

                <ArrowRight size={17} className="text-[#2563EB]" />
              </div>
            </button>

            {/* SHIPMENTS */}
            <button
              type="button"
              onClick={goToShipments}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Package size={19} strokeWidth={1.8} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Shipments
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Track your active shipments.
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#2563EB]"
                />
              </div>
            </button>
          </section>

          {/* FOOTER */}
          <div className="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            ImportEase · Agency Member Platform
          </div>
        </div>
      </main>

      {/* =========================================================
          BID DETAILS MODAL
      ========================================================= */}
      {showDetails && selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#173563]">
                  Agency Member Quotation
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedBid.id} · {selectedBid.shipmentId}
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

            {/* MODAL CONTENT */}
            <div className="space-y-5 px-5 py-6 sm:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* COMPANY */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-400">
                    SME / Company
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBid.company}
                  </div>
                </div>

                {/* PRODUCT */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-400">
                    Product
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {selectedBid.product}
                  </div>
                </div>

                {/* QUOTATION */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-400">
                    Quotation
                  </div>

                  <div className="mt-1 text-lg font-bold text-[#173563]">
                    Rs. {Number(selectedBid.amount).toLocaleString()}
                  </div>
                </div>

                {/* STATUS */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-400">
                    Status
                  </div>

                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                        selectedBid.status
                      )}`}
                    >
                      {getStatusIcon(selectedBid.status)}
                      {selectedBid.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* NOTES */}
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-800">
                  Quotation Notes
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  {selectedBid.notes}
                </div>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-slate-400">
                    Submitted
                  </div>

                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedBid.submittedAt}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400">
                    Valid Until
                  </div>

                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedBid.validUntil}
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={closeBidDetails}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>

              {selectedBid.status === "Accepted" && (
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
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentMyBids;