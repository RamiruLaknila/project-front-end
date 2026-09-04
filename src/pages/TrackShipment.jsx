import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  Package,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
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
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(23, 59, 108, 0);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(23, 59, 108, 0.05);
          }
        }

        .fade-up {
          animation:
            fadeUp 0.5s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .scale-in {
          animation:
            scaleIn 0.35s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .slide-down {
          animation:
            slideDown 0.25s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .pulse-soft {
          animation: pulseSoft 2.5s ease-in-out infinite;
        }

        .delay-1 {
          animation-delay: 0.05s;
        }

        .delay-2 {
          animation-delay: 0.10s;
        }

        .delay-3 {
          animation-delay: 0.15s;
        }

        .delay-4 {
          animation-delay: 0.20s;
        }

        .delay-5 {
          animation-delay: 0.25s;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scale-in,
          .slide-down,
          .pulse-soft {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* ===================================================
            BACK BUTTON
        ==================================================== */}

        <div className="fade-up mb-6">
          <BackButton current="Track Shipment" />
        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up -mt-8 mb-7">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-[30px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[40px]">
              Track your Shipment
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-[15px] leading-6 text-slate-500 sm:text-base">
              Follow your import and customs clearance progress
              from one place.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={14} />
              Refresh status
            </button>
          </div>
        </section>

        {/* ===================================================
            SHIPMENT HEADER CARD
        ==================================================== */}

        <section className="fade-up delay-1 mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Package size={23} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Shipment ID
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    {shipmentId}
                  </h2>

                  <span className="rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                    IN PROGRESS
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Request submitted {createdDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden h-10 w-px bg-slate-100 sm:block" />

              <div>
                <p className="text-xs text-slate-400">
                  Current stage
                </p>

                <p className="mt-0.5 text-sm font-bold text-[#173563]">
                  Agent review
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* =================================================
              LEFT - TIMELINE
          ================================================== */}

          <section className="fade-up delay-2 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">
                Import progress
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your shipment status will be updated as it moves
                through the process.
              </p>
            </div>

            <div className="p-5 sm:p-6">
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
          ================================================== */}

          <div className="space-y-6">
            {/* CLEARING AGENT */}

            <section className="fade-up delay-3 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Your clearing agent
                </h2>
              </div>

              <div className="p-5 sm:p-6">
                {agent ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173563] text-sm font-bold text-white">
                        {agent.initials || "AG"}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-sm font-bold text-slate-900">
                            {agent.name || "Clearing Agent"}
                          </h3>

                          {agent.verified && (
                            <ShieldCheck
                              size={16}
                              className="shrink-0 text-emerald-600"
                            />
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPin size={12} />
                            {agent.location || "Sri Lanka"}
                          </span>

                          <span className="text-xs text-slate-300">
                            •
                          </span>

                          <span className="text-xs text-slate-400">
                            ★ {agent.rating || "4.8"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
                      <div className="flex items-center gap-2">
                        <Clock3
                          size={15}
                          className="text-blue-600"
                        />

                        <p className="text-sm font-semibold text-slate-600">
                          {agent.response ||
                            "Response time varies"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/messages")}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-[#173563]"
                    >
                      <MessageSquare size={15} />
                      Contact agent
                    </button>
                  </>
                ) : (
                  <div className="py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <ShieldCheck size={19} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-800">
                      Agent information unavailable
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your selected clearing agent information
                      could not be loaded.
                    </p>

                    <Link
                      to="/find-agent"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-800"
                    >
                      Find an agent
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* IMPORT SUMMARY */}

            <section className="fade-up delay-4 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Import summary
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                <SummaryRow
                  label="Product"
                  value={
                    importData?.productName || "Not specified"
                  }
                />

                <SummaryRow
                  label="HS Code"
                  value={
                    importData?.hsCode || "Not specified"
                  }
                />

                <SummaryRow
                  label="Origin"
                  value={
                    importData?.country || "Not specified"
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

        <section className="fade-up delay-5 mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/documents"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <FileText size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800">
                Shipment documents
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                View and manage documents related to this import.
              </p>
            </div>

            <ArrowRight
              size={16}
              className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
            />
          </Link>

          <Link
            to="/dashboard"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Package size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800">
                Back to dashboard
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                View all your imports and available tools.
              </p>
            </div>

            <ArrowRight
              size={16}
              className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
            />
          </Link>
        </section>

        {/* ===================================================
            SECURITY
        ==================================================== */}

        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <ShieldCheck
            size={15}
            className="text-emerald-600"
          />

          <span>
            Your import information is securely managed by
            ImportEase.
          </span>
        </div>
      </main>
    </div>
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
          <Check size={14} strokeWidth={3} />
        ) : active ? (
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-slate-200" />
        )}
      </div>

      {/* CONTENT */}

      <div
        className={`min-w-0 flex-1 ${
          last ? "pb-0" : "pb-8"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`text-sm font-bold ${
              active
                ? "text-[#173563]"
                : completed
                ? "text-slate-800"
                : "text-slate-400"
            }`}
          >
            {stage.title}
          </h3>

          {active && (
            <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
              CURRENT
            </span>
          )}

          {completed && (
            <span className="text-xs font-medium text-emerald-600">
              Completed
            </span>
          )}
        </div>

        <p
          className={`mt-1.5 max-w-lg text-xs leading-5 ${
            active
              ? "text-slate-600"
              : "text-slate-400"
          }`}
        >
          {stage.description}
        </p>

        {active && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5">
            <Clock3
              size={14}
              className="text-blue-600"
            />

            <span className="text-xs font-medium text-blue-700">
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

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[200px] truncate text-right text-sm font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

export default TrackShipment;