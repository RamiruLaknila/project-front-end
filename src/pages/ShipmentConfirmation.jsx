import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";

/*
=========================================================
SAFE LOCAL STORAGE READER
=========================================================
*/

function getStoredData(key) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      `Unable to read ${key} from localStorage`,
      error
    );

    return null;
  }
}

function ShipmentConfirmation() {
  const navigate = useNavigate();

  /*
  =========================================================
  GET SAVED DATA
  =========================================================
  */

  const importData = getStoredData("currentImport");
  const selectedAgent = getStoredData("selectedAgent");

  /*
  =========================================================
  CONFIRM REQUEST
  =========================================================
  */

  const handleConfirm = () => {
    /*
    Make sure agent exists.
    */

    if (!selectedAgent) {
      alert(
        "No clearing agent has been selected. Please go back and select an agent."
      );

      navigate("/find-agent");

      return;
    }

    /*
    Make sure import information exists.
    */

    if (!importData) {
      alert(
        "Your import details are missing. Please enter the import details again."
      );

      navigate("/new-import");

      return;
    }

    /*
    Create shipment.
    */

    const shipment = {
      id: `IMP-${Date.now().toString().slice(-6)}`,

      status: "Agent Requested",

      createdAt: new Date().toISOString(),

      importData: importData,

      agent: selectedAgent,
    };

    /*
    Save shipment.
    */

    localStorage.setItem(
      "currentShipment",
      JSON.stringify(shipment)
    );

    /*
    Optional:
    Save to shipment history.
    */

    const existingShipments = getStoredData(
      "shipments"
    );

    const shipments = Array.isArray(existingShipments)
      ? existingShipments
      : [];

    shipments.unshift(shipment);

    localStorage.setItem(
      "shipments",
      JSON.stringify(shipments)
    );

    /*
    Go to tracking page.
    */

    navigate("/track-shipment");
  };

  /*
  =========================================================
  BACK
  =========================================================
  */

  const handleBack = () => {
    navigate("/find-agent");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-8">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-11 w-11 object-contain mix-blend-multiply"
            />

            <div>

              <div className="text-[18px] font-bold tracking-tight text-[#173563]">
                Import<span className="text-slate-900">
                  Ease
                </span>
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-400 sm:block">
                SME Import Platform
              </div>

            </div>

          </Link>

          <div className="flex items-center gap-3">

            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >

              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />

            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                MB
              </div>

              <div className="hidden sm:block">

                <p className="text-xs font-semibold text-slate-800">
                  My Business
                </p>

                <p className="text-[9px] text-slate-400">
                  SME Account
                </p>

              </div>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1000px] px-5 py-8 sm:px-8 lg:py-10">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="mb-7 flex flex-wrap items-center gap-2 text-xs text-slate-400">

          <Link
            to="/dashboard"
            className="hover:text-slate-700"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <Link
            to="/find-agent"
            className="hover:text-slate-700"
          >
            Find Agent
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-slate-600">
            Confirm Request
          </span>

        </div>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="mb-8">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

            <FileCheck2
              size={13}
              className="text-blue-700"
            />

            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Final review
            </span>

          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
            Review your import request
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Check your shipment information and selected
            clearing agent before submitting the request.
          </p>

        </section>

        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <div className="mb-8 flex items-center">

          <ProgressStep
            number="1"
            label="Import details"
            completed
          />

          <ProgressLine completed />

          <ProgressStep
            number="2"
            label="Find agent"
            completed
          />

          <ProgressLine completed />

          <ProgressStep
            number="3"
            label="Confirm"
            active
          />

        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">

          {/* =====================================================
              LEFT
          ===================================================== */}

          <div className="space-y-5">

            {/* =================================================
                IMPORT DETAILS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.025)]">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Package size={17} />
                  </div>

                  <div>

                    <h2 className="text-sm font-bold text-slate-800">
                      Import details
                    </h2>

                    <p className="text-[9px] text-slate-400">
                      Information for this shipment
                    </p>

                  </div>

                </div>

                <Link
                  to="/new-import"
                  className="text-[10px] font-bold text-blue-700 hover:underline"
                >
                  Edit
                </Link>

              </div>

              <div className="grid gap-px bg-slate-100 sm:grid-cols-2">

                <InfoItem
                  label="Product"
                  value={
                    importData?.productName ||
                    importData?.product ||
                    "Not specified"
                  }
                />

                <InfoItem
                  label="HS Code"
                  value={
                    importData?.hsCode ||
                    "Not specified"
                  }
                />

                <InfoItem
                  label="Country of origin"
                  value={
                    importData?.country ||
                    importData?.countryOfOrigin ||
                    "Not specified"
                  }
                />

                <InfoItem
                  label="Quantity"
                  value={
                    importData
                      ? `${importData.quantity || 0} ${
                          importData.unit || ""
                        }`
                      : "Not specified"
                  }
                />

                <InfoItem
                  label="Estimated value"
                  value={
                    importData?.value
                      ? `LKR ${Number(
                          importData.value
                        ).toLocaleString()}`
                      : "Not specified"
                  }
                />

                <InfoItem
                  label="Import type"
                  value={
                    importData?.importType ||
                    "Commercial import"
                  }
                />

              </div>

            </section>

            {/* =================================================
                SELECTED AGENT
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.025)]">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <UserCheck size={17} />
                  </div>

                  <div>

                    <h2 className="text-sm font-bold text-slate-800">
                      Selected clearing agent
                    </h2>

                    <p className="text-[9px] text-slate-400">
                      Your preferred service provider
                    </p>

                  </div>

                </div>

                <Link
                  to="/find-agent"
                  className="text-[10px] font-bold text-blue-700 hover:underline"
                >
                  Change
                </Link>

              </div>

              <div className="p-5">

                {selectedAgent ? (

                  <div>

                    <div className="flex items-start gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#173563] text-sm font-bold text-white">
                        {selectedAgent.initials ||
                          selectedAgent.name
                            ?.slice(0, 2)
                            .toUpperCase() ||
                          "AG"}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-sm font-bold text-slate-900">
                            {selectedAgent.name}
                          </h3>

                          {selectedAgent.verified && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-1 text-[8px] font-bold text-emerald-700">

                              <ShieldCheck size={10} />

                              VERIFIED

                            </span>
                          )}

                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-3">

                          <span className="flex items-center gap-1 text-[10px] text-slate-400">

                            <MapPin size={11} />

                            {selectedAgent.location ||
                              "Sri Lanka"}

                          </span>

                          {selectedAgent.rating && (
                            <span className="flex items-center gap-1 text-[10px] text-slate-400">

                              <Star
                                size={11}
                                className="fill-amber-400 text-amber-400"
                              />

                              {selectedAgent.rating}

                            </span>
                          )}

                          {selectedAgent.reviews && (
                            <span className="text-[10px] text-slate-400">
                              {selectedAgent.reviews} reviews
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] text-slate-400">
                          Experience
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {selectedAgent.experience ||
                            "Not specified"}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] text-slate-400">
                          Imports handled
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {selectedAgent.completed
                            ? `${selectedAgent.completed}+`
                            : "Not specified"}
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <EmptyAgent />

                )}

              </div>

            </section>

            {/* =================================================
                NOTICE
            ================================================= */}

            <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">

              <Clock3
                size={17}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>

                <p className="text-[10px] font-bold text-amber-800">
                  What happens next?
                </p>

                <p className="mt-1 text-[9px] leading-5 text-amber-700">
                  Your request will be sent to the selected
                  clearing agent. The agent can review your
                  shipment and respond with a final quotation.
                </p>

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT SUMMARY
          ===================================================== */}

          <aside className="h-fit lg:sticky lg:top-24">

            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

              <div className="border-b border-slate-100 px-5 py-4">

                <h2 className="text-sm font-bold text-slate-800">
                  Request summary
                </h2>

                <p className="mt-1 text-[9px] text-slate-400">
                  Review before submitting
                </p>

              </div>

              <div className="space-y-4 p-5">

                <SummaryRow
                  label="Clearing agent"
                  value={
                    selectedAgent?.name ||
                    "Not selected"
                  }
                />

                <SummaryRow
                  label="Service fee"
                  value={
                    selectedAgent?.price
                      ? `LKR ${Number(
                          selectedAgent.price
                        ).toLocaleString()}`
                      : "Pending"
                  }
                />

                <SummaryRow
                  label="Status"
                  value={
                    selectedAgent
                      ? "Ready to submit"
                      : "Agent not selected"
                  }
                />

                <div className="border-t border-slate-100 pt-4">

                  <div className="flex items-start gap-2">

                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <p className="text-[9px] leading-5 text-slate-500">
                      No payment is required at this stage.
                      You will review the final quotation
                      before proceeding.
                    </p>

                  </div>

                </div>

                {/* =================================================
                    CONFIRM BUTTON
                ================================================= */}

                <button
                  onClick={handleConfirm}
                  disabled={!selectedAgent}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#102A4D] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <CheckCircle2 size={15} />

                  Confirm & send request

                  <ArrowRight size={15} />

                </button>

                <button
                  onClick={handleBack}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >

                  <ArrowLeft size={14} />

                  Back to agents

                </button>

              </div>

            </section>

            <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-slate-400">

              <ShieldCheck
                size={13}
                className="text-emerald-600"
              />

              Secure request through ImportEase

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   PROGRESS STEP
========================================================= */

