import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  DollarSign,
  Loader2,
  MessageSquare,
  Package,
  ShieldCheck,
  Star,
  UserCheck,
  XCircle,
} from "lucide-react";

function ReviewBids() {
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  /* =========================================================
     LOAD REQUEST
  ========================================================= */

  const loadRequest = () => {
    try {
      const currentRequestId =
        localStorage.getItem("currentRequestId");

      const savedRequest = JSON.parse(
        localStorage.getItem("shipmentRequest") || "null"
      );

      const marketplaceRequest = JSON.parse(
        localStorage.getItem("currentMarketplaceRequest") || "null"
      );

      let currentRequest = savedRequest;

      /*
       * Prefer the current marketplace request when the IDs match.
       */

      if (
        marketplaceRequest &&
        marketplaceRequest.id === currentRequestId
      ) {
        currentRequest = {
          ...savedRequest,
          ...marketplaceRequest,
        };
      }

      if (currentRequest) {
        setRequest(currentRequest);
      }
    } catch (error) {
      console.error("Failed to load shipment request:", error);
      setRequest(null);
    }
  };

  /* =========================================================
     LOAD BIDS
  ========================================================= */

  const loadBids = () => {
    try {
      const currentRequestId =
        localStorage.getItem("currentRequestId");

      const savedBids = JSON.parse(
        localStorage.getItem("agentBids") || "[]"
      );

      if (!Array.isArray(savedBids)) {
        setBids([]);
        return;
      }

      /*
       * Only show bids belonging to THIS shipment request.
       */

      const requestBids = savedBids.filter(
        (bid) => bid.requestId === currentRequestId
      );

      setBids(requestBids);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load bids:", error);
      setBids([]);
    }
  };

  /* =========================================================
     INITIAL LOAD + AUTO REFRESH
  ========================================================= */

  useEffect(() => {
    loadRequest();
    loadBids();

    /*
     * Refresh every 2 seconds.
     *
     * This is useful because your prototype uses localStorage
     * instead of a real backend.
     */

    const interval = setInterval(() => {
      loadRequest();
      loadBids();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return `LKR ${amount.toLocaleString("en-LK")}`;
  };

  /* =========================================================
     CALCULATE TOTAL
  ========================================================= */

  const getTotal = (bid) => {
    return (
      Number(bid?.clearanceFee || 0) +
      Number(bid?.additionalCharges || 0)
    );
  };

  /* =========================================================
     SORT BIDS
     
     Lowest total fee first.
  ========================================================= */

  const sortedBids = useMemo(() => {
    return [...bids].sort(
      (a, b) => getTotal(a) - getTotal(b)
    );
  }, [bids]);

  /* =========================================================
     ACCEPT BID
  ========================================================= */

  const handleAcceptBid = () => {
    if (!selectedBid || !request) {
      return;
    }

    setIsAccepting(true);

    try {
      /* =====================================================
         GET EXISTING BIDS
      ===================================================== */

      const existingBids = JSON.parse(
        localStorage.getItem("agentBids") || "[]"
      );

      /* =====================================================
         UPDATE SELECTED BID
      ===================================================== */

      const updatedBids = existingBids.map((bid) => {
        if (bid.id === selectedBid.id) {
          return {
            ...bid,
            status: "Accepted",
            acceptedAt: new Date().toISOString(),
          };
        }

        /*
         * Other bids for this request become rejected.
         */

        if (bid.requestId === request.id) {
          return {
            ...bid,
            status: "Rejected",
          };
        }

        return bid;
      });

      localStorage.setItem(
        "agentBids",
        JSON.stringify(updatedBids)
      );

      /* =====================================================
         CREATE SELECTED AGENT
      ===================================================== */

      const selectedAgent = {
        id:
          selectedBid.agentId ||
          selectedBid.id,

        name:
          selectedBid.agentName ||
          "Clearing Agent",

        agencyName:
          selectedBid.agencyName ||
          selectedBid.agentName ||
          "Clearing Agency",

        clearanceFee:
          Number(selectedBid.clearanceFee || 0),

        additionalCharges:
          Number(selectedBid.additionalCharges || 0),

        totalFee:
          getTotal(selectedBid),

        processingTime:
          selectedBid.processingTime || "Not specified",

        message:
          selectedBid.message || "",

        bidId:
          selectedBid.id,

        requestId:
          request.id,

        selectedAt:
          new Date().toISOString(),
      };

      /* =====================================================
         SAVE SELECTED AGENT
      ===================================================== */

      localStorage.setItem(
        "selectedAgent",
        JSON.stringify(selectedAgent)
      );

      /* =====================================================
         UPDATE SHIPMENT REQUEST
      ===================================================== */

      const updatedRequest = {
        ...request,

        status: "Agent Selected",

        selectedBidId:
          selectedBid.id,

        selectedAgentId:
          selectedAgent.id,

        selectedAgentName:
          selectedAgent.name,

        selectedAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "shipmentRequest",
        JSON.stringify(updatedRequest)
      );

      localStorage.setItem(
        "currentMarketplaceRequest",
        JSON.stringify({
          ...updatedRequest,
        })
      );

      /* =====================================================
         SAVE CURRENT SHIPMENT
         
         ShipmentConfirmation can use this directly.
      ===================================================== */

      const currentShipment = {
        id:
          `SHP-${Date.now()}`,

        requestId:
          request.id,

        product:
          request.product ||
          request.productDetails ||
          "Import Shipment",

        origin:
          request.origin || "",

        destination:
          request.destination ||
          "Colombo, Sri Lanka",

        shipmentValue:
          Number(
            request.shipmentValue ||
            request.declaredValue ||
            0
          ),

        hsCode:
          request.hsCode ||
          "Not classified",

        category:
          request.category ||
          "General",

        agent:
          selectedAgent,

        status:
          "Agent Selected",

        createdAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "currentShipment",
        JSON.stringify(currentShipment)
      );

      /* =====================================================
         UPDATE MARKETPLACE REQUEST
      ===================================================== */

      let marketplaceRequests = [];

      try {
        marketplaceRequests = JSON.parse(
          localStorage.getItem("marketplaceRequests") || "[]"
        );

        if (!Array.isArray(marketplaceRequests)) {
          marketplaceRequests = [];
        }
      } catch {
        marketplaceRequests = [];
      }

      const updatedMarketplaceRequests =
        marketplaceRequests.map((item) => {
          if (item.id === request.id) {
            return {
              ...item,
              status: "Agent Selected",
              selectedBidId: selectedBid.id,
              selectedAgentName: selectedAgent.name,
            };
          }

          return item;
        });

      localStorage.setItem(
        "marketplaceRequests",
        JSON.stringify(updatedMarketplaceRequests)
      );

      /* =====================================================
         CLOSE MODAL
      ===================================================== */

      setSelectedBid(null);

      /*
       * Give localStorage a moment to finish updating before
       * navigation.
       */

      setTimeout(() => {
        navigate("/shipment-confirmation");
      }, 400);
    } catch (error) {
      console.error("Failed to accept bid:", error);

      alert(
        "Something went wrong while accepting this bid. Please try again."
      );

      setIsAccepting(false);
    }
  };

  /* =========================================================
     REQUEST NOT FOUND
  ========================================================= */

  if (!request) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle
              size={28}
              className="text-red-500"
            />
          </div>

          <h1 className="text-xl font-bold text-[#173563]">
            Shipment request not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't find the shipment request you're trying
            to review.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 w-full rounded-xl bg-[#173B6C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#12315B]"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/find-agent")}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <h1 className="text-lg font-bold text-[#173563] sm:text-xl">
                Review Agent Bids
              </h1>

              <p className="text-xs text-slate-500 sm:text-sm">
                Compare clearing agents and choose the best offer
              </p>

            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:flex">

            <ShieldCheck size={14} />

            Secure marketplace

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8 lg:py-9">

        {/* ===================================================
            PROGRESS
        ==================================================== */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex items-center">

            {/* STEP 1 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 size={16} />
              </div>

              <span className="hidden text-xs font-semibold text-emerald-600 sm:block">
                Describe Shipment
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-emerald-200" />

            {/* STEP 2 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173B6C] text-xs font-bold text-white">
                2
              </div>

              <span className="hidden text-xs font-semibold text-[#173B6C] sm:block">
                Review Bids
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 3 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                Accept & Clear
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            REQUEST SUMMARY
        ==================================================== */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  {request.id}
                </span>

                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                  {request.urgency || "Medium"} Priority
                </span>

              </div>

              <h2 className="mt-3 text-xl font-bold text-[#173563] sm:text-2xl">
                {request.product ||
                  request.productDetails ||
                  "Import Shipment"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {request.origin || "Origin not specified"} →{" "}
                {request.destination ||
                  "Colombo, Sri Lanka"}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 px-4 py-3">

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Shipment Value
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  $
                  {Number(
                    request.shipmentValue ||
                      request.declaredValue ||
                      0
                  ).toLocaleString()}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3">

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  HS Code
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {request.hsCode || "Not classified"}
                </p>

              </div>

              <div className="col-span-2 rounded-xl bg-slate-50 px-4 py-3 sm:col-span-1">

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Required By
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {request.requestedDate || "Within 7 days"}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            BID HEADER
        ==================================================== */}

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h2 className="text-lg font-bold text-[#173563]">
              Agent bids
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {bids.length === 0
                ? "Waiting for clearing agents to respond."
                : `${bids.length} bid${
                    bids.length === 1 ? "" : "s"
                  } received`}
            </p>

          </div>

          <p className="text-[10px] text-slate-400">
            Last updated{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>

        </div>

        {/* ===================================================
            NO BIDS
        ==================================================== */}

        {bids.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

              <Loader2
                size={30}
                className="animate-spin text-blue-600"
              />

            </div>

            <h3 className="text-lg font-bold text-[#173563]">
              Waiting for agent bids
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your shipment request has been published to the
              clearing agent marketplace. Agents can now review
              your request and submit their offers.
            </p>

            <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-3 rounded-xl bg-slate-50 p-4 text-left">

              <Clock3
                size={18}
                className="shrink-0 text-blue-600"
              />

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  This page updates automatically
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  You don't need to refresh while waiting.
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Dashboard
            </button>

          </section>
        ) : (

          /* =================================================
             BID LIST
          ================================================== */

          <div className="space-y-4">

            {sortedBids.map((bid, index) => {

              const totalFee = getTotal(bid);

              const isBestPrice =
                index === 0;

              const isAccepted =
                bid.status === "Accepted";

              return (
                <article
                  key={bid.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 ${
                    isAccepted
                      ? "border-emerald-300 ring-2 ring-emerald-100"
                      : "border-slate-200"
                  }`}
                >

                  {/* BID TOP */}

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        <Building2 size={22} />

                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-base font-bold text-[#173563] sm:text-lg">
                            {bid.agencyName ||
                              bid.agentName ||
                              "Clearing Agent"}
                          </h3>

                          {isBestPrice && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                              <Star size={11} />
                              Best Price
                            </span>
                          )}

                          {isAccepted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 size={11} />
                              Accepted
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          Bid #{bid.id}
                        </p>

                      </div>

                    </div>

                    {/* TOTAL */}

                    <div className="rounded-xl bg-blue-50 px-5 py-3 lg:min-w-[180px] lg:text-right">

                      <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                        Total estimated fee
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#173563]">
                        {formatCurrency(totalFee)}
                      </p>

                    </div>

                  </div>

                  {/* BID DETAILS */}

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                        <DollarSign size={14} />

                        Clearance Fee

                      </div>

                      <p className="mt-2 text-sm font-bold text-slate-700">
                        {formatCurrency(
                          bid.clearanceFee
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                        <DollarSign size={14} />

                        Additional Charges

                      </div>

                      <p className="mt-2 text-sm font-bold text-slate-700">
                        {formatCurrency(
                          bid.additionalCharges
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                        <Clock3 size={14} />

                        Processing Time

                      </div>

                      <p className="mt-2 text-sm font-bold text-slate-700">
                        {bid.processingTime ||
                          "Not specified"}
                      </p>

                    </div>

                  </div>

                  {/* MESSAGE */}

                  {bid.message && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                        <MessageSquare size={14} />

                        Message from agent

                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {bid.message}
                      </p>

                    </div>
                  )}

                  {/* ACTION */}

                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-xs text-slate-400">

                      <UserCheck size={14} />

                      Submitted{" "}
                      {bid.createdAt
                        ? new Date(
                            bid.createdAt
                          ).toLocaleDateString()
                        : "recently"}

                    </div>

                    {!isAccepted && (
                      <button
                        onClick={() =>
                          setSelectedBid(bid)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12315B]"
                      >
                        Choose This Agent
                        <ArrowRight size={16} />
                      </button>
                    )}

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <div className="mt-7 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <ShieldCheck size={13} />

          Agent bids are compared using the information submitted
          through the ImportEase marketplace.

        </div>

      </main>

      {/* =====================================================
          ACCEPT BID MODAL
      ====================================================== */}

      {selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="border-b border-slate-100 px-6 py-5">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-lg font-bold text-[#173563]">
                    Confirm Agent Selection
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Review the offer before accepting it.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedBid(null)
                  }
                  disabled={isAccepting}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle size={20} />
                </button>

              </div>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-4 p-6">

              <div className="rounded-xl bg-blue-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600">
                    <Building2 size={19} />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#173563]">
                      {selectedBid.agencyName ||
                        selectedBid.agentName ||
                        "Clearing Agent"}
                    </p>

                    <p className="text-xs text-blue-600">
                      Bid #{selectedBid.id}
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-3">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Clearance fee
                  </span>

                  <span className="font-semibold text-slate-700">
                    {formatCurrency(
                      selectedBid.clearanceFee
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Additional charges
                  </span>

                  <span className="font-semibold text-slate-700">
                    {formatCurrency(
                      selectedBid.additionalCharges
                    )}
                  </span>

                </div>

                <div className="border-t border-slate-100 pt-3">

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-slate-700">
                      Total
                    </span>

                    <span className="text-lg font-bold text-[#173B6C]">
                      {formatCurrency(
                        getTotal(selectedBid)
                      )}
                    </span>

                  </div>

                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                  <Clock3 size={14} />

                  Processing time

                </div>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {selectedBid.processingTime ||
                    "Not specified"}
                </p>

              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

                <p className="text-xs leading-5 text-amber-700">
                  Once you accept this bid, the other bids for
                  this shipment will no longer be available and
                  this agent will be selected for your shipment.
                </p>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row">

              <button
                onClick={() =>
                  setSelectedBid(null)
                }
                disabled={isAccepting}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAcceptBid}
                disabled={isAccepting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#12315B] disabled:cursor-not-allowed disabled:opacity-70"
              >

                {isAccepting ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Accept Bid
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default ReviewBids;