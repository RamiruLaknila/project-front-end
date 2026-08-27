import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Globe2,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";

function ShipmentConfirmation() {
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  /* =========================================================
     LOAD CURRENT SHIPMENT
  ========================================================= */

  useEffect(() => {
    try {
      const savedShipment = JSON.parse(
        localStorage.getItem("currentShipment") || "null"
      );

      const savedAgent = JSON.parse(
        localStorage.getItem("selectedAgent") || "null"
      );

      const savedRequest = JSON.parse(
        localStorage.getItem("shipmentRequest") || "null"
      );

      if (savedShipment) {
        setShipment({
          ...savedShipment,
          agent:
            savedShipment.agent ||
            savedAgent ||
            null,
        });

        setConfirmed(
          savedShipment.status === "Confirmed" ||
          savedShipment.status === "Processing"
        );

        return;
      }

      /*
       * Fallback:
       * If currentShipment does not exist, build it from the
       * request + selected agent.
       */

      if (savedRequest && savedAgent) {
        const fallbackShipment = {
          id: `SHP-${Date.now()}`,

          requestId:
            savedRequest.id ||
            localStorage.getItem("currentRequestId"),

          product:
            savedRequest.product ||
            savedRequest.productDetails ||
            "Import Shipment",

          origin:
            savedRequest.origin ||
            "",

          destination:
            savedRequest.destination ||
            "Colombo, Sri Lanka",

          shipmentValue:
            Number(
              savedRequest.shipmentValue ||
              savedRequest.declaredValue ||
              0
            ),

          hsCode:
            savedRequest.hsCode ||
            "Not classified",

          category:
            savedRequest.category ||
            "General",

          agent: savedAgent,

          status: "Agent Selected",

          createdAt:
            new Date().toISOString(),
        };

        localStorage.setItem(
          "currentShipment",
          JSON.stringify(fallbackShipment)
        );

        setShipment(fallbackShipment);
      }
    } catch (error) {
      console.error(
        "Failed to load shipment:",
        error
      );
    }
  }, []);

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (value) => {
    return `LKR ${Number(value || 0).toLocaleString("en-LK")}`;
  };

  /* =========================================================
     CONFIRM SHIPMENT
  ========================================================= */

  const handleConfirmShipment = () => {
    if (!shipment) {
      return;
    }

    setIsConfirming(true);

    try {
      const confirmedAt =
        new Date().toISOString();

      const updatedShipment = {
        ...shipment,

        status: "Confirmed",

        confirmedAt,

        trackingStatus: "Preparing",

        currentStage: "Shipment Confirmed",
      };

      /* =====================================================
         SAVE CURRENT SHIPMENT
      ===================================================== */

      localStorage.setItem(
        "currentShipment",
        JSON.stringify(updatedShipment)
      );

      /* =====================================================
         UPDATE SHIPMENT REQUEST
      ===================================================== */

      const savedRequest = JSON.parse(
        localStorage.getItem("shipmentRequest") || "null"
      );

      if (savedRequest) {
        const updatedRequest = {
          ...savedRequest,

          status: "Confirmed",

          shipmentId:
            updatedShipment.id,

          confirmedAt,
        };

        localStorage.setItem(
          "shipmentRequest",
          JSON.stringify(updatedRequest)
        );
      }

      /* =====================================================
         UPDATE MARKETPLACE REQUEST
      ===================================================== */

      let marketplaceRequests = [];

      try {
        marketplaceRequests = JSON.parse(
          localStorage.getItem(
            "marketplaceRequests"
          ) || "[]"
        );

        if (!Array.isArray(marketplaceRequests)) {
          marketplaceRequests = [];
        }
      } catch {
        marketplaceRequests = [];
      }

      const updatedMarketplaceRequests =
        marketplaceRequests.map((request) => {
          if (
            request.id ===
            shipment.requestId
          ) {
            return {
              ...request,

              status: "Confirmed",

              shipmentId:
                updatedShipment.id,

              confirmedAt,
            };
          }

          return request;
        });

      localStorage.setItem(
        "marketplaceRequests",
        JSON.stringify(
          updatedMarketplaceRequests
        )
      );

      /* =====================================================
         CREATE / UPDATE SME SHIPMENTS LIST
      ===================================================== */

      let shipments = [];

      try {
        shipments = JSON.parse(
          localStorage.getItem("shipments") ||
            "[]"
        );

        if (!Array.isArray(shipments)) {
          shipments = [];
        }
      } catch {
        shipments = [];
      }

      const shipmentExists = shipments.some(
        (item) =>
          item.id === updatedShipment.id
      );

      const updatedShipments = shipmentExists
        ? shipments.map((item) =>
            item.id === updatedShipment.id
              ? updatedShipment
              : item
          )
        : [
            updatedShipment,
            ...shipments,
          ];

      localStorage.setItem(
        "shipments",
        JSON.stringify(
          updatedShipments
        )
      );

      /* =====================================================
         SAVE TRACKING INFORMATION
      ===================================================== */

      const trackingData = {
        shipmentId:
          updatedShipment.id,

        requestId:
          updatedShipment.requestId,

        status: "Preparing",

        currentStage:
          "Shipment Confirmed",

        progress: 20,

        updatedAt:
          confirmedAt,

        timeline: [
          {
            id: 1,
            title: "Shipment Request Created",
            description:
              "Your import request was submitted to clearing agents.",
            status: "completed",
            date:
              shipment.createdAt ||
              confirmedAt,
          },

          {
            id: 2,
            title: "Clearing Agent Selected",
            description:
              `${shipment.agent?.name || "Your clearing agent"} was selected for this shipment.`,
            status: "completed",
            date:
              shipment.agent?.selectedAt ||
              confirmedAt,
          },

          {
            id: 3,
            title: "Shipment Confirmed",
            description:
              "You confirmed the selected clearing agent and shipment.",
            status: "completed",
            date:
              confirmedAt,
          },

          {
            id: 4,
            title: "Documents & Clearance",
            description:
              "Your clearing agent will prepare the required customs documentation.",
            status: "current",
            date: null,
          },

          {
            id: 5,
            title: "Customs Clearance",
            description:
              "Customs clearance will begin once the required documents are ready.",
            status: "pending",
            date: null,
          },

          {
            id: 6,
            title: "Shipment Cleared",
            description:
              "Your shipment will be marked as cleared after customs processing.",
            status: "pending",
            date: null,
          },
        ],
      };

      localStorage.setItem(
        "shipmentTracking",
        JSON.stringify(
          trackingData
        )
      );

      setShipment(updatedShipment);
      setConfirmed(true);
      setIsConfirming(false);
    } catch (error) {
      console.error(
        "Failed to confirm shipment:",
        error
      );

      alert(
        "Something went wrong while confirming the shipment."
      );

      setIsConfirming(false);
    }
  };

  /* =========================================================
     NO SHIPMENT
  ========================================================= */

  if (!shipment) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center px-5">

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <Package
              size={28}
              className="text-amber-600"
            />
          </div>

          <h1 className="text-xl font-bold text-[#173563]">
            Shipment not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't find the shipment you are trying
            to confirm.
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-6 w-full rounded-xl bg-[#173B6C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#12315B]"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  const agent =
    shipment.agent || {};

  const totalFee =
    Number(agent.clearanceFee || 0) +
    Number(agent.additionalCharges || 0);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate("/review-bids")
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <h1 className="text-lg font-bold text-[#173563] sm:text-xl">
                Shipment Confirmation
              </h1>

              <p className="text-xs text-slate-500 sm:text-sm">
                Confirm your clearing agent and shipment
              </p>

            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">

            <ShieldCheck size={14} />

            Secure confirmation

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-5xl px-5 py-7 sm:px-8 lg:py-10">

        {/* ===================================================
            PROGRESS
        ==================================================== */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex items-center">

            {/* STEP 1 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={16} />
              </div>

              <span className="hidden text-xs font-semibold text-emerald-600 sm:block">
                Describe Shipment
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-emerald-200" />

            {/* STEP 2 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={16} />
              </div>

              <span className="hidden text-xs font-semibold text-emerald-600 sm:block">
                Review Bids
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-emerald-200" />

            {/* STEP 3 */}

            <div className="flex shrink-0 items-center gap-2">

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  confirmed
                    ? "bg-emerald-500 text-white"
                    : "bg-[#173B6C] text-white"
                }`}
              >
                {confirmed ? (
                  <Check size={16} />
                ) : (
                  "3"
                )}
              </div>

              <span
                className={`hidden text-xs font-semibold sm:block ${
                  confirmed
                    ? "text-emerald-600"
                    : "text-[#173B6C]"
                }`}
              >
                Accept & Clear
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            SUCCESS BANNER
        ==================================================== */}

        {confirmed && (
          <section className="mb-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <CheckCircle2 size={21} />
                </div>

                <div>

                  <h2 className="text-base font-bold text-emerald-800">
                    Shipment confirmed successfully
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Your clearing agent has been selected and
                    your shipment is now ready for processing.
                  </p>

                </div>

              </div>

              <div className="rounded-xl bg-white px-4 py-3 text-center">

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Shipment ID
                </p>

                <p className="mt-1 text-sm font-bold text-[#173563]">
                  {shipment.id}
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            TITLE
        ==================================================== */}

        <div className="mb-6">

          <div className="flex items-center gap-2">

            <CheckCircle2
              size={22}
              className="text-emerald-500"
            />

            <h2 className="text-xl font-bold text-[#173563] sm:text-2xl">
              {confirmed
                ? "Your shipment is confirmed"
                : "Review & confirm your shipment"}
            </h2>

          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {confirmed
              ? "Your selected clearing agent can now begin preparing your shipment for customs clearance."
              : "Please review the shipment and clearing agent details below before confirming."}
          </p>

        </div>

        {/* ===================================================
            CONTENT GRID
        ==================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT
          ================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* SHIPMENT DETAILS */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Package size={18} />
                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-[#173563]">
                      Shipment details
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      Information provided with your import request
                    </p>

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">

                {/* PRODUCT */}

                <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Package size={14} />
                    Product
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-700">
                    {shipment.product ||
                      "Import Shipment"}
                  </p>

                </div>

                {/* ORIGIN */}

                <div className="rounded-xl border border-slate-100 p-4">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Globe2 size={14} />
                    Origin
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-700">
                    {shipment.origin ||
                      "Not specified"}
                  </p>

                </div>

                {/* DESTINATION */}

                <div className="rounded-xl border border-slate-100 p-4">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <MapPin size={14} />
                    Destination
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-700">
                    {shipment.destination ||
                      "Colombo, Sri Lanka"}
                  </p>

                </div>

                {/* HS CODE */}

                <div className="rounded-xl border border-slate-100 p-4">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <FileText size={14} />
                    HS Code
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-700">
                    {shipment.hsCode ||
                      "Not classified"}
                  </p>

                </div>

                {/* VALUE */}

                <div className="rounded-xl border border-slate-100 p-4">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <DollarSign size={14} />
                    Shipment Value
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-700">
                    $
                    {Number(
                      shipment.shipmentValue ||
                        0
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

            </section>

            {/* SELECTED AGENT */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <UserCheck size={18} />
                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-[#173563]">
                      Selected clearing agent
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      Your chosen customs clearance partner
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <Building2 size={26} />

                  </div>

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h4 className="text-lg font-bold text-[#173563]">
                        {agent.agencyName ||
                          agent.name ||
                          "Clearing Agent"}
                      </h4>

                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">

                        <CheckCircle2 size={11} />

                        Selected

                      </span>

                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {agent.name ||
                        "Assigned clearing agent"}
                    </p>

                    {agent.message && (
                      <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                        "{agent.message}"
                      </p>
                    )}

                  </div>

                </div>

                {/* AGENT FEE DETAILS */}

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Clearance Fee
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {formatCurrency(
                        agent.clearanceFee
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      Additional
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {formatCurrency(
                        agent.additionalCharges
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wide text-blue-500">
                      Total Fee
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#173563]">
                      {formatCurrency(
                        totalFee
                      )}
                    </p>

                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                  <Clock3 size={14} />

                  Estimated processing:
                  <span className="font-semibold text-slate-700">
                    {agent.processingTime ||
                      "Not specified"}
                  </span>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SUMMARY
          ================================================== */}

          <aside>

            <section className="sticky top-5 rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-5">

                <h3 className="text-sm font-bold text-[#173563]">
                  Confirmation summary
                </h3>

                <p className="mt-1 text-[11px] text-slate-400">
                  Review the final selection
                </p>

              </div>

              <div className="space-y-4 p-5">

                <div>

                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Shipment
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {shipment.id}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Clearing Agent
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {agent.agencyName ||
                      agent.name ||
                      "Clearing Agent"}
                  </p>

                </div>

                <div className="border-t border-slate-100 pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Agent Fee
                    </span>

                    <span className="font-semibold text-slate-700">
                      {formatCurrency(
                        totalFee
                      )}
                    </span>

                  </div>

                </div>

                {!confirmed ? (

                  <button
                    onClick={
                      handleConfirmShipment
                    }
                    disabled={isConfirming}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12315B] disabled:cursor-not-allowed disabled:opacity-70"
                  >

                    {isConfirming ? (
                      <>
                        <Truck
                          size={17}
                          className="animate-pulse"
                        />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Confirm Shipment
                      </>
                    )}

                  </button>

                ) : (

                  <button
                    onClick={() =>
                      navigate("/track-shipment")
                    }
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12315B]"
                  >

                    Track Shipment

                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-0.5"
                    />

                  </button>

                )}

                <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">

                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />

                  <p className="text-[10px] leading-5 text-slate-500">
                    {confirmed
                      ? "Your shipment has been securely recorded and is ready for the clearance process."
                      : "By confirming, you agree to proceed with the selected clearing agent for this shipment."}
                  </p>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default ShipmentConfirmation;