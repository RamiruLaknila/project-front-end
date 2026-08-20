import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import BackButton from "../components/ui/BackButton";

/* =========================================================
   SHIPMENT STAGES
========================================================= */

const stages = [
  {
    id: "request",
    title: "Agent request submitted",
    description: "Your clearing agent request has been sent.",
  },
  {
    id: "review",
    title: "Agent reviewing request",
    description:
      "The selected agent is reviewing your import details.",
  },
  {
    id: "documents",
    title: "Documents & clearance preparation",
    description:
      "Required documents and customs information are being prepared.",
  },
  {
    id: "customs",
    title: "Customs clearance",
    description:
      "Your shipment is going through the customs clearance process.",
  },
  {
    id: "completed",
    title: "Import completed",
    description:
      "Your shipment has successfully completed the import process.",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

function TrackShipment() {
  const navigate = useNavigate();

  /* =======================================================
     LOAD CURRENT SHIPMENT
  ======================================================= */

  const shipment = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("currentShipment") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  const importData = shipment?.importData || null;
  const agent = shipment?.agent || null;

  /*
    0 = request submitted
    1 = agent reviewing
    2 = documents
    3 = customs
    4 = completed
  */

  const currentStage = 1;

  const shipmentId = shipment?.id || "IMP-204821";

  const createdDate = shipment?.createdAt
    ? new Date(shipment.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "20 Aug 2026";

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scale-in {
            animation: none;
          }
        }

        .fade-up {
          animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .scale-in {
          animation: scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto w-full max-w-[980px] px-5 py-8 sm:px-8 lg:py-10">

        {/* ===================================================
            BACK BUTTON
        ==================================================== */}

        <div className="mb-6">
          <BackButton current="Track Shipment" />
        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up mb-8">

          <div className="flex flex-col items-center justify-center text-center">

            {/* BADGE */}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

              <Truck
                size={13}
                className="text-blue-700"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                Shipment tracking
              </span>

            </div>

            {/* TITLE */}

            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[40px]">
              Track your Shipment
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
              Follow your import and customs clearance progress
              from one place.
            </p>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw size={13} />

              Refresh status
            </button>

          </div>

        </section>

        {/* ===================================================
            SHIPMENT HEADER CARD
        ==================================================== */}

        <section className="fade-up mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.03)]">

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            {/* SHIPMENT INFORMATION */}

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Package size={21} />
              </div>

              <div className="min-w-0">

                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Shipment ID
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">

                  <h2 className="text-base font-bold tracking-tight text-slate-900">
                    {shipmentId}
                  </h2>

                  <span className="rounded-md bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-700">
                    IN PROGRESS
                  </span>

                </div>

                <p className="mt-1 text-[9px] text-slate-400">
                  Request submitted {createdDate}
                </p>

              </div>

            </div>

            {/* CURRENT STAGE */}

            <div className="flex items-center gap-3">

              <div className="hidden h-10 w-px bg-slate-200 sm:block" />

              <div>

                <p className="text-[9px] text-slate-400">
                  Current stage
                </p>

                <p className="mt-1 text-xs font-bold text-[#173563]">
                  Agent review
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            CONTENT GRID
        ==================================================== */}

        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

          {/* =================================================
              LEFT - TIMELINE
          ================================================= */}

          <section className="fade-up rounded-2xl border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.03)]">

            {/* HEADER */}

            <div className="border-b border-slate-100 px-5 py-4">

              <h2 className="text-sm font-bold text-slate-800">
                Import progress
              </h2>

              <p className="mt-1 text-[9px] text-slate-400">
                Your shipment status will be updated as it moves
                through the process.
              </p>

            </div>

            {/* TIMELINE */}

            <div className="p-5 sm:p-7">

              <div className="relative">

                {stages.map((stage, index) => {

                  const completed = index < currentStage;
                  const active = index === currentStage;

                  return (
                    <TimelineItem
                      key={stage.id}
                      stage={stage}
                      completed={completed}
                      active={active}
                      last={index === stages.length - 1}
                    />
                  );

                })}

              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-5">

            {/* =================================================
                CLEARING AGENT
            ================================================= */}

            <section className="fade-up rounded-2xl border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.03)]">

              <div className="border-b border-slate-100 px-5 py-4">

                <h2 className="text-sm font-bold text-slate-800">
                  Your clearing agent
                </h2>

              </div>

              <div className="p-5">

                {agent ? (
                  <>

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173563] text-xs font-bold text-white">
                        {agent.initials || "AG"}
                      </div>

                      <div className="min-w-0">

                        <div className="flex items-center gap-1.5">

                          <h3 className="truncate text-xs font-bold text-slate-900">
                            {agent.name}
                          </h3>

                          {agent.verified && (
                            <ShieldCheck
                              size={13}
                              className="shrink-0 text-emerald-600"
                            />
                          )}

                        </div>

                        <div className="mt-1 flex items-center gap-2">

                          <span className="flex items-center gap-1 text-[9px] text-slate-400">

                            <MapPin size={10} />

                            {agent.location || "Sri Lanka"}

                          </span>

                          <span className="text-[9px] text-slate-300">
                            •
                          </span>

                          <span className="text-[9px] text-slate-400">
                            ★ {agent.rating || "4.8"}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2">

                        <Clock3
                          size={14}
                          className="text-blue-600"
                        />

                        <p className="text-[9px] font-semibold text-slate-600">
                          {agent.response ||
                            "Response time varies"}
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/messages")}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50"
                    >

                      <MessageSquare size={13} />

                      Contact agent

                    </button>

                  </>

                ) : (

                  <p className="text-xs text-slate-400">
                    Agent information is unavailable.
                  </p>

                )}

              </div>

            </section>

            {/* =================================================
                IMPORT SUMMARY
            ================================================= */}

            <section className="fade-up rounded-2xl border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.03)]">

              <div className="border-b border-slate-100 px-5 py-4">

                <h2 className="text-sm font-bold text-slate-800">
                  Import summary
                </h2>

              </div>

              <div className="divide-y divide-slate-100">

                <SummaryRow
                  label="Product"
                  value={
                    importData?.productName ||
                    "Not specified"
                  }
                />

                <SummaryRow
                  label="HS Code"
                  value={
                    importData?.hsCode ||
                    "Not specified"
                  }
                />

                <SummaryRow
                  label="Origin"
                  value={
                    importData?.country ||
                    "Not specified"
                  }
                />

                <SummaryRow
                  label="Quantity"
                  value={
                    importData
                      ? `${importData.quantity || 0} ${
                          importData.unit || ""
                        }`
                      : "Not specified"
                  }
                />

              </div>

            </section>

          </div>

        </div>

        {/* ===================================================
            DOCUMENTS / ACTIONS
        ==================================================== */}

        <section className="fade-up mt-5 grid gap-4 sm:grid-cols-2">

          {/* DOCUMENTS */}

          <Link
            to="/documents"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <FileText size={18} />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-xs font-bold text-slate-800">
                Shipment documents
              </p>

              <p className="mt-1 text-[9px] leading-4 text-slate-400">
                View and manage documents related to this import.
              </p>

            </div>

            <ArrowRight
              size={15}
              className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
            />

          </Link>

          {/* DASHBOARD */}

          <Link
            to="/dashboard"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Package size={18} />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-xs font-bold text-slate-800">
                Back to dashboard
              </p>

              <p className="mt-1 text-[9px] leading-4 text-slate-400">
                View all your imports and available tools.
              </p>

            </div>

            <ArrowRight
              size={15}
              className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
            />

          </Link>

        </section>

        {/* ===================================================
            SECURITY
        ==================================================== */}

        <div className="mt-7 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <ShieldCheck
            size={13}
            className="text-emerald-600"
          />

          <span>
            Your import information is securely managed by ImportEase.
          </span>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   APP NAVBAR
========================================================= */

function AppNavbar() {

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
    },
    {
      to: "/hs-code-search",
      label: "HS Code Search",
      mobileLabel: "HS Code",
    },
    {
      to: "/calculator",
      label: "Calculator",
    },
    {
      to: "/find-agent",
      label: "Find Agent",
    },
    {
      to: "/track-shipment",
      label: "Track Shipment",
    },
  ];

  const currentPath = window.location.pathname;

  const isActive = (path) => {
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

      {/* ===================================================
          DESKTOP NAVBAR
      ==================================================== */}

      <div className="relative mx-auto flex h-[68px] max-w-[1280px] items-center px-5 sm:px-8">

        {/* LOGO */}

        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-3"
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

            <div className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-400 sm:block">
              SME Import Platform
            </div>

          </div>

        </Link>

        {/* CENTER NAVIGATION */}

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">

          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              active={isActive(item.to)}
            />
          ))}

        </nav>

        {/* RIGHT SIDE */}

        <div className="ml-auto flex items-center gap-3">

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
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

      {/* ===================================================
          MOBILE NAVIGATION
      ==================================================== */}

      <div className="border-t border-slate-100 bg-white px-4 py-2 md:hidden">

        <nav className="flex gap-1 overflow-x-auto pb-1">

          {navItems.map((item) => (
            <MobileNavItem
              key={item.to}
              to={item.to}
              label={item.mobileLabel || item.label}
              active={isActive(item.to)}
            />
          ))}

        </nav>

      </div>

    </header>
  );
}

