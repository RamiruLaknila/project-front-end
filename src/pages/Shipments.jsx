import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";

function Shipments() {
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    const savedImport = localStorage.getItem("currentImport");

    if (savedImport) {
      try {
        setShipment(JSON.parse(savedImport));
      } catch (error) {
        console.error("Unable to load shipment:", error);
      }
    }
  }, []);

  const reference =
    shipment?.shipmentReference || "IE-26-000000";

  const product =
    shipment?.productName || "Imported Product";

  const hsCode =
    shipment?.hsCode || "Not assigned";

  const agent =
    shipment?.selectedAgent;

  const status =
    shipment?.status || "Submitted";

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-8">

          {/* Logo */}
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
                Import<span className="text-slate-900">Ease</span>
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-400 sm:block">
                SME Import Platform
              </div>
            </div>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3">

            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
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
      <main className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:py-10">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">

          <Link
            to="/dashboard"
            className="transition hover:text-slate-700"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-slate-600">
            Shipment Tracking
          </span>

        </div>

        {/* ===================================================
            PAGE HEADER
        =================================================== */}
        <section className="mb-7">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                <Truck
                  size={13}
                  className="text-blue-700"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Shipment tracking
                </span>

              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
                Track your import
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor your import request, clearance progress,
                documents, and clearing agent activity from one place.
              </p>

            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw size={14} />
              Refresh status
            </button>

          </div>

        </section>

        {/* ===================================================
            SHIPMENT HEADER CARD
        =================================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_25px_rgba(15,23,42,0.03)]">

          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Package size={21} />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-base font-bold text-slate-900">
                      {product}
                    </h2>

                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700">
                      {status.toUpperCase()}
                    </span>

                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">

                    <span>
                      Reference:
                      <strong className="ml-1 font-mono text-slate-600">
                        {reference}
                      </strong>
                    </span>

                    <span>
                      HS Code:
                      <strong className="ml-1 font-mono text-slate-600">
                        {hsCode}
                      </strong>
                    </span>

                  </div>

                </div>

              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">

                <Clock3
                  size={15}
                  className="text-slate-400"
                />

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Current status
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-slate-700">
                    Request submitted
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}
          <div className="px-5 py-7 sm:px-7">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Import progress
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  Your shipment journey
                </p>
              </div>

              <span className="text-xs font-bold text-blue-700">
                20% complete
              </span>

            </div>

            <div className="relative">

              <div className="absolute left-[18px] top-5 h-[calc(100%-40px)] w-px bg-slate-200 sm:left-[24px]" />

              <TimelineItem
                number="01"
                title="Import request submitted"
                description="Your import request has been successfully submitted."
                time="Just now"
                complete
              />

              <TimelineItem
                number="02"
                title="Agent reviewing request"
                description="Your selected clearing agent will review the shipment details."
                time="Waiting"
                active
              />

              <TimelineItem
                number="03"
                title="Documents & clearance"
                description="Required documents and customs clearance will be processed."
                time="Pending"
              />

              <TimelineItem
                number="04"
                title="Customs assessment"
                description="Customs duties, taxes, and clearance status will be updated."
                time="Pending"
              />

              <TimelineItem
                number="05"
                title="Shipment cleared"
                description="Your shipment will be ready for the next delivery stage."
                time="Pending"
              />

            </div>

          </div>

        </section>

        {/* ===================================================
            LOWER GRID
        =================================================== */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_370px]">

          {/* =================================================
              LEFT
          ================================================= */}
          <div className="space-y-6">

            {/* AGENT */}
            <section className="rounded-2xl border border-slate-200 bg-white">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <UserRound size={16} />
                  </div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Clearing agent
                  </h2>

                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                  SELECTED
                </span>

              </div>

              <div className="p-5">

                {agent ? (
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] text-xs font-bold text-white">

                        {agent.initials || "AG"}

                        <span className="absolute -bottom-1 -right-1 rounded-full bg-white">
                          <BadgeCheck
                            size={16}
                            className="fill-emerald-500 text-white"
                          />
                        </span>

                      </div>

                      <div>

                        <h3 className="text-sm font-bold text-slate-900">
                          {agent.name}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">

                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {agent.location || "Sri Lanka"}
                          </span>

                          <span>
                            ★ {agent.rating || "4.8"}
                          </span>

                        </div>

                      </div>

                    </div>

                    <button
                      className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Contact agent
                    </button>

                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No clearing agent information available.
                  </p>
                )}

              </div>

            </section>

            {/* DOCUMENTS */}
            <section className="rounded-2xl border border-slate-200 bg-white">

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <FileText size={16} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Import documents
                    </h2>

                    <p className="mt-0.5 text-[9px] text-slate-400">
                      Documents required for clearance
                    </p>
                  </div>

                </div>

              </div>

              <div className="divide-y divide-slate-100">

                <DocumentRow
                  title="Commercial Invoice"
                  status="Pending upload"
                />

                <DocumentRow
                  title="Packing List"
                  status="Pending upload"
                />

                <DocumentRow
                  title="Bill of Lading / Air Waybill"
                  status="Pending upload"
                />

                <DocumentRow
                  title="Additional clearance documents"
                  status="May be required"
                />

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT
          ================================================= */}
          <aside className="space-y-6">

            {/* SUMMARY */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

              <div className="bg-[#173563] px-5 py-5 text-white">

                <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-200">
                  Import summary
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Shipment overview
                </h2>

              </div>

              <div className="space-y-4 p-5">

                <InfoRow
                  label="Product"
                  value={product}
                />

                <InfoRow
                  label="HS Code"
                  value={hsCode}
                  mono
                />

                <InfoRow
                  label="Reference"
                  value={reference}
                  mono
                />

                <InfoRow
                  label="Status"
                  value="Submitted"
                />

                <div className="border-t border-slate-100 pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-semibold text-slate-600">
                      Estimated total
                    </span>

                    <span className="text-lg font-bold text-[#173563]">
                      $
                      {formatMoney(
                        shipment?.finalSummary?.total
                      )}
                    </span>

                  </div>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Final amount may change after customs assessment.
                  </p>

                </div>

              </div>

            </section>

            {/* HELP */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <ShieldCheck size={17} />
                </div>

                <div>

                  <h3 className="text-xs font-bold text-slate-800">
                    Need assistance?
                  </h3>

                  <p className="mt-1 text-[10px] leading-5 text-slate-400">
                    Your clearing agent can help with documents,
                    customs requirements, and shipment questions.
                  </p>

                  <button className="mt-3 flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:text-blue-800">
                    Get support
                    <ArrowUpRight size={12} />
                  </button>

                </div>

              </div>

            </section>

          </aside>

        </div>

        {/* BACK */}
        <div className="mt-7 flex justify-center">

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>

        </div>

      </main>
    </div>
  );
}