function ProgressStep({
  number,
  label,
  completed,
  active,
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">

      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
          completed
            ? "bg-emerald-600 text-white"
            : active
            ? "bg-[#173563] text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >

        {completed ? (
          <CheckCircle2 size={14} />
        ) : (
          number
        )}

      </div>

      <span
        className={`hidden text-[10px] font-semibold sm:block ${
          active || completed
            ? "text-slate-700"
            : "text-slate-400"
        }`}
      >
        {label}
      </span>

    </div>
  );
}

/* =========================================================
   PROGRESS LINE
========================================================= */

function ProgressLine({ completed }) {
  return (
    <div
      className={`mx-2 h-px flex-1 ${
        completed
          ? "bg-emerald-300"
          : "bg-slate-200"
      }`}
    />
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ label, value }) {
  return (
    <div className="bg-white p-4">

      <p className="text-[9px] font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">

      <span className="text-[10px] text-slate-400">
        {label}
      </span>

      <span className="max-w-[180px] text-right text-[10px] font-bold text-slate-700">
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   EMPTY AGENT
========================================================= */

function EmptyAgent() {
  return (
    <div className="rounded-xl bg-red-50 p-5 text-center">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100">

        <UserCheck
          size={18}
          className="text-red-600"
        />

      </div>

      <p className="mt-3 text-xs font-bold text-red-700">
        No agent selected
      </p>

      <p className="mt-1 text-[10px] text-red-500">
        Please return to Find Agent and select a
        clearing agent.
      </p>

      <Link
        to="/find-agent"
        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#173563] px-3 py-2 text-[10px] font-bold text-white"
      >
        Choose an agent

        <ArrowRight size={12} />

      </Link>

    </div>
  );
}

export default ShipmentConfirmation;