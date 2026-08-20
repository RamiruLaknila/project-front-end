import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  MapPin,
  Package,
  Pencil,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";

function ShipmentConfirmation() {
  const navigate = useNavigate();

  const [importData, setImportData] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const savedImport = localStorage.getItem("currentImport");

    if (savedImport) {
      try {
        setImportData(JSON.parse(savedImport));
      } catch (error) {
        console.error("Unable to load import:", error);
      }
    }
  }, []);

  const agent = importData?.selectedAgent;

  const calculation = importData?.calculation || {};

  const totalImportCost =
    Number(calculation.estimatedTotal) || 0;

  const agentFee =
    Number(agent?.price) || 0;

  const grandTotal =
    totalImportCost + agentFee;

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  const shipmentReference = useMemo(() => {
    const existing =
      localStorage.getItem("shipmentReference");

    if (existing) {
      return existing;
    }

    const reference = `IE-${new Date()
      .getFullYear()
      .toString()
      .slice(-2)}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    localStorage.setItem(
      "shipmentReference",
      reference
    );

    return reference;
  }, []);

  const handleConfirm = () => {
    const submittedImport = {
      ...(importData || {}),

      shipmentReference,
      status: "Submitted",
      submittedAt: new Date().toISOString(),

      finalSummary: {
        importCost: totalImportCost,
        agentFee,
        total: grandTotal,
      },
    };

    localStorage.setItem(
      "currentImport",
      JSON.stringify(submittedImport)
    );

    localStorage.setItem(
      "shipmentStatus",
      "Submitted"
    );

    setImportData(submittedImport);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <SuccessScreen
        shipmentReference={shipmentReference}
        navigate={navigate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[70px] max-w-[1180px] items-center justify-between px-5 sm:px-7">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-10 w-10 object-contain mix-blend-multiply"
            />

            <div>
              <div className="text-[17px] font-bold tracking-tight text-[#173563]">
                Import<span className="text-slate-900">Ease</span>
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:block">
                SME Import Platform
              </div>
            </div>
          </Link>

          <Link
            to="/find-agent"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowLeft size={16} />

            <span className="hidden sm:inline">
              Back to Agents
            </span>
          </Link>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="mx-auto max-w-[1050px] px-5 py-8 sm:px-7 lg:py-12">

        {/* ===================================================
            BREADCRUMB
        =================================================== */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">

          <Link
            to="/dashboard"
            className="hover:text-slate-700"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <span>Find Agent</span>

          <ChevronRight size={13} />

          <span className="text-slate-600">
            Confirmation
          </span>

        </div>

        {/* ===================================================
            TITLE
        =================================================== */}
        <section className="mb-7">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5">

            <FileCheck2
              size={13}
              className="text-violet-600"
            />

            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
              Final review
            </span>

          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
            Review your import request
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Check the details below before submitting your import
            request to the selected clearing agent.
          </p>

        </section>

        {/* ===================================================
            PROGRESS
        =================================================== */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

          <div className="flex items-center">

            <ProgressStep
              number="1"
              label="Import"
              complete
            />

            <ProgressLine />

            <ProgressStep
              number="2"
              label="HS Code"
              complete
            />

            <ProgressLine />

            <ProgressStep
              number="3"
              label="Costs"
              complete
            />

            <ProgressLine />

            <ProgressStep
              number="4"
              label="Agent"
              complete
            />

            <ProgressLine />

            <ProgressStep
              number="5"
              label="Confirm"
              active
            />

          </div>

        </div>

        {/* ===================================================
            REFERENCE BAR
        =================================================== */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <FileText
                size={16}
                className="text-slate-500"
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Request reference
              </p>

              <p className="mt-0.5 font-mono text-xs font-bold text-slate-700">
                {shipmentReference}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-amber-400" />

            <span className="text-[10px] font-semibold text-slate-500">
              Ready for submission
            </span>

          </div>

        </div>

        {/* ===================================================
            CONTENT GRID
        =================================================== */}
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">

          {/* =================================================
              LEFT
          ================================================= */}
          <div className="space-y-5">

            {/* IMPORT DETAILS */}
            <section className="rounded-2xl border border-slate-200 bg-white">

              <SectionHeader
                icon={<Package size={17} />}
                title="Import details"
                action={
                  <Link
                    to="/new-import"
                    className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 hover:text-blue-800"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                }
              />

              <div className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">

                <DetailItem
                  label="Product"
                  value={
                    importData?.productName ||
                    "Imported product"
                  }
                />

                <DetailItem
                  label="HS Code"
                  value={
                    importData?.hsCode ||
                    "Not available"
                  }
                  mono
                />

                <DetailItem
                  label="Quantity"
                  value={
                    importData?.quantity
                      ? `${importData.quantity} ${
                          importData.unit || "units"
                        }`
                      : "Not specified"
                  }
                />

                <DetailItem
                  label="Estimated goods value"
                  value={`$${formatMoney(
                    calculation.productValue
                  )}`}
                />

              </div>

            </section>

            {/* COST SUMMARY */}
            <section className="rounded-2xl border border-slate-200 bg-white">

              <SectionHeader
                icon={<FileCheck2 size={17} />}
                title="Cost summary"
                action={
                  <Link
                    to="/calculator"
                    className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 hover:text-blue-800"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                }
              />

              <div className="space-y-3 p-5 sm:p-6">

                <CostRow
                  label="Product value"
                  value={calculation.productValue}
                />

                <CostRow
                  label="Shipping / freight"
                  value={calculation.shipping}
                />

                <CostRow
                  label="Insurance"
                  value={calculation.insurance}
                />

                <div className="my-2 border-t border-slate-100" />

                <CostRow
                  label="Customs duty"
                  value={calculation.customsDuty}
                />

                <CostRow
                  label="VAT"
                  value={calculation.vat}
                />

                <CostRow
                  label="Other import costs"
                  value={calculation.otherCosts}
                />

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-4">

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-semibold text-slate-600">
                      Estimated import cost
                    </span>

                    <span className="text-lg font-bold text-[#173563]">
                      ${formatMoney(totalImportCost)}
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* SELECTED AGENT */}
            <section className="rounded-2xl border border-emerald-200 bg-white">

              <div className="border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 sm:px-6">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-600"
                  />

                  <h2 className="text-sm font-bold text-emerald-900">
                    Selected clearing agent
                  </h2>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                {agent ? (
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-4">

                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#173563] text-xs font-bold text-white">
                        {agent.initials || "AG"}

                        <span className="absolute -bottom-1 -right-1 rounded-full bg-white">
                          <BadgeCheck
                            size={16}
                            className="fill-emerald-500 text-white"
                          />
                        </span>
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-sm font-bold text-slate-900">
                            {agent.name}
                          </h3>

                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            VERIFIED
                          </span>

                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">

                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {agent.location}
                          </span>

                          <span className="flex items-center gap-1">
                            <Star
                              size={11}
                              className="fill-amber-400 text-amber-400"
                            />
                            {agent.rating}
                          </span>

                          <span>
                            {agent.experience}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="border-t border-slate-100 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">

                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        Service fee
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#173563]">
                        ${formatMoney(agentFee)}
                      </p>

                    </div>

                  </div>
                ) : (
                  <div className="py-4 text-center">

                    <p className="text-sm font-semibold text-slate-700">
                      No agent selected
                    </p>

                    <Link
                      to="/find-agent"
                      className="mt-2 inline-block text-xs font-semibold text-blue-700"
                    >
                      Select a clearing agent
                    </Link>

                  </div>
                )}

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SUMMARY
          ================================================= */}
          <aside className="h-fit lg:sticky lg:top-[90px]">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

              <div className="bg-[#173563] px-5 py-5 text-white">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-200">
                      Final estimate
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      ${formatMoney(grandTotal)}
                    </p>

                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Package size={19} />
                  </div>

                </div>

                <p className="mt-2 text-[10px] leading-5 text-blue-200">
                  Estimated import cost plus selected agent service fee.
                </p>

              </div>

              <div className="p-5">

                <div className="space-y-3">

                  <SummaryRow
                    label="Estimated import cost"
                    value={`$${formatMoney(
                      totalImportCost
                    )}`}
                  />

                  <SummaryRow
                    label="Agent service fee"
                    value={`$${formatMoney(
                      agentFee
                    )}`}
                  />

                </div>

                <div className="my-5 border-t border-slate-100" />

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold text-slate-800">
                    Estimated total
                  </span>

                  <span className="text-lg font-bold text-[#173563]">
                    ${formatMoney(grandTotal)}
                  </span>

                </div>

                {/* CONFIRM */}
                <button
                  onClick={handleConfirm}
                  disabled={!agent}
                  className={`group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${
                    agent
                      ? "bg-[#173563] text-white shadow-lg shadow-[#173563]/10 hover:-translate-y-0.5 hover:bg-[#102A50]"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  <Check size={17} />

                  Confirm & Submit

                  <ArrowRight
                    size={16}
                    className={
                      agent
                        ? "transition-transform group-hover:translate-x-0.5"
                        : ""
                    }
                  />
                </button>

                <p className="mt-3 text-center text-[9px] leading-4 text-slate-400">
                  By submitting, you confirm that the information
                  provided for this import request is accurate.
                </p>

              </div>

            </div>

            {/* TRUST */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={15} />
                </div>

                <div>

                  <p className="text-[10px] font-bold text-slate-700">
                    Secure import request
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-slate-400">
                    Your request and shipment information is kept
                    within your ImportEase account.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* ===================================================
            BOTTOM NOTICE
        =================================================== */}
        <div className="mt-7 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3.5">

          <Clock3
            size={15}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>

            <p className="text-[10px] font-semibold text-amber-800">
              Important
            </p>

            <p className="mt-0.5 text-[9px] leading-5 text-amber-700">
              All costs shown are estimates. Final customs duties,
              taxes, clearance charges, and other fees may vary based
              on the final customs assessment.
            </p>

          </div>

        </div>

        {/* ===================================================
            BACK
        =================================================== */}
        <div className="mt-6 flex justify-center">

          <Link
            to="/find-agent"
            className="flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            <ArrowLeft size={14} />
            Return to agent selection
          </Link>

        </div>

      </main>
    </div>
  );
}

/* =========================================================
   SUCCESS SCREEN
========================================================= */

function SuccessScreen({
  shipmentReference,
  navigate,
}) {
  return (
    <div className="min-h-screen bg-[#F6F8FB]">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-[70px] max-w-[1180px] items-center px-5 sm:px-7">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-10 w-10 object-contain mix-blend-multiply"
            />

            <div className="text-[17px] font-bold tracking-tight text-[#173563]">
              Import<span className="text-slate-900">Ease</span>
            </div>
          </Link>

        </div>

      </header>

      <main className="mx-auto flex min-h-[calc(100vh-70px)] max-w-[700px] items-center justify-center px-5 py-12">

        <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-10">

          {/* SUCCESS ICON */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Check
                size={24}
                strokeWidth={3}
              />
            </div>

          </div>

          <div className="mt-6">

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Request submitted
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
              Your import request is on its way
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Your import request has been submitted successfully.
              You can now track its progress and manage the shipment
              from your dashboard.
            </p>

          </div>

          {/* REFERENCE */}
          <div className="mx-auto mt-7 max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">

            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              Shipment reference
            </p>

            <p className="mt-1 font-mono text-lg font-bold text-[#173563]">
              {shipmentReference}
            </p>

          </div>

          {/* STATUS */}
          <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">

            <SuccessItem
              icon={<CheckCircle2 size={15} />}
              title="Request submitted"
            />

            <SuccessItem
              icon={<UserRound size={15} />}
              title="Agent notified"
            />

            <SuccessItem
              icon={<FileText size={15} />}
              title="Tracking created"
            />

          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={() =>
                navigate("/shipments")
              }
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#173563]/10 transition hover:-translate-y-0.5 hover:bg-[#102A50]"
            >
              Track shipment

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Go to dashboard
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function ProgressStep({
  number,
  label,
  active = false,
  complete = false,
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
          complete
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-[#173563] text-white"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {complete ? (
          <CheckCircle2 size={15} />
        ) : (
          number
        )}
      </div>

      <span
        className={`hidden text-xs sm:block ${
          active
            ? "font-semibold text-[#173563]"
            : complete
              ? "font-semibold text-emerald-700"
              : "text-slate-400"
        }`}
      >
        {label}
      </span>

    </div>
  );
}

function ProgressLine({ complete = true }) {
  return (
    <div
      className={`mx-2 h-px flex-1 ${
        complete
          ? "bg-emerald-200"
          : "bg-slate-200"
      }`}
    />
  );
}

function SectionHeader({
  icon,
  title,
  action,
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

      <div className="flex items-center gap-2.5">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

        <h2 className="text-sm font-bold text-slate-900">
          {title}
        </h2>

      </div>

      {action}

    </div>
  );
}

function DetailItem({
  label,
  value,
  mono = false,
}) {
  return (
    <div>

      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-semibold text-slate-700 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
}

function CostRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-xs font-semibold text-slate-700">
        ${Number(value || 0).toFixed(2)}
      </span>

    </div>
  );
}

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-xs font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}

function SuccessItem({
  icon,
  title,
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">

      <div className="text-emerald-500">
        {icon}
      </div>

      <span className="text-[10px] font-semibold text-slate-600">
        {title}
      </span>

    </div>
  );
}

export default ShipmentConfirmation;