/* =========================================================
   DESKTOP NAV ITEM
========================================================= */

function NavItem({
  to,
  label,
  active,
}) {

  return (
    <Link
      to={to}
      className={`relative rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
        active
          ? "bg-blue-50 text-[#173563] shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-[#173563]"
      }`}
    >

      {label}

      {active && (
        <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#173563]" />
      )}

    </Link>
  );
}

/* =========================================================
   MOBILE NAV ITEM
========================================================= */

function MobileNavItem({
  to,
  label,
  active,
}) {

  return (
    <Link
      to={to}
      className={`shrink-0 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
        active
          ? "bg-[#173563] text-white"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}

/* =========================================================
   TIMELINE ITEM
========================================================= */

function TimelineItem({
  stage,
  completed,
  active,
  last,
}) {

  return (
    <div className="relative flex gap-4">

      {/* CONNECTOR */}

      {!last && (
        <div
          className={`absolute left-[15px] top-[32px] h-[calc(100%-8px)] w-px ${
            completed
              ? "bg-emerald-300"
              : "bg-slate-200"
          }`}
        />
      )}

      {/* CIRCLE */}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
          completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : active
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-white text-slate-300"
        }`}
      >

        {completed ? (

          <Check
            size={14}
            strokeWidth={3}
          />

        ) : active ? (

          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600" />

        ) : (

          <span className="h-2 w-2 rounded-full bg-slate-200" />

        )}

      </div>

      {/* CONTENT */}

      <div
        className={`min-w-0 flex-1 ${
          last ? "pb-0" : "pb-9"
        }`}
      >

        <div className="flex flex-wrap items-center gap-2">

          <h3
            className={`text-xs font-bold ${
              active
                ? "text-[#173563]"
                : completed
                ? "text-slate-700"
                : "text-slate-400"
            }`}
          >
            {stage.title}
          </h3>

          {active && (
            <span className="rounded-md bg-blue-50 px-2 py-1 text-[8px] font-bold text-blue-700">
              CURRENT
            </span>
          )}

          {completed && (
            <span className="text-[8px] font-medium text-emerald-600">
              Completed
            </span>
          )}

        </div>

        <p
          className={`mt-1 max-w-lg text-[9px] leading-5 ${
            active
              ? "text-slate-500"
              : "text-slate-400"
          }`}
        >
          {stage.description}
        </p>

        {active && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">

            <Clock3
              size={12}
              className="text-blue-600"
            />

            <span className="text-[9px] font-medium text-blue-700">
              Waiting for the clearing agent to respond.
            </span>

          </div>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
}) {

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">

      <span className="text-[9px] text-slate-400">
        {label}
      </span>

      <span className="max-w-[180px] truncate text-right text-[10px] font-bold text-slate-700">
        {value}
      </span>

    </div>
  );
}

export default TrackShipment;