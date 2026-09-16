import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowsClockwise,
  Bell,
  CaretDown,
  CaretRight,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Package,
  MagnifyingGlass,
  Warning,
} from "@phosphor-icons/react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";
import { api, ApiError } from "../lib/api";
import { STAGE_LABELS, STAGE_ORDER, isFinalStage, nextStage, stageIndex } from "../lib/shipmentStages";

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AgentShipments() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  /* =========================================================
     LOAD AGENCY MEMBER DATA
  ========================================================= */

  useEffect(() => {
    try {
      const storedAgent = localStorage.getItem("clearingAgent");

      if (!storedAgent) {
        navigate("/agent-signin", { replace: true });
        return;
      }

      const parsedAgent = JSON.parse(storedAgent);

      if (parsedAgent.agentType !== "agency-member") {
        navigate("/agent-signin", { replace: true });
      }
    } catch (error) {
      console.error("Failed to load agency member data:", error);
      navigate("/agent-signin", { replace: true });
    }
  }, [navigate]);

  /* =========================================================
     LOAD ASSIGNED SHIPMENTS
  ========================================================= */

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
          setError(err instanceof ApiError ? err.message : "Could not load shipments. Is the backend running?");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const refresh = () => setReloadKey((key) => key + 1);

  /* =========================================================
     SHIPMENT COUNTS (derived from real stage data)
  ========================================================= */

  const totalShipments = shipments.length;

  const pendingShipments = shipments.filter((s) => s.currentStage === "assigned").length;

  const inProgressShipments = shipments.filter(
    (s) => !["assigned", "cargo_released"].includes(s.currentStage)
  ).length;

  const completedShipments = shipments.filter((s) => s.currentStage === "cargo_released").length;

  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const statusOf = (shipment) => {
    if (shipment.currentStage === "cargo_released") return "Completed";
    if (shipment.currentStage === "assigned") return "Pending";
    return "In Progress";
  };

  const filteredShipments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesStatus = statusFilter === "All" || statusOf(shipment) === statusFilter;

      const searchableText = [
        shipment.reference,
        shipment.importerName,
        shipment.description,
        shipment.origin,
        shipment.destination,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [shipments, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AgentMemberSidebar />

      <main className="min-h-screen pt-[68px] lg:ml-[270px] lg:pt-0">
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:top-0">
          <div className="flex items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agency Member Workspace
              </p>
              <h1 className="text-base font-bold text-slate-800">Shipments</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/agent-notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          <button
            type="button"
            onClick={() => navigate("/agent-dashboard")}
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-[#173563]"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

          <section className="mb-7">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h2 className="text-[35px] font-bold leading-tight tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
                  My Shipments
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[16px]">
                  View shipments assigned to you and advance their clearance
                  progress.
                </p>
              </div>

              <button
                type="button"
                onClick={refresh}
                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB]"
              >
                <ArrowsClockwise size={15} />
                Refresh
              </button>
            </div>
          </section>

          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard icon={Package} label="Total Shipments" value={totalShipments} description="All assigned shipments" iconStyle="bg-blue-50 text-blue-600" />
            <SummaryCard icon={Clock} label="Pending" value={pendingShipments} description="Just assigned, not yet started" iconStyle="bg-amber-50 text-amber-700" />
            <SummaryCard icon={FileText} label="In Progress" value={inProgressShipments} description="Currently processing" iconStyle="bg-violet-50 text-violet-600" />
            <SummaryCard icon={CheckCircle} label="Completed" value={completedShipments} description="Cargo released" iconStyle="bg-emerald-50 text-emerald-700" />
          </section>

          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search shipment, importer or product..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#14213D]">Assigned Shipments</h2>
                <p className="mt-1 text-[12px] text-slate-500">
                  {filteredShipments.length} shipment{filteredShipments.length !== 1 ? "s" : ""} shown
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" aria-label="Loading" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-[14px] font-semibold text-red-600">
                {error}
              </div>
            ) : filteredShipments.length > 0 ? (
              <div className="space-y-3">
                {filteredShipments.map((shipment) => (
                  <ShipmentCard
                    key={shipment.id}
                    shipment={shipment}
                    expanded={expandedId === shipment.id}
                    onToggle={() => setExpandedId((current) => (current === shipment.id ? null : shipment.id))}
                    onAdvanced={refresh}
                  />
                ))}
              </div>
            ) : (
              <EmptyState searchTerm={searchTerm} statusFilter={statusFilter} />
            )}
          </section>

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[11px] text-slate-400">
            ImportEase · Agency Member Platform
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ icon: Icon, label, value, description, iconStyle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-semibold text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">{value}</p>
          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SHIPMENT CARD (collapsible, with a stage-advance control)
========================================================= */

function ShipmentCard({ shipment, expanded, onToggle, onAdvanced }) {
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState("");

  const currentIndex = stageIndex(shipment.currentStage);
  const upcoming = nextStage(shipment.currentStage);
  const final = isFinalStage(shipment.currentStage);

  const statusStyles = final
    ? "bg-emerald-50 text-emerald-700"
    : shipment.currentStage === "assigned"
    ? "bg-amber-50 text-amber-700"
    : "bg-blue-50 text-blue-700";

  const statusLabel = final ? "Completed" : shipment.currentStage === "assigned" ? "Pending" : "In Progress";

  const handleAdvance = async () => {
    if (!upcoming || advancing) return;
    setAdvancing(true);
    setAdvanceError("");
    try {
      await api.put(`/shipments/${shipment.id}/status`, { newStage: upcoming });
      onAdvanced();
    } catch (err) {
      setAdvanceError(err instanceof ApiError ? err.message : "Could not update this shipment's stage.");
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:border-blue-200 hover:shadow-md">
      <button type="button" onClick={onToggle} className="flex w-full flex-col gap-5 p-5 text-left lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
            <Package size={21} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">{shipment.description || "Shipment"}</h3>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles}`}>
                {final ? <CheckCircle size={10} /> : <Clock size={10} />}
                {statusLabel}
              </span>
            </div>

            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              {shipment.reference || shipment.id} · {shipment.importerName || "Importer"}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={11} />
                {shipment.origin || "-"} → {shipment.destination || "-"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText size={11} />
                {shipment.hsCode ? `HS Code ${shipment.hsCode}` : "No HS code provided"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center gap-4 lg:w-[260px]">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">{STAGE_LABELS[shipment.currentStage]}</span>
              <span className="text-[11px] font-bold text-slate-600">
                {currentIndex + 1}/{STAGE_ORDER.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / STAGE_ORDER.length) * 100}%` }}
              />
            </div>
          </div>
          <CaretDown size={16} className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {STAGE_ORDER.map((stage, index) => (
              <span key={stage} className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    index < currentIndex || (index === currentIndex && final)
                      ? "bg-emerald-50 text-emerald-700"
                      : index === currentIndex
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </span>
                {index < STAGE_ORDER.length - 1 && <CaretRight size={12} className="text-slate-300" />}
              </span>
            ))}
          </div>

          {advanceError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              <Warning size={15} />
              {advanceError}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
            {final ? (
              <p className="text-[13px] font-semibold text-emerald-700">
                This shipment has completed clearance -- cargo has been released.
              </p>
            ) : (
              <>
                <p className="text-[13px] text-slate-600">
                  Next stage: <span className="font-bold text-slate-800">{STAGE_LABELS[upcoming]}</span>
                </p>
                <button
                  type="button"
                  onClick={handleAdvance}
                  disabled={advancing}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle size={15} />
                  {advancing ? "Updating..." : `Mark as ${STAGE_LABELS[upcoming]}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ searchTerm, statusFilter }) {
  const hasFilter = searchTerm || statusFilter !== "All";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
          <Package size={22} />
        </div>
        <h3 className="mt-4 text-sm font-bold text-slate-700">
          {hasFilter ? "No shipments found" : "No shipments yet"}
        </h3>
        <p className="mt-1 max-w-sm text-[12px] leading-5 text-slate-400">
          {hasFilter
            ? "Try changing your search or status filter."
            : "Shipments assigned to you will appear here once an SME accepts your bid."}
        </p>
      </div>
    </div>
  );
}

export default AgentShipments;
