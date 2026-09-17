import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowsClockwise,
  CalendarBlank,
  CaretDown,
  CaretRight,
  Check,
  ChatText,
  Clock,
  FileText,
  MapPin,
  Package,
  ShieldCheck,
} from "@phosphor-icons/react";

import AppNavbar from "../components/ui/AppNavbar";
import { api, ApiError } from "../lib/api";
import { STAGE_DESCRIPTIONS, STAGE_LABELS, STAGE_ORDER, stageIndex } from "../lib/shipmentStages";

function formatDate(iso) {
  if (!iso) return "Not specified";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not specified";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function TrackShipment() {
  const [searchParams] = useSearchParams();
  const linkedShipmentId = searchParams.get("shipmentId");

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.get("/shipments");
        if (!active) return;
        setShipments([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setError("");
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "Could not load your shipments. Is the backend running?");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!linkedShipmentId || shipments.length === 0) return undefined;
    if (!shipments.some((shipment) => shipment.id === linkedShipmentId)) return undefined;

    const timer = setTimeout(() => setExpandedId(linkedShipmentId), 0);
    return () => clearTimeout(timer);
  }, [linkedShipmentId, shipments]);

  const refresh = () => setReloadKey((key) => key + 1);

  const activeCount = shipments.filter((s) => s.currentStage !== "cargo_released").length;

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .delay-1 { animation-delay: 0.05s; }
        .delay-2 { animation-delay: 0.10s; }
        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; }
        }
      `}</style>

      <AppNavbar />

      <main className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        <section className="fade-up -mt-8 mb-7">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
              Track your Shipments
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
              Follow every import and customs clearance in progress, from one
              place.
            </p>

            <button
              type="button"
              onClick={refresh}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowsClockwise size={14} />
              Refresh status
            </button>
          </div>
        </section>

        {!loading && !error && shipments.length > 0 && (
          <section className="fade-up delay-1 mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_2px_12px_rgba(15,23,42,.025)] sm:px-6">
            <p className="text-sm font-semibold text-slate-600">
              {shipments.length} shipment{shipments.length !== 1 ? "s" : ""} total
            </p>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              {activeCount} active
            </span>
          </section>
        )}

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" aria-label="Loading" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-[14px] font-semibold text-red-600">
            {error}
          </div>
        ) : shipments.length === 0 ? (
          <section className="fade-up delay-1 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-[0_2px_12px_rgba(15,23,42,.025)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
              <Package size={22} />
            </div>
            <h3 className="mt-4 text-[16px] font-bold text-[#173563]">No shipments yet</h3>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-5 text-slate-500">
              Once you post a request and an agent is assigned, your shipment's
              clearance progress will show up here.
            </p>
            <Link
              to="/find-agent"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#214777]"
            >
              Find a clearing agent
              <CaretRight size={16} />
            </Link>
          </section>
        ) : (
          <div className="space-y-4">
            {shipments.map((shipment, index) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                expanded={expandedId === shipment.id}
                onToggle={() => setExpandedId((current) => (current === shipment.id ? null : shipment.id))}
                delayClass={index === 0 ? "delay-1" : "delay-2"}
              />
            ))}
          </div>
        )}

        <section className="fade-up delay-2 mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/documents"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <FileText size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800">Shipment documents</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                View and manage documents related to your imports.
              </p>
            </div>
            <ArrowRight size={16} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
          </Link>

          <Link
            to="/dashboard"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Package size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800">Back to dashboard</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                View all your imports and available tools.
              </p>
            </div>
            <ArrowRight size={16} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
          </Link>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <ShieldCheck size={15} className="text-emerald-600" />
          <span>Your import information is securely managed by ImportEase.</span>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   ONE SHIPMENT (collapsible: summary + full stage timeline)
========================================================= */

function ShipmentCard({ shipment, expanded, onToggle, delayClass }) {
  const currentIndex = stageIndex(shipment.currentStage);
  const isFinal = shipment.currentStage === "cargo_released";

  return (
    <section className={`fade-up ${delayClass} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-3 p-5 text-left sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Package size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-bold text-slate-900">
                {shipment.reference || shipment.id}
              </h2>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  isFinal ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {isFinal ? "COMPLETED" : "IN PROGRESS"}
              </span>
            </div>
            <p className="mt-1 truncate text-[13px] text-slate-500">
              {shipment.description || "Shipment"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] text-slate-400">Current stage</p>
            <p className="text-[13px] font-bold text-[#173563]">{STAGE_LABELS[shipment.currentStage] || shipment.currentStage}</p>
          </div>
          <CaretDown size={16} className={`text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_320px]">
            {/* TIMELINE */}
            <div>
              <h3 className="mb-4 text-[14px] font-bold text-slate-900">Clearance progress</h3>
              <div className="relative">
                {STAGE_ORDER.map((stage, index) => (
                  <TimelineItem
                    key={stage}
                    stage={stage}
                    completed={index < currentIndex || (index === currentIndex && isFinal)}
                    active={index === currentIndex && !isFinal}
                    last={index === STAGE_ORDER.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* SIDE INFO */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <h4 className="text-[12px] font-bold uppercase tracking-wide text-slate-400">Your clearing agent</h4>
                {shipment.agentName ? (
                  <div className="mt-2">
                    <p className="text-[14px] font-bold text-slate-800">{shipment.agentName}</p>
                    <p className="text-[12px] text-slate-500">{shipment.agencyName || "Independent agent"}</p>
                    {(shipment.feeLkr || shipment.clearanceTimelineHours) && (
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                        {shipment.feeLkr && (
                          <span className="rounded-md bg-white px-2 py-1 font-semibold">
                            Rs. {Number(shipment.feeLkr).toLocaleString()}
                          </span>
                        )}
                        {shipment.clearanceTimelineHours && (
                          <span className="rounded-md bg-white px-2 py-1 font-semibold">
                            {shipment.clearanceTimelineHours}h clearance
                          </span>
                        )}
                      </div>
                    )}
                    <Link
                      to="/messages"
                      className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 hover:text-[#173563]"
                    >
                      <ChatText size={14} />
                      Contact agent
                    </Link>
                  </div>
                ) : (
                  <p className="mt-2 text-[12px] leading-5 text-slate-500">
                    Not assigned yet -- this appears once you accept a bid on{" "}
                    <Link to="/find-agent" className="font-semibold text-[#2563EB] hover:underline">
                      Find a clearing agent
                    </Link>
                    .
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <h4 className="text-[12px] font-bold uppercase tracking-wide text-slate-400">Shipment details</h4>
                <div className="mt-2 space-y-2 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={13} /> Route
                    </span>
                    <span className="font-semibold text-slate-700">
                      {shipment.origin || "-"} → {shipment.destination || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">HS Code</span>
                    <span className="font-semibold text-slate-700">
                      {shipment.hsCode || "No HS code provided"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <CalendarBlank size={13} /> Est. arrival
                    </span>
                    <span className="font-semibold text-slate-700">{formatDate(shipment.estimatedArrival)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Must release by</span>
                    <span className="font-semibold text-slate-700">{formatDate(shipment.mustReleaseBy)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   TIMELINE ITEM
========================================================= */

function TimelineItem({ stage, completed, active, last }) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`absolute left-[15px] top-[32px] h-[calc(100%-8px)] w-px ${
            completed ? "bg-emerald-300" : "bg-slate-200"
          }`}
        />
      )}

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
          <Check size={14} />
        ) : active ? (
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-slate-200" />
        )}
      </div>

      <div className={`min-w-0 flex-1 ${last ? "pb-0" : "pb-8"}`}>
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`text-sm font-bold ${
              active ? "text-[#173563]" : completed ? "text-slate-800" : "text-slate-400"
            }`}
          >
            {STAGE_LABELS[stage]}
          </h3>

          {active && (
            <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
              CURRENT
            </span>
          )}

          {completed && (
            <span className="text-xs font-medium text-emerald-600">Completed</span>
          )}
        </div>

        <p className={`mt-1.5 max-w-lg text-xs leading-5 ${active ? "text-slate-600" : "text-slate-400"}`}>
          {STAGE_DESCRIPTIONS[stage]}
        </p>

        {active && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5">
            <Clock size={14} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700">
              Waiting for the clearing agent to move this forward.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackShipment;