/* =========================================================
   TIMELINE
========================================================= */

function TimelineItem({
  number,
  title,
  description,
  time,
  complete = false,
  active = false,
}) {
  return (
    <div className="relative flex gap-4 pb-7 last:pb-0 sm:gap-5">

      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white text-[9px] font-bold shadow-sm ${
          complete
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {complete ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          number
        )}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">

        <div className="flex flex-col justify-between gap-1 sm:flex-row">

          <h3
            className={`text-xs font-bold ${
              active || complete
                ? "text-slate-800"
                : "text-slate-400"
            }`}
          >
            {title}
          </h3>

          <span
            className={`text-[9px] font-medium ${
              active
                ? "text-blue-600"
                : complete
                  ? "text-emerald-600"
                  : "text-slate-400"
            }`}
          >
            {time}
          </span>

        </div>

        <p className="mt-1 max-w-xl text-[10px] leading-5 text-slate-400">
          {description}
        </p>

        {active && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-semibold text-blue-700">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />

            Currently in progress

          </div>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   DOCUMENT
========================================================= */

function DocumentRow({
  title,
  status,
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
          <FileText size={15} />
        </div>

        <div className="min-w-0">

          <p className="truncate text-[11px] font-semibold text-slate-700">
            {title}
          </p>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {status}
          </p>

        </div>

      </div>

      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[8px] font-bold text-slate-400">
        PENDING
      </span>

    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  label,
  value,
  mono = false,
}) {
  return (
    <div className="flex items-start justify-between gap-4">

      <span className="text-[10px] text-slate-400">
        {label}
      </span>

      <span
        className={`max-w-[190px] text-right text-[10px] font-semibold text-slate-700 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   MONEY
========================================================= */

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default Shipments